<?php

namespace App\Http\Controllers;

use App\Models\DokumentasiKegiatan;
use App\Models\Kegiatan;
use App\Models\PesertaKegiatan;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminKegiatanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('is-admin');

        $activities = Kegiatan::with(['profilOrganisasi.organisasi', 'dokumentasiKegiatan'])
            ->orderBy('tanggal_pelaksanaan', 'desc')
            ->get()
            ->map(function ($kegiatan) {
                if ($kegiatan->dokumentasiKegiatan) {
                    $kegiatan->dokumentasiKegiatan->dokumen_proposal = $kegiatan->dokumentasiKegiatan->dokumen_proposal 
                        ? Storage::disk('public')->url($kegiatan->dokumentasiKegiatan->dokumen_proposal) 
                        : null;
                    $kegiatan->dokumentasiKegiatan->dokumen_lpj = $kegiatan->dokumentasiKegiatan->dokumen_lpj 
                        ? Storage::disk('public')->url($kegiatan->dokumentasiKegiatan->dokumen_lpj) 
                        : null;
                    $kegiatan->dokumentasiKegiatan->hasil_evaluasi = $kegiatan->dokumentasiKegiatan->hasil_evaluasi 
                        ? Storage::disk('public')->url($kegiatan->dokumentasiKegiatan->hasil_evaluasi) 
                        : null;
                }
                return $kegiatan;
            });

        $profilList = ProfilOrganisasi::where('status_aktif', true)
            ->with('organisasi')
            ->get();

        return Inertia::render('admin/manajemen-kegiatan', [
            'initialActivities' => $activities,
            'profilList' => $profilList,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('is-admin');

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

        $validated['status_kegiatan'] = 'Mendatang';
        $validated['username_petugas'] = auth()->user()->username;

        Kegiatan::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Kegiatan berhasil ditambahkan.',
        ]);

        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-admin');

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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-admin');

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
        Gate::authorize('is-admin');

        $pesertaList = PesertaKegiatan::where('id_kegiatan', $kegiatan->id_kegiatan)
            ->with(['mahasiswa', 'transaksiKeuangan'])
            ->get();

        return Inertia::render('admin/peserta-kegiatan', [
            'kegiatan' => $kegiatan,
            'pesertaList' => $pesertaList,
        ]);
    }
}
