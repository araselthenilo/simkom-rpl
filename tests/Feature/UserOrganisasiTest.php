<?php

use App\Models\User;
use App\Models\Organisasi;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

    $file = \Illuminate\Http\UploadedFile::fake()->create('ktm.jpg', 500, 'image/jpeg');

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
