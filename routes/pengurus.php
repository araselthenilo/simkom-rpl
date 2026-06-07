<?php

use App\Http\Controllers\AnggotaOrganisasiController;
use App\Http\Controllers\PengurusProfilOrganisasiController;
use Illuminate\Support\Facades\Route;

Route::middleware('can:is-pengurus')->prefix('pengurus')->group(function () {
    Route::inertia('/', 'pengurus/dashboard')->name('pengurus');
    Route::inertia('/keuangan', 'pengurus/manajemen-keuangan')->name('pengurus.keuangan');
    
    // Manajemen Anggota Routes
    Route::get('/anggota', [AnggotaOrganisasiController::class, 'pengurusIndex'])->name('pengurus.anggota');
    Route::patch('/anggota/{anggotaOrganisasi}', [AnggotaOrganisasiController::class, 'update'])->name('pengurus.anggota.update');

    Route::inertia('/kegiatan', 'pengurus/manajemen-kegiatan')->name('pengurus.kegiatan');

    Route::get('/switch-organisasi/{organisasi}', function (\App\Models\Organisasi $organisasi) {
        $user = auth()->user();
        if (!$user || $user->role !== 'Mahasiswa' || !$user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // Verify that the user is indeed active staff of this organization
        $isStaff = \App\Models\PengurusOrganisasi::where('status_aktif', true)
            ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                $q->where('nim', $nim);
            })
            ->whereHas('profilOrganisasi', function ($q) use ($organisasi) {
                $q->where('id_organisasi', $organisasi->id_organisasi);
            })
            ->exists();

        if (!$isStaff) {
            abort(403, 'Anda bukan pengurus aktif di organisasi ini.');
        }

        session(['active_organization_id' => $organisasi->id_organisasi]);

        $referer = request()->headers->get('referer');
        $refererPath = $referer ? parse_url($referer, PHP_URL_PATH) : '';

        if ($refererPath && str_starts_with($refererPath, '/pengurus')) {
            return back();
        }

        return redirect()->route('pengurus');
    })->name('pengurus.switch-organisasi');

    // Profil Organisasi routes for pengurus
    Route::get('/profil', [PengurusProfilOrganisasiController::class, 'show'])->name('pengurus.profil');
    Route::get('/profil/edit', [PengurusProfilOrganisasiController::class, 'edit'])->name('pengurus.profil.edit');
    Route::post('/profil/propose', [PengurusProfilOrganisasiController::class, 'propose'])->name('pengurus.profil.propose');
});
