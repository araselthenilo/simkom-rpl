<?php

namespace App\Http\Controllers;

use App\Exports\LaporanKegiatanExport;
use App\Exports\LaporanKeuanganExport;
use App\Models\ArsipLaporan;
use App\Models\Kegiatan;
use App\Models\Organisasi;
use App\Models\TransaksiKeuangan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ArsipLaporanController extends Controller
{
    public function index(Organisasi $organisasi): Response
    {
        Gate::authorize('is-petugas');

        $arsip = ArsipLaporan::where('id_organisasi', $organisasi->id_organisasi)
            ->with('penggunaPetugas:username')
            ->orderByDesc('created_at')
            ->get([
                'id_laporan',
                'id_organisasi',
                'username_petugas',
                'jenis_laporan',
                'file_laporan',
                'created_at',
            ]);

        return Inertia::render('Laporan/Index', [
            'organisasi' => $organisasi->only('id_organisasi', 'nama_organisasi'),
            'arsip' => $arsip,
        ]);
    }

    public function generate(Request $request, Organisasi $organisasi): RedirectResponse
    {
        Gate::authorize('is-petugas');

        $validated = $request->validate([
            'jenis_laporan' => ['required', Rule::in(['Kegiatan', 'Keuangan'])],
            'format' => ['required', Rule::in(['pdf', 'excel'])],
            'periode' => ['nullable', 'integer', 'digits:4', 'min:2000'],
        ]);

        $jenis = $validated['jenis_laporan'];
        $format = $validated['format'];
        $periode = isset($validated['periode']) ? (int) $validated['periode'] : null;

        $kegiatanIds = $this->resolveKegiatanIds($organisasi);

        $rows = $jenis === 'Kegiatan'
            ? $this->buildLaporanKegiatanData($kegiatanIds, $periode)
            : $this->buildLaporanKeuanganData($kegiatanIds, $periode);

        $ext = $format === 'pdf' ? 'pdf' : 'xlsx';
        $filename = sprintf(
            'laporan-%s-%s-%s.%s',
            strtolower($jenis),
            $periode ?? 'semua',
            now()->format('YmdHis'),
            $ext
        );
        $storagePath = "arsip_laporan/{$organisasi->id_organisasi}/{$filename}";

        $format === 'pdf'
            ? $this->generatePdf($jenis, $organisasi, $rows, $periode, $storagePath)
            : $this->generateExcel($jenis, $rows, $storagePath);

        ArsipLaporan::create([
            'id_organisasi' => $organisasi->id_organisasi,
            'username_petugas' => $request->user()->username,
            'jenis_laporan' => $jenis,
            'file_laporan' => $storagePath,
        ]);

        return redirect()
            ->route('organisasi.laporan.index', $organisasi)
            ->with('success', "Laporan {$jenis} berhasil dibuat.");
    }

    public function download(Organisasi $organisasi, ArsipLaporan $arsipLaporan): StreamedResponse
    {
        Gate::authorize('is-petugas');

        $this->authorizeArsipOwnership($organisasi, $arsipLaporan);

        abort_unless(
            Storage::disk('public')->exists($arsipLaporan->file_laporan),
            404,
            'File laporan tidak ditemukan di storage.'
        );

        return Storage::disk('public')->download(
            $arsipLaporan->file_laporan,
            basename($arsipLaporan->file_laporan)
        );
    }

    public function destroy(Organisasi $organisasi, ArsipLaporan $arsipLaporan): RedirectResponse
    {
        Gate::authorize('is-petugas');

        $this->authorizeArsipOwnership($organisasi, $arsipLaporan);

        Storage::disk('public')->delete($arsipLaporan->file_laporan);
        $arsipLaporan->delete();

        return redirect()
            ->route('organisasi.laporan.index', $organisasi)
            ->with('success', 'Arsip laporan berhasil dihapus.');
    }

    /**
     * @return Collection<int, int>
     */
    private function resolveKegiatanIds(Organisasi $organisasi): Collection
    {
        return Kegiatan::whereHas(
            'profilOrganisasi',
            fn ($q) => $q->where('id_organisasi', $organisasi->id_organisasi)
        )->pluck('id_kegiatan');
    }

    /**
     * @param  Collection<int, int>  $kegiatanIds
     * @return Collection<int, array<string, mixed>>
     */
    private function buildLaporanKegiatanData(Collection $kegiatanIds, ?int $periode): Collection
    {
        return Kegiatan::withCount('pesertaKegiatan')
            ->with('transaksiKeuangan')
            ->whereIn('id_kegiatan', $kegiatanIds)
            ->when($periode, fn ($q) => $q->whereYear('tanggal_pelaksanaan', $periode))
            ->orderBy('tanggal_pelaksanaan')
            ->get()
            ->map(fn (Kegiatan $k) => [
                'nama_kegiatan' => $k->nama_kegiatan,
                'jenis_kegiatan' => $k->jenis_kegiatan,
                'tanggal_pelaksanaan' => $k->tanggal_pelaksanaan->format('d/m/Y'),
                'lokasi_kegiatan' => $k->lokasi_kegiatan,
                'status_kegiatan' => $k->status_kegiatan,
                'jumlah_peserta' => $k->peserta_kegiatan_count,
                'total_pemasukan' => (float) $k->transaksiKeuangan
                    ->where('jenis_transaksi', 'Pemasukan')
                    ->sum('nominal_transaksi'),
                'total_pengeluaran' => (float) $k->transaksiKeuangan
                    ->where('jenis_transaksi', 'Pengeluaran')
                    ->sum('nominal_transaksi'),
            ]);
    }

    /**
     * @param  Collection<int, int>  $kegiatanIds
     * @return Collection<int, array<string, mixed>>
     */
    private function buildLaporanKeuanganData(Collection $kegiatanIds, ?int $periode): Collection
    {
        return TransaksiKeuangan::with('kegiatan:id_kegiatan,nama_kegiatan')
            ->whereIn('id_kegiatan', $kegiatanIds)
            ->when($periode, fn ($q) => $q->whereYear('tanggal_transaksi', $periode))
            ->orderBy('id_kegiatan')
            ->orderBy('tanggal_transaksi')
            ->get()
            ->map(fn (TransaksiKeuangan $t) => [
                'nama_kegiatan' => $t->kegiatan->nama_kegiatan,
                'jenis_transaksi' => $t->jenis_transaksi,
                'nominal_transaksi' => (float) $t->nominal_transaksi,
                'tanggal_transaksi' => $t->tanggal_transaksi->format('d/m/Y'),
                'sumber_tujuan_transaksi' => $t->sumber_tujuan_transaksi,
                'catatan_koreksi' => $t->catatan_koreksi,
            ]);
    }

    /** @param Collection<int, array<string, mixed>> $rows */
    private function generatePdf(
        string $jenis,
        Organisasi $organisasi,
        Collection $rows,
        ?int $periode,
        string $storagePath
    ): void {
        $view = $jenis === 'Kegiatan'
            ? 'laporan.kegiatan-pdf'
            : 'laporan.keuangan-pdf';

        $pdfContent = Pdf::loadView($view, [
            'organisasi' => $organisasi,
            'rows' => $rows,
            'periode' => $periode,
            'generated_at' => now()->format('d/m/Y H:i:s'),
        ])->setPaper('a4', 'landscape')->output();

        Storage::disk('public')->put($storagePath, $pdfContent);
    }

    /**
     * Generate Excel via Maatwebsite dan simpan ke Storage::disk('public').
     *
     * @param  Collection<int, array<string, mixed>>  $rows
     */
    private function generateExcel(
        string $jenis,
        Collection $rows,
        string $storagePath
    ): void {
        $export = $jenis === 'Kegiatan'
            ? new LaporanKegiatanExport($rows)
            : new LaporanKeuanganExport($rows);

        Excel::store($export, $storagePath, 'public');
    }

    private function authorizeArsipOwnership(Organisasi $organisasi, ArsipLaporan $arsipLaporan): void
    {
        abort_if(
            $arsipLaporan->id_organisasi !== $organisasi->id_organisasi,
            403,
            'Arsip laporan ini bukan milik organisasi yang dimaksud.'
        );
    }
}
