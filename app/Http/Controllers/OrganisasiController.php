<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Organisasi;
use App\Models\Pembinaan;
use App\Models\PembinaOrganisasi;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrganisasiController extends Controller
{
    /**
     * Show the form for creating a new organization.
     */
    public function create(): Response
    {
        Gate::authorize('is-admin');

        return Inertia::render('admin/tambah-organisasi');
    }

    /**
     * Store a newly created organization and its initial profile.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('is-admin');

        $validated = $request->validate([
            'nama_organisasi' => ['required', 'string', 'max:100', 'unique:organisasi,nama_organisasi'],
            'status_aktif' => ['required', 'boolean'],
            'periode_kepengurusan' => [
                'required',
                'string',
                'size:9',
                'regex:/^\d{4}\/\d{4}$/',
            ],
            'logo_organisasi' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'deskripsi_organisasi' => ['required', 'string'],
            'visi_organisasi' => ['required', 'string'],
            'misi_organisasi' => ['required', 'string'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            // 1. Create Organisasi
            $organisasi = Organisasi::create([
                'nama_organisasi' => $validated['nama_organisasi'],
                'status_aktif' => $validated['status_aktif'],
            ]);

            // 2. Upload Logo
            $logoPath = $request->file('logo_organisasi')
                ->store('logo_organisasi', 'public');

            // 3. Create ProfilOrganisasi
            ProfilOrganisasi::create([
                'id_organisasi' => $organisasi->id_organisasi,
                'periode_kepengurusan' => $validated['periode_kepengurusan'],
                'logo_organisasi' => $logoPath,
                'deskripsi_organisasi' => $validated['deskripsi_organisasi'],
                'visi_organisasi' => $validated['visi_organisasi'],
                'misi_organisasi' => $validated['misi_organisasi'],
                'status_aktif' => $validated['status_aktif'],
            ]);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Organisasi dan profil baru berhasil ditambahkan.',
        ]);

        return to_route('admin.organisasi');
    }

    /**
     * Display a listing of registered organizations.
     */
    public function index(): Response
    {
        Gate::authorize('is-admin');

        $organisasi = Organisasi::with(['profilOrganisasi' => function ($query) {
            $query->orderBy('periode_kepengurusan', 'desc');
        }])
            ->withCount('anggotaOrganisasi')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/manajemen-organisasi', [
            'organisasi' => $organisasi,
        ]);
    }

    /**
     * Toggle the active status of an organization.
     */
    public function toggleStatus(Organisasi $organisasi): RedirectResponse
    {
        Gate::authorize('is-admin');

        $organisasi->update([
            'status_aktif' => ! $organisasi->status_aktif,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Status aktif organisasi berhasil diperbarui.',
        ]);

        return to_route('admin.organisasi');
    }

    /**
     * Soft delete an organization.
     */
    public function destroy(Organisasi $organisasi): RedirectResponse
    {
        Gate::authorize('is-admin');

        $organisasi->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Organisasi berhasil dinonaktifkan/dihapus.',
        ]);

        return to_route('admin.organisasi');
    }

    /**
     * Display historical profiles of an organization and their pembinas across time.
     */
    public function profilHistory(Organisasi $organisasi): Response
    {
        Gate::authorize('is-admin');

        $organisasi->load(['profilOrganisasi' => function ($query) {
            $query->orderBy('periode_kepengurusan', 'desc');
        }]);

        // Get all pembinaans for this organization with their pembinaOrganisasi
        $pembinaans = $organisasi->pembinaan()->with('pembinaOrganisasi')->get();

        // Map pembina into the respective profil_organisasi based on period
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

        return Inertia::render('admin/riwayat-profil', [
            'organisasi' => [
                'id_organisasi' => $organisasi->id_organisasi,
                'nama_organisasi' => $organisasi->nama_organisasi,
                'status_aktif' => $organisasi->status_aktif,
            ],
            'profils' => $profils,
            'allPembina' => $allPembina,
        ]);
    }

    /**
     * Show the form for creating a new organization profile.
     */
    public function createProfil(Organisasi $organisasi): Response
    {
        Gate::authorize('is-admin');

        return Inertia::render('admin/tambah-profil-organisasi', [
            'organisasi' => [
                'id_organisasi' => $organisasi->id_organisasi,
                'nama_organisasi' => $organisasi->nama_organisasi,
            ],
        ]);
    }

    /**
     * Store a newly created organization profile.
     */
    public function storeProfil(Request $request, Organisasi $organisasi): RedirectResponse
    {
        Gate::authorize('is-admin');

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

        return to_route('admin.organisasi.profil', ['organisasi' => $organisasi->id_organisasi]);
    }

    /**
     * Show the form for editing an organization profile.
     */
    public function editProfil(ProfilOrganisasi $profilOrganisasi): Response
    {
        Gate::authorize('is-admin');

        $profilOrganisasi->load('organisasi');

        return Inertia::render('admin/edit-profil-organisasi', [
            'profilOrganisasi' => $profilOrganisasi,
        ]);
    }

    /**
     * Update an organization profile.
     */
    public function updateProfil(Request $request, ProfilOrganisasi $profilOrganisasi): RedirectResponse
    {
        Gate::authorize('is-admin');

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

        return to_route('admin.organisasi.profil', ['organisasi' => $profilOrganisasi->id_organisasi]);
    }

    /**
     * Store a new pembinaan association.
     */
    public function storePembinaan(Request $request, Organisasi $organisasi): RedirectResponse
    {
        Gate::authorize('is-admin');

        $validated = $request->validate([
            'nip_pembina' => ['required', 'string', 'exists:pembina_organisasi,nip_pembina'],
            'periode_pembinaan' => ['required', 'string', 'size:9', 'regex:/^\d{4}\/\d{4}$/'],
        ]);

        // Check unique constraint
        $exists = Pembinaan::where([
            'id_organisasi' => $organisasi->id_organisasi,
            'nip_pembina' => $validated['nip_pembina'],
            'periode_pembinaan' => $validated['periode_pembinaan'],
        ])->exists();

        if ($exists) {
            return back()->withErrors([
                'nip_pembina' => 'Pembina ini sudah ditugaskan pada periode kepengurusan tersebut.',
            ]);
        }

        $pembinaan = new Pembinaan;
        $pembinaan->id_organisasi = $organisasi->id_organisasi;
        $pembinaan->nip_pembina = $validated['nip_pembina'];
        $pembinaan->periode_pembinaan = $validated['periode_pembinaan'];
        $pembinaan->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pembina organisasi berhasil ditambahkan.',
        ]);

        return back();
    }

    /**
     * Remove a pembinaan association.
     */
    public function destroyPembinaan(Pembinaan $pembinaan): RedirectResponse
    {
        Gate::authorize('is-admin');

        $pembinaan->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pembina organisasi berhasil dihapus.',
        ]);

        return back();
    }

    /**
     * Display the officers (Pengurus Organisasi) for a specific profile period.
     */
    public function showPengurus(ProfilOrganisasi $profilOrganisasi): Response
    {
        Gate::authorize('is-admin');

        $profilOrganisasi->load([
            'organisasi',
            'pengurusOrganisasi.anggotaOrganisasi.mahasiswa',
        ]);

        $anggotaList = AnggotaOrganisasi::where('id_organisasi', $profilOrganisasi->id_organisasi)
            ->where('status_keanggotaan', 'Aktif')
            ->with('mahasiswa')
            ->get();

        return Inertia::render('admin/pengurus-periode', [
            'profilOrganisasi' => $profilOrganisasi,
            'anggotaList' => $anggotaList,
        ]);
    }
}
