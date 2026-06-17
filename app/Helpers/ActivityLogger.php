<?php

namespace App\Helpers;

use App\Models\LogAktivitas;

class ActivityLogger
{
    public static function log(string $kategori, string $deskripsi, ?int $id_organisasi = null): void
    {
        LogAktivitas::create([
            'username' => auth()->check() ? auth()->user()->username : null,
            'id_organisasi' => $id_organisasi,
            'kategori' => $kategori,
            'deskripsi' => $deskripsi,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
