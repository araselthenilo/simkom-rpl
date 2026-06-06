<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id_organisasi', 'nim', 'tanggal_bergabung', 'status_keanggotaan', 'alasan_penolakan'])]
class AnggotaOrganisasi extends Model
{
    protected $table = 'anggota_organisasi';

    protected $primaryKey = 'id_keanggotaan';

    public function organisasi(): BelongsTo
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi', 'id_organisasi');
    }

    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class, 'nim', 'nim');
    }

    public function pengurusOrganisasi(): HasMany
    {
        return $this->hasMany(PengurusOrganisasi::class, 'id_keanggotaan', 'id_keanggotaan');
    }
}
