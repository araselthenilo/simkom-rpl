<?php

namespace App\Providers;

use App\Models\Kegiatan;
use App\Models\PengurusOrganisasi;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->configureDefaults();

        Gate::define('is-mahasiswa', function ($user) {
            return $user->role === 'Mahasiswa';
        });

        Gate::define('is-pembina', function ($user) {
            return $user->role === 'Pembina Organisasi';
        });

        Gate::define('is-admin', function ($user) {
            return $user->role === 'Admin Kemahasiswaan';
        });

        Gate::define('is-petugas', function ($user) {
            return in_array($user->role, ['Admin Kemahasiswaan', 'Pembina Organisasi']);
        });

        Gate::define('is-pengurus', function ($user) {
            return PengurusOrganisasi::whereHas('anggotaOrganisasi.mahasiswa', function ($query) use ($user) {
                $query->where('username', $user->username);
            })
                ->whereHas('anggotaOrganisasi.organisasi')
                ->exists();
        });

        Gate::define('is-pengurus-kegiatan', function ($user, Kegiatan $kegiatan) {
            return PengurusOrganisasi::whereHas('anggotaOrganisasi.mahasiswa', function ($query) use ($user) {
                $query->where('username', $user->username);
            })
                ->whereHas('profilOrganisasi', function ($query) use ($kegiatan) {
                    $query->where('id_profil', $kegiatan->id_profil)
                        ->whereHas('organisasi');
                })
                ->exists();
        });
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(
            fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
