<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\DokumentasiKegiatan;
use App\Models\Kegiatan;
use App\Models\Mahasiswa;
use App\Models\Organisasi;
use App\Models\PengajuanProfilOrganisasi;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $totalOrganisasiAktif = Organisasi::where('status_aktif', true)->count();
        $totalMahasiswaAktif = Mahasiswa::count();
        $totalAnggotaAktif = AnggotaOrganisasi::where('status_keanggotaan', 'Aktif')->count();

        $pengajuanProfilList = PengajuanProfilOrganisasi::where('status_pengajuan', 'Diproses')
            ->with(['pengurusOrganisasi.profilOrganisasi.organisasi'])
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $totalPendingPengajuan = PengajuanProfilOrganisasi::where('status_pengajuan', 'Diproses')->count();

        $pendingDokumentasiList = DokumentasiKegiatan::where('status_dokumentasi', 'Diproses')
            ->with(['kegiatan.profilOrganisasi.organisasi'])
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $totalPendingDokumentasi = DokumentasiKegiatan::where('status_dokumentasi', 'Diproses')->count();

        $now = Carbon::now();
        $kegiatanBulanIni = Kegiatan::where('status_kegiatan', '!=', 'Dibatalkan')
            ->whereMonth('tanggal_pelaksanaan', $now->month)
            ->whereYear('tanggal_pelaksanaan', $now->year)
            ->count();

        $lastMonth = Carbon::now()->subMonth();
        $kegiatanBulanLalu = Kegiatan::where('status_kegiatan', '!=', 'Dibatalkan')
            ->whereMonth('tanggal_pelaksanaan', $lastMonth->month)
            ->whereYear('tanggal_pelaksanaan', $lastMonth->year)
            ->count();

        $perubahanKegiatanBulanLalu = $kegiatanBulanIni - $kegiatanBulanLalu;

        $agendaTerdekat = Kegiatan::where('status_kegiatan', '!=', 'Dibatalkan')
            ->where('tanggal_pelaksanaan', '>=', Carbon::today()->toDateString())
            ->orderBy('tanggal_pelaksanaan', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'totalOrganisasiAktif' => $totalOrganisasiAktif,
            'totalMahasiswaAktif' => $totalMahasiswaAktif,
            'totalAnggotaAktif' => $totalAnggotaAktif,
            'pengajuanProfilList' => $pengajuanProfilList,
            'totalPendingPengajuan' => $totalPendingPengajuan,
            'pendingDokumentasiList' => $pendingDokumentasiList,
            'totalPendingDokumentasi' => $totalPendingDokumentasi,
            'kegiatanBulanIni' => $kegiatanBulanIni,
            'perubahanKegiatanBulanLalu' => $perubahanKegiatanBulanLalu,
            'agendaTerdekat' => $agendaTerdekat,
        ]);
    }
}
