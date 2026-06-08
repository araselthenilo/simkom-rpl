<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('guest cannot access pengurus keuangan page', function () {
    $response = $this->get('/pengurus/keuangan');
    $response->assertRedirect(route('login'));
});

test('non-pengurus student cannot access pengurus keuangan page', function () {
    $user = User::factory()->create(['role' => 'Mahasiswa']);

    $response = $this->actingAs($user)->get('/pengurus/keuangan');
    $response->assertStatus(403);
});

test('active pengurus can view their organization keuangan dashboard', function () {
    // 1. Create pengurus user
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $nimPengurus = '111111111';
    DB::table('mahasiswa')->insert([
        'nim' => $nimPengurus,
        'username' => $user->username,
        'nama_lengkap' => 'Ketua Himpunan',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567890',
    ]);

    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'Himpunan Mahasiswa',
        'status_aktif' => true,
    ]);

    $id_profil = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi Organisasi',
        'visi_organisasi' => 'Visi Organisasi',
        'misi_organisasi' => 'Misi Organisasi',
        'status_aktif' => true,
    ]);

    $id_keanggotaanPengurus = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => $nimPengurus,
        'tanggal_bergabung' => '2025-06-01',
        'status_keanggotaan' => 'Aktif',
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil,
        'id_keanggotaan' => $id_keanggotaanPengurus,
        'jabatan' => 'Ketua',
        'status_aktif' => true,
    ]);

    // 2. Create related Kegiatan
    $id_kegiatan = DB::table('kegiatan')->insertGetId([
        'id_profil' => $id_profil,
        'nama_kegiatan' => 'Seminar Teknologi Masa Depan',
        'jenis_kegiatan' => 'Seminar',
        'deskripsi_kegiatan' => 'Seminar tentang teknologi masa depan.',
        'biaya_pendaftaran' => 0.00,
        'tanggal_pelaksanaan' => '2026-07-28',
        'lokasi_kegiatan' => 'Lab Teater Kampus',
        'kuota_peserta' => 200,
        'status_kegiatan' => 'Mendatang',
    ]);

    // 3. Create Transaksi Keuangan
    // Current month transactions (June 2026 based on local time or now())
    $currentYear = now()->year;
    $currentMonth = str_pad(now()->month, 2, '0', STR_PAD_LEFT);

    DB::table('transaksi_keuangan')->insert([
        'id_kegiatan' => $id_kegiatan,
        'jenis_transaksi' => 'Pemasukan',
        'nominal_transaksi' => 1500000.00,
        'tanggal_transaksi' => "{$currentYear}-{$currentMonth}-05",
        'sumber_tujuan_transaksi' => 'Sponsorship Tech Corp',
        'foto_bukti_transaksi' => 'bukti_sponsorship.png',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('transaksi_keuangan')->insert([
        'id_kegiatan' => $id_kegiatan,
        'jenis_transaksi' => 'Pengeluaran',
        'nominal_transaksi' => 500000.00,
        'tanggal_transaksi' => "{$currentYear}-{$currentMonth}-06",
        'sumber_tujuan_transaksi' => 'Pembelian ATK',
        'foto_bukti_transaksi' => 'bukti_atk.png',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // Transaction from previous month to check monthly statistics filters
    $prevMonth = now()->subMonth();
    $prevYear = $prevMonth->year;
    $prevMonthStr = str_pad($prevMonth->month, 2, '0', STR_PAD_LEFT);

    DB::table('transaksi_keuangan')->insert([
        'id_kegiatan' => $id_kegiatan,
        'jenis_transaksi' => 'Pemasukan',
        'nominal_transaksi' => 2000000.00,
        'tanggal_transaksi' => "{$prevYear}-{$prevMonthStr}-15",
        'sumber_tujuan_transaksi' => 'Saldo Awal',
        'foto_bukti_transaksi' => 'bukti_saldo.png',
        'created_at' => now()->subMonth(),
        'updated_at' => now()->subMonth(),
    ]);

    $response = $this->actingAs($user)->get('/pengurus/keuangan');
    $response->assertStatus(200);

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('pengurus/manajemen-keuangan')
        ->has('transactions', 3)
        ->where('stats.total_saldo', 3000000) // 1.5M + 2M - 0.5M = 3M
        ->where('stats.total_pemasukan', 3500000) // All time/general pemasukan
        ->where('stats.total_pengeluaran', 500000) // All time/general pengeluaran
        ->where('transactions.0.sumber_tujuan_transaksi', 'Pembelian ATK') // Descending order
        ->where('transactions.0.kegiatan.nama_kegiatan', 'Seminar Teknologi Masa Depan')
    );
});
