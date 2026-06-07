<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('guest cannot access pengurus manajemen anggota', function () {
    $response = $this->get('/pengurus/anggota');
    $response->assertRedirect(route('login'));
});

test('non-pengurus student cannot access pengurus manajemen anggota', function () {
    $user = User::factory()->create(['role' => 'Mahasiswa']);

    $response = $this->actingAs($user)->get('/pengurus/anggota');
    $response->assertStatus(403);
});

test('active pengurus can view members of their organization excluding active staff', function () {
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
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
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

    // 2. Create another active staff member (should be excluded)
    $userStaff = User::factory()->create(['role' => 'Mahasiswa']);
    $nimStaff = '222222222';
    DB::table('mahasiswa')->insert([
        'nim' => $nimStaff,
        'username' => $userStaff->username,
        'nama_lengkap' => 'Staff Himpunan',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567891',
    ]);

    $id_keanggotaanStaff = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => $nimStaff,
        'tanggal_bergabung' => '2025-06-01',
        'status_keanggotaan' => 'Aktif',
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil,
        'id_keanggotaan' => $id_keanggotaanStaff,
        'jabatan' => 'Sekretaris',
        'status_aktif' => true,
    ]);

    // 3. Create regular members (should be included)
    $userMhs1 = User::factory()->create(['role' => 'Mahasiswa']);
    $nimMhs1 = '333333333';
    DB::table('mahasiswa')->insert([
        'nim' => $nimMhs1,
        'username' => $userMhs1->username,
        'nama_lengkap' => 'Regular Member 1',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567892',
    ]);

    $id_keanggotaanMhs1 = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => $nimMhs1,
        'status_keanggotaan' => 'Diproses',
    ]);

    $userMhs2 = User::factory()->create(['role' => 'Mahasiswa']);
    $nimMhs2 = '444444444';
    DB::table('mahasiswa')->insert([
        'nim' => $nimMhs2,
        'username' => $userMhs2->username,
        'nama_lengkap' => 'Regular Member 2',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567893',
    ]);

    $id_keanggotaanMhs2 = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => $nimMhs2,
        'status_keanggotaan' => 'Aktif',
    ]);

    $response = $this->actingAs($user)->get('/pengurus/anggota');
    $response->assertStatus(200);

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('pengurus/manajemen-anggota')
        ->has('members', 2)
        ->where('members.0.nim', $nimMhs1)
        ->where('members.1.nim', $nimMhs2)
        ->where('stats.total', 2)
        ->where('stats.pending', 1)
        ->where('stats.active', 1)
        ->where('stats.rejected', 0)
    );
});

test('active pengurus can update member status', function () {
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
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
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

    // 2. Create regular member
    $userMhs = User::factory()->create(['role' => 'Mahasiswa']);
    $nimMhs = '333333333';
    DB::table('mahasiswa')->insert([
        'nim' => $nimMhs,
        'username' => $userMhs->username,
        'nama_lengkap' => 'Regular Member',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567892',
    ]);

    $id_keanggotaan = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => $nimMhs,
        'status_keanggotaan' => 'Diproses',
    ]);

    // Accept member
    $response = $this->actingAs($user)->patch("/pengurus/anggota/{$id_keanggotaan}", [
        'status_keanggotaan' => 'Aktif',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('anggota_organisasi', [
        'id_keanggotaan' => $id_keanggotaan,
        'status_keanggotaan' => 'Aktif',
    ]);

    // Reject member
    $response = $this->actingAs($user)->patch("/pengurus/anggota/{$id_keanggotaan}", [
        'status_keanggotaan' => 'Ditolak',
        'alasan_penolakan' => 'Dokumen tidak valid.',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('anggota_organisasi', [
        'id_keanggotaan' => $id_keanggotaan,
        'status_keanggotaan' => 'Ditolak',
        'alasan_penolakan' => 'Dokumen tidak valid.',
    ]);
});
