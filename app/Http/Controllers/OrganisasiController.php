<?php

namespace App\Http\Controllers;

use App\Models\Organisasi;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
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
            'status_aktif' => !$organisasi->status_aktif,
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
}
