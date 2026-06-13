<?php

namespace App\Http\Controllers;

use App\Models\PengajuanProfilOrganisasi;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AdminPengajuanProfilController extends Controller
{
    /**
     * Display a listing of organization profile submissions.
     */
    public function index(): Response
    {
        Gate::authorize('is-admin');

        $submissions = PengajuanProfilOrganisasi::with([
            'pengurusOrganisasi.profilOrganisasi.organisasi',
            'pengurusOrganisasi.anggotaOrganisasi.mahasiswa',
            'penggunaPetugas'
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('admin/pengajuan-profil', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Display the specified profile submission comparison.
     */
    public function show(PengajuanProfilOrganisasi $submission): Response
    {
        Gate::authorize('is-admin');

        $submission->load([
            'pengurusOrganisasi.profilOrganisasi.organisasi',
            'pengurusOrganisasi.anggotaOrganisasi.mahasiswa',
            'penggunaPetugas.profilPengguna',
        ]);

        $organisasiId = $submission->pengurusOrganisasi?->profilOrganisasi?->id_organisasi;

        $activeProfil = null;
        if ($organisasiId) {
            $activeProfil = ProfilOrganisasi::where('id_organisasi', $organisasiId)
                ->where('status_aktif', true)
                ->first();
        }

        return Inertia::render('admin/pengajuan-profil-show', [
            'submission' => $submission,
            'activeProfil' => $activeProfil,
        ]);
    }

    /**
     * Accept the profile submission.
     */
    public function accept(PengajuanProfilOrganisasi $submission): RedirectResponse
    {
        Gate::authorize('is-admin');

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

        return redirect()->route('admin.pengajuan-profil.index');
    }

    /**
     * Reject the profile submission.
     */
    public function reject(PengajuanProfilOrganisasi $submission): RedirectResponse
    {
        Gate::authorize('is-admin');

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

        return redirect()->route('admin.pengajuan-profil.index');
    }
}
