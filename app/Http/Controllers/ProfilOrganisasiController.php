<?php

namespace App\Http\Controllers;

use App\Models\Organisasi;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfilOrganisasiController extends Controller
{
    public function index(): Response
    {
        $profilOrganisasi = ProfilOrganisasi::with('organisasi')
            ->latest('id_profil')
            ->paginate(10);

        return Inertia::render('ProfilOrganisasi/Index', [
            'profilOrganisasi' => $profilOrganisasi,
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('is-petugas');

        $organisasi = Organisasi::where('status_aktif', true)->get();

        return Inertia::render('ProfilOrganisasi/Create', [
            'organisasi' => $organisasi,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('is-petugas');

        $validated = $request->validate([
            'id_organisasi' => ['required', 'integer', 'exists:organisasi,id_organisasi'],
            'periode_kepengurusan' => [
                'required',
                'string',
                'size:9',
                'regex:/^\d{4}\/\d{4}$/',
                Rule::unique('profil_organisasi')->where(
                    fn ($query) => $query->where('id_organisasi', $request->id_organisasi)
                ),
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
            'id_organisasi' => $validated['id_organisasi'],
            'periode_kepengurusan' => $validated['periode_kepengurusan'],
            'logo_organisasi' => $logoPath,
            'deskripsi_organisasi' => $validated['deskripsi_organisasi'],
            'visi_organisasi' => $validated['visi_organisasi'],
            'misi_organisasi' => $validated['misi_organisasi'],
            'status_aktif' => $validated['status_aktif'],
        ]);

        return redirect()
            ->route('profil-organisasi.index')
            ->with('success', 'Profil organisasi berhasil dibuat.');
    }

    public function show(ProfilOrganisasi $profilOrganisasi): Response
    {
        $profilOrganisasi->load([
            'organisasi',
            'pengurusOrganisasi',
            'kegiatan',
        ]);

        return Inertia::render('ProfilOrganisasi/Show', [
            'profilOrganisasi' => $profilOrganisasi,
        ]);
    }

    public function edit(ProfilOrganisasi $profilOrganisasi): Response
    {
        Gate::authorize('is-petugas');

        $organisasi = Organisasi::whereStatusAktif(true)->get();

        return Inertia::render('ProfilOrganisasi/Edit', [
            'profilOrganisasi' => $profilOrganisasi,
            'organisasi' => $organisasi,
        ]);
    }

    public function update(Request $request, ProfilOrganisasi $profilOrganisasi): RedirectResponse
    {
        Gate::authorize('is-petugas');

        $validated = $request->validate([
            'id_organisasi' => ['required', 'integer', 'exists:organisasi,id_organisasi'],
            'periode_kepengurusan' => [
                'required',
                'string',
                'size:9',
                'regex:/^\d{4}\/\d{4}$/',
                Rule::unique('profil_organisasi')
                    ->where(fn ($query) => $query->where('id_organisasi', $request->id_organisasi))
                    ->ignore($profilOrganisasi->id_profil, 'id_profil'),
            ],
            'logo_organisasi' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'deskripsi_organisasi' => ['required', 'string'],
            'visi_organisasi' => ['required', 'string'],
            'misi_organisasi' => ['required', 'string'],
            'status_aktif' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('logo_organisasi')) {
            Storage::disk('public')->delete($profilOrganisasi->logo_organisasi);

            $validated['logo_organisasi'] = $request->file('logo_organisasi')
                ->store('logo_organisasi', 'public');
        } else {
            unset($validated['logo_organisasi']);
        }

        $profilOrganisasi->update($validated);

        return redirect()
            ->route('profil-organisasi.show', $profilOrganisasi)
            ->with('success', 'Profil organisasi berhasil diperbarui.');
    }

    public function destroy(ProfilOrganisasi $profilOrganisasi): RedirectResponse
    {
        Gate::authorize('is-petugas');

        if (
            $profilOrganisasi->kegiatan()->exists() ||
            $profilOrganisasi->pengurusOrganisasi()->exists()
        ) {
            return redirect()
                ->route('profil-organisasi.show', $profilOrganisasi)
                ->with(
                    'error',
                    'Profil tidak dapat dihapus karena masih memiliki data kegiatan atau '.
                        'pengurus terkait. Nonaktifkan profil sebagai gantinya.'
                );
        }

        Storage::disk('public')->delete($profilOrganisasi->logo_organisasi);

        $profilOrganisasi->delete();

        return redirect()
            ->route('profil-organisasi.index')
            ->with('success', 'Profil organisasi berhasil dihapus.');
    }
}
