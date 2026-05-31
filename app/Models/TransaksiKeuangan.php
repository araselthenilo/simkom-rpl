<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TransaksiKeuangan extends Model
{
    protected $table = 'transaksi_keuangan';
    protected $primaryKey = 'id_transaksi';

    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class, 'id_kegiatan', 'id_kegiatan');
    }

    public function pesertaKegiatan(): HasOne
    {
        return $this->hasOne(PesertaKegiatan::class, 'id_peserta', 'id_peserta');
    }
}
