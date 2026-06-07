<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['username', 'name', 'email', 'password', 'role'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    protected $primaryKey = 'username';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $appends = ['name', 'is_active_organization_staff', 'active_organization_eras'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function profilPengguna(): MorphTo
    {
        return $this->morphTo('profilPengguna', 'role', 'username', 'username');
    }

    public function passkeys(): HasMany
    {
        return $this->hasMany(\Laravel\Passkeys\Passkeys::passkeyModel(), 'user_id', 'username');
    }

    public function isMahasiswa(): bool
    {
        return $this->role === 'Mahasiswa';
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

    public function name(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->profilPengguna?->nama_lengkap,
            set: function ($value) {
                if ($this->profilPengguna) {
                    $this->profilPengguna->nama_lengkap = $value;
                    $this->profilPengguna->save();
                }
                return [];
            }
        );
    }

    public function isActiveOrganizationStaff(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->role === 'Mahasiswa' &&
            ($this->profilPengguna?->anggotaOrganisasi()
                ->whereHas('pengurusOrganisasi', fn ($q) => $q->where('status_aktif', true)
                    ->whereHas('profilOrganisasi.organisasi', fn ($q2) => $q2->where('status_aktif', true))
                )
                ->exists() ?? false)
        );
    }

    public function activeOrganizationEras(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->role !== 'Mahasiswa' || ! $this->profilPengguna) {
                    return [];
                }

                $nim = $this->profilPengguna->nim;

                return PengurusOrganisasi::with(['profilOrganisasi.organisasi'])
                    ->where('status_aktif', true)
                    ->whereHas('profilOrganisasi.organisasi', function ($q) {
                        $q->where('status_aktif', true);
                    })
                    ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                        $q->where('nim', $nim);
                    })
                    ->get()
                    ->map(function ($pengurus) {
                        return [
                            'periode_kepengurusan' => $pengurus->profilOrganisasi?->periode_kepengurusan,
                            'nama_organisasi' => $pengurus->profilOrganisasi?->organisasi?->nama_organisasi,
                            'jabatan' => $pengurus->jabatan,
                        ];
                    })
                    ->toArray();
            }
        );
    }
}
