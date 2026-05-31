<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DokumentasiKegiatan extends Model
{
    protected $table = 'dokumentasi_kegiatan';
    protected $primaryKey = 'id_dokumentasi';

    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class, 'id_kegiatan', 'id_kegiatan');
    }

    public function fotoKegiatan(): HasMany
    {
        return $this->hasMany(FotoDokumentasi::class, 'id_dokumentasi', 'id_dokumentasi');
    }

    public function catatanRevisi(): HasMany
    {
        return $this->hasMany(CatatanRevisi::class, 'id_dokumentasi', 'id_dokumentasi');
    }
}
