<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Organisasi;
use App\Models\PembinaOrganisasi;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PembinaOrganisasiController extends Controller
{
    private function getManagedOrgIds(): array
    {
        $pembina = auth()->user()->profilPengguna;
        return $pembina ? $pembina->pembinaan()->pluck('id_organisasi')->toArray() : [];
    }

    public function index(): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $organisasi = Organisasi::whereIn('id_organisasi', $managedOrgIds)
            ->with(['profilOrganisasi' => function ($query) {
                $query->orderBy('periode_kepengurusan', 'desc');
            }])
            ->withCount('anggotaOrganisasi')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pembina/manajemen-organisasi', [
            'organisasi' => $organisasi,
        ]);
    }

    public function profilHistory(Organisasi $organisasi): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        abort_unless(in_array($organisasi->id_organisasi, $managedOrgIds), 403);

        $organisasi->load(['profilOrganisasi' => function ($query) {
            $query->orderBy('periode_kepengurusan', 'desc');
        }]);

        $pembinaans = $organisasi->pembinaan()->with('pembinaOrganisasi')->get();

        $profils = $organisasi->profilOrganisasi->map(function ($profil) use ($pembinaans) {
            $profil->pembina = $pembinaans->filter(function ($pembinaan) use ($profil) {
                return $pembinaan->periode_pembinaan === $profil->periode_kepengurusan;
            })->map(function ($pembinaan) {
                $p = $pembinaan->pembinaOrganisasi;
                if ($p) {
                    $p->id_pembinaan = $pembinaan->id_pembinaan;
                }
                return $p;
            })->filter()->values();

            return $profil;
        });

        $allPembina = PembinaOrganisasi::orderBy('nama_lengkap', 'asc')->get();

        return Inertia::render('pembina/riwayat-profil', [
            'organisasi' => [
                'id_organisasi' => $organisasi->id_organisasi,
                'nama_organisasi' => $organisasi->nama_organisasi,
                'status_aktif' => $organisasi->status_aktif,
            ],
            'profils' => $profils,
            'allPembina' => $allPembina,
        ]);
    }

    public function createProfil(Organisasi $organisasi): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        abort_unless(in_array($organisasi->id_organisasi, $managedOrgIds), 403);

        return Inertia::render('pembina/tambah-profil-organisasi', [
            'organisasi' => [
                'id_organisasi' => $organisasi->id_organisasi,
                'nama_organisasi' => $organisasi->nama_organisasi,
            ],
        ]);
    }

    public function storeProfil(Request $request, Organisasi $organisasi): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        abort_unless(in_array($organisasi->id_organisasi, $managedOrgIds), 403);

        $validated = $request->validate([
            'periode_kepengurusan' => [
                'required',
                'string',
                'size:9',
                'regex:/^\d{4}\/\d{4}$/',
                Rule::unique('profil_organisasi')
                    ->where(fn ($query) => $query->where('id_organisasi', $organisasi->id_organisasi)),
            ],
            'logo_organisasi' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'deskripsi_organisasi' => ['required', 'string'],
            'visi_organisasi' => ['required', 'string'],
            'misi_organisasi' => ['required', 'string'],
            'status_aktif' => ['required', 'boolean'],
        ]);

        $logoPath = $request->file('logo_organisasi')
            ->store('logo_organisasi', 'public');

        ProfilOrganisasi::create([
            'id_organisasi' => $organisasi->id_organisasi,
            'periode_kepengurusan' => $validated['periode_kepengurusan'],
            'logo_organisasi' => $logoPath,
            'deskripsi_organisasi' => $validated['deskripsi_organisasi'],
            'visi_organisasi' => $validated['visi_organisasi'],
            'misi_organisasi' => $validated['misi_organisasi'],
            'status_aktif' => $validated['status_aktif'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Profil organisasi baru berhasil ditambahkan.',
        ]);

        return to_route('pembina.organisasi.profil', ['organisasi' => $organisasi->id_organisasi]);
    }

    public function editProfil(ProfilOrganisasi $profilOrganisasi): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        abort_unless(in_array($profilOrganisasi->id_organisasi, $managedOrgIds), 403);

        $profilOrganisasi->load('organisasi');

        return Inertia::render('pembina/edit-profil-organisasi', [
            'profilOrganisasi' => $profilOrganisasi,
        ]);
    }

    public function updateProfil(Request $request, ProfilOrganisasi $profilOrganisasi): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        abort_unless(in_array($profilOrganisasi->id_organisasi, $managedOrgIds), 403);

        $validated = $request->validate([
            'periode_kepengurusan' => [
                'required',
                'string',
                'size:9',
                'regex:/^\d{4}\/\d{4}$/',
                Rule::unique('profil_organisasi')
                    ->where(fn ($query) => $query->where('id_organisasi', $profilOrganisasi->id_organisasi))
                    ->ignore($profilOrganisasi->id_profil, 'id_profil'),
            ],
            'logo_organisasi' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'deskripsi_organisasi' => ['required', 'string'],
            'visi_organisasi' => ['required', 'string'],
            'misi_organisasi' => ['required', 'string'],
            'status_aktif' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('logo_organisasi')) {
            if ($profilOrganisasi->logo_organisasi) {
                Storage::disk('public')->delete($profilOrganisasi->logo_organisasi);
            }

            $validated['logo_organisasi'] = $request->file('logo_organisasi')
                ->store('logo_organisasi', 'public');
        } else {
            unset($validated['logo_organisasi']);
        }

        $profilOrganisasi->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Profil organisasi berhasil diperbarui.',
        ]);

        return to_route('pembina.organisasi.profil', ['organisasi' => $profilOrganisasi->id_organisasi]);
    }

    public function showPengurus(ProfilOrganisasi $profilOrganisasi): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        abort_unless(in_array($profilOrganisasi->id_organisasi, $managedOrgIds), 403);

        $profilOrganisasi->load([
            'organisasi',
            'pengurusOrganisasi.anggotaOrganisasi.mahasiswa',
        ]);

        $anggotaList = AnggotaOrganisasi::where('id_organisasi', $profilOrganisasi->id_organisasi)
            ->where('status_keanggotaan', 'Aktif')
            ->with('mahasiswa')
            ->get();

        return Inertia::render('pembina/pengurus-periode', [
            'profilOrganisasi' => $profilOrganisasi,
            'anggotaList' => $anggotaList,
        ]);
    }
}
