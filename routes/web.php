<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/home', 'home')->name('home')->middleware('can:is-mahasiswa');

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
