<?php

use App\Http\Controllers\AnggotaOrganisasiController;
use App\Http\Controllers\PengurusKegiatanController;
use App\Http\Controllers\PesertaKegiatanController;
use App\Http\Controllers\TransaksiKeuanganController;
use App\Http\Controllers\UserKegiatanController;
use App\Http\Controllers\UserOrganisasiController;
use App\Models\AnggotaOrganisasi;
use App\Models\Kegiatan;
use App\Models\PesertaKegiatan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', function () {
        $user = auth()->user();
        $organizations = [];

        if ($user && $user->role === 'Mahasiswa' && $user->profilPengguna) {
            $nim = $user->profilPengguna->nim;

            $anggotaList = AnggotaOrganisasi::where('nim', $nim)
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
                    },
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

        $kegiatanList = Kegiatan::where('status_kegiatan', 'Mendatang')
            ->with(['profilOrganisasi.organisasi'])
            ->withCount('pesertaKegiatan')
            ->orderBy('tanggal_pelaksanaan', 'asc')
            ->take(3)
            ->get();

        $registrations = [];
        $nim = '';
        if ($user && $user->role === 'Mahasiswa' && $user->profilPengguna) {
            $nim = $user->profilPengguna->nim;
            $registrations = PesertaKegiatan::where('nim', $nim)
                ->get()
                ->pluck('id_peserta', 'id_kegiatan')
                ->toArray();
        }

        return Inertia::render('home', [
            'organizations' => $organizations,
            'kegiatanList' => $kegiatanList,
            'registrations' => (object) $registrations,
            'nim' => $nim,
        ]);
    })->name('home')->middleware('can:is-mahasiswa');

    // Mahasiswa Organization Routes
    Route::get('/organisasi', [UserOrganisasiController::class, 'index'])->name('organisasi.index')->middleware('can:is-mahasiswa');
    Route::get('/organisasi/{organisasi}/detail', [UserOrganisasiController::class, 'showProfil'])->name('organisasi.detail')->middleware('can:is-mahasiswa');
    Route::get('/organisasi/{organisasi}/pengurus', [UserOrganisasiController::class, 'showPengurus'])->name('organisasi.pengurus')->middleware('can:is-mahasiswa');
    Route::get('/organisasi/{organisasi}/kegiatan', [UserOrganisasiController::class, 'showKegiatan'])->name('organisasi.kegiatan')->middleware('can:is-mahasiswa');
    Route::get('/organisasi/{organisasi}/keuangan', [UserOrganisasiController::class, 'showKeuangan'])->name('organisasi.keuangan')->middleware('can:is-mahasiswa');
    Route::post('/organisasi/daftar', [AnggotaOrganisasiController::class, 'store'])->name('organisasi.daftar')->middleware('can:is-mahasiswa');

    // Mahasiswa Kegiatan Routes
    Route::get('/kegiatan', [UserKegiatanController::class, 'index'])->name('kegiatan.index')->middleware('can:is-mahasiswa');
    Route::post('/kegiatan/{id_kegiatan}/daftar', [PesertaKegiatanController::class, 'store'])->name('kegiatan.daftar')->middleware('can:is-mahasiswa');
    Route::delete('/kegiatan/{id_kegiatan}/batal/{id_peserta}', [PesertaKegiatanController::class, 'destroy'])->name('kegiatan.batal')->middleware('can:is-mahasiswa');

    // Admin Kemahasiswaan Routes
    require __DIR__.'/admin.php';

    // Pembina Organisasi Routes
    require __DIR__.'/pembina.php';

    // Pengurus Organisasi Routes
    require __DIR__.'/pengurus.php';

    // Secure Document and Image Routes
    Route::get('/anggota/{anggotaOrganisasi}/ktm', [AnggotaOrganisasiController::class, 'showKtm'])
        ->name('anggota.ktm');
    Route::get('/transaksi-keuangan/{transaksi}/bukti', [TransaksiKeuanganController::class, 'showBuktiTrans'])
        ->name('transaksi-keuangan.bukti');
    Route::get('/dokumentasi-kegiatan/{dokumentasi}/download/{type}', [PengurusKegiatanController::class, 'downloadDoc'])
        ->name('dokumentasi.download-doc');
});

require __DIR__.'/settings.php';

// Catch-all: redirect any undefined URL to login
Route::fallback(function () {
    return redirect('/login');
});
