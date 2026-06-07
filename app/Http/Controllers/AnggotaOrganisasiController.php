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

    public function pengurusIndex(Request $request): Response
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'Mahasiswa' || !$user->profilPengguna) {
            abort(403);
        }

        $nim = $user->profilPengguna->nim;

        // Find the active PengurusOrganisasi record matching the active organization in session
        $activeOrgId = session('active_organization_id');
        $pengurusRecordQuery = \App\Models\PengurusOrganisasi::where('status_aktif', true)
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

        if (!isset($pengurusRecord) || !$pengurusRecord) {
            $pengurusRecord = $pengurusRecordQuery->first();
            if ($pengurusRecord && $pengurusRecord->profilOrganisasi) {
                session(['active_organization_id' => $pengurusRecord->profilOrganisasi->id_organisasi]);
            }
        }

        if (!$pengurusRecord || !$pengurusRecord->profilOrganisasi) {
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
}
