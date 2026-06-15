<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Organisasi;
use App\Models\PengurusOrganisasi;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PembinaPengurusOrganisasiController extends Controller
{
    private function getManagedOrgIds(): array
    {
        $pembina = auth()->user()->profilPengguna;

        return $pembina ? $pembina->pembinaan()->pluck('id_organisasi')->toArray() : [];
    }

    public function adminIndex(): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $organisasiList = Organisasi::where('status_aktif', true)
            ->whereIn('id_organisasi', $managedOrgIds)
            ->with(['profilOrganisasi' => function ($q) {
                $q->orderBy('periode_kepengurusan', 'desc');
            }])
            ->get();

        $anggotaList = AnggotaOrganisasi::where('status_keanggotaan', 'Aktif')
            ->whereIn('id_organisasi', $managedOrgIds)
            ->with('mahasiswa')
            ->get();

        $pengurusList = PengurusOrganisasi::whereHas('profilOrganisasi', function ($q) use ($managedOrgIds) {
            $q->whereIn('id_organisasi', $managedOrgIds);
        })
            ->with([
                'anggotaOrganisasi.mahasiswa',
                'profilOrganisasi.organisasi',
            ])
            ->orderBy('id_pengurus', 'desc')
            ->get();

        return Inertia::render('pembina/pengurus/index', [
            'organisasiList' => $organisasiList,
            'anggotaList' => $anggotaList,
            'pengurusList' => $pengurusList,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $validated = $request->validate([
            'id_profil' => 'required|exists:profil_organisasi,id_profil',
            'id_keanggotaan' => 'required|exists:anggota_organisasi,id_keanggotaan',
            'jabatan' => 'required|string|max:50',
            'status_aktif' => 'required|boolean',
        ]);

        $profil = ProfilOrganisasi::findOrFail($validated['id_profil']);
        $anggota = AnggotaOrganisasi::findOrFail($validated['id_keanggotaan']);

        abort_unless(in_array($profil->id_organisasi, $managedOrgIds), 403);
        abort_unless(in_array($anggota->id_organisasi, $managedOrgIds), 403);

        $exists = PengurusOrganisasi::where('id_profil', $validated['id_profil'])
            ->where('id_keanggotaan', $validated['id_keanggotaan'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'id_keanggotaan' => 'Anggota ini sudah terdaftar sebagai pengurus pada periode terpilih.',
            ]);
        }

        if ($profil->id_organisasi !== $anggota->id_organisasi) {
            return back()->withErrors([
                'id_keanggotaan' => 'Anggota tidak sesuai dengan organisasi terpilih.',
            ]);
        }

        PengurusOrganisasi::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengurus baru berhasil ditambahkan.',
        ]);

        return back();
    }

    public function toggleStatus(PengurusOrganisasi $pengurus): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        $idOrganisasi = $pengurus->profilOrganisasi?->id_organisasi;
        abort_unless(in_array($idOrganisasi, $managedOrgIds), 403);

        $pengurus->update([
            'status_aktif' => ! $pengurus->status_aktif,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Status keaktifan pengurus berhasil diperbarui.',
        ]);

        return back();
    }

    public function destroy(PengurusOrganisasi $pengurus): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        $idOrganisasi = $pengurus->profilOrganisasi?->id_organisasi;
        abort_unless(in_array($idOrganisasi, $managedOrgIds), 403);

        $pengurus->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengurus berhasil dihapus.',
        ]);

        return back();
    }
}
