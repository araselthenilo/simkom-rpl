<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfilOrganisasi extends Model
{
    protected $table = 'profil_organisasi';
    protected $primaryKey = 'id_profil';

    public function organisasi(): BelongsTo
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi', 'id_organisasi');
    }

    public function pengurusOrganisasi(): HasMany
    {
        return $this->hasMany(PengurusOrganisasi::class, 'id_profil', 'id_profil');
    }

    public function kegiatan(): HasMany
    {
        return $this->hasMany(Kegiatan::class, 'id_profil', 'id_profil');
    }
}
