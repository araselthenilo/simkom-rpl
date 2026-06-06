<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id_profil', 'id_keanggotaan', 'jabatan', 'status_aktif'])]
class PengurusOrganisasi extends Model
{
    protected $table = 'pengurus_organisasi';

    protected $primaryKey = 'id_pengurus';

    public function profilOrganisasi(): BelongsTo
    {
        return $this->belongsTo(ProfilOrganisasi::class, 'id_profil', 'id_profil');
    }

    public function anggotaOrganisasi(): BelongsTo
    {
        return $this->belongsTo(anggotaOrganisasi::class, 'id_keanggotaan', 'id_keanggotaan');
    }

    public function pengajuanProfilOrganisasi(): HasMany
    {
        return $this->hasMany(PengajuanProfilOrganisasi::class, 'id_pengurus', 'id_pengurus');
    }
}
