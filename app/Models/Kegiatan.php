<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Kegiatan extends Model
{
    protected $table = 'kegiatan';
    protected $primaryKey = 'id_kegiatan';

    public function profilOrganisasi(): BelongsTo
    {
        return $this->belongsTo(ProfilOrganisasi::class, 'id_profil', 'id_profil');
    }

    public function penggunaPetugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username_petugas', 'username');
    }

    public function dokumentasiKegiatan(): HasOne
    {
        return $this->hasOne(DokumentasiKegiatan::class, 'id_dokumentasi', 'id_dokumentasi');
    }

    public function transaksiKeuangan(): HasMany
    {
        return $this->hasMany(TransaksiKeuangan::class, 'id_kegiatan', 'id_kegiatan');
    }

    public function pesertaKegiatan(): HasMany
    {
        return $this->hasMany(PesertaKegiatan::class, 'id_kegiatan', 'id_kegiatan');
    }
}
