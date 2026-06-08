<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'nip_pembina',
    'id_organisasi',
    'periode_pembinaan',
])]
class Pembinaan extends Model
{
    protected $table = 'pembinaan';

    protected $primaryKey = 'id_pembinaan';

    public function pembinaOrganisasi(): BelongsTo
    {
        return $this->belongsTo(PembinaOrganisasi::class, 'nip_pembina', 'nip_pembina');
    }

    public function organisasi(): BelongsTo
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi', 'id_organisasi');
    }
}
