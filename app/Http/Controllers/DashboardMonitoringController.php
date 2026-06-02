<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Kegiatan;
use App\Models\Organisasi;
use App\Models\PengurusOrganisasi;
use App\Models\TransaksiKeuangan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DashboardMonitoringController extends Controller
{
    public function index(?Organisasi $organisasi = null): Response
    {
        // abort_unless(
        //     Gate::check('is-pengurus') || Gate::check('is-petugas'),
        //     403
        // );

        if (! $organisasi && Gate::check('is-pengurus')) {
            $organisasi = PengurusOrganisasi::whereHas('anggotaOrganisasi.mahasiswa', function ($query) {
                $query->where('username', Auth::id());
            })
                ->with('profilOrganisasi.organisasi')
                ->first()
                ?->profilOrganisasi
                ?->organisasi;
        }

        if ($organisasi) {
            $kegiatanIds = Kegiatan::whereHas(
                'profilOrganisasi',
                fn($q) => $q->where('id_organisasi', $organisasi->id_organisasi)
            )->pluck('id_kegiatan');

            $jumlahAnggotaAktif = AnggotaOrganisasi::where('id_organisasi', $organisasi->id_organisasi)
                ->where('status_keanggotaan', 'Aktif')
                ->count();

            $jumlahKegiatanAktif = Kegiatan::whereIn('id_kegiatan', $kegiatanIds)
                ->whereIn('status_kegiatan', ['Mendatang', 'Sedang berlangsung'])
                ->count();

            $keuanganAgregat = TransaksiKeuangan::whereIn('id_kegiatan', $kegiatanIds)
                ->selectRaw('jenis_transaksi, SUM(nominal_transaksi) as total')
                ->groupBy('jenis_transaksi')
                ->pluck('total', 'jenis_transaksi');

            $distribusiStatus = Kegiatan::whereIn('id_kegiatan', $kegiatanIds)
                ->selectRaw('status_kegiatan, COUNT(*) as jumlah')
                ->groupBy('status_kegiatan')
                ->pluck('jumlah', 'status_kegiatan');

            $kegiatanMendatang = Kegiatan::whereIn('id_kegiatan', $kegiatanIds)
                ->whereIn('status_kegiatan', ['Mendatang', 'Sedang berlangsung'])
                ->orderBy('tanggal_pelaksanaan')
                ->limit(5)
                ->get([
                    'id_kegiatan',
                    'nama_kegiatan',
                    'jenis_kegiatan',
                    'tanggal_pelaksanaan',
                    'lokasi_kegiatan',
                    'status_kegiatan',
                    'kuota_peserta',
                ]);
        } else {
            $jumlahAnggotaAktif = 0;
            $jumlahKegiatanAktif = 0;
            $keuanganAgregat = collect();
            $distribusiStatus = collect();
            $kegiatanMendatang = collect();
        }

        $totalPemasukan   = (float) ($keuanganAgregat->get('Pemasukan', 0));
        $totalPengeluaran = (float) ($keuanganAgregat->get('Pengeluaran', 0));

        return Inertia::render('dashboard', [
            'organisasi'          => $organisasi?->only('id_organisasi', 'nama_organisasi', 'status_aktif'),
            'jumlahAnggotaAktif'  => $jumlahAnggotaAktif,
            'jumlahKegiatanAktif' => $jumlahKegiatanAktif,
            'keuangan'            => [
                'total_pemasukan'   => $totalPemasukan,
                'total_pengeluaran' => $totalPengeluaran,
                'saldo'             => $totalPemasukan - $totalPengeluaran,
            ],
            'distribusiStatus'    => $distribusiStatus,
            'kegiatanMendatang'   => $kegiatanMendatang,
        ]);
    }
}
