<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\OrganisasiController;
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
});
