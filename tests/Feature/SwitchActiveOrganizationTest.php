<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('guest cannot switch active organization', function () {
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'Test Org',
        'status_aktif' => true,
    ]);
    $response = $this->get("/pengurus/switch-organisasi/{$id_organisasi}");
    $response->assertRedirect(route('login'));
});

test('non-pengurus student cannot switch active organization', function () {
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $id_organisasi = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'Test Org',
        'status_aktif' => true,
    ]);

    $response = $this->actingAs($user)->get("/pengurus/switch-organisasi/{$id_organisasi}");
    $response->assertStatus(403);
});

test('active pengurus can switch active organization', function () {
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

    $id_organisasi1 = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'Himpunan Mahasiswa 1',
        'status_aktif' => true,
    ]);

    $id_profil1 = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi1,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo1.png',
        'deskripsi_organisasi' => 'Deskripsi 1',
        'visi_organisasi' => 'Visi 1',
        'misi_organisasi' => 'Misi 1',
        'status_aktif' => true,
    ]);

    $id_keanggotaanPengurus1 = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi1,
        'nim' => $nimPengurus,
        'tanggal_bergabung' => '2025-06-01',
        'status_keanggotaan' => 'Aktif',
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil1,
        'id_keanggotaan' => $id_keanggotaanPengurus1,
        'jabatan' => 'Ketua',
        'status_aktif' => true,
    ]);

    $id_organisasi2 = DB::table('organisasi')->insertGetId([
        'nama_organisasi' => 'Himpunan Mahasiswa 2',
        'status_aktif' => true,
    ]);

    $id_profil2 = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi2,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo2.png',
        'deskripsi_organisasi' => 'Deskripsi 2',
        'visi_organisasi' => 'Visi 2',
        'misi_organisasi' => 'Misi 2',
        'status_aktif' => true,
    ]);

    $id_keanggotaanPengurus2 = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $id_organisasi2,
        'nim' => $nimPengurus,
        'tanggal_bergabung' => '2025-06-01',
        'status_keanggotaan' => 'Aktif',
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $id_profil2,
        'id_keanggotaan' => $id_keanggotaanPengurus2,
        'jabatan' => 'Sekretaris',
        'status_aktif' => true,
    ]);

    // Test initial shared props loads the first organization
    $response = $this->actingAs($user)->get('/pengurus/anggota');
    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('active_organization.id_organisasi', $id_organisasi1)
        ->has('staff_organizations', 2)
    );

    // Switch active organization from home page -> should redirect to /pengurus
    $response = $this->actingAs($user)
        ->from('/home')
        ->get("/pengurus/switch-organisasi/{$id_organisasi2}");

    $response->assertRedirect(route('pengurus'));
    $this->assertEquals($id_organisasi2, session('active_organization_id'));

    // Switch active organization from organisasi page -> should redirect to /pengurus
    $response = $this->actingAs($user)
        ->from('/organisasi')
        ->get("/pengurus/switch-organisasi/{$id_organisasi1}");

    $response->assertRedirect(route('pengurus'));
    $this->assertEquals($id_organisasi1, session('active_organization_id'));

    // Switch active organization from pengurus subpage -> should redirect back to the page
    $response = $this->actingAs($user)
        ->from('/pengurus/anggota')
        ->get("/pengurus/switch-organisasi/{$id_organisasi2}");

    $response->assertRedirect('/pengurus/anggota');
    $this->assertEquals($id_organisasi2, session('active_organization_id'));

    // Check shared props after switch
    $response = $this->actingAs($user)->get('/pengurus/anggota');
    $response->assertStatus(200);
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('active_organization.id_organisasi', $id_organisasi2)
    );
});
