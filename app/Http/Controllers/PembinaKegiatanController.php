<?php

namespace App\Http\Controllers;

use App\Models\DokumentasiKegiatan;
use App\Models\Kegiatan;
use App\Models\PesertaKegiatan;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PembinaKegiatanController extends Controller
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

        $activities = Kegiatan::whereHas('profilOrganisasi', function ($q) use ($managedOrgIds) {
            $q->whereIn('id_organisasi', $managedOrgIds);
        })
            ->with(['profilOrganisasi.organisasi', 'dokumentasiKegiatan'])
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

        $profilList = ProfilOrganisasi::where('status_aktif', true)
            ->whereIn('id_organisasi', $managedOrgIds)
            ->with('organisasi')
            ->get();

        return Inertia::render('pembina/manajemen-kegiatan', [
            'initialActivities' => $activities,
            'profilList' => $profilList,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        $validated = $request->validate([
            'id_profil' => ['required', 'integer', 'exists:profil_organisasi,id_profil'],
            'nama_kegiatan' => ['required', 'string', 'max:200'],
            'jenis_kegiatan' => ['required', 'in:Seminar,Pelatihan,Lomba,Pengabdian Masyarakat'],
            'deskripsi_kegiatan' => ['required', 'string'],
            'biaya_pendaftaran' => ['required', 'numeric', 'min:0'],
            'tanggal_pelaksanaan' => ['required', 'date'],
            'lokasi_kegiatan' => ['required', 'string', 'max:200'],
            'kuota_peserta' => ['required', 'integer', 'min:1'],
        ]);

        $profil = ProfilOrganisasi::findOrFail($validated['id_profil']);
        abort_unless(in_array($profil->id_organisasi, $managedOrgIds), 403);

        $validated['status_kegiatan'] = 'Mendatang';
        $validated['username_petugas'] = auth()->user()->username;

        Kegiatan::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kegiatan berhasil ditambahkan.',
        ]);

        return redirect()->back();
    }

    public function update(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        $idOrganisasi = $kegiatan->profilOrganisasi?->id_organisasi;
        abort_unless(in_array($idOrganisasi, $managedOrgIds), 403);

        $validated = $request->validate([
            'id_profil' => ['sometimes', 'required', 'integer', 'exists:profil_organisasi,id_profil'],
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

        if (isset($validated['id_profil'])) {
            $profil = ProfilOrganisasi::findOrFail($validated['id_profil']);
            abort_unless(in_array($profil->id_organisasi, $managedOrgIds), 403);
        }

        if (isset($validated['status_kegiatan']) && $validated['status_kegiatan'] === 'Dibatalkan') {
            $request->validate([
                'alasan_pembatalan' => ['required', 'string', 'max:500'],
            ]);
        }

        $validated['username_petugas'] = auth()->user()->username;

        $kegiatan->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kegiatan berhasil diperbarui.',
        ]);

        return redirect()->back();
    }

    public function destroy(Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        $idOrganisasi = $kegiatan->profilOrganisasi?->id_organisasi;
        abort_unless(in_array($idOrganisasi, $managedOrgIds), 403);

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
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();
        $idOrganisasi = $kegiatan->profilOrganisasi?->id_organisasi;
        abort_unless(in_array($idOrganisasi, $managedOrgIds), 403);

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

        return Inertia::render('pembina/peserta-kegiatan', [
            'kegiatan' => $kegiatan,
            'pesertaList' => $pesertaList,
        ]);
    }
}
