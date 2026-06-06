<?php

namespace App\Http\Controllers;

use App\Models\DokumentasiKegiatan;
use App\Models\Kegiatan;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DokumentasiKegiatanController extends Controller
{
    private const DISK = 'local';

    private const DOC_TYPES = [
        'proposal' => 'dokumen_proposal',
        'lpj' => 'dokumen_lpj',
        'evaluasi' => 'hasil_evaluasi',
    ];

    public function show(Kegiatan $kegiatan): Response
    {
        abort_unless(
            Gate::allows('is-pengurus-organisasi') || Gate::allows('is-petugas'),
            403
        );

        $dok = $kegiatan->dokumentasiKegiatan;

        return Inertia::render('DokumentasiKegiatan/Show', [
            'kegiatan' => $kegiatan,
            'dokumentasi' => $dok ? [
                'id_dokumentasi' => $dok->id_dokumentasi,
                'has_proposal' => (bool) $dok->dokumen_proposal,
                'has_lpj' => (bool) $dok->dokumen_lpj,
                'has_hasil_evaluasi' => (bool) $dok->hasil_evaluasi,
                'status_dokumentasi' => $dok->status_dokumentasi,
                'waktu_terakhir_diubah' => $dok->waktu_terakhir_diubah,
            ] : null,
        ]);
    }

    public function update(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-pengurus-organisasi');

        $dok = $kegiatan->dokumentasiKegiatan;

        $request->validate([
            'dokumen_proposal' => [
                $dok ? 'nullable' : 'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240', // 10 MB
            ],
            'dokumen_lpj' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ]);

        $data = [];

        if ($request->hasFile('dokumen_proposal')) {
            if ($dok?->dokumen_proposal) {
                Storage::disk(self::DISK)->delete($dok->dokumen_proposal);
            }
            $ext = $request->file('dokumen_proposal')->getClientOriginalExtension();
            $data['dokumen_proposal'] = $request->file('dokumen_proposal')
                ->storeAs("dokumentasi/{$kegiatan->id_kegiatan}", "proposal.{$ext}", self::DISK);
        }

        if ($request->hasFile('dokumen_lpj')) {
            if ($dok?->dokumen_lpj) {
                Storage::disk(self::DISK)->delete($dok->dokumen_lpj);
            }
            $ext = $request->file('dokumen_lpj')->getClientOriginalExtension();
            $data['dokumen_lpj'] = $request->file('dokumen_lpj')
                ->storeAs("dokumentasi/{$kegiatan->id_kegiatan}", "lpj.{$ext}", self::DISK);
        }

        if (empty($data)) {
            return back()->withErrors(['dokumen' => 'Tidak ada dokumen yang diunggah.']);
        }

        DokumentasiKegiatan::updateOrCreate(
            ['id_kegiatan' => $kegiatan->id_kegiatan],
            $data
        );

        return back()->with('success', 'Dokumen berhasil diunggah.');
    }

    public function updateStatus(Request $request, Kegiatan $kegiatan): RedirectResponse
    {
        Gate::authorize('is-petugas');

        $dok = $kegiatan->dokumentasiKegiatan;
        abort_if($dok === null, 404, 'Dokumentasi kegiatan belum tersedia.');

        $validated = $request->validate([
            'status_dokumentasi' => ['required', Rule::in(['Diproses', 'Butuh Revisi', 'Diterima'])],
            'hasil_evaluasi' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ]);

        $data = ['status_dokumentasi' => $validated['status_dokumentasi']];

        if ($request->hasFile('hasil_evaluasi')) {
            if ($dok->hasil_evaluasi) {
                Storage::disk(self::DISK)->delete($dok->hasil_evaluasi);
            }
            $ext = $request->file('hasil_evaluasi')->getClientOriginalExtension();
            $data['hasil_evaluasi'] = $request->file('hasil_evaluasi')
                ->storeAs("dokumentasi/{$kegiatan->id_kegiatan}", "evaluasi.{$ext}", self::DISK);
        }

        $dok->update($data);

        return back()->with('success', 'Status dokumentasi berhasil diperbarui.');
    }

    public function download(Kegiatan $kegiatan, string $type): StreamedResponse
    {
        abort_unless(
            Gate::allows('is-pengurus-organisasi') || Gate::allows('is-petugas'),
            403
        );

        abort_unless(array_key_exists($type, self::DOC_TYPES), 404);

        $dok = $kegiatan->dokumentasiKegiatan;
        abort_if($dok === null, 404);

        $path = $dok->{self::DOC_TYPES[$type]};
        abort_if($path === null || ! Storage::disk(self::DISK)->exists($path), 404);

        $filename = "{$type}_{$kegiatan->id_kegiatan}.".pathinfo($path, PATHINFO_EXTENSION);

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk(self::DISK);

        return $disk->download($path, $filename);
    }
}
