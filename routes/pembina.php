<?php

use App\Http\Controllers\PembinaDashboardController;
use App\Http\Controllers\PembinaDokumentasiKegiatanController;
use App\Http\Controllers\PembinaKegiatanController;
use App\Http\Controllers\PembinaLaporanController;
use App\Http\Controllers\PembinaOrganisasiController;
use App\Http\Controllers\PembinaPengajuanProfilController;
use App\Http\Controllers\PembinaPengurusOrganisasiController;
use App\Http\Controllers\PembinaTransaksiKeuanganController;
use Illuminate\Support\Facades\Route;

Route::middleware('can:is-pembina')->prefix('pembina')->name('pembina.')->group(function () {
    Route::get('/dashboard', [PembinaDashboardController::class, 'index'])->name('dashboard');
    Route::get('/organisasi', [PembinaOrganisasiController::class, 'index'])->name('organisasi');

    // NOTE: Pembina Organisasi cannot create organizations or assign pembinas, but they can view profile history and update profiles.
    Route::middleware('can:is-pembina-organisasi,organisasi')->group(function () {
        Route::get('/organisasi/{organisasi}/profil', [PembinaOrganisasiController::class, 'profilHistory'])->name('organisasi.profil');
        Route::get('/organisasi/{organisasi}/profil/create', [PembinaOrganisasiController::class, 'createProfil'])->name('profil-organisasi.create');
        Route::post('/organisasi/{organisasi}/profil', [PembinaOrganisasiController::class, 'storeProfil'])->name('profil-organisasi.store');
    });

    Route::get('/profil-organisasi/{profilOrganisasi}/edit', [PembinaOrganisasiController::class, 'editProfil'])->name('profil-organisasi.edit');
    Route::put('/profil-organisasi/{profilOrganisasi}', [PembinaOrganisasiController::class, 'updateProfil'])->name('profil-organisasi.update');
    Route::get('/profil-organisasi/{profilOrganisasi}/pengurus', [PembinaOrganisasiController::class, 'showPengurus'])->name('profil-organisasi.pengurus');

    // Pengurus management routes
    Route::get('/pengurus', [PembinaPengurusOrganisasiController::class, 'adminIndex'])->name('pengurus.index');
    Route::post('/pengurus', [PembinaPengurusOrganisasiController::class, 'store'])->name('pengurus.store');
    Route::patch('/pengurus/{pengurus}/toggle', [PembinaPengurusOrganisasiController::class, 'toggleStatus'])->name('pengurus.toggle');
    Route::delete('/pengurus/{pengurus}', [PembinaPengurusOrganisasiController::class, 'destroy'])->name('pengurus.destroy');

    // Kegiatan management routes
    Route::get('/kegiatan', [PembinaKegiatanController::class, 'index'])->name('kegiatan.index');
    Route::post('/kegiatan', [PembinaKegiatanController::class, 'store'])->name('kegiatan.store');
    Route::put('/kegiatan/{kegiatan}', [PembinaKegiatanController::class, 'update'])->name('kegiatan.update');
    Route::delete('/kegiatan/{kegiatan}', [PembinaKegiatanController::class, 'destroy'])->name('kegiatan.destroy');
    Route::get('/kegiatan/{kegiatan}/peserta', [PembinaKegiatanController::class, 'peserta'])->name('kegiatan.peserta');

    // Keuangan management routes (read-only overview for pembina)
    Route::get('/keuangan', [PembinaTransaksiKeuanganController::class, 'adminIndex'])->name('keuangan.index');

    // Pengajuan Profil routes
    Route::get('/pengajuan-profil', [PembinaPengajuanProfilController::class, 'index'])->name('pengajuan-profil.index');
    Route::get('/pengajuan-profil/{submission}', [PembinaPengajuanProfilController::class, 'show'])->name('pengajuan-profil.show');
    Route::post('/pengajuan-profil/{submission}/accept', [PembinaPengajuanProfilController::class, 'accept'])->name('pengajuan-profil.accept');
    Route::post('/pengajuan-profil/{submission}/reject', [PembinaPengajuanProfilController::class, 'reject'])->name('pengajuan-profil.reject');

    // Dokumentasi Kegiatan routes
    Route::get('/dokumentasi-kegiatan', [PembinaDokumentasiKegiatanController::class, 'index'])->name('dokumentasi-kegiatan.index');
    Route::get('/dokumentasi-kegiatan/{dokumentasi}', [PembinaDokumentasiKegiatanController::class, 'show'])->name('dokumentasi-kegiatan.show');
    Route::post('/dokumentasi-kegiatan/{dokumentasi}/update-status', [PembinaDokumentasiKegiatanController::class, 'updateStatus'])->name('dokumentasi-kegiatan.update-status');

    // Laporan routes
    Route::get('/laporan', [PembinaLaporanController::class, 'index'])->name('laporan.index');
    Route::post('/laporan/generate', [PembinaLaporanController::class, 'generate'])->name('laporan.generate');
    Route::get('/laporan/{arsipLaporan}/download', [PembinaLaporanController::class, 'download'])->name('laporan.download');
    Route::delete('/laporan/{arsipLaporan}', [PembinaLaporanController::class, 'destroy'])->name('laporan.destroy');
});
