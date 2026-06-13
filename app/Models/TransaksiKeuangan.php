<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable([
    'id_kegiatan',
    'jenis_transaksi',
    'nominal_transaksi',
    'tanggal_transaksi',
    'sumber_tujuan_transaksi',
    'foto_bukti_transaksi',
    'catatan_koreksi',
])]
class TransaksiKeuangan extends Model
{
    protected $table = 'transaksi_keuangan';

    protected $primaryKey = 'id_transaksi';

    protected $casts = [
        'tanggal_transaksi' => 'date',
    ];

    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class, 'id_kegiatan', 'id_kegiatan');
    }

    public function pesertaKegiatan(): HasOne
    {
        return $this->hasOne(PesertaKegiatan::class, 'id_peserta', 'id_peserta');
    }
}
