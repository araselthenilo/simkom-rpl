<?php

namespace App\Http\Controllers;

use App\Models\PengajuanProfilOrganisasi;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PembinaPengajuanProfilController extends Controller
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

        $submissions = PengajuanProfilOrganisasi::whereHas('pengurusOrganisasi.profilOrganisasi', function ($q) use ($managedOrgIds) {
            $q->whereIn('id_organisasi', $managedOrgIds);
        })
            ->with([
                'pengurusOrganisasi.profilOrganisasi.organisasi',
                'pengurusOrganisasi.anggotaOrganisasi.mahasiswa',
                'penggunaPetugas',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('pembina/pengajuan-profil', [
            'submissions' => $submissions,
        ]);
    }

    public function show(PengajuanProfilOrganisasi $submission): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $submission->load([
            'pengurusOrganisasi.profilOrganisasi.organisasi',
            'pengurusOrganisasi.anggotaOrganisasi.mahasiswa',
            'penggunaPetugas.profilPengguna',
        ]);

        $organisasiId = $submission->pengurusOrganisasi?->profilOrganisasi?->id_organisasi;
        abort_unless(in_array($organisasiId, $managedOrgIds), 403);

        $activeProfil = null;
        if ($organisasiId) {
            $activeProfil = ProfilOrganisasi::where('id_organisasi', $organisasiId)
                ->where('status_aktif', true)
                ->first();
        }

        return Inertia::render('pembina/pengajuan-profil-show', [
            'submission' => $submission,
            'activeProfil' => $activeProfil,
        ]);
    }

    public function accept(PengajuanProfilOrganisasi $submission): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $organisasiId = $submission->pengurusOrganisasi?->profilOrganisasi?->id_organisasi;
        abort_unless(in_array($organisasiId, $managedOrgIds), 403);

        if ($submission->status_pengajuan !== 'Diproses') {
            return back()->withErrors(['message' => 'Pengajuan ini sudah diproses.']);
        }

        DB::transaction(function () use ($submission) {
            $submission->update([
                'status_pengajuan' => 'Diterima',
                'username_petugas' => auth()->user()->username,
            ]);

            $profil = $submission->pengurusOrganisasi?->profilOrganisasi;
            if ($profil) {
                $profil->update([
                    'logo_organisasi' => $submission->logo_organisasi,
                    'deskripsi_organisasi' => $submission->deskripsi_organisasi,
                    'visi_organisasi' => $submission->visi_organisasi,
                    'misi_organisasi' => $submission->misi_organisasi,
                ]);
            }
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengajuan profil berhasil disetujui.',
        ]);

        return redirect()->route('pembina.pengajuan-profil.index');
    }

    public function reject(PengajuanProfilOrganisasi $submission): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $organisasiId = $submission->pengurusOrganisasi?->profilOrganisasi?->id_organisasi;
        abort_unless(in_array($organisasiId, $managedOrgIds), 403);

        if ($submission->status_pengajuan !== 'Diproses') {
            return back()->withErrors(['message' => 'Pengajuan ini sudah diproses.']);
        }

        $submission->update([
            'status_pengajuan' => 'Ditolak',
            'username_petugas' => auth()->user()->username,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengajuan profil berhasil ditolak.',
        ]);

        return redirect()->route('pembina.pengajuan-profil.index');
    }
}
