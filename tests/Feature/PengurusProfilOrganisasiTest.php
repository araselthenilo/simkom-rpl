<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('guest cannot access pengurus profil page', function () {
    $response = $this->get('/pengurus/profil');
    $response->assertRedirect(route('login'));
});

test('non-pengurus student cannot access pengurus profil page', function () {
    $user = User::factory()->create(['role' => 'Mahasiswa']);

    $response = $this->actingAs($user)->get('/pengurus/profil');
    $response->assertStatus(403);
});

test('active pengurus can view their organization profil', function () {
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

    $response = $this->actingAs($user)->get('/pengurus/profil');
    $response->assertStatus(200);

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('pengurus/profil/show')
        ->where('profil.periode_kepengurusan', '2025/2026')
        ->where('profil.deskripsi_organisasi', 'Deskripsi Organisasi')
        ->where('organisasi.nama_organisasi', 'Himpunan Mahasiswa')
    );
});

test('active pengurus can submit change proposal', function () {
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

    $id_pengurus = DB::table('pengurus_organisasi')->insertGetId([
        'id_profil' => $id_profil,
        'id_keanggotaan' => $id_keanggotaanPengurus,
        'jabatan' => 'Ketua',
        'status_aktif' => true,
    ]);

    $response = $this->actingAs($user)->post('/pengurus/profil/propose', [
        'deskripsi_organisasi' => 'Deskripsi Baru',
        'visi_organisasi' => 'Visi Baru',
        'misi_organisasi' => 'Misi Baru',
    ]);

    $response->assertRedirect(route('pengurus.profil'));

    $this->assertDatabaseHas('pengajuan_profil_organisasi', [
        'id_pengurus' => $id_pengurus,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo.png', // Reused since none uploaded
        'deskripsi_organisasi' => 'Deskripsi Baru',
        'visi_organisasi' => 'Visi Baru',
        'misi_organisasi' => 'Misi Baru',
        'status_pengajuan' => 'Diproses',
    ]);
});
