<?php

namespace App\Http\Controllers;

use App\Models\Organisasi;
use App\Models\ProfilOrganisasi;
use App\Models\PengurusOrganisasi;
use App\Models\PengajuanProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PengurusProfilOrganisasiController extends Controller
{
    private function getActivePengurusRecord()
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'Mahasiswa' || !$user->profilPengguna) {
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

        if (!isset($pengurusRecord) || !$pengurusRecord) {
            $pengurusRecord = $pengurusRecordQuery->first();
            if ($pengurusRecord && $pengurusRecord->profilOrganisasi) {
                session(['active_organization_id' => $pengurusRecord->profilOrganisasi->id_organisasi]);
            }
        }

        if (!$pengurusRecord || !$pengurusRecord->profilOrganisasi) {
            abort(403, 'Anda bukan pengurus organisasi yang aktif.');
        }

        return $pengurusRecord;
    }

    public function show(): Response
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $organisasi = $pengurusRecord->profilOrganisasi->organisasi;

        // Fetch the active profile for this organization
        $profil = ProfilOrganisasi::where('id_organisasi', $organisasi->id_organisasi)
            ->where('status_aktif', true)
            ->first();

        if (!$profil) {
            abort(404, 'Profil organisasi tidak ditemukan.');
        }

        // Fetch the latest proposal if any
        $latestProposal = PengajuanProfilOrganisasi::where('id_pengurus', $pengurusRecord->id_pengurus)
            ->latest('id_pengajuan')
            ->first();

        return Inertia::render('pengurus/profil/show', [
            'profil' => $profil,
            'organisasi' => $organisasi,
            'latestProposal' => $latestProposal,
        ]);
    }

    public function edit(): Response
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $organisasi = $pengurusRecord->profilOrganisasi->organisasi;

        $profil = ProfilOrganisasi::where('id_organisasi', $organisasi->id_organisasi)
            ->where('status_aktif', true)
            ->first();

        if (!$profil) {
            abort(404, 'Profil organisasi tidak ditemukan.');
        }

        return Inertia::render('pengurus/profil/edit', [
            'profil' => $profil,
            'organisasi' => $organisasi,
        ]);
    }

    public function propose(Request $request): RedirectResponse
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $organisasi = $pengurusRecord->profilOrganisasi->organisasi;

        $profil = ProfilOrganisasi::where('id_organisasi', $organisasi->id_organisasi)
            ->where('status_aktif', true)
            ->first();

        if (!$profil) {
            abort(404, 'Profil organisasi tidak ditemukan.');
        }

        $validated = $request->validate([
            'deskripsi_organisasi' => ['required', 'string'],
            'visi_organisasi' => ['required', 'string'],
            'misi_organisasi' => ['required', 'string'],
            'logo_organisasi' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('logo_organisasi')) {
            $logoPath = $request->file('logo_organisasi')
                ->store('logo_organisasi', 'public');
        } else {
            $logoPath = $profil->logo_organisasi;
        }

        PengajuanProfilOrganisasi::create([
            'id_pengurus' => $pengurusRecord->id_pengurus,
            'periode_kepengurusan' => $profil->periode_kepengurusan,
            'logo_organisasi' => $logoPath,
            'deskripsi_organisasi' => $validated['deskripsi_organisasi'],
            'visi_organisasi' => $validated['visi_organisasi'],
            'misi_organisasi' => $validated['misi_organisasi'],
            'status_pengajuan' => 'Diproses',
        ]);

        return redirect()
            ->route('pengurus.profil')
            ->with('success', 'Pengajuan perubahan profil berhasil diajukan.');
    }
}
