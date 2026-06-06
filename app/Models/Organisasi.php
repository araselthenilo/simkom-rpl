<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama_organisasi', 'status_aktif'])]
class Organisasi extends Model
{
    protected $table = 'organisasi';

    protected $primaryKey = 'id_organisasi';

    public function profilOrganisasi(): HasMany
    {
        return $this->hasMany(ProfilOrganisasi::class, 'id_organisasi', 'id_organisasi');
    }

    public function pembinaan(): HasMany
    {
        return $this->hasMany(Pembinaan::class, 'id_organisasi', 'id_organisasi');
    }

    public function anggotaOrganisasi(): HasMany
    {
        return $this->hasMany(AnggotaOrganisasi::class, 'id_organisasi', 'id_organisasi');
    }
}
