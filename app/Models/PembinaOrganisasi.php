<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PembinaOrganisasi extends Model
{
    protected $table = 'pembina_organisasi';
    protected $primaryKey = 'nip_pembina';
    public $incrementing = false;
    protected $keyType = 'string';

    public function organisasi(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username', 'username');
    }

    public function pembinaan(): HasMany
    {
        return $this->hasMany(Pembinaan::class, 'nip_pembina', 'nip_pembina');
    }
}
