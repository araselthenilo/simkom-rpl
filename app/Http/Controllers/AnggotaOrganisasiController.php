<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Organisasi;
use App\Models\PengurusOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
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
        $nim = auth()->user()->profilPengguna->nim;

        $validated = $request->validate([
            'id_organisasi' => ['required', 'integer', 'exists:organisasi,id_organisasi'],
            'foto_ktm' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $sudahTerdaftar = AnggotaOrganisasi::where('id_organisasi', $validated['id_organisasi'])
            ->where('nim', $nim)
            ->exists();

        if ($sudahTerdaftar) {
            return back()->withErrors([
                'id_organisasi' => 'Anda sudah terdaftar atau sedang mengajukan pendaftaran di organisasi ini.',
            ]);
        }

        $fotoKtmPath = $request->file('foto_ktm')
            ->store('foto_ktm', 'local');

        AnggotaOrganisasi::create([
            'id_organisasi' => $validated['id_organisasi'],
            'nim' => $nim,
            'foto_ktm' => $fotoKtmPath,
            // Diisi sementara; akan ditimpa saat disetujui (status --> Aktif)
            'tanggal_bergabung' => now()->toDateString(),
            'status_keanggotaan' => 'Diproses',
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pendaftaran anggota berhasil diajukan.',
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

    public function pengurusIndex(Request $request): Response
    {
        $user = auth()->user();
        if (! $user || $user->role !== 'Mahasiswa' || ! $user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // Find the active PengurusOrganisasi record matching the active organization in session
        $activeOrgId = session('active_organization_id');
        $pengurusRecordQuery = PengurusOrganisasi::where('status_aktif', true)
            ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                $q->where('nim', $nim);
            })
            ->whereHas('profilOrganisasi.organisasi', function ($q) {
                $q->where('status_aktif', true);
            })
            ->with('profilOrganisasi.organisasi');

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

        $organisasi = $pengurusRecord->profilOrganisasi->organisasi;

        $anggotaList = AnggotaOrganisasi::with('mahasiswa')
            ->where('id_organisasi', $organisasi->id_organisasi)
            ->whereDoesntHave('pengurusOrganisasi', function ($q) {
                $q->where('status_aktif', true);
            })
            ->get();

        $members = $anggotaList->map(function ($anggota) {
            $name = $anggota->mahasiswa->nama_lengkap ?? '';
            $words = explode(' ', $name);
            $initials = '';
            if (count($words) > 0) {
                $initials .= strtoupper(substr($words[0], 0, 1));
            }
            if (count($words) > 1) {
                $initials .= strtoupper(substr($words[1], 0, 1));
            }
            if (empty($initials)) {
                $initials = '??';
            }

            $avatarColor = 'bg-primary-fixed text-primary';
            if ($anggota->status_keanggotaan === 'Diproses') {
                $avatarColor = 'bg-secondary-fixed text-on-secondary-container';
            } elseif ($anggota->status_keanggotaan === 'Ditolak') {
                $avatarColor = 'bg-tertiary-fixed text-on-tertiary-container';
            }

            return [
                'id_keanggotaan' => $anggota->id_keanggotaan,
                'nim' => $anggota->nim,
                'name' => $name,
                'major' => $anggota->mahasiswa->program_studi ?? '',
                'status' => $anggota->status_keanggotaan,
                'initials' => $initials,
                'avatarColor' => $avatarColor,
                'foto_ktm' => $anggota->foto_ktm,
            ];
        });

        $stats = [
            'total' => $anggotaList->count(),
            'pending' => $anggotaList->where('status_keanggotaan', 'Diproses')->count(),
            'active' => $anggotaList->where('status_keanggotaan', 'Aktif')->count(),
            'rejected' => $anggotaList->where('status_keanggotaan', 'Ditolak')->count(),
        ];

        return Inertia::render('pengurus/manajemen-anggota', [
            'members' => $members,
            'stats' => $stats,
        ]);
    }

    public function showKtm(AnggotaOrganisasi $anggotaOrganisasi)
    {
        if (!auth()->check()) {
            abort(403);
        }

        $isAuthorized = false;

        // Admin / Petugas: allowed
        if (Gate::check('is-admin') || Gate::check('is-petugas')) {
            $isAuthorized = true;
        }

        // Pembina Organisasi: check if they oversee the organization
        if (Gate::check('is-pembina')) {
            $pembina = auth()->user()->profilPengguna;
            $managedOrgIds = $pembina ? $pembina->pembinaan()->pluck('id_organisasi')->toArray() : [];
            if (in_array($anggotaOrganisasi->id_organisasi, $managedOrgIds)) {
                $isAuthorized = true;
            }
        }

        // Pengurus Organisasi: check if they are active staff of the organization
        if (Gate::check('is-pengurus-organisasi')) {
            $nim = auth()->user()->profilPengguna->nim ?? null;
            $isStaff = $nim ? PengurusOrganisasi::where('status_aktif', true)
                ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                    $q->where('nim', $nim);
                })
                ->whereHas('profilOrganisasi', function ($q) use ($anggotaOrganisasi) {
                    $q->where('id_organisasi', $anggotaOrganisasi->id_organisasi);
                })
                ->exists() : false;

            if ($isStaff) {
                $isAuthorized = true;
            }
        }

        if (!$isAuthorized) {
            abort(403, 'Anda tidak memiliki akses ke foto KTM ini.');
        }

        if (!Storage::disk('local')->exists($anggotaOrganisasi->foto_ktm)) {
            abort(404, 'File KTM tidak ditemukan.');
        }

        return response()->file(Storage::disk('local')->path($anggotaOrganisasi->foto_ktm));
    }
}
