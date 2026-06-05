<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengajuanProfilOrganisasi extends Model
{
    protected $table = 'pengajuan_profil_organisasi';
    protected $primaryKey = 'id_pengajuan';
    protected $appends = ['nip_petugas', 'organisasi'];
    protected $with = [
        'penggunaPetugas.profilPengguna',
        'pengurusOrganisasi.profilOrganisasi',
    ];

    public function pengurusOrganisasi(): BelongsTo
    {
        return $this->belongsTo(PengurusOrganisasi::class, 'id_pengurus', 'id_pengurus');
    }

    public function penggunaPetugas(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username_petugas', 'username');
    }

    public function nipPetugas(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->penggunaPetugas?->profilPengguna?->getKey
        );
    }

    public function organisasi(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->pengurusOrganisasi?->profilOrganisasi?->organisasi
        );
    }
}
