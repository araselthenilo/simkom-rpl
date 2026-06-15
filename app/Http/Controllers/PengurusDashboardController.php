<?php

namespace App\Http\Controllers;

use App\Models\AnggotaOrganisasi;
use App\Models\Kegiatan;
use App\Models\PengurusOrganisasi;
use App\Models\PesertaKegiatan;
use App\Models\TransaksiKeuangan;
use Inertia\Inertia;
use Inertia\Response;

class PengurusDashboardController extends Controller
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

    private function getIndonesianDayName(string $dayOfWeekName): string
    {
        $map = [
            'Monday' => 'Sen',
            'Tuesday' => 'Sel',
            'Wednesday' => 'Rab',
            'Thursday' => 'Kam',
            'Friday' => 'Jum',
            'Saturday' => 'Sab',
            'Sunday' => 'Min',
            'Mon' => 'Sen',
            'Tue' => 'Sel',
            'Wed' => 'Rab',
            'Thu' => 'Kam',
            'Fri' => 'Jum',
            'Sat' => 'Sab',
            'Sun' => 'Min',
        ];

        return $map[$dayOfWeekName] ?? $dayOfWeekName;
    }

    public function index(): Response
    {
        $pengurusRecord = $this->getActivePengurusRecord();
        $idProfil = $pengurusRecord->id_profil;
        $idOrganisasi = $pengurusRecord->profilOrganisasi->id_organisasi;

        // 1. Total Anggota (Aktif)
        $totalAnggota = AnggotaOrganisasi::where('id_organisasi', $idOrganisasi)
            ->where('status_keanggotaan', 'Aktif')
            ->count();

        // 2. Kenaikan Anggota Baru Bulan Ini
        $newMembersThisMonth = AnggotaOrganisasi::where('id_organisasi', $idOrganisasi)
            ->where('status_keanggotaan', 'Aktif')
            ->where('tanggal_bergabung', '>=', now()->startOfMonth()->toDateString())
            ->count();

        $previousMembersCount = $totalAnggota - $newMembersThisMonth;
        if ($previousMembersCount > 0) {
            $percentageIncrease = round(($newMembersThisMonth / $previousMembersCount) * 100);
        } else {
            $percentageIncrease = $newMembersThisMonth > 0 ? 100 : 0;
        }

        // 3. Kegiatan Aktif (belong to profile, status Mendatang or Sedang berlangsung)
        $activities = Kegiatan::where('id_profil', $idProfil)->get();
        $activityIds = $activities->pluck('id_kegiatan');

        $kegiatanAktif = Kegiatan::where('id_profil', $idProfil)
            ->whereIn('status_kegiatan', ['Mendatang', 'Sedang berlangsung'])
            ->count();

        // 4. Saldo Kas (Sum of Pemasukan - Pengeluaran from transaksi_keuangan for activities under this profile)
        $totalPemasukan = TransaksiKeuangan::whereIn('id_kegiatan', $activityIds)
            ->where('jenis_transaksi', 'Pemasukan')
            ->sum('nominal_transaksi');

        $totalPengeluaran = TransaksiKeuangan::whereIn('id_kegiatan', $activityIds)
            ->where('jenis_transaksi', 'Pengeluaran')
            ->sum('nominal_transaksi');

        $saldoKas = $totalPemasukan - $totalPengeluaran;

        // 5. Menunggu Verifikasi (status Diproses for this organization)
        $menungguVerifikasi = AnggotaOrganisasi::where('id_organisasi', $idOrganisasi)
            ->where('status_keanggotaan', 'Diproses')
            ->count();

        // Menunggu Verifikasi Baru (Diproses & created in last 7 days)
        $menungguVerifikasiBaru = AnggotaOrganisasi::where('id_organisasi', $idOrganisasi)
            ->where('status_keanggotaan', 'Diproses')
            ->where('created_at', '>=', now()->subDays(7)->startOfDay())
            ->count();

        // 6. Recent Activities (Top 5 activities of this profile)
        $recentActivities = Kegiatan::where('id_profil', $idProfil)
            ->orderBy('created_at', 'desc')
            ->orderBy('id_kegiatan', 'desc')
            ->limit(5)
            ->get()
            ->map(function (Kegiatan $k) {
                return [
                    'id_kegiatan' => $k->id_kegiatan,
                    'nama_kegiatan' => $k->nama_kegiatan,
                    'jenis_kegiatan' => $k->jenis_kegiatan,
                    'status_kegiatan' => $k->status_kegiatan,
                    'time' => $k->created_at ? $k->created_at->diffForHumans() : 'Baru saja',
                ];
            });

        // 7. Recent Members (Top 5 members of this organization)
        $recentMembers = AnggotaOrganisasi::with('mahasiswa')
            ->where('id_organisasi', $idOrganisasi)
            ->orderBy('created_at', 'desc')
            ->orderBy('id_keanggotaan', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($anggota) {
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

                $initialsBg = 'bg-primary/10 text-primary dark:bg-primary-container dark:text-on-primary-container';
                if ($anggota->status_keanggotaan === 'Diproses') {
                    $initialsBg = 'bg-secondary-container/20 text-secondary dark:bg-secondary-container dark:text-on-secondary-container';
                }

                return [
                    'id_keanggotaan' => $anggota->id_keanggotaan,
                    'name' => $name,
                    'initials' => $initials,
                    'initialsBg' => $initialsBg,
                    'nim' => $anggota->nim,
                    'status' => $anggota->status_keanggotaan, // 'Aktif', 'Diproses', 'Ditolak'
                    'date' => $anggota->created_at ? $anggota->created_at->isoFormat('D MMM YYYY') : '',
                ];
            });

        // 8. Trend Data (7 Days)
        $trend7Days = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayOfWeekName = now()->subDays($i)->format('l'); // Monday, Tuesday, etc.
            $trend7Days->put($date, [
                'day' => $this->getIndonesianDayName($dayOfWeekName),
                'count' => 0,
            ]);
        }

        $registrations7 = PesertaKegiatan::whereIn('id_kegiatan', $activityIds)
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->get();

        foreach ($registrations7 as $reg) {
            if ($trend7Days->has($reg->date)) {
                $item = $trend7Days->get($reg->date);
                $item['count'] = (int) $reg->count;
                $trend7Days->put($reg->date, $item);
            }
        }

        $max7 = $trend7Days->max('count');
        $trendData7Days = $trend7Days->map(function ($item) use ($max7) {
            $item['height'] = $max7 > 0 ? round(($item['count'] / $max7) * 100).'%' : '0%';

            return $item;
        })->values()->all();

        // 9. Trend Data (30 Days)
        $trend30Days = collect();
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $trend30Days->put($date, [
                'day' => now()->subDays($i)->format('d/m'),
                'count' => 0,
            ]);
        }

        $registrations30 = PesertaKegiatan::whereIn('id_kegiatan', $activityIds)
            ->where('created_at', '>=', now()->subDays(29)->startOfDay())
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->get();

        foreach ($registrations30 as $reg) {
            if ($trend30Days->has($reg->date)) {
                $item = $trend30Days->get($reg->date);
                $item['count'] = (int) $reg->count;
                $trend30Days->put($reg->date, $item);
            }
        }

        $max30 = $trend30Days->max('count');
        $trendData30Days = $trend30Days->map(function ($item) use ($max30) {
            $item['height'] = $max30 > 0 ? round(($item['count'] / $max30) * 100).'%' : '0%';

            return $item;
        })->values()->all();

        return Inertia::render('pengurus/dashboard', [
            'stats' => [
                'totalAnggota' => $totalAnggota,
                'percentageIncrease' => $percentageIncrease,
                'kegiatanAktif' => $kegiatanAktif,
                'saldoKas' => (float) $saldoKas,
                'menungguVerifikasi' => $menungguVerifikasi,
                'menungguVerifikasiBaru' => $menungguVerifikasiBaru,
            ],
            'recentActivities' => $recentActivities,
            'recentMembers' => $recentMembers,
            'trendData7Days' => $trendData7Days,
            'trendData30Days' => $trendData30Days,
        ]);
    }
}
