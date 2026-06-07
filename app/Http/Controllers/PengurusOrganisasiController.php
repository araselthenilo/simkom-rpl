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

class PengurusOrganisasiController extends Controller
{
    /**
     * Admin view to manage all Pengurus.
     */
    public function adminIndex(): Response
    {
        Gate::authorize('is-admin');

        $organisasiList = Organisasi::where('status_aktif', true)
            ->with(['profilOrganisasi' => function ($q) {
                $q->orderBy('periode_kepengurusan', 'desc');
            }])
            ->get();

        $anggotaList = AnggotaOrganisasi::where('status_keanggotaan', 'Aktif')
            ->with('mahasiswa')
            ->get();

        $pengurusList = PengurusOrganisasi::with([
            'anggotaOrganisasi.mahasiswa',
            'profilOrganisasi.organisasi',
        ])
            ->orderBy('id_pengurus', 'desc')
            ->get();

        return Inertia::render('admin/pengurus/index', [
            'organisasiList' => $organisasiList,
            'anggotaList' => $anggotaList,
            'pengurusList' => $pengurusList,
        ]);
    }

    /**
     * Admin store new Pengurus.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('is-admin');

        $validated = $request->validate([
            'id_profil' => 'required|exists:profil_organisasi,id_profil',
            'id_keanggotaan' => 'required|exists:anggota_organisasi,id_keanggotaan',
            'jabatan' => 'required|string|max:50',
            'status_aktif' => 'required|boolean',
        ]);

        // Check if this member is already a pengurus in this profile period
        $exists = PengurusOrganisasi::where('id_profil', $validated['id_profil'])
            ->where('id_keanggotaan', $validated['id_keanggotaan'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'id_keanggotaan' => 'Anggota ini sudah terdaftar sebagai pengurus pada periode terpilih.',
            ]);
        }

        // Verify if the member belongs to the correct organization
        $profil = ProfilOrganisasi::findOrFail($validated['id_profil']);
        $anggota = AnggotaOrganisasi::findOrFail($validated['id_keanggotaan']);

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

    /**
     * Admin toggle status.
     */
    public function toggleStatus(PengurusOrganisasi $pengurus): RedirectResponse
    {
        Gate::authorize('is-admin');

        $pengurus->update([
            'status_aktif' => ! $pengurus->status_aktif,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Status keaktifan pengurus berhasil diperbarui.',
        ]);

        return back();
    }

    /**
     * Admin delete.
     */
    public function destroy(PengurusOrganisasi $pengurus): RedirectResponse
    {
        Gate::authorize('is-admin');

        $pengurus->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengurus berhasil dihapus.',
        ]);

        return back();
    }

    /**
     * Helper to get active pengurus record for the logged-in student.
     */
    private function getActivePengurusRecord()
    {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403, 'Akses ditolak.');
        }

        $nim = $user->profilPengguna->nim;
        $activeOrgId = session('active_organization_id');

        $pengurusRecordQuery = PengurusOrganisasi::where('status_aktif', true)
            ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                $q->where('nim', $nim);
            })
            ->whereHas('profilOrganisasi.organisasi', function ($q) {
                $q->where('status_aktif', true);
            })
            ->with(['profilOrganisasi.organisasi']);

        if ($activeOrgId) {
            $pengurusRecord = (clone $pengurusRecordQuery)
                ->whereHas('profilOrganisasi', function ($q) use ($activeOrgId) {
                    $q->where('id_organisasi', $activeOrgId);
                })
                ->first();
        }

        if (! isset($pengurusRecord) || ! $pengurusRecord) {
            $pengurusRecord = $pengurusRecordQuery->first();
            if ($pengurusRecord && $pengurusRecord->profilOrganisasi) {
                session(['active_organization_id' => $pengurusRecord->profilOrganisasi->id_organisasi]);
            }
        }

        if (! $pengurusRecord || ! $pengurusRecord->profilOrganisasi) {
            abort(403, 'Anda bukan pengurus organisasi yang aktif.');
        }

        return $pengurusRecord;
    }

    /**
     * Pengurus view of their fellow staff members.
     */
    public function pengurusIndex(): Response
    {
        $currentPengurus = $this->getActivePengurusRecord();
        $idProfil = $currentPengurus->id_profil;
        $idOrganisasi = $currentPengurus->profilOrganisasi->id_organisasi;

        $organisasi = $currentPengurus->profilOrganisasi->organisasi;
        $profil = $currentPengurus->profilOrganisasi;

        // Fetch all pengurus for this specific profil (period)
        $pengurusList = PengurusOrganisasi::where('id_profil', $idProfil)
            ->with('anggotaOrganisasi.mahasiswa')
            ->get();

        // Fetch all active members of this organization to be added
        $anggotaList = AnggotaOrganisasi::where('id_organisasi', $idOrganisasi)
            ->where('status_keanggotaan', 'Aktif')
            ->with('mahasiswa')
            ->get();

        return Inertia::render('pengurus/staff/index', [
            'pengurusList' => $pengurusList,
            'anggotaList' => $anggotaList,
            'organisasi' => $organisasi,
            'profil' => $profil,
        ]);
    }

    /**
     * Pengurus store new Pengurus.
     */
    public function storePengurus(Request $request): RedirectResponse
    {
        $currentPengurus = $this->getActivePengurusRecord();
        $idProfil = $currentPengurus->id_profil;
        $idOrganisasi = $currentPengurus->profilOrganisasi->id_organisasi;

        $validated = $request->validate([
            'id_keanggotaan' => 'required|exists:anggota_organisasi,id_keanggotaan',
            'jabatan' => 'required|string|max:50',
            'status_aktif' => 'required|boolean',
        ]);

        // Check if this member is already a pengurus in this profile period
        $exists = PengurusOrganisasi::where('id_profil', $idProfil)
            ->where('id_keanggotaan', $validated['id_keanggotaan'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'id_keanggotaan' => 'Anggota ini sudah terdaftar sebagai pengurus pada periode saat ini.',
            ]);
        }

        // Verify if the member belongs to the correct organization
        $anggota = AnggotaOrganisasi::findOrFail($validated['id_keanggotaan']);

        if ($anggota->id_organisasi !== $idOrganisasi) {
            return back()->withErrors([
                'id_keanggotaan' => 'Anggota tidak sesuai dengan organisasi Anda.',
            ]);
        }

        PengurusOrganisasi::create([
            'id_profil' => $idProfil,
            'id_keanggotaan' => $validated['id_keanggotaan'],
            'jabatan' => $validated['jabatan'],
            'status_aktif' => $validated['status_aktif'],
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengurus baru berhasil ditambahkan.',
        ]);

        return back();
    }

    /**
     * Pengurus toggle status.
     */
    public function toggleStatusPengurus(PengurusOrganisasi $pengurus): RedirectResponse
    {
        $currentPengurus = $this->getActivePengurusRecord();

        // Ensure the pengurus being updated belongs to the same organization & profile
        if ($pengurus->id_profil !== $currentPengurus->id_profil) {
            abort(403, 'Akses ditolak.');
        }

        $pengurus->update([
            'status_aktif' => ! $pengurus->status_aktif,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Status keaktifan pengurus berhasil diperbarui.',
        ]);

        return back();
    }

    /**
     * Pengurus delete.
     */
    public function destroyPengurus(PengurusOrganisasi $pengurus): RedirectResponse
    {
        $currentPengurus = $this->getActivePengurusRecord();

        // Ensure the pengurus being updated belongs to the same organization & profile
        if ($pengurus->id_profil !== $currentPengurus->id_profil) {
            abort(403, 'Akses ditolak.');
        }

        $pengurus->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengurus berhasil dihapus.',
        ]);

        return back();
    }
}
