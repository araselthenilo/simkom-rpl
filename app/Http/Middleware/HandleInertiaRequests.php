<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $staffOrganizations = [];
        $activeOrganization = null;

        if ($user && $user->role === 'Mahasiswa' && $user->profilPengguna) {
            $nim = $user->profilPengguna->nim;

            // Retrieve active PengurusOrganisasi records
            $pengurusRecords = \App\Models\PengurusOrganisasi::where('status_aktif', true)
                ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                    $q->where('nim', $nim);
                })
                ->whereHas('profilOrganisasi.organisasi', function ($q) {
                    $q->where('status_aktif', true);
                })
                ->with(['profilOrganisasi.organisasi'])
                ->get();

            foreach ($pengurusRecords as $record) {
                $org = $record->profilOrganisasi?->organisasi;
                if ($org) {
                    $staffOrganizations[] = [
                        'id_organisasi' => $org->id_organisasi,
                        'nama_organisasi' => $org->nama_organisasi,
                        'logo_organisasi' => $record->profilOrganisasi->logo_organisasi,
                        'jabatan' => $record->jabatan,
                    ];
                }
            }

            if (!empty($staffOrganizations)) {
                $activeOrgId = $request->session()->get('active_organization_id');
                if ($activeOrgId) {
                    foreach ($staffOrganizations as $orgInfo) {
                        if ($orgInfo['id_organisasi'] == $activeOrgId) {
                            $activeOrganization = $orgInfo;
                            break;
                        }
                    }
                }

                if (!$activeOrganization) {
                    $activeOrganization = $staffOrganizations[0];
                    $request->session()->put('active_organization_id', $activeOrganization['id_organisasi']);
                }
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user()
                    ?->load('profilPengguna'),
            ],
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'active_organization' => $activeOrganization,
            'staff_organizations' => $staffOrganizations,
        ];
    }
}
