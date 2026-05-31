<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $primaryKey = 'username';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    protected $appends = ['name'];

    public function mahasiswa(): HasOne
    {
        return $this->hasOne(Mahasiswa::class, 'username', 'username');
    }

    public function pembinaOrganisasi(): HasOne
    {
        return $this->hasOne(PembinaOrganisasi::class, 'username', 'username');
    }

    public function adminKemahasiswaan(): HasOne
    {
        return $this->hasOne(AdminKemahasiswaan::class, 'username', 'username');
    }

    public function getNameAttribute()
    {
        return match ($this->role) {
            'Mahasiswa' => $this->mahasiswa?->nama_lengkap,
            'Pembina Organisasi' => $this->pembinaOrganisasi?->nama_lengkap,
            'Admin Kemahasiswaan' => $this->adminKemahasiswaan?->nama_lengkap,
            default => null,
        };
    }
}
