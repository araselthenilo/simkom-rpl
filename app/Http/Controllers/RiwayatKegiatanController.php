<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\Organisasi;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class RiwayatKegiatanController extends Controller
{
    public function index(Request $request, Organisasi $organisasi): Response
    {
        abort_unless(
            Gate::check('is-pengurus') || Gate::check('is-petugas'),
            403
        );

        $validated = $request->validate([
            'status_kegiatan' => ['nullable', 'in:Mendatang,Sedang berlangsung,Selesai,Dibatalkan'],
            'jenis_kegiatan'  => ['nullable', 'in:Seminar,Pelatihan,Lomba,Pengabdian Masyarakat'],
            'tahun'           => ['nullable', 'integer', 'digits:4'],
        ]);

        $kegiatan = Kegiatan::withCount('pesertaKegiatan')
            ->with([
                'dokumentasiKegiatan' => fn($q) => $q->withCount([
                    'catatanRevisi',
                    'catatanRevisi as catatan_pending_count' => fn($q) => $q->where('status_tindaklanjut', false),
                ]),
            ])
            ->whereHas(
                'profilOrganisasi',
                fn($q) => $q->where('id_organisasi', $organisasi->id_organisasi)
            )
            ->when(
                isset($validated['status_kegiatan']),
                fn($q) => $q->where('status_kegiatan', $validated['status_kegiatan']),
                fn($q) => $q->where('status_kegiatan', 'Selesai')
            )
            ->when(
                isset($validated['jenis_kegiatan']),
                fn($q) => $q->where('jenis_kegiatan', $validated['jenis_kegiatan'])
            )
            ->when(
                isset($validated['tahun']),
                fn($q) => $q->whereYear('tanggal_pelaksanaan', $validated['tahun'])
            )
            ->orderBy('tanggal_pelaksanaan', 'desc')
            ->paginate(15)
            ->withQueryString();

        $tahunTersedia = Kegiatan::whereHas(
            'profilOrganisasi',
            fn($q) => $q->where('id_organisasi', $organisasi->id_organisasi)
        )
            ->selectRaw('YEAR(tanggal_pelaksanaan) as tahun')
            ->distinct()
            ->orderByDesc('tahun')
            ->pluck('tahun');

        return Inertia::render('RiwayatKegiatan/Index', [
            'organisasi'    => $organisasi->only('id_organisasi', 'nama_organisasi'),
            'kegiatan'      => $kegiatan,
            'filters'       => $validated,
            'tahunTersedia' => $tahunTersedia,
        ]);
    }

    public function show(Organisasi $organisasi, Kegiatan $kegiatan): Response
    {
        abort_unless(
            Gate::check('is-pengurus') || Gate::check('is-petugas'),
            403
        );

        $this->authorizeKegiatanOwnership($organisasi, $kegiatan);

        $kegiatan->load([
            'pesertaKegiatan.mahasiswa.pengguna',
            'pesertaKegiatan.transaksiKeuangan:id_transaksi,jenis_transaksi,nominal_transaksi,foto_bukti_transaksi',
            'dokumentasiKegiatan.fotoDokumentasi',
            'dokumentasiKegiatan.catatanRevisi.petugas:username',
            'transaksiKeuangan',
        ]);

        $keuanganSummary = [
            'total_pemasukan'   => $kegiatan->transaksiKeuangan
                ->where('jenis_transaksi', 'Pemasukan')->sum('nominal_transaksi'),
            'total_pengeluaran' => $kegiatan->transaksiKeuangan
                ->where('jenis_transaksi', 'Pengeluaran')->sum('nominal_transaksi'),
        ];
        $keuanganSummary['saldo'] = $keuanganSummary['total_pemasukan'] - $keuanganSummary['total_pengeluaran'];

        return Inertia::render('RiwayatKegiatan/Show', [
            'organisasi'      => $organisasi->only('id_organisasi', 'nama_organisasi'),
            'kegiatan'        => $kegiatan,
            'keuanganSummary' => $keuanganSummary,
        ]);
    }

    private function authorizeKegiatanOwnership(Organisasi $organisasi, Kegiatan $kegiatan): void
    {
        $milik = ProfilOrganisasi::where('id_profil', $kegiatan->id_profil)
            ->where('id_organisasi', $organisasi->id_organisasi)
            ->exists();

        abort_unless($milik, 403, 'Kegiatan ini bukan milik organisasi yang dimaksud.');
    }
}
