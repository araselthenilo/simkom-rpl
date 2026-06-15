<?php

namespace App\Http\Controllers;

use App\Models\CatatanRevisi;
use App\Models\DokumentasiKegiatan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminDokumentasiKegiatanController extends Controller
{
    /**
     * Display a listing of activity documentation submissions.
     */
    public function index(): Response
    {
        Gate::authorize('is-admin');

        $submissions = DokumentasiKegiatan::with([
            'kegiatan.profilOrganisasi.organisasi',
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('admin/dokumentasi-kegiatan', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Display the specified activity documentation details.
     */
    public function show(DokumentasiKegiatan $dokumentasi): Response
    {
        Gate::authorize('is-admin');

        $dokumentasi->load([
            'kegiatan.profilOrganisasi.organisasi',
            'fotoKegiatan',
            'catatanRevisi.penggunaPetugas.profilPengguna',
        ]);

        // Transform URLs for public storage access
        $formatted = [
            'id_dokumentasi' => $dokumentasi->id_dokumentasi,
            'id_kegiatan' => $dokumentasi->id_kegiatan,
            'dokumen_proposal' => $dokumentasi->dokumen_proposal ? route('dokumentasi.download-doc', [$dokumentasi->id_dokumentasi, 'proposal']) : null,
            'dokumen_lpj' => $dokumentasi->dokumen_lpj ? route('dokumentasi.download-doc', [$dokumentasi->id_dokumentasi, 'lpj']) : null,
            'hasil_evaluasi' => $dokumentasi->hasil_evaluasi ? route('dokumentasi.download-doc', [$dokumentasi->id_dokumentasi, 'evaluasi']) : null,
            'status_dokumentasi' => $dokumentasi->status_dokumentasi,
            'created_at' => $dokumentasi->created_at->toIso8601String(),
            'updated_at' => $dokumentasi->updated_at->toIso8601String(),
            'kegiatan' => $dokumentasi->kegiatan,
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
                    'created_at' => $catatan->created_at->toIso8601String(),
                ];
            })->sortByDesc('created_at')->values()->toArray(),
        ];

        return Inertia::render('admin/dokumentasi-kegiatan-show', [
            'dokumentasi' => $formatted,
        ]);
    }

    /**
     * Update the status of the documentation.
     */
    public function updateStatus(Request $request, DokumentasiKegiatan $dokumentasi): RedirectResponse
    {
        Gate::authorize('is-admin');

        $validated = $request->validate([
            'status_dokumentasi' => ['required', 'in:Diproses,Butuh Revisi,Diterima'],
            'hasil_evaluasi' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'], // 10MB
            'isi_catatan' => ['required_if:status_dokumentasi,Butuh Revisi', 'nullable', 'string', 'max:1000'],
        ]);

        $data = [
            'status_dokumentasi' => $validated['status_dokumentasi'],
        ];

        if ($request->hasFile('hasil_evaluasi')) {
            if ($dokumentasi->hasil_evaluasi) {
                Storage::disk('local')->delete($dokumentasi->hasil_evaluasi);
            }
            $data['hasil_evaluasi'] = $request->file('hasil_evaluasi')->store('dokumentasi/evaluasi', 'local');
        }

        $dokumentasi->update($data);

        // If status is 'Butuh Revisi' and notes are provided, create a CatatanRevisi
        if ($validated['status_dokumentasi'] === 'Butuh Revisi' && ! empty($validated['isi_catatan'])) {
            CatatanRevisi::create([
                'id_dokumentasi' => $dokumentasi->id_dokumentasi,
                'username_petugas' => auth()->user()->username,
                'isi_catatan' => $validated['isi_catatan'],
                'status_tindaklanjut' => false,
            ]);
        }

        $statusText = $validated['status_dokumentasi'] === 'Diterima' ? 'disetujui' : 'ditolak untuk revisi';

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Dokumentasi kegiatan berhasil {$statusText}.",
        ]);

        return redirect()->route('admin.dokumentasi-kegiatan.index');
    }
}
