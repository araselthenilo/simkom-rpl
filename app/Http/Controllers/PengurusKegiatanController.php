<?php

namespace App\Http\Controllers;

use App\Models\CatatanRevisi;
use App\Models\DokumentasiKegiatan;
use App\Models\FotoDokumentasi;
use App\Models\Kegiatan;
use App\Models\PengurusOrganisasi;
use App\Models\PesertaKegiatan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PengurusKegiatanController extends Controller
{
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

    public function index(): Response
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        $activities = Kegiatan::where('id_profil', $id_profil)
            ->with('dokumentasiKegiatan')
            ->orderBy('tanggal_pelaksanaan', 'desc')
            ->get()
            ->map(function ($kegiatan) {
                if ($kegiatan->dokumentasiKegiatan) {
                    $prop = $kegiatan->dokumentasiKegiatan->dokumen_proposal;
                    $lpj = $kegiatan->dokumentasiKegiatan->dokumen_lpj;
                    $eval = $kegiatan->dokumentasiKegiatan->hasil_evaluasi;

                    $kegiatan->dokumentasiKegiatan->dokumen_proposal = $prop
                        ? route('dokumentasi.download-doc', [$kegiatan->dokumentasiKegiatan->id_dokumentasi, 'proposal', basename($prop)])
                        : null;
                    $kegiatan->dokumentasiKegiatan->dokumen_lpj = $lpj
                        ? route('dokumentasi.download-doc', [$kegiatan->dokumentasiKegiatan->id_dokumentasi, 'lpj', basename($lpj)])
                        : null;
                    $kegiatan->dokumentasiKegiatan->hasil_evaluasi = $eval
                        ? route('dokumentasi.download-doc', [$kegiatan->dokumentasiKegiatan->id_dokumentasi, 'evaluasi', basename($eval)])
                        : null;
                }

                return $kegiatan;
            });

        return Inertia::render('pengurus/manajemen-kegiatan', [
            'initialActivities' => $activities,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        $validated = $request->validate([
            'nama_kegiatan' => ['required', 'string', 'max:200'],
            'jenis_kegiatan' => ['required', 'in:Seminar,Pelatihan,Lomba,Pengabdian Masyarakat'],
            'deskripsi_kegiatan' => ['required', 'string'],
            'biaya_pendaftaran' => ['required', 'numeric', 'min:0'],
            'tanggal_pelaksanaan' => ['required', 'date'],
            'lokasi_kegiatan' => ['required', 'string', 'max:200'],
            'kuota_peserta' => ['required', 'integer', 'min:1'],
        ]);

        $validated['id_profil'] = $id_profil;
        $validated['status_kegiatan'] = 'Mendatang';

        Kegiatan::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kegiatan berhasil ditambahkan.',
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        if ($kegiatan->id_profil !== $id_profil) {
            abort(403, 'Anda tidak memiliki akses ke kegiatan ini.');
        }

        $validated = $request->validate([
            'nama_kegiatan' => ['sometimes', 'required', 'string', 'max:200'],
            'jenis_kegiatan' => ['sometimes', 'required', 'in:Seminar,Pelatihan,Lomba,Pengabdian Masyarakat'],
            'deskripsi_kegiatan' => ['sometimes', 'required', 'string'],
            'biaya_pendaftaran' => ['sometimes', 'required', 'numeric', 'min:0'],
            'tanggal_pelaksanaan' => ['sometimes', 'required', 'date'],
            'lokasi_kegiatan' => ['sometimes', 'required', 'string', 'max:200'],
            'kuota_peserta' => ['sometimes', 'required', 'integer', 'min:1'],
            'status_kegiatan' => ['sometimes', 'required', 'in:Mendatang,Sedang berlangsung,Selesai,Dibatalkan'],
            'alasan_pembatalan' => ['nullable', 'string', 'max:500'],
        ]);

        // If status changes to Dibatalkan, ensure cancellation reason is required
        if (isset($validated['status_kegiatan']) && $validated['status_kegiatan'] === 'Dibatalkan') {
            $request->validate([
                'alasan_pembatalan' => ['required', 'string', 'max:500'],
            ]);
        }

        $kegiatan->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kegiatan berhasil diperbarui.',
        ]);

        return redirect()->back();
    }

    public function destroy(Kegiatan $kegiatan): RedirectResponse
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        if ($kegiatan->id_profil !== $id_profil) {
            abort(403, 'Anda tidak memiliki akses ke kegiatan ini.');
        }

        if (
            $kegiatan->pesertaKegiatan()->exists() ||
            $kegiatan->transaksiKeuangan()->exists() ||
            DokumentasiKegiatan::where('id_kegiatan', $kegiatan->id_kegiatan)->exists()
        ) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Kegiatan tidak dapat dihapus karena sudah memiliki data transaksi, dokumentasi, atau peserta terkait.',
            ]);

            return redirect()->back();
        }

        $kegiatan->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kegiatan berhasil dihapus.',
        ]);

        return redirect()->back();
    }

    public function peserta(Kegiatan $kegiatan): Response
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        if ($kegiatan->id_profil !== $id_profil) {
            abort(403, 'Anda tidak memiliki akses ke kegiatan ini.');
        }

        $pesertaList = PesertaKegiatan::where('id_kegiatan', $kegiatan->id_kegiatan)
            ->with(['mahasiswa', 'transaksiKeuangan'])
            ->get()
            ->map(function ($peserta) {
                if ($peserta->transaksiKeuangan) {
                    $peserta->transaksiKeuangan->foto_bukti_transaksi = $peserta->transaksiKeuangan->foto_bukti_transaksi
                        ? route('transaksi-keuangan.bukti', $peserta->transaksiKeuangan->id_transaksi)
                        : null;
                }

                return $peserta;
            });

        return Inertia::render('pengurus/peserta-kegiatan', [
            'kegiatan' => $kegiatan,
            'pesertaList' => $pesertaList,
        ]);
    }

    public function showDokumentasi(Kegiatan $kegiatan): Response
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        if ($kegiatan->id_profil !== $id_profil) {
            abort(403, 'Anda tidak memiliki akses ke kegiatan ini.');
        }

        $dokumentasi = DokumentasiKegiatan::where('id_kegiatan', $kegiatan->id_kegiatan)
            ->with(['fotoKegiatan', 'catatanRevisi'])
            ->first();

        $formattedDokumentasi = null;
        if ($dokumentasi) {
            $formattedDokumentasi = [
                'id_dokumentasi' => $dokumentasi->id_dokumentasi,
                'id_kegiatan' => $dokumentasi->id_kegiatan,
                'dokumen_proposal' => $dokumentasi->dokumen_proposal ? route('dokumentasi.download-doc', [$dokumentasi->id_dokumentasi, 'proposal', basename($dokumentasi->dokumen_proposal)]) : null,
                'dokumen_lpj' => $dokumentasi->dokumen_lpj ? route('dokumentasi.download-doc', [$dokumentasi->id_dokumentasi, 'lpj', basename($dokumentasi->dokumen_lpj)]) : null,
                'hasil_evaluasi' => $dokumentasi->hasil_evaluasi ? route('dokumentasi.download-doc', [$dokumentasi->id_dokumentasi, 'evaluasi', basename($dokumentasi->hasil_evaluasi)]) : null,
                'status_dokumentasi' => $dokumentasi->status_dokumentasi,
                'created_at' => $dokumentasi->created_at,
                'updated_at' => $dokumentasi->updated_at,
                'foto_kegiatan' => $dokumentasi->fotoKegiatan->map(function ($foto) {
                    return [
                        'id_foto' => $foto->id_foto,
                        'url' => Storage::disk('public')->url($foto->foto_dokumentasi),
                    ];
                }),
                'catatan_revisi' => $dokumentasi->catatanRevisi->map(function ($catatan) {
                    return [
                        'id_catatan' => $catatan->id_catatan,
                        'isi_catatan' => $catatan->isi_catatan,
                        'username_petugas' => $catatan->username_petugas,
                        'nama_petugas' => $catatan->penggunaPetugas?->name ?? $catatan->username_petugas,
                        'status_tindaklanjut' => (bool) $catatan->status_tindaklanjut,
                        'waktu_ditindaklanjuti' => $catatan->waktu_ditindaklanjuti ? $catatan->waktu_ditindaklanjuti : null,
                        'created_at' => $catatan->created_at,
                    ];
                })->sortByDesc('created_at')->values(),
            ];
        }

        return Inertia::render('pengurus/dokumentasi-kegiatan', [
            'kegiatan' => $kegiatan,
            'dokumentasi' => $formattedDokumentasi,
        ]);
    }

    public function storeDokumentasi(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        if ($kegiatan->id_profil !== $id_profil) {
            abort(403, 'Anda tidak memiliki akses ke kegiatan ini.');
        }

        $dokumentasi = DokumentasiKegiatan::where('id_kegiatan', $kegiatan->id_kegiatan)->first();

        $request->validate([
            'dokumen_proposal' => [
                $dokumentasi ? 'nullable' : 'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240', // 10MB
            ],
            'dokumen_lpj' => [
                'nullable',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240', // 10MB
            ],
        ]);

        $data = [];

        if ($request->hasFile('dokumen_proposal')) {
            if ($dokumentasi && $dokumentasi->dokumen_proposal) {
                Storage::disk('local')->delete($dokumentasi->dokumen_proposal);
            }
            $data['dokumen_proposal'] = $request->file('dokumen_proposal')->store('dokumentasi/proposal', 'local');
        }

        if ($request->hasFile('dokumen_lpj')) {
            if ($dokumentasi && $dokumentasi->dokumen_lpj) {
                Storage::disk('local')->delete($dokumentasi->dokumen_lpj);
            }
            $data['dokumen_lpj'] = $request->file('dokumen_lpj')->store('dokumentasi/lpj', 'local');
        }

        if ($dokumentasi) {
            if (! empty($data)) {
                // If status was 'Butuh Revisi', updating document should reset status to 'Diproses'
                if ($dokumentasi->status_dokumentasi === 'Butuh Revisi') {
                    $data['status_dokumentasi'] = 'Diproses';
                }
                $dokumentasi->update($data);
            }
            $message = 'Dokumentasi kegiatan berhasil diperbarui.';
        } else {
            DokumentasiKegiatan::create([
                'id_kegiatan' => $kegiatan->id_kegiatan,
                'dokumen_proposal' => $data['dokumen_proposal'],
                'dokumen_lpj' => $data['dokumen_lpj'] ?? null,
                'status_dokumentasi' => 'Diproses',
            ]);
            $message = 'Dokumentasi kegiatan berhasil dibuat.';
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $message,
        ]);

        return redirect()->back();
    }

    public function uploadFoto(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        if ($kegiatan->id_profil !== $id_profil) {
            abort(403, 'Anda tidak memiliki akses ke kegiatan ini.');
        }

        $dokumentasi = DokumentasiKegiatan::where('id_kegiatan', $kegiatan->id_kegiatan)->first();
        if (! $dokumentasi) {
            abort(400, 'Harap unggah dokumen proposal terlebih dahulu.');
        }

        $request->validate([
            'foto' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ]);

        $path = $request->file('foto')->store('dokumentasi/foto', 'public');

        $foto = new FotoDokumentasi;
        $foto->id_dokumentasi = $dokumentasi->id_dokumentasi;
        $foto->foto_dokumentasi = $path;
        $foto->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Foto dokumentasi berhasil ditambahkan.',
        ]);

        return redirect()->back();
    }

    public function deleteFoto(Request $request, Kegiatan $kegiatan, FotoDokumentasi $foto): RedirectResponse
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        if ($kegiatan->id_profil !== $id_profil) {
            abort(403, 'Anda tidak memiliki akses ke kegiatan ini.');
        }

        $dokumentasi = DokumentasiKegiatan::where('id_kegiatan', $kegiatan->id_kegiatan)->first();
        if (! $dokumentasi || $foto->id_dokumentasi !== $dokumentasi->id_dokumentasi) {
            abort(403, 'Akses ditolak.');
        }

        Storage::disk('public')->delete($foto->foto_dokumentasi);
        $foto->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Foto dokumentasi berhasil dihapus.',
        ]);

        return redirect()->back();
    }

    public function tindaklanjutCatatan(Request $request, Kegiatan $kegiatan, CatatanRevisi $catatan): RedirectResponse
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $id_profil = $pengurusRecord->id_profil;

        if ($kegiatan->id_profil !== $id_profil) {
            abort(403, 'Anda tidak memiliki akses ke kegiatan ini.');
        }

        $dokumentasi = DokumentasiKegiatan::where('id_kegiatan', $kegiatan->id_kegiatan)->first();
        if (! $dokumentasi || $catatan->id_dokumentasi !== $dokumentasi->id_dokumentasi) {
            abort(403, 'Akses ditolak.');
        }

        $catatan->update([
            'status_tindaklanjut' => true,
            'waktu_ditindaklanjuti' => now(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Catatan revisi berhasil ditindaklanjuti.',
        ]);

        return redirect()->back();
    }

    public function downloadDoc(DokumentasiKegiatan $dokumentasi, string $type)
    {
        if (! auth()->check()) {
            abort(403);
        }

        $kegiatan = $dokumentasi->kegiatan;
        if (! $kegiatan) {
            abort(404, 'Kegiatan tidak ditemukan.');
        }

        $orgId = $kegiatan->profilOrganisasi->id_organisasi ?? null;

        // Authorization check:
        // Admin: allow.
        // Pembina: check if manages orgId.
        // Pengurus: check if is active staff of orgId.
        $user = auth()->user();
        $isAuthorized = false;

        if ($user->role === 'Admin Kemahasiswaan') {
            $isAuthorized = true;
        } elseif ($user->role === 'Pembina Organisasi') {
            $pembina = $user->profilPengguna;
            $managedOrgIds = $pembina ? $pembina->pembinaan()->pluck('id_organisasi')->toArray() : [];
            if (in_array($orgId, $managedOrgIds)) {
                $isAuthorized = true;
            }
        } elseif ($user->role === 'Mahasiswa' && $user->isActiveOrganizationStaff) {
            $nim = $user->profilPengguna->nim ?? null;
            $isStaff = $nim ? PengurusOrganisasi::where('status_aktif', true)
                ->whereHas('anggotaOrganisasi', function ($q) use ($nim) {
                    $q->where('nim', $nim);
                })
                ->whereHas('profilOrganisasi', function ($q) use ($orgId) {
                    $q->where('id_organisasi', $orgId);
                })
                ->exists() : false;

            if ($isStaff) {
                $isAuthorized = true;
            }
        }

        if (! $isAuthorized) {
            abort(403, 'Anda tidak memiliki akses ke dokumen ini.');
        }

        $filePath = null;
        if ($type === 'proposal') {
            $filePath = $dokumentasi->dokumen_proposal;
        } elseif ($type === 'lpj') {
            $filePath = $dokumentasi->dokumen_lpj;
        } elseif ($type === 'evaluasi') {
            $filePath = $dokumentasi->hasil_evaluasi;
        }

        if (! $filePath || ! Storage::disk('local')->exists($filePath)) {
            abort(404, 'Dokumen tidak ditemukan.');
        }

        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        if ($extension === 'pdf' && ! request()->has('download')) {
            return Storage::disk('local')->response($filePath, basename($filePath), [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"',
            ]);
        }

        return Storage::disk('local')->download($filePath, basename($filePath));
    }
}
