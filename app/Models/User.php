<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['username', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $primaryKey = 'username';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $appends = ['name'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function pribadiPengguna(): HasOne
    {
        return match ($this->role) {
            'Mahasiswa' => $this->hasOne(Mahasiswa::class, 'username', 'username'),
            'Pembina Organisasi' => $this->hasOne(PembinaOrganisasi::class, 'username', 'username'),
            'Admin Kemahasiswaan' => $this->hasOne(AdminKemahasiswaan::class, 'username', 'username'),
            default => null,
        };
    }

    public function kegiatan(): HasMany
    {
        return $this->hasMany(Kegiatan::class, 'username_petugas', 'username');
    }

    public function catatanRevisi(): HasMany
    {
        return $this->hasMany(CatatanRevisi::class, 'username_petugas', 'username');
    }

    public function pengajuanProfilOrganisasi(): HasMany
    {
        return $this->hasMany(PengajuanProfilOrganisasi::class, 'username_petugas', 'username');
    }

    public function arsipLaporan(): HasMany
    {
        return $this->hasMany(ArsipLaporan::class, 'username_petugas', 'username');
    }

    public function getNameAttribute()
    {
        return $this->pribadiPengguna?->nama_lengkap;
    }
}
