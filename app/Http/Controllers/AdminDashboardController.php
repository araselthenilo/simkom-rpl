<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Mahasiswa;
use App\Models\Organisasi;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $totalOrganisasiAktif = Organisasi::where('status_aktif', true)->count();
        $totalMahasiswaAktif = Mahasiswa::count();
        $totalAnggotaAktif = AnggotaOrganisasi::where('status_keanggotaan', 'Aktif')->count();

        return Inertia::render('admin/dashboard', [
            'totalOrganisasiAktif' => $totalOrganisasiAktif,
            'totalMahasiswaAktif' => $totalMahasiswaAktif,
            'totalAnggotaAktif' => $totalAnggotaAktif,
        ]);
    }
}
