<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PesertaKegiatan extends Model
{
    protected $table = 'peserta_kegiatan';
    protected $primaryKey = 'id_peserta';

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'nim', 'nim');
    }

    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class, 'id_kegiatan', 'id_kegiatan');
    }

    public function transaksiKeuangan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class, 'id_transaksi', 'id_transaksi');
    }
}
