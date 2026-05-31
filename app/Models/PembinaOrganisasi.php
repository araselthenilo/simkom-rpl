<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PembinaOrganisasi extends Model
{
    protected $primaryKey = 'nip_pembina';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'pembina_organisasi';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username', 'username');
    }
}
