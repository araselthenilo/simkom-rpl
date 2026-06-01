<?php

use App\Http\Controllers\DashboardMonitoringController;
use App\Http\Controllers\ProfilOrganisasiController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard/{organisasi?}', [DashboardMonitoringController::class, 'index'])->name('dashboard');
});

Route::resource('profil-organisasi', ProfilOrganisasiController::class);

require __DIR__ . '/settings.php';
