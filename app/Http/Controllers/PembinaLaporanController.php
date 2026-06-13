<?php

namespace App\Http\Controllers;

use App\Exports\LaporanKeuanganExport;
use App\Exports\LaporanKegiatanExport;
use App\Models\ArsipLaporan;
use App\Models\Organisasi;
use App\Models\TransaksiKeuangan;
use App\Models\Kegiatan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PembinaLaporanController extends Controller
{
    private function getManagedOrgIds(): array
    {
        $pembina = auth()->user()->profilPengguna;
        return $pembina ? $pembina->pembinaan()->pluck('id_organisasi')->toArray() : [];
    }

    public function index(): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $arsip = ArsipLaporan::whereIn('id_organisasi', $managedOrgIds)
            ->with(['organisasi:id_organisasi,nama_organisasi', 'penggunaPetugas:username'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('pembina/laporan', [
            'arsip' => $arsip->map(fn ($item) => [
                'id_laporan' => $item->id_laporan,
                'id_organisasi' => $item->id_organisasi,
                'nama_organisasi' => $item->organisasi?->nama_organisasi ?? 'Tidak Diketahui',
                'username_petugas' => $item->username_petugas,
                'jenis_laporan' => $item->jenis_laporan,
                'file_laporan' => $item->file_laporan,
                'created_at' => $item->created_at ? $item->created_at->toIso8601String() : null,
            ]),
        ]);
    }

    public function generate(Request $request): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $validated = $request->validate([
            'id_organisasi' => ['required', 'integer', 'exists:organisasi,id_organisasi'],
            'format' => ['required', 'string', 'in:pdf,excel'],
            'jenis_laporan' => ['nullable', 'string', 'in:Keuangan,Kegiatan'],

            // Keuangan filters
            'filter_organisasi_id' => ['nullable', 'string'],
            'id_kegiatan' => ['nullable', 'string'],
            'jenis_transaksi' => ['nullable', 'string'],
            'search' => ['nullable', 'string'],
            'sort_by' => ['nullable', 'string'],

            // Kegiatan filters
            'status_kegiatan' => ['nullable', 'string'],
            'jenis_kegiatan' => ['nullable', 'string'],
            'tanggal_mulai' => ['nullable', 'string'],
            'tanggal_akhir' => ['nullable', 'string'],
            'sort_by_field' => ['nullable', 'string'],
            'sort_direction' => ['nullable', 'string'],
        ]);

        $id_organisasi = $validated['id_organisasi'];
        abort_unless(in_array($id_organisasi, $managedOrgIds), 403);

        $format = $validated['format'];
        $jenisLaporan = $validated['jenis_laporan'] ?? 'Keuangan';
        $organisasi = Organisasi::findOrFail($id_organisasi);

        if ($jenisLaporan === 'Keuangan') {
            $query = TransaksiKeuangan::with(['kegiatan.profilOrganisasi.organisasi']);

            $filterOrg = $request->input('filter_organisasi_id', 'all');
            if ($filterOrg !== 'all') {
                abort_unless(in_array($filterOrg, $managedOrgIds), 403);
                $query->whereHas('kegiatan.profilOrganisasi.organisasi', function ($q) use ($filterOrg) {
                    $q->where('id_organisasi', $filterOrg);
                });
            } else {
                $query->whereHas('kegiatan.profilOrganisasi.organisasi', function ($q) use ($managedOrgIds) {
                    $q->whereIn('id_organisasi', $managedOrgIds);
                });
            }

            if ($request->filled('id_kegiatan') && $request->input('id_kegiatan') !== 'all') {
                $query->where('id_kegiatan', $request->input('id_kegiatan'));
            }

            if ($request->filled('jenis_transaksi') && $request->input('jenis_transaksi') !== 'all') {
                $query->where('jenis_transaksi', $request->input('jenis_transaksi'));
            }

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('sumber_tujuan_transaksi', 'like', "%{$search}%")
                      ->orWhereHas('kegiatan', function ($qk) use ($search) {
                          $qk->where('nama_kegiatan', 'like', "%{$search}%")
                            ->orWhereHas('profilOrganisasi.organisasi', function ($qo) use ($search) {
                                $qo->where('nama_organisasi', 'like', "%{$search}%");
                            });
                      });
                });
            }

            $sortBy = $request->input('sort_by', 'newest');
            if ($sortBy === 'newest') {
                $query->orderBy('tanggal_transaksi', 'desc')->orderBy('created_at', 'desc');
            } else {
                $query->orderBy('tanggal_transaksi', 'asc')->orderBy('created_at', 'asc');
            }

            $transactions = $query->get();

            $rows = $transactions->map(fn (TransaksiKeuangan $t) => [
                'nama_kegiatan' => $t->kegiatan?->nama_kegiatan ?? '-',
                'jenis_transaksi' => $t->jenis_transaksi,
                'nominal_transaksi' => (float) $t->nominal_transaksi,
                'tanggal_transaksi' => $t->tanggal_transaksi->format('d/m/Y'),
                'sumber_tujuan_transaksi' => $t->sumber_tujuan_transaksi,
                'catatan_koreksi' => $t->catatan_koreksi,
            ]);

            $ext = $format === 'pdf' ? 'pdf' : 'xlsx';
            $filename = sprintf(
                'laporan-keuangan-%s-%s.%s',
                $filterOrg === 'all' ? 'semua' : strtolower(str_replace(' ', '-', $organisasi->nama_organisasi)),
                now()->format('YmdHis'),
                $ext
            );
            $storagePath = "arsip_laporan/{$id_organisasi}/{$filename}";

            if ($format === 'pdf') {
                $pdfContent = Pdf::loadView('laporan.keuangan-pdf', [
                    'organisasi' => $organisasi,
                    'rows' => $rows,
                    'periode' => null,
                    'generated_at' => now()->format('d/m/Y H:i:s'),
                    'is_admin_all' => ($filterOrg === 'all'),
                ])->setPaper('a4', 'landscape')->output();

                Storage::disk('public')->put($storagePath, $pdfContent);
            } else {
                $export = new LaporanKeuanganExport($rows);
                Excel::store($export, $storagePath, 'public');
            }

            ArsipLaporan::create([
                'id_organisasi' => $id_organisasi,
                'username_petugas' => $request->user()->username,
                'jenis_laporan' => 'Keuangan',
                'file_laporan' => $storagePath,
            ]);

            return redirect()
                ->route('pembina.laporan.index')
                ->with('success', 'Laporan Keuangan berhasil dibuat.');
        } else {
            $query = Kegiatan::whereHas('profilOrganisasi', function($q) use ($managedOrgIds) {
                $q->whereIn('id_organisasi', $managedOrgIds);
            })
            ->withCount('pesertaKegiatan')
            ->with(['profilOrganisasi.organisasi', 'transaksiKeuangan']);

            if ($request->filled('status_kegiatan') && $request->input('status_kegiatan') !== 'Semua') {
                $query->where('status_kegiatan', $request->input('status_kegiatan'));
            }

            if ($request->filled('jenis_kegiatan') && $request->input('jenis_kegiatan') !== 'Semua') {
                $query->where('jenis_kegiatan', $request->input('jenis_kegiatan'));
            }

            if ($request->filled('tanggal_mulai')) {
                $query->where('tanggal_pelaksanaan', '>=', $request->input('tanggal_mulai'));
            }
            if ($request->filled('tanggal_akhir')) {
                $query->where('tanggal_pelaksanaan', '<=', $request->input('tanggal_akhir'));
            }

            $sortField = $request->input('sort_by_field', 'tanggal_pelaksanaan');
            $sortDir = $request->input('sort_direction', 'asc');
            $query->orderBy($sortField, $sortDir);

            $activities = $query->get();

            $rows = $activities->map(fn (Kegiatan $k) => [
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

            $ext = $format === 'pdf' ? 'pdf' : 'xlsx';
            $filename = sprintf(
                'laporan-kegiatan-%s-%s.%s',
                strtolower(str_replace(' ', '-', $organisasi->nama_organisasi)),
                now()->format('YmdHis'),
                $ext
            );
            $storagePath = "arsip_laporan/{$id_organisasi}/{$filename}";

            if ($format === 'pdf') {
                $pdfContent = Pdf::loadView('laporan.kegiatan-pdf', [
                    'organisasi' => $organisasi,
                    'rows' => $rows,
                    'periode' => null,
                    'generated_at' => now()->format('d/m/Y H:i:s'),
                ])->setPaper('a4', 'landscape')->output();

                Storage::disk('public')->put($storagePath, $pdfContent);
            } else {
                $export = new LaporanKegiatanExport($rows);
                Excel::store($export, $storagePath, 'public');
            }

            ArsipLaporan::create([
                'id_organisasi' => $id_organisasi,
                'username_petugas' => $request->user()->username,
                'jenis_laporan' => 'Kegiatan',
                'file_laporan' => $storagePath,
            ]);

            return redirect()
                ->route('pembina.laporan.index')
                ->with('success', 'Laporan Kegiatan berhasil dibuat.');
        }
    }

    public function download(ArsipLaporan $arsipLaporan): StreamedResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        abort_unless(in_array($arsipLaporan->id_organisasi, $managedOrgIds), 403);

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

    public function destroy(ArsipLaporan $arsipLaporan): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        abort_unless(in_array($arsipLaporan->id_organisasi, $managedOrgIds), 403);

        if ($arsipLaporan->file_laporan) {
            Storage::disk('public')->delete($arsipLaporan->file_laporan);
        }
        $arsipLaporan->delete();

        return redirect()
            ->route('pembina.laporan.index')
            ->with('success', 'Arsip laporan berhasil dihapus.');
    }
}
