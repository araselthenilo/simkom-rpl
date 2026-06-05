<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['nip_admin', 'username', 'nama_lengkap', 'nomor_telepon'])]
class AdminKemahasiswaan extends Model
{
    protected $table = 'admin_kemahasiswaan';
    protected $primaryKey = 'nip_admin';
    public $incrementing = false;
    protected $keyType = 'string';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username', 'username');
    }
}
