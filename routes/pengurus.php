<?php

use App\Http\Controllers\AnggotaOrganisasiController;
use App\Http\Controllers\PengurusDashboardController;
use App\Http\Controllers\PengurusKegiatanController;
use App\Http\Controllers\PengurusOrganisasiController;
use App\Http\Controllers\PengurusProfilOrganisasiController;
use App\Http\Controllers\TransaksiKeuanganController;
use App\Models\Organisasi;
use App\Models\PengurusOrganisasi;
use Illuminate\Support\Facades\Route;

Route::middleware('can:is-pengurus-organisasi')->prefix('pengurus')->group(function () {
    Route::get('/', [PengurusDashboardController::class, 'index'])->name('pengurus');
    Route::get('/keuangan', [TransaksiKeuanganController::class, 'pengurusIndex'])->name('pengurus.keuangan');
    Route::post('/keuangan/store', [TransaksiKeuanganController::class, 'pengurusStore'])->name('pengurus.keuangan.store');
    Route::put('/keuangan/{transaksi}', [TransaksiKeuanganController::class, 'pengurusUpdate'])->name('pengurus.keuangan.update');

    // Manajemen Staff / Pengurus Routes
    Route::get('/staff', [PengurusOrganisasiController::class, 'pengurusIndex'])->name('pengurus.staff.index');
    Route::post('/staff', [PengurusOrganisasiController::class, 'storePengurus'])->name('pengurus.staff.store');
    Route::patch('/staff/{pengurus}/toggle', [PengurusOrganisasiController::class, 'toggleStatusPengurus'])->name('pengurus.staff.toggle');
    Route::delete('/staff/{pengurus}', [PengurusOrganisasiController::class, 'destroyPengurus'])->name('pengurus.staff.destroy');

    // Manajemen Anggota Routes

    Route::get('/anggota', [AnggotaOrganisasiController::class, 'pengurusIndex'])->name('pengurus.anggota');
    Route::patch('/anggota/{anggotaOrganisasi}', [AnggotaOrganisasiController::class, 'update'])->name('pengurus.anggota.update');

    // Manajemen Kegiatan Routes
    Route::get('/kegiatan', [PengurusKegiatanController::class, 'index'])->name('pengurus.kegiatan');
    Route::post('/kegiatan', [PengurusKegiatanController::class, 'store'])->name('pengurus.kegiatan.store');
    Route::put('/kegiatan/{kegiatan}', [PengurusKegiatanController::class, 'update'])->name('pengurus.kegiatan.update');
    Route::delete('/kegiatan/{kegiatan}', [PengurusKegiatanController::class, 'destroy'])->name('pengurus.kegiatan.destroy');
    Route::get('/kegiatan/{kegiatan}/peserta', [PengurusKegiatanController::class, 'peserta'])->name('pengurus.kegiatan.peserta');
    Route::get('/kegiatan/{kegiatan}/dokumentasi', [PengurusKegiatanController::class, 'showDokumentasi'])->name('pengurus.kegiatan.dokumentasi');
    Route::post('/kegiatan/{kegiatan}/dokumentasi', [PengurusKegiatanController::class, 'storeDokumentasi'])->name('pengurus.kegiatan.dokumentasi.store');
    Route::post('/kegiatan/{kegiatan}/dokumentasi/foto', [PengurusKegiatanController::class, 'uploadFoto'])->name('pengurus.kegiatan.dokumentasi.foto');
    Route::delete('/kegiatan/{kegiatan}/dokumentasi/foto/{foto}', [PengurusKegiatanController::class, 'deleteFoto'])->name('pengurus.kegiatan.dokumentasi.foto.delete');
    Route::post('/kegiatan/{kegiatan}/dokumentasi/revisi/{catatan}/tindaklanjut', [PengurusKegiatanController::class, 'tindaklanjutCatatan'])->name('pengurus.kegiatan.dokumentasi.revisi.tindaklanjut');

    Route::get('/switch-organisasi/{organisasi}', function (Organisasi $organisasi) {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // Verify that the user is indeed active staff of this organization
        $isStaff = PengurusOrganisasi::where('status_aktif', true)
            ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                $q->where('nim', $nim);
            })
            ->whereHas('profilOrganisasi', function ($q) use ($organisasi) {
                $q->where('id_organisasi', $organisasi->id_organisasi);
            })
            ->exists();

        if (! $isStaff) {
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
