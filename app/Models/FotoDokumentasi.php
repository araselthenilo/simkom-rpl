<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FotoDokumentasi extends Model
{
    protected $table = 'foto_dokumentasi';
    protected $primaryKey = 'id_foto';

    public function dokumentasiKegiatan(): BelongsTo
    {
        return $this->belongsTo(DokumentasiKegiatan::class, 'id_dokumentasi', 'id_dokumentasi');
    }
}
