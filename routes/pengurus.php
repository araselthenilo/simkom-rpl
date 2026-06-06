<?php

use Illuminate\Support\Facades\Route;

Route::middleware('can:is-pengurus')->prefix('pengurus')->group(function () {
    Route::inertia('/', 'pengurus/dashboard')->name('pengurus');
    Route::inertia('/keuangan', 'pengurus/manajemen-keuangan')->name('pengurus.keuangan');
    Route::inertia('/anggota', 'pengurus/manajemen-anggota')->name('pengurus.anggota');
    Route::inertia('/kegiatan', 'pengurus/manajemen-kegiatan')->name('pengurus.kegiatan');
});
