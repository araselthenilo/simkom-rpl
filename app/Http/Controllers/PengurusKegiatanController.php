<?php

namespace App\Http\Controllers;

use App\Models\DokumentasiKegiatan;
use App\Models\Kegiatan;
use App\Models\PengurusOrganisasi;
use App\Models\PesertaKegiatan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            ->orderBy('tanggal_pelaksanaan', 'desc')
            ->get();

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
            ->get();

        return Inertia::render('pengurus/peserta-kegiatan', [
            'kegiatan' => $kegiatan,
            'pesertaList' => $pesertaList,
        ]);
    }
}
