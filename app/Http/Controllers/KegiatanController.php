<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KegiatanController extends Controller
{
    public function index(ProfilOrganisasi $profil): Response
    {
        $isPrivileged = Gate::check('is-petugas') || Gate::check('is-pengurus-organisasi');

        $kegiatan = Kegiatan::where('id_profil', $profil->id_profil)
            ->when(! $isPrivileged, fn ($q) => $q->where('status_kegiatan', '!=', 'Dibatalkan'))
            ->orderByDesc('tanggal_pelaksanaan')
            ->paginate(10);

        return Inertia::render('Kegiatan/Index', [
            'profil' => $profil->only('id_profil', 'nama_organisasi'),
            'kegiatan' => $kegiatan->through(
                fn ($k) => $isPrivileged
                    ? $k
                    : $k->only(
                        'id_kegiatan',
                        'nama_kegiatan',
                        'jenis_kegiatan',
                        'tanggal_pelaksanaan',
                        'lokasi_kegiatan',
                        'biaya_pendaftaran',
                        'kuota_peserta',
                        'status_kegiatan'
                    )
            ),
            'isPrivileged' => $isPrivileged,
        ]);
    }

    public function show(Kegiatan $kegiatan): Response
    {
        $isPrivileged = Gate::check('is-petugas') || Gate::check('is-pengurus-organisasi');

        return Inertia::render('Kegiatan/Show', [
            'kegiatan' => $isPrivileged
                ? $kegiatan
                : $kegiatan->only(
                    'id_kegiatan',
                    'nama_kegiatan',
                    'jenis_kegiatan',
                    'deskripsi_kegiatan',
                    'tanggal_pelaksanaan',
                    'lokasi_kegiatan',
                    'biaya_pendaftaran',
                    'kuota_peserta',
                    'status_kegiatan'
                ),
        ]);
    }

    public function create(ProfilOrganisasi $profil): Response
    {
        Gate::authorize('is-pengurus-organisasi');

        return Inertia::render('Kegiatan/Create', [
            'profil' => $profil,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('is-pengurus-organisasi');

        $validated = $request->validate([
            'id_profil' => ['required', 'integer', 'exists:profil_organisasi,id_profil'],
            'nama_kegiatan' => ['required', 'string', 'max:200'],
            'jenis_kegiatan' => ['required', 'in:Seminar,Pelatihan,Lomba,Pengabdian Masyarakat'],
            'deskripsi_kegiatan' => ['required', 'string'],
            'biaya_pendaftaran' => ['required', 'numeric', 'min:0'],
            'tanggal_pelaksanaan' => ['required', 'date'],
            'lokasi_kegiatan' => ['required', 'string', 'max:200'],
            'kuota_peserta' => ['required', 'integer', 'min:1'],
        ]);

        Kegiatan::create($validated);

        return redirect()
            ->route('profil.kegiatan.index', $validated['id_profil'])
            ->with('success', 'Kegiatan berhasil ditambahkan.');
    }

    public function adminResponding(Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-petugas');

        $validated = request()->validate([
            'status_kegiatan' => ['required', 'in:Mendatang,Sedang berlangsung,Selesai,Dibatalkan'],
            'alasan_pembatalan' => [
                'nullable',
                'required_if:status_kegiatan,Dibatalkan',
                'string',
                'max:500',
            ],
        ]);

        $kegiatan->update(array_merge($validated, [
            'username_petugas' => Auth::user()->username,
        ]));

        return redirect()->back()
            ->with('success', 'Status kegiatan berhasil diperbarui.');
    }

    public function update(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-pengurus-organisasi');

        $validated = $request->validate([
            'nama_kegiatan' => ['required', 'string', 'max:200'],
            'jenis_kegiatan' => ['required', 'in:Seminar,Pelatihan,Lomba,Pengabdian Masyarakat'],
            'deskripsi_kegiatan' => ['required', 'string'],
            'biaya_pendaftaran' => ['required', 'numeric', 'min:0'],
            'tanggal_pelaksanaan' => ['required', 'date'],
            'lokasi_kegiatan' => ['required', 'string', 'max:200'],
            'kuota_peserta' => ['required', 'integer', 'min:1'],
        ]);

        $kegiatan->update($validated);

        return redirect()
            ->route('kegiatan.show', $kegiatan->id_kegiatan)
            ->with('success', 'Kegiatan berhasil diperbarui.');
    }

    public function destroy(int $id_kegiatan): RedirectResponse
    {
        Gate::authorize('is-pengurus-organisasi');

        $kegiatan = Kegiatan::findOrFail($id_kegiatan);
        $id_profil = $kegiatan->id_profil;

        $kegiatan->delete();

        return redirect()
            ->route('profil.kegiatan.index', $id_profil)
            ->with('success', 'Kegiatan berhasil dihapus.');
    }
}
