<?php

use App\Http\Controllers\ProfilOrganisasiController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::resource('profil-organisasi', ProfilOrganisasiController::class);

require __DIR__ . '/settings.php';
