<?php

namespace App\Http\Controllers;

use App\Models\Kegiatan;
use App\Models\TransaksiKeuangan;
use App\Models\Organisasi;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PembinaTransaksiKeuanganController extends Controller
{
    private function getManagedOrgIds(): array
    {
        $pembina = auth()->user()->profilPengguna;
        return $pembina ? $pembina->pembinaan()->pluck('id_organisasi')->toArray() : [];
    }

    public function adminIndex(): Response
    {
        Gate::authorize('is-pembina');
        $managedOrgIds = $this->getManagedOrgIds();

        // Fetch all transactions with kegiatan → profilOrganisasi → organisasi belonging to managed organizations
        $transactions = TransaksiKeuangan::whereHas('kegiatan.profilOrganisasi', function($q) use ($managedOrgIds) {
            $q->whereIn('id_organisasi', $managedOrgIds);
        })
        ->with([
            'kegiatan.profilOrganisasi.organisasi',
        ])
        ->orderBy('tanggal_transaksi', 'desc')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function (TransaksiKeuangan $t) {
            return [
                'id_transaksi'           => $t->id_transaksi,
                'id_kegiatan'            => $t->id_kegiatan,
                'jenis_transaksi'        => $t->jenis_transaksi,
                'nominal_transaksi'      => (float) $t->nominal_transaksi,
                'tanggal_transaksi'      => $t->tanggal_transaksi,
                'sumber_tujuan_transaksi'=> $t->sumber_tujuan_transaksi,
                'foto_bukti_transaksi'   => $t->foto_bukti_transaksi
                    ? Storage::disk('public')->url($t->foto_bukti_transaksi)
                    : null,
                'catatan_koreksi'        => $t->catatan_koreksi,
                'created_at'             => $t->created_at ? $t->created_at->toIso8601String() : null,
                'kegiatan'               => $t->kegiatan ? [
                    'id_kegiatan'       => $t->kegiatan->id_kegiatan,
                    'nama_kegiatan'     => $t->kegiatan->nama_kegiatan,
                    'profil_organisasi' => $t->kegiatan->profilOrganisasi ? [
                        'id_profil'    => $t->kegiatan->profilOrganisasi->id_profil,
                        'organisasi'   => $t->kegiatan->profilOrganisasi->organisasi ? [
                            'id_organisasi'   => $t->kegiatan->profilOrganisasi->organisasi->id_organisasi,
                            'nama_organisasi' => $t->kegiatan->profilOrganisasi->organisasi->nama_organisasi,
                        ] : null,
                    ] : null,
                ] : null,
            ];
        });

        // Aggregate stats across all managed transactions
        $totalPemasukan = TransaksiKeuangan::whereHas('kegiatan.profilOrganisasi', function($q) use ($managedOrgIds) {
            $q->whereIn('id_organisasi', $managedOrgIds);
        })
        ->where('jenis_transaksi', 'Pemasukan')
        ->sum('nominal_transaksi');

        $totalPengeluaran = TransaksiKeuangan::whereHas('kegiatan.profilOrganisasi', function($q) use ($managedOrgIds) {
            $q->whereIn('id_organisasi', $managedOrgIds);
        })
        ->where('jenis_transaksi', 'Pengeluaran')
        ->sum('nominal_transaksi');

        $totalSaldo = $totalPemasukan - $totalPengeluaran;

        // Managed activities only
        $activities = Kegiatan::whereHas('profilOrganisasi', function ($q) use ($managedOrgIds) {
            $q->whereIn('id_organisasi', $managedOrgIds);
        })
        ->get()
        ->map(fn (Kegiatan $k) => [
            'id_kegiatan'   => $k->id_kegiatan,
            'nama_kegiatan' => $k->nama_kegiatan,
        ]);

        // Managed active organisations only
        $organisasiList = Organisasi::where('status_aktif', true)
            ->whereIn('id_organisasi', $managedOrgIds)
            ->get()
            ->map(fn ($org) => [
                'id_organisasi'   => $org->id_organisasi,
                'nama_organisasi' => $org->nama_organisasi,
            ]);

        return Inertia::render('pembina/manajemen-keuangan', [
            'transactions'   => $transactions,
            'activities'     => $activities,
            'organisasiList' => $organisasiList,
            'stats'          => [
                'total_saldo'        => (float) $totalSaldo,
                'total_pemasukan'    => (float) $totalPemasukan,
                'total_pengeluaran'  => (float) $totalPengeluaran,
            ],
        ]);
    }
}
