<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('isActiveOrganizationStaff returns false if user is not Mahasiswa', function () {
    $user = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);

    expect($user->isActiveOrganizationStaff)->toBeFalse();
});

test('isActiveOrganizationStaff returns false if user is Mahasiswa but has no organization affiliation', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);

    DB::table('mahasiswa')->insert([
        'nim' => '123456789',
        'username' => $user->username,
        'nama_lengkap' => 'Test Student',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567890',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    expect($user->isActiveOrganizationStaff)->toBeFalse();
});

test('isActiveOrganizationStaff returns true if user is Mahasiswa and is active organization staff', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);

    DB::table('mahasiswa')->insert([
        'nim' => '123456789',
        'username' => $user->username,
        'nama_lengkap' => 'Test Student',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567890',
        'created_at' => now(),
        'updated_at' => now(),
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

    $id_keanggotaan = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => '123456789',
        'tanggal_bergabung' => '2025-06-01',
        'status_keanggotaan' => 'Aktif',
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil,
        'id_keanggotaan' => $id_keanggotaan,
        'jabatan' => 'Ketua',
        'status_aktif' => true,
    ]);

    // Refresh user to clear relationship cache
    $user = $user->fresh();

    expect($user->isActiveOrganizationStaff)->toBeTrue();
});

test('isActiveOrganizationStaff returns false if user is Mahasiswa but staff status is inactive', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);

    DB::table('mahasiswa')->insert([
        'nim' => '123456789',
        'username' => $user->username,
        'nama_lengkap' => 'Test Student',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567890',
        'created_at' => now(),
        'updated_at' => now(),
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

    $id_keanggotaan = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => '123456789',
        'tanggal_bergabung' => '2025-06-01',
        'status_keanggotaan' => 'Aktif',
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil,
        'id_keanggotaan' => $id_keanggotaan,
        'jabatan' => 'Ketua',
        'status_aktif' => false, // Inactive staff
    ]);

    $user = $user->fresh();

    expect($user->isActiveOrganizationStaff)->toBeFalse();
});

test('activeOrganizationEras returns correct eras of active organization kepengurusan', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);

    DB::table('mahasiswa')->insert([
        'nim' => '987654321',
        'username' => $user->username,
        'nama_lengkap' => 'Test Student 2',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567891',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'Himpunan Mahasiswa',
        'status_aktif' => true,
    ]);

    $id_profil1 = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'periode_kepengurusan' => '2024/2025',
        'logo_organisasi' => 'logo1.png',
        'deskripsi_organisasi' => 'Deskripsi 1',
        'visi_organisasi' => 'Visi 1',
        'misi_organisasi' => 'Misi 1',
        'status_aktif' => true,
    ]);

    $id_profil2 = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo2.png',
        'deskripsi_organisasi' => 'Deskripsi 2',
        'visi_organisasi' => 'Visi 2',
        'misi_organisasi' => 'Misi 2',
        'status_aktif' => true,
    ]);

    $id_keanggotaan = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi,
        'nim' => '987654321',
        'tanggal_bergabung' => '2024-06-01',
        'status_keanggotaan' => 'Aktif',
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil1,
        'id_keanggotaan' => $id_keanggotaan,
        'jabatan' => 'Staff',
        'status_aktif' => true,
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil2,
        'id_keanggotaan' => $id_keanggotaan,
        'jabatan' => 'Ketua',
        'status_aktif' => true,
    ]);

    $user = $user->fresh();

    expect($user->activeOrganizationEras)->toEqualCanonicalizing([
        [
            'periode_kepengurusan' => '2024/2025',
            'nama_organisasi' => 'Himpunan Mahasiswa',
            'jabatan' => 'Staff',
        ],
        [
            'periode_kepengurusan' => '2025/2026',
            'nama_organisasi' => 'Himpunan Mahasiswa',
            'jabatan' => 'Ketua',
        ],
    ]);
});
