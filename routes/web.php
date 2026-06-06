<?php

use App\Http\Controllers\DashboardMonitoringController;
use App\Http\Controllers\ProfilOrganisasiController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/home', 'home')->name('home');
    Route::inertia('/pengurus', 'pengurus/dashboard')->name('pengurus');
    Route::inertia('/pengurus/keuangan', 'pengurus/manajemen-keuangan')->name('pengurus.keuangan');
    Route::get('dashboard/{organisasi?}', [DashboardMonitoringController::class, 'index'])->name('dashboard');
});

Route::resource('profil-organisasi', ProfilOrganisasiController::class);

require __DIR__ . '/settings.php';
