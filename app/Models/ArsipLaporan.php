<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'id_organisasi',
    'username_petugas',
    'jenis_laporan',
    'file_laporan',
])]
class ArsipLaporan extends Model
{
    protected $table = 'arsip_laporan';

    protected $primaryKey = 'id_laporan';

    protected $appends = ['nip_petugas'];

    protected $with = [
        'penggunaPetugas.profilPengguna',
    ];

    public function organisasi(): BelongsTo
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi', 'id_organisasi');
    }

    public function penggunaPetugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username_petugas', 'username');
    }

    public function nipPetugas(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->penggunaPetugas?->profilPengguna?->getKey
        );
    }
}
