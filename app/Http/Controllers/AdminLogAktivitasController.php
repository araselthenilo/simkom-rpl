<?php

namespace App\Http\Controllers;

use App\Exports\LogAktivitasExport;
use App\Models\LogAktivitas;
use App\Models\Organisasi;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Maatwebsite\Excel\Facades\Excel;

class AdminLogAktivitasController extends Controller
{
    public function export(Request $request)
    {
        Gate::authorize('is-admin');

        $validated = $request->validate([
            'id_organisasi' => ['nullable', 'string'],
            'kategori' => ['nullable', 'string'],
            'tanggal_mulai' => ['nullable', 'date'],
            'tanggal_akhir' => ['nullable', 'date'],
            'format' => ['required', 'string', 'in:pdf,excel'],
        ]);

        $idOrganisasi = $validated['id_organisasi'] ?? 'all';
        $kategori = $validated['kategori'] ?? 'all';
        $tanggalMulai = $validated['tanggal_mulai'] ?? null;
        $tanggalAkhir = $validated['tanggal_akhir'] ?? null;
        $format = $validated['format'];

        $query = LogAktivitas::with(['user', 'organisasi'])->orderBy('created_at', 'desc');

        if ($idOrganisasi !== 'all') {
            $query->where('id_organisasi', $idOrganisasi);
        }

        if ($kategori !== 'all') {
            $query->where('kategori', $kategori);
        }

        if ($tanggalMulai) {
            $query->whereDate('created_at', '>=', $tanggalMulai);
        }

        if ($tanggalAkhir) {
            $query->whereDate('created_at', '<=', $tanggalAkhir);
        }

        $logs = $query->get();

        $orgName = 'Semua UKM';
        if ($idOrganisasi !== 'all') {
            $org = Organisasi::find($idOrganisasi);
            $orgName = $org ? $org->nama_organisasi : 'UKM Tidak Diketahui';
        }

        $kategoriLabel = $kategori === 'all' ? 'Semua Kategori' : $kategori;

        $periode = 'Semua Periode';
        if ($tanggalMulai && $tanggalAkhir) {
            $periode = date('d/m/Y', strtotime($tanggalMulai)) . ' - ' . date('d/m/Y', strtotime($tanggalAkhir));
        } elseif ($tanggalMulai) {
            $periode = 'Mulai ' . date('d/m/Y', strtotime($tanggalMulai));
        } elseif ($tanggalAkhir) {
            $periode = 'Hingga ' . date('d/m/Y', strtotime($tanggalAkhir));
        }

        $filename = 'log-aktivitas-' . now()->format('YmdHis');

        if ($format === 'pdf') {
            $pdf = Pdf::loadView('laporan.log-pdf', [
                'rows' => $logs,
                'petugas' => $request->user()->name ?? $request->user()->username,
                'filter_organisasi' => $orgName,
                'filter_kategori' => $kategoriLabel,
                'periode' => $periode,
                'generated_at' => now()->format('d/m/Y H:i:s'),
            ])->setPaper('a4', 'landscape');

            return $pdf->download($filename . '.pdf');
        } else {
            return Excel::download(new LogAktivitasExport($logs), $filename . '.xlsx');
        }
    }
}
