<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\TransaksiKeuangan;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TransaksiKeuanganController extends Controller
{
    public function index(Kegiatan $kegiatan): Response
    {
        Gate::authorize('is-pengurus');

        $transaksi = TransaksiKeuangan::where('id_kegiatan', $kegiatan->id_kegiatan)
            ->orderBy('tanggal_transaksi', 'desc')
            ->get()
            ->map(fn (TransaksiKeuangan $t) => $this->formatForClient($t));

        $summary = [
            'total_pemasukan' => TransaksiKeuangan::where('id_kegiatan', $kegiatan->id_kegiatan)
                ->where('jenis_transaksi', 'Pemasukan')
                ->sum('nominal_transaksi'),
            'total_pengeluaran' => TransaksiKeuangan::where('id_kegiatan', $kegiatan->id_kegiatan)
                ->where('jenis_transaksi', 'Pengeluaran')
                ->sum('nominal_transaksi'),
        ];

        $summary['saldo'] = $summary['total_pemasukan'] - $summary['total_pengeluaran'];

        return Inertia::render('TransaksiKeuangan/Index', [
            'kegiatan' => $kegiatan->only('id_kegiatan', 'nama_kegiatan'),
            'transaksi' => $transaksi,
            'summary' => $summary,
        ]);
    }

    public function create(Kegiatan $kegiatan): Response
    {
        Gate::authorize('is-pengurus');

        return Inertia::render('TransaksiKeuangan/Create', [
            'kegiatan' => $kegiatan->only('id_kegiatan', 'nama_kegiatan'),
            'jenis_transaksi' => ['Pemasukan', 'Pengeluaran'],
        ]);
    }

    public function store(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-pengurus');

        $validated = $request->validate([
            'jenis_transaksi' => ['required', Rule::in(['Pemasukan', 'Pengeluaran'])],
            'nominal_transaksi' => ['required', 'numeric', 'min:0'],
            'tanggal_transaksi' => ['required', 'date'],
            'sumber_tujuan_transaksi' => ['required', 'string', 'max:200'],
            'foto_bukti_transaksi' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'catatan_koreksi' => ['nullable', 'string', 'max:500'],
        ]);

        $path = $request->file('foto_bukti_transaksi')
            ->store('transaksi_keuangan/bukti', 'public');

        TransaksiKeuangan::create([
            'id_kegiatan' => $kegiatan->id_kegiatan,
            'jenis_transaksi' => $validated['jenis_transaksi'],
            'nominal_transaksi' => $validated['nominal_transaksi'],
            'tanggal_transaksi' => $validated['tanggal_transaksi'],
            'sumber_tujuan_transaksi' => $validated['sumber_tujuan_transaksi'],
            'foto_bukti_transaksi' => $path,
            'catatan_koreksi' => $validated['catatan_koreksi'] ?? null,
        ]);

        return redirect()
            ->route('kegiatan.transaksi-keuangan.index', $kegiatan)
            ->with('success', 'Transaksi berhasil ditambahkan.');
    }

    public function show(Kegiatan $kegiatan, TransaksiKeuangan $transaksiKeuangan): Response
    {
        Gate::authorize('is-pengurus');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        return Inertia::render('TransaksiKeuangan/Show', [
            'kegiatan' => $kegiatan->only('id_kegiatan', 'nama_kegiatan'),
            'transaksi' => $this->formatForClient($transaksiKeuangan),
        ]);
    }

    public function edit(Kegiatan $kegiatan, TransaksiKeuangan $transaksiKeuangan): Response
    {
        Gate::authorize('is-pengurus');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        return Inertia::render('TransaksiKeuangan/Edit', [
            'kegiatan' => $kegiatan->only('id_kegiatan', 'nama_kegiatan'),
            'transaksi' => $this->formatForClient($transaksiKeuangan),
            'jenis_transaksi' => ['Pemasukan', 'Pengeluaran'],
        ]);
    }

    public function update(
        Request $request,
        Kegiatan $kegiatan,
        TransaksiKeuangan $transaksiKeuangan
    ): RedirectResponse {
        Gate::authorize('is-pengurus');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        $validated = $request->validate([
            'jenis_transaksi' => ['required', Rule::in(['Pemasukan', 'Pengeluaran'])],
            'nominal_transaksi' => ['required', 'numeric', 'min:0'],
            'tanggal_transaksi' => ['required', 'date'],
            'sumber_tujuan_transaksi' => ['required', 'string', 'max:200'],
            'foto_bukti_transaksi' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'catatan_koreksi' => ['nullable', 'string', 'max:500'],
        ]);

        if ($request->hasFile('foto_bukti_transaksi')) {
            Storage::disk('public')->delete($transaksiKeuangan->foto_bukti_transaksi);

            $validated['foto_bukti_transaksi'] = $request
                ->file('foto_bukti_transaksi')
                ->store('transaksi_keuangan/bukti', 'public');
        } else {
            $validated['foto_bukti_transaksi'] = $transaksiKeuangan->foto_bukti_transaksi;
        }

        $transaksiKeuangan->update($validated);

        return redirect()
            ->route('kegiatan.transaksi-keuangan.index', $kegiatan)
            ->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(
        Kegiatan $kegiatan,
        TransaksiKeuangan $transaksiKeuangan
    ): RedirectResponse {
        Gate::authorize('is-petugas');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        // Delete bukti foto from on-premise storage
        Storage::disk('public')->delete($transaksiKeuangan->foto_bukti_transaksi);

        $transaksiKeuangan->delete();

        return redirect()
            ->route('kegiatan.transaksi-keuangan.index', $kegiatan)
            ->with('success', 'Transaksi berhasil dihapus.');
    }

    public function koreksi(
        Request $request,
        Kegiatan $kegiatan,
        TransaksiKeuangan $transaksiKeuangan
    ): RedirectResponse {
        Gate::authorize('is-pengurus');

        $this->authorizeKegiatanOwnership($kegiatan, $transaksiKeuangan);

        $validated = $request->validate([
            'catatan_koreksi' => ['required', 'string', 'max:500'],
        ]);

        $transaksiKeuangan->update([
            'catatan_koreksi' => $validated['catatan_koreksi'],
        ]);

        return redirect()
            ->route('kegiatan.transaksi-keuangan.show', [$kegiatan, $transaksiKeuangan])
            ->with('success', 'Catatan koreksi berhasil disimpan.');
    }

    private function authorizeKegiatanOwnership(
        Kegiatan $kegiatan,
        TransaksiKeuangan $transaksiKeuangan
    ): void {
        abort_if(
            $transaksiKeuangan->id_kegiatan !== $kegiatan->id_kegiatan,
            403,
            'Transaksi ini bukan milik kegiatan yang dikerjakan.'
        );
    }

    private function formatForClient(TransaksiKeuangan $transaksi): array
    {
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return [
            'id_transaksi' => $transaksi->id_transaksi,
            'id_kegiatan' => $transaksi->id_kegiatan,
            'jenis_transaksi' => $transaksi->jenis_transaksi,
            'nominal_transaksi' => $transaksi->nominal_transaksi,
            'tanggal_transaksi' => $transaksi->tanggal_transaksi,
            'sumber_tujuan_transaksi' => $transaksi->sumber_tujuan_transaksi,
            'foto_bukti_transaksi' => $transaksi->foto_bukti_transaksi
                ? $disk->url($transaksi->foto_bukti_transaksi)
                : null,
            'catatan_koreksi' => $transaksi->catatan_koreksi,
        ];
    }
}
