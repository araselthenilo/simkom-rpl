<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['username', 'id_organisasi', 'kategori', 'deskripsi', 'ip_address', 'user_agent'])]
class LogAktivitas extends Model
{
    protected $table = 'log_aktivitas';

    protected $primaryKey = 'id_log';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'username', 'username');
    }

    public function organisasi(): BelongsTo
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi', 'id_organisasi');
    }
}
