<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatatanRevisi extends Model
{
    protected $table = 'catatan_revisi';
    protected $primaryKey = 'id_catatan';
    protected $appends = ['nip_petugas'];
    protected $with = [
        'penggunaPetugas.pribadiPengguna',
    ];

    public function dokumentasiKegiatan(): BelongsTo
    {
        return $this->belongsTo(DokumentasiKegiatan::class, 'id_dokumentasi', 'id_dokumentasi');
    }

    public function penggunaPetugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username_petugas', 'username');
    }

    public function nipPetugas(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->penggunaPetugas?->pribadiPengguna?->getKey
        );
    }
}
