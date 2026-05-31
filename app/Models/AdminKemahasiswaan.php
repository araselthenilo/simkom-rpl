<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminKemahasiswaan extends Model
{
    protected $primaryKey = 'nip_admin';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $table = 'admin_kemahasiswaan';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username', 'username');
    }
}
