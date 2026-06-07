<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', function () {
        $user = auth()->user();
        $organizations = [];

        if ($user && $user->role === 'Mahasiswa' && $user->profilPengguna) {
            $nim = $user->profilPengguna->nim;

            $anggotaList = \App\Models\AnggotaOrganisasi::where('nim', $nim)
                ->where('status_keanggotaan', 'Aktif')
                ->whereHas('organisasi', function ($q) {
                    $q->where('status_aktif', true);
                })
                ->with([
                    'organisasi.profilOrganisasi' => function ($q) {
                        $q->where('status_aktif', true);
                    },
                    'pengurusOrganisasi' => function ($q) {
                        $q->where('status_aktif', true);
                    }
                ])
                ->get();

            foreach ($anggotaList as $anggota) {
                $org = $anggota->organisasi;
                $activeProfile = $org->profilOrganisasi->first();
                $activePengurus = $anggota->pengurusOrganisasi->first();

                if ($activePengurus) {
                    $organizations[] = [
                        'id' => $org->id_organisasi,
                        'name' => $org->nama_organisasi,
                        'role' => $activePengurus->jabatan,
                        'type' => 'staff',
                        'icon' => '',
                        'bgIcon' => '',
                        'description' => $activeProfile?->deskripsi_organisasi ?? '',
                        'link' => '#',
                    ];
                } else {
                    $organizations[] = [
                        'id' => $org->id_organisasi,
                        'name' => $org->nama_organisasi,
                        'role' => 'Anggota Aktif',
                        'type' => 'member',
                        'icon' => '',
                        'statusText' => 'Anggota Aktif',
                        'link' => route('organisasi.detail', $org->id_organisasi),
                    ];
                }
            }
        }

        return \Inertia\Inertia::render('home', [
            'organizations' => $organizations,
        ]);
    })->name('home')->middleware('can:is-mahasiswa');

    // Mahasiswa Organization Routes
    Route::get('/organisasi', [\App\Http\Controllers\UserOrganisasiController::class, 'index'])->name('organisasi.index')->middleware('can:is-mahasiswa');
    Route::get('/organisasi/{organisasi}/detail', [\App\Http\Controllers\UserOrganisasiController::class, 'showProfil'])->name('organisasi.detail')->middleware('can:is-mahasiswa');
    Route::post('/organisasi/daftar', [\App\Http\Controllers\AnggotaOrganisasiController::class, 'store'])->name('organisasi.daftar')->middleware('can:is-mahasiswa');

    // Admin Kemahasiswaan Routes
    require __DIR__ . '/admin.php';

    // Pengurus Organisasi Routes
    require __DIR__ . '/pengurus.php';
});

require __DIR__ . '/settings.php';

// Catch-all: redirect any undefined URL to login
Route::fallback(function () {
    return redirect('/login');
});
