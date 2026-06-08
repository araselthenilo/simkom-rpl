<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Kegiatan;
use App\Models\Organisasi;
use App\Models\PengurusOrganisasi;
use App\Models\PesertaKegiatan;
use App\Models\ProfilOrganisasi;
use App\Models\TransaksiKeuangan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserOrganisasiController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // 1. Followed organizations (active membership/staff)
        $followedOrganizations = [];
        $anggotaList = AnggotaOrganisasi::where('nim', $nim)
            ->where('status_keanggotaan', 'Aktif')
            ->whereHas('organisasi', function ($q) {
                $q->where('status_aktif', true);
            })
            ->with([
                'organisasi.profilOrganisasi' => function ($q) {
                    $q->where('status_aktif', true);
                },
                'pengurusOrganisasi' => function ($q) {
                    $q->where('status_aktif', true);
                },
            ])
            ->get();

        foreach ($anggotaList as $anggota) {
            $org = $anggota->organisasi;
            $activeProfile = $org->profilOrganisasi->first();
            $activePengurus = $anggota->pengurusOrganisasi->first();

            if ($activePengurus) {
                $followedOrganizations[] = [
                    'id' => $org->id_organisasi,
                    'name' => $org->nama_organisasi,
                    'role' => $activePengurus->jabatan,
                    'type' => 'staff',
                    'icon' => '',
                    'bgIcon' => '',
                    'description' => $activeProfile?->deskripsi_organisasi ?? '',
                    'link' => '#',
                ];
            } else {
                $followedOrganizations[] = [
                    'id' => $org->id_organisasi,
                    'name' => $org->nama_organisasi,
                    'role' => 'Anggota Aktif',
                    'type' => 'member',
                    'icon' => '',
                    'statusText' => 'Anggota Aktif',
                    'link' => route('organisasi.detail', $org->id_organisasi),
                ];
            }
        }

        // 2. Applied organizations (pending application status 'Diproses')
        $appliedList = AnggotaOrganisasi::where('nim', $nim)
            ->where('status_keanggotaan', 'Diproses')
            ->whereHas('organisasi', function ($q) {
                $q->where('status_aktif', true);
            })
            ->with([
                'organisasi.profilOrganisasi' => function ($q) {
                    $q->where('status_aktif', true);
                },
            ])
            ->get();

        $appliedOrganizations = [];
        foreach ($appliedList as $anggota) {
            $org = $anggota->organisasi;
            $activeProfile = $org->profilOrganisasi->first();
            $appliedOrganizations[] = [
                'id' => $org->id_organisasi,
                'name' => $org->nama_organisasi,
                'logo' => $activeProfile?->logo_organisasi ?? '',
                'description' => $activeProfile?->deskripsi_organisasi ?? '',
                'tanggal_daftar' => $anggota->created_at ? $anggota->created_at->toDateString() : ($anggota->tanggal_bergabung ?? ''),
                'status' => 'Diproses',
            ];
        }

        // 3. Joinable organizations (active organizations where the user has no active/pending record)
        $userOrgIds = AnggotaOrganisasi::where('nim', $nim)
            ->whereIn('status_keanggotaan', ['Aktif', 'Diproses'])
            ->pluck('id_organisasi');

        $joinableList = Organisasi::where('status_aktif', true)
            ->whereNotIn('id_organisasi', $userOrgIds)
            ->with([
                'profilOrganisasi' => function ($q) {
                    $q->where('status_aktif', true);
                },
            ])
            ->get();

        $joinableOrganizations = [];
        foreach ($joinableList as $org) {
            $activeProfile = $org->profilOrganisasi->first();

            // Check if they had a previous status (e.g. 'Ditolak' or 'Tidak Aktif')
            $previousRecord = AnggotaOrganisasi::where('nim', $nim)
                ->where('id_organisasi', $org->id_organisasi)
                ->first();
            $status = $previousRecord ? $previousRecord->status_keanggotaan : null;

            $joinableOrganizations[] = [
                'id' => $org->id_organisasi,
                'name' => $org->nama_organisasi,
                'logo' => $activeProfile?->logo_organisasi ?? '',
                'description' => $activeProfile?->deskripsi_organisasi ?? '',
                'status' => $status,
            ];
        }

        return Inertia::render('organisasi/index', [
            'followed' => $followedOrganizations,
            'applied' => $appliedOrganizations,
            'joinable' => $joinableOrganizations,
        ]);
    }

    public function showProfil(Organisasi $organisasi): Response
    {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // Check active profile
        $profil = $organisasi->profilOrganisasi()
            ->where('status_aktif', true)
            ->first();

        if (! $profil) {
            $profil = new ProfilOrganisasi;
            $profil->id_organisasi = $organisasi->id_organisasi;
            $profil->periode_kepengurusan = date('Y').'/'.(date('Y') + 1);
            $profil->deskripsi_organisasi = 'Organisasi ini belum mengisi profil.';
            $profil->visi_organisasi = '';
            $profil->misi_organisasi = '';
        }

        // Check membership status
        $anggota = AnggotaOrganisasi::where('id_organisasi', $organisasi->id_organisasi)
            ->where('nim', $nim)
            ->first();

        $statusKeanggotaan = $anggota ? $anggota->status_keanggotaan : null;

        return Inertia::render('organisasi/detail', [
            'profil' => $profil,
            'organisasi' => [
                'id_organisasi' => $organisasi->id_organisasi,
                'nama_organisasi' => $organisasi->nama_organisasi,
            ],
            'statusKeanggotaan' => $statusKeanggotaan,
            'isReadOnly' => true,
        ]);
    }

    public function showPengurus(Organisasi $organisasi): Response
    {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // Check active profile
        $profil = $organisasi->profilOrganisasi()
            ->where('status_aktif', true)
            ->first();

        $pengurusList = [];
        if ($profil) {
            $pengurusList = PengurusOrganisasi::where('id_profil', $profil->id_profil)
                ->where('status_aktif', true)
                ->with(['anggotaOrganisasi.mahasiswa'])
                ->get();
        }

        // Check membership status
        $anggota = AnggotaOrganisasi::where('id_organisasi', $organisasi->id_organisasi)
            ->where('nim', $nim)
            ->first();

        $statusKeanggotaan = $anggota ? $anggota->status_keanggotaan : null;

        return Inertia::render('organisasi/pengurus', [
            'profil' => $profil,
            'organisasi' => [
                'id_organisasi' => $organisasi->id_organisasi,
                'nama_organisasi' => $organisasi->nama_organisasi,
            ],
            'pengurusList' => $pengurusList,
            'statusKeanggotaan' => $statusKeanggotaan,
        ]);
    }

    public function showKegiatan(Organisasi $organisasi): Response
    {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // Check active profile
        $profil = $organisasi->profilOrganisasi()
            ->where('status_aktif', true)
            ->first();

        // Fetch all kegiatan for this organization
        $kegiatanList = Kegiatan::whereHas('profilOrganisasi', function ($q) use ($organisasi) {
            $q->where('id_organisasi', $organisasi->id_organisasi);
        })
            ->withCount('pesertaKegiatan')
            ->orderBy('tanggal_pelaksanaan', 'desc')
            ->get();

        // Fetch registered kegiatan mapped to their id_peserta
        $registrations = PesertaKegiatan::where('nim', $nim)
            ->get()
            ->pluck('id_peserta', 'id_kegiatan')
            ->toArray();

        return Inertia::render('organisasi/kegiatan', [
            'profil' => $profil,
            'organisasi' => [
                'id_organisasi' => $organisasi->id_organisasi,
                'nama_organisasi' => $organisasi->nama_organisasi,
            ],
            'kegiatanList' => $kegiatanList,
            'registrations' => (object) $registrations,
            'nim' => $nim,
        ]);
    }

    public function showKeuangan(Organisasi $organisasi): Response
    {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403);
        }

        // Check active profile
        $profil = $organisasi->profilOrganisasi()
            ->where('status_aktif', true)
            ->first();

        // Fetch all financial transactions of this organization (via kegiatan relationship)
        $transaksiList = TransaksiKeuangan::whereHas('kegiatan.profilOrganisasi', function ($q) use ($organisasi) {
            $q->where('id_organisasi', $organisasi->id_organisasi);
        })
            ->with('kegiatan')
            ->orderBy('tanggal_transaksi', 'desc')
            ->get();

        return Inertia::render('organisasi/keuangan', [
            'profil' => $profil,
            'organisasi' => [
                'id_organisasi' => $organisasi->id_organisasi,
                'nama_organisasi' => $organisasi->nama_organisasi,
            ],
            'transaksiList' => $transaksiList,
        ]);
    }
}
