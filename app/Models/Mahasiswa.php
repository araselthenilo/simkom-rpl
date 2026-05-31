<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Mahasiswa extends Model
{
    protected $table = 'mahasiswa';
    protected $primaryKey = 'nim';
    public $incrementing = false;
    protected $keyType = 'string';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username', 'username');
    }

    public function anggotaOrganisasi(): HasMany
    {
        return $this->hasMany(AnggotaOrganisasi::class, 'nim', 'nim');
    }

    public function pesertaKegiatan(): HasMany
    {
        return $this->hasMany(PesertaKegiatan::class, 'nim', 'nim');
    }
}
