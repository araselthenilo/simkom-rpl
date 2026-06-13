<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminKegiatanController;
use App\Http\Controllers\AdminPengajuanProfilController;
use App\Http\Controllers\AdminDokumentasiKegiatanController;
use App\Http\Controllers\OrganisasiController;
use App\Http\Controllers\PengurusOrganisasiController;
use App\Http\Controllers\TransaksiKeuanganController;
use Illuminate\Support\Facades\Route;

Route::middleware('can:is-admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/organisasi', [OrganisasiController::class, 'index'])->name('organisasi');
    Route::get('/organisasi/create', [OrganisasiController::class, 'create'])->name('organisasi.create');
    Route::post('/organisasi', [OrganisasiController::class, 'store'])->name('organisasi.store');
    Route::patch('/organisasi/{organisasi}/toggle', [OrganisasiController::class, 'toggleStatus'])->name('organisasi.toggle');
    Route::delete('/organisasi/{organisasi}', [OrganisasiController::class, 'destroy'])->name('organisasi.destroy');
    Route::get('/organisasi/{organisasi}/profil', [OrganisasiController::class, 'profilHistory'])->name('organisasi.profil');
    Route::post('/organisasi/{organisasi}/pembinaan', [OrganisasiController::class, 'storePembinaan'])->name('pembinaan.store');
    Route::delete('/pembinaan/{pembinaan}', [OrganisasiController::class, 'destroyPembinaan'])->name('pembinaan.destroy');
    Route::get('/organisasi/{organisasi}/profil/create', [OrganisasiController::class, 'createProfil'])->name('profil-organisasi.create');
    Route::post('/organisasi/{organisasi}/profil', [OrganisasiController::class, 'storeProfil'])->name('profil-organisasi.store');
    Route::get('/profil-organisasi/{profilOrganisasi}/edit', [OrganisasiController::class, 'editProfil'])->name('profil-organisasi.edit');
    Route::put('/profil-organisasi/{profilOrganisasi}', [OrganisasiController::class, 'updateProfil'])->name('profil-organisasi.update');
    Route::get('/profil-organisasi/{profilOrganisasi}/pengurus', [OrganisasiController::class, 'showPengurus'])->name('profil-organisasi.pengurus');

    // Pengurus management routes
    Route::get('/pengurus', [PengurusOrganisasiController::class, 'adminIndex'])->name('pengurus.index');
    Route::post('/pengurus', [PengurusOrganisasiController::class, 'store'])->name('pengurus.store');
    Route::patch('/pengurus/{pengurus}/toggle', [PengurusOrganisasiController::class, 'toggleStatus'])->name('pengurus.toggle');
    Route::delete('/pengurus/{pengurus}', [PengurusOrganisasiController::class, 'destroy'])->name('pengurus.destroy');

    // Kegiatan management routes
    Route::get('/kegiatan', [AdminKegiatanController::class, 'index'])->name('kegiatan.index');
    Route::post('/kegiatan', [AdminKegiatanController::class, 'store'])->name('kegiatan.store');
    Route::put('/kegiatan/{kegiatan}', [AdminKegiatanController::class, 'update'])->name('kegiatan.update');
    Route::delete('/kegiatan/{kegiatan}', [AdminKegiatanController::class, 'destroy'])->name('kegiatan.destroy');
    Route::get('/kegiatan/{kegiatan}/peserta', [AdminKegiatanController::class, 'peserta'])->name('kegiatan.peserta');

    // Keuangan management routes (read-only overview for admin)
    Route::get('/keuangan', [TransaksiKeuanganController::class, 'adminIndex'])->name('keuangan.index');

    // Pengajuan Profil routes
    Route::get('/pengajuan-profil', [AdminPengajuanProfilController::class, 'index'])->name('pengajuan-profil.index');
    Route::get('/pengajuan-profil/{submission}', [AdminPengajuanProfilController::class, 'show'])->name('pengajuan-profil.show');
    Route::post('/pengajuan-profil/{submission}/accept', [AdminPengajuanProfilController::class, 'accept'])->name('pengajuan-profil.accept');
    Route::post('/pengajuan-profil/{submission}/reject', [AdminPengajuanProfilController::class, 'reject'])->name('pengajuan-profil.reject');

    // Dokumentasi Kegiatan routes
    Route::get('/dokumentasi-kegiatan', [AdminDokumentasiKegiatanController::class, 'index'])->name('dokumentasi-kegiatan.index');
    Route::get('/dokumentasi-kegiatan/{dokumentasi}', [AdminDokumentasiKegiatanController::class, 'show'])->name('dokumentasi-kegiatan.show');
    Route::post('/dokumentasi-kegiatan/{dokumentasi}/update-status', [AdminDokumentasiKegiatanController::class, 'updateStatus'])->name('dokumentasi-kegiatan.update-status');
});
