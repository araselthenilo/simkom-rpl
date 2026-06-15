<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\DokumentasiKegiatan;
use App\Models\Kegiatan;
use App\Models\Mahasiswa;
use App\Models\Organisasi;
use App\Models\PengajuanProfilOrganisasi;
use Carbon\Carbon;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PembinaDashboardController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('is-pembina');

        $pembina = auth()->user()->profilPengguna;
        $managedOrgIds = $pembina ? $pembina->pembinaan()->pluck('id_organisasi')->toArray() : [];

        $totalOrganisasiAktif = Organisasi::where('status_aktif', true)
            ->whereIn('id_organisasi', $managedOrgIds)
            ->count();

        // Count distinct active students in organizations managed by the pembina
        $totalMahasiswaAktif = Mahasiswa::whereHas('anggotaOrganisasi', function ($q) use ($managedOrgIds) {
            $q->whereIn('id_organisasi', $managedOrgIds)->where('status_keanggotaan', 'Aktif');
        })->distinct()->count();

        $totalAnggotaAktif = AnggotaOrganisasi::where('status_keanggotaan', 'Aktif')
            ->whereIn('id_organisasi', $managedOrgIds)
            ->count();

        $pengajuanProfilList = PengajuanProfilOrganisasi::where('status_pengajuan', 'Diproses')
            ->whereHas('pengurusOrganisasi.profilOrganisasi', function ($q) use ($managedOrgIds) {
                $q->whereIn('id_organisasi', $managedOrgIds);
            })
            ->with(['pengurusOrganisasi.profilOrganisasi.organisasi'])
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $totalPendingPengajuan = PengajuanProfilOrganisasi::where('status_pengajuan', 'Diproses')
            ->whereHas('pengurusOrganisasi.profilOrganisasi', function ($q) use ($managedOrgIds) {
                $q->whereIn('id_organisasi', $managedOrgIds);
            })
            ->count();

        $pendingDokumentasiList = DokumentasiKegiatan::where('status_dokumentasi', 'Diproses')
            ->whereHas('kegiatan.profilOrganisasi', function ($q) use ($managedOrgIds) {
                $q->whereIn('id_organisasi', $managedOrgIds);
            })
            ->with(['kegiatan.profilOrganisasi.organisasi'])
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get();

        $totalPendingDokumentasi = DokumentasiKegiatan::where('status_dokumentasi', 'Diproses')
            ->whereHas('kegiatan.profilOrganisasi', function ($q) use ($managedOrgIds) {
                $q->whereIn('id_organisasi', $managedOrgIds);
            })
            ->count();

        $now = Carbon::now();
        $kegiatanBulanIni = Kegiatan::where('status_kegiatan', '!=', 'Dibatalkan')
            ->whereHas('profilOrganisasi', function ($q) use ($managedOrgIds) {
                $q->whereIn('id_organisasi', $managedOrgIds);
            })
            ->whereMonth('tanggal_pelaksanaan', $now->month)
            ->whereYear('tanggal_pelaksanaan', $now->year)
            ->count();

        $lastMonth = Carbon::now()->subMonth();
        $kegiatanBulanLalu = Kegiatan::where('status_kegiatan', '!=', 'Dibatalkan')
            ->whereHas('profilOrganisasi', function ($q) use ($managedOrgIds) {
                $q->whereIn('id_organisasi', $managedOrgIds);
            })
            ->whereMonth('tanggal_pelaksanaan', $lastMonth->month)
            ->whereYear('tanggal_pelaksanaan', $lastMonth->year)
            ->count();

        $perubahanKegiatanBulanLalu = $kegiatanBulanIni - $kegiatanBulanLalu;

        $agendaTerdekat = Kegiatan::where('status_kegiatan', '!=', 'Dibatalkan')
            ->whereHas('profilOrganisasi', function ($q) use ($managedOrgIds) {
                $q->whereIn('id_organisasi', $managedOrgIds);
            })
            ->where('tanggal_pelaksanaan', '>=', Carbon::today()->toDateString())
            ->orderBy('tanggal_pelaksanaan', 'asc')
            ->take(5)
            ->get();

        return Inertia::render('pembina/dashboard', [
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
