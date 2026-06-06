<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Organisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AnggotaOrganisasiController extends Controller
{
    public function index(Organisasi $organisasi): Response
    {
        if (! Gate::check('is-petugas') && ! Gate::check('is-pengurus-organisasi')) {
            abort(403);
        }

        $anggota = AnggotaOrganisasi::with('mahasiswa:nim,nama')
            ->where('id_organisasi', $organisasi->id_organisasi)
            ->orderBy('tanggal_bergabung', 'desc')
            ->get();

        return Inertia::render('AnggotaOrganisasi/Index', [
            'organisasi' => $organisasi->only('id_organisasi', 'nama_organisasi'),
            'anggota' => $anggota,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_organisasi' => ['required', 'integer', 'exists:organisasi,id_organisasi'],
            'nim' => ['required', 'string', 'size:9', 'exists:mahasiswa,nim'],
        ]);

        $sudahTerdaftar = AnggotaOrganisasi::where('id_organisasi', $validated['id_organisasi'])
            ->where('nim', $validated['nim'])
            ->exists();

        if ($sudahTerdaftar) {
            return back()->withErrors([
                'nim' => 'Mahasiswa sudah terdaftar di organisasi ini.',
            ]);
        }

        AnggotaOrganisasi::create([
            'id_organisasi' => $validated['id_organisasi'],
            'nim' => $validated['nim'],
            // Diisi sementara; akan ditimpa saat disetujui (status --> Aktif)
            'tanggal_bergabung' => now()->toDateString(),
            'status_keanggotaan' => 'Diproses',
        ]);

        return back()->with('success', 'Pendaftaran anggota berhasil diajukan.');
    }

    /**
     * Perbarui status keanggotaan (dan alasan penolakan jika perlu).
     * Dapat dilakukan oleh petugas atau pengurus organisasi.
     */
    public function update(Request $request, AnggotaOrganisasi $anggotaOrganisasi): RedirectResponse
    {
        if (! Gate::check('is-petugas') && ! Gate::check('is-pengurus-organisasi')) {
            abort(403);
        }

        $validated = $request->validate([
            'status_keanggotaan' => [
                'required',
                Rule::in(['Diproses', 'Ditolak', 'Aktif', 'Tidak Aktif']),
            ],
            'alasan_penolakan' => [
                'nullable',
                'string',
                'max:500',
                Rule::requiredIf($request->input('status_keanggotaan') === 'Ditolak'),
            ],
        ]);

        $anggotaOrganisasi->update([
            'status_keanggotaan' => $validated['status_keanggotaan'],
            // Stamp tanggal resmi bergabung saat disetujui
            'tanggal_bergabung' => $validated['status_keanggotaan'] === 'Aktif'
                ? now()->toDateString()
                : $anggotaOrganisasi->tanggal_bergabung,
            // Kosongkan alasan jika status bukan 'Ditolak'
            'alasan_penolakan' => $validated['status_keanggotaan'] === 'Ditolak'
                ? $validated['alasan_penolakan']
                : null,
        ]);

        return back()->with('success', 'Status keanggotaan berhasil diperbarui.');
    }

    /**
     * Hapus data keanggotaan.
     * Hanya dapat dilakukan oleh petugas.
     */
    public function destroy(AnggotaOrganisasi $anggotaOrganisasi): RedirectResponse
    {
        Gate::authorize('is-petugas');

        $anggotaOrganisasi->delete();

        return back()->with('success', 'Data anggota berhasil dihapus.');
    }
}
