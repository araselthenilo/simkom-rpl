<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('guest cannot access organisasi list page', function () {
    $response = $this->get('/organisasi');
    $response->assertRedirect(route('login'));
});

test('student can view organisasi list page with followed, pending, and joinable organizations', function () {
    // 1. Create a student user
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $nim = '555555555';
    DB::table('mahasiswa')->insert([
        'nim' => $nim,
        'username' => $user->username,
        'nama_lengkap' => 'Budi Sudarsono',
        'program_studi' => 'Sistem Komputer',
        'nomor_telepon' => '081234567899',
    ]);

    // 2. Create organizations
    $id_followed = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Followed',
        'status_aktif' => true,
    ]);
    DB::table('anggota_organisasi')->insert([
        'id_organisasi' => $id_followed,
        'nim' => $nim,
        'status_keanggotaan' => 'Aktif',
    ]);

    $id_applied = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Applied',
        'status_aktif' => true,
    ]);
    DB::table('anggota_organisasi')->insert([
        'id_organisasi' => $id_applied,
        'nim' => $nim,
        'status_keanggotaan' => 'Diproses',
    ]);

    $id_joinable = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Joinable',
        'status_aktif' => true,
    ]);

    $response = $this->actingAs($user)->get('/organisasi');

    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('organisasi/index')
        ->has('followed', 1)
        ->has('applied', 1)
        ->has('joinable', 1)
        ->where('followed.0.id', $id_followed)
        ->where('applied.0.id', $id_applied)
        ->where('joinable.0.id', $id_joinable)
    );
});

test('student can view organization profile in read-only mode', function () {
    // 1. Create student
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $nim = '555555555';
    DB::table('mahasiswa')->insert([
        'nim' => $nim,
        'username' => $user->username,
        'nama_lengkap' => 'Budi Sudarsono',
        'program_studi' => 'Sistem Komputer',
        'nomor_telepon' => '081234567899',
    ]);

    // 2. Create organization and profile
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Coder',
        'status_aktif' => true,
    ]);
    DB::table('profil_organisasi')->insert([
        'id_organisasi' => $id_organisasi,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'UKM untuk coding.',
        'visi_organisasi' => 'Visi coding.',
        'misi_organisasi' => 'Misi coding.',
        'status_aktif' => true,
    ]);

    $response = $this->actingAs($user)->get("/organisasi/{$id_organisasi}/detail");

    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('organisasi/detail')
        ->where('organisasi.id_organisasi', $id_organisasi)
        ->where('isReadOnly', true)
        ->where('statusKeanggotaan', null)
    );
});

test('student can apply to join an organization', function () {
    // 1. Create student
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $nim = '555555555';
    DB::table('mahasiswa')->insert([
        'nim' => $nim,
        'username' => $user->username,
        'nama_lengkap' => 'Budi Sudarsono',
        'program_studi' => 'Sistem Komputer',
        'nomor_telepon' => '081234567899',
    ]);

    // 2. Create organization
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Coder',
        'status_aktif' => true,
    ]);

    $file = UploadedFile::fake()->create('ktm.jpg', 500, 'image/jpeg');

    $response = $this->actingAs($user)->post('/organisasi/daftar', [
        'id_organisasi' => $id_organisasi,
        'foto_ktm' => $file,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('anggota_organisasi', [
        'id_organisasi' => $id_organisasi,
        'nim' => $nim,
        'status_keanggotaan' => 'Diproses',
    ]);
});

test('guest cannot access public pengurus list page', function () {
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Coder',
        'status_aktif' => true,
    ]);

    $response = $this->get("/organisasi/{$id_organisasi}/pengurus");
    $response->assertRedirect(route('login'));
});

test('student can view public pengurus list page', function () {
    // 1. Create student
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $nim = '555555555';
    DB::table('mahasiswa')->insert([
        'nim' => $nim,
        'username' => $user->username,
        'nama_lengkap' => 'Budi Sudarsono',
        'program_studi' => 'Sistem Komputer',
        'nomor_telepon' => '081234567899',
    ]);

    // 2. Create organization and profile
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Coder',
        'status_aktif' => true,
    ]);
    $id_profil = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'UKM untuk coding.',
        'visi_organisasi' => 'Visi coding.',
        'misi_organisasi' => 'Misi coding.',
        'status_aktif' => true,
    ]);

    // 3. Create active pengurus
    $id_keanggotaan = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => $nim,
        'status_keanggotaan' => 'Aktif',
    ]);
    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil,
        'id_keanggotaan' => $id_keanggotaan,
        'jabatan' => 'Ketua',
        'status_aktif' => true,
    ]);

    $response = $this->actingAs($user)->get("/organisasi/{$id_organisasi}/pengurus");

    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('organisasi/pengurus')
        ->where('organisasi.id_organisasi', $id_organisasi)
        ->has('pengurusList', 1)
        ->where('pengurusList.0.jabatan', 'Ketua')
    );
});

test('guest cannot access public kegiatan list page', function () {
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Coder',
        'status_aktif' => true,
    ]);

    $response = $this->get("/organisasi/{$id_organisasi}/kegiatan");
    $response->assertRedirect(route('login'));
});

test('student can view public kegiatan list page', function () {
    // 1. Create student
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $nim = '555555555';
    DB::table('mahasiswa')->insert([
        'nim' => $nim,
        'username' => $user->username,
        'nama_lengkap' => 'Budi Sudarsono',
        'program_studi' => 'Sistem Komputer',
        'nomor_telepon' => '081234567899',
    ]);

    // 2. Create organization and profile
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Coder',
        'status_aktif' => true,
    ]);
    $id_profil = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'UKM untuk coding.',
        'visi_organisasi' => 'Visi coding.',
        'misi_organisasi' => 'Misi coding.',
        'status_aktif' => true,
    ]);

    // 3. Create a kegiatan
    DB::table('kegiatan')->insert([
        'id_profil' => $id_profil,
        'nama_kegiatan' => 'Workshop React',
        'jenis_kegiatan' => 'Pelatihan',
        'deskripsi_kegiatan' => 'Belajar React JS dasar.',
        'biaya_pendaftaran' => 0.00,
        'tanggal_pelaksanaan' => '2026-07-10',
        'lokasi_kegiatan' => 'Lab 3',
        'kuota_peserta' => 50,
        'status_kegiatan' => 'Mendatang',
    ]);

    $response = $this->actingAs($user)->get("/organisasi/{$id_organisasi}/kegiatan");

    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('organisasi/kegiatan')
        ->where('organisasi.id_organisasi', $id_organisasi)
        ->has('kegiatanList', 1)
        ->where('kegiatanList.0.nama_kegiatan', 'Workshop React')
    );
});

test('guest cannot access public keuangan list page', function () {
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Coder',
        'status_aktif' => true,
    ]);

    $response = $this->get("/organisasi/{$id_organisasi}/keuangan");
    $response->assertRedirect(route('login'));
});

test('student can view public keuangan list page', function () {
    // 1. Create student
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $nim = '555555555';
    DB::table('mahasiswa')->insert([
        'nim' => $nim,
        'username' => $user->username,
        'nama_lengkap' => 'Budi Sudarsono',
        'program_studi' => 'Sistem Komputer',
        'nomor_telepon' => '081234567899',
    ]);

    // 2. Create organization and profile
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'UKM Coder',
        'status_aktif' => true,
    ]);
    $id_profil = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'UKM untuk coding.',
        'visi_organisasi' => 'Visi coding.',
        'misi_organisasi' => 'Misi coding.',
        'status_aktif' => true,
    ]);

    // 3. Create a kegiatan
    $id_kegiatan = DB::table('kegiatan')->insertGetId([
        'id_profil' => $id_profil,
        'nama_kegiatan' => 'Workshop React',
        'jenis_kegiatan' => 'Pelatihan',
        'deskripsi_kegiatan' => 'Belajar React JS dasar.',
        'biaya_pendaftaran' => 0.00,
        'tanggal_pelaksanaan' => '2026-07-10',
        'lokasi_kegiatan' => 'Lab 3',
        'kuota_peserta' => 50,
        'status_kegiatan' => 'Mendatang',
    ]);

    // 4. Create financial transaction
    DB::table('transaksi_keuangan')->insert([
        'id_kegiatan' => $id_kegiatan,
        'jenis_transaksi' => 'Pemasukan',
        'nominal_transaksi' => 500000.00,
        'tanggal_transaksi' => '2026-06-08',
        'sumber_tujuan_transaksi' => 'Uang Kas Himpunan',
        'foto_bukti_transaksi' => 'receipt.png',
    ]);

    $response = $this->actingAs($user)->get("/organisasi/{$id_organisasi}/keuangan");

    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('organisasi/keuangan')
        ->where('organisasi.id_organisasi', $id_organisasi)
        ->has('transaksiList', 1)
        ->where('transaksiList.0.jenis_transaksi', 'Pemasukan')
    );
});
