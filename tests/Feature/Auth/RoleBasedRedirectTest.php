<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

test('guest accessing home is redirected to login', function () {
    $response = $this->get('/home');

    $response->assertRedirect(route('login'));
});

test('guest accessing admin dashboard is redirected to login', function () {
    $response = $this->get('/admin/dashboard');

    $response->assertRedirect(route('login'));
});

test('mahasiswa login redirects to home', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);

    $response = $this->post(route('login.store'), [
        'username' => $user->username,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home'));
});

test('admin kemahasiswaan login redirects to admin dashboard', function () {
    $user = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);

    $response = $this->post(route('login.store'), [
        'username' => $user->username,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('admin.dashboard'));
});

test('mahasiswa cannot access admin dashboard directly', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertStatus(403);
});

test('admin kemahasiswaan cannot access home directly', function () {
    $user = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);

    $response = $this->actingAs($user)->get(route('home'));

    $response->assertStatus(403);
});

test('admin dashboard returns correct active counts as inertia props', function () {
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);

    // Insert Organisasi
    DB::table('organisasi')->insert([
        ['nama_organisasi' => 'UKM A', 'status_aktif' => true],
        ['nama_organisasi' => 'UKM B', 'status_aktif' => false],
        ['nama_organisasi' => 'UKM C', 'status_aktif' => true],
    ]);

    // Insert Mahasiswa
    $userMhs1 = User::factory()->create(['role' => 'Mahasiswa']);
    $userMhs2 = User::factory()->create(['role' => 'Mahasiswa']);

    DB::table('mahasiswa')->insert([
        [
            'nim' => '111111111',
            'username' => $userMhs1->username,
            'nama_lengkap' => 'Student One',
            'program_studi' => 'Sistem Informasi',
            'nomor_telepon' => '081234567890',
        ],
        [
            'nim' => '222222222',
            'username' => $userMhs2->username,
            'nama_lengkap' => 'Student Two',
            'program_studi' => 'Teknologi Informasi',
            'nomor_telepon' => '081234567891',
        ],
    ]);

    $id_organisasi = DB::table('organisasi')->where('nama_organisasi', 'UKM A')->value('id_organisasi');

    // Insert AnggotaOrganisasi
    DB::table('anggota_organisasi')->insert([
        [
            'id_organisasi' => $id_organisasi,
            'nim' => '111111111',
            'tanggal_bergabung' => '2025-06-01',
            'status_keanggotaan' => 'Aktif',
        ],
        [
            'id_organisasi' => $id_organisasi,
            'nim' => '222222222',
            'tanggal_bergabung' => '2025-06-01',
            'status_keanggotaan' => 'Diproses',
        ],
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertStatus(200);

    // Assert Inertia props
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('admin/dashboard')
        ->where('totalOrganisasiAktif', 2)
        ->where('totalMahasiswaAktif', 2)
        ->where('totalAnggotaAktif', 1)
    );
});

test('mahasiswa home page returns correct organizations props based on active staff and active organization status', function () {
    // 1. Create a Mahasiswa user
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    $nim = '999999999';
    DB::table('mahasiswa')->insert([
        'nim' => $nim,
        'username' => $user->username,
        'nama_lengkap' => 'Active Student',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '081234567899',
    ]);

    // 2. Create Organizations
    $id_ukmA = DB::table('organisasi')->insertGetId(['nama_organisasi' => 'UKM A', 'status_aktif' => true]);
    $id_ukmB = DB::table('organisasi')->insertGetId(['nama_organisasi' => 'UKM B', 'status_aktif' => true]);
    $id_ukmC = DB::table('organisasi')->insertGetId(['nama_organisasi' => 'UKM C', 'status_aktif' => false]);
    $id_ukmD = DB::table('organisasi')->insertGetId(['nama_organisasi' => 'UKM D', 'status_aktif' => true]);

    $id_profilA = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_ukmA, 'periode_kepengurusan' => '2026/2027', 'logo_organisasi' => 'a.png',
        'deskripsi_organisasi' => 'Desc A', 'visi_organisasi' => 'V', 'misi_organisasi' => 'M', 'status_aktif' => true,
    ]);
    $id_profilC = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_ukmC, 'periode_kepengurusan' => '2026/2027', 'logo_organisasi' => 'c.png',
        'deskripsi_organisasi' => 'Desc C', 'visi_organisasi' => 'V', 'misi_organisasi' => 'M', 'status_aktif' => false,
    ]);
    $id_profilD = DB::table('profil_organisasi')->insertGetId([
        'id_organisasi' => $id_ukmD, 'periode_kepengurusan' => '2026/2027', 'logo_organisasi' => 'd.png',
        'deskripsi_organisasi' => 'Desc D', 'visi_organisasi' => 'V', 'misi_organisasi' => 'M', 'status_aktif' => true,
    ]);

    // memberships
    $id_keanggotaanA = DB::table('anggota_organisasi')->insertGetId(['id_organisasi' => $id_ukmA, 'nim' => $nim, 'status_keanggotaan' => 'Aktif']);
    $id_keanggotaanB = DB::table('anggota_organisasi')->insertGetId(['id_organisasi' => $id_ukmB, 'nim' => $nim, 'status_keanggotaan' => 'Aktif']);
    $id_keanggotaanC = DB::table('anggota_organisasi')->insertGetId(['id_organisasi' => $id_ukmC, 'nim' => $nim, 'status_keanggotaan' => 'Aktif']);
    $id_keanggotaanD = DB::table('anggota_organisasi')->insertGetId(['id_organisasi' => $id_ukmD, 'nim' => $nim, 'status_keanggotaan' => 'Aktif']);

    // staff records
    DB::table('pengurus_organisasi')->insert([
        ['id_profil' => $id_profilA, 'id_keanggotaan' => $id_keanggotaanA, 'jabatan' => 'Ketua', 'status_aktif' => true],
        ['id_profil' => $id_profilC, 'id_keanggotaan' => $id_keanggotaanC, 'jabatan' => 'Sekretaris', 'status_aktif' => true],
        ['id_profil' => $id_profilD, 'id_keanggotaan' => $id_keanggotaanD, 'jabatan' => 'Bendahara', 'status_aktif' => false],
    ]);

    // 3. Get /home and assert Inertia props
    $response = $this->actingAs($user)->get(route('home'));
    $response->assertStatus(200);

    $response->assertInertia(function (AssertableInertia $page) {
        $page->component('home')
            ->has('organizations', 3)
            ->where('organizations.0.name', 'UKM A')
            ->where('organizations.0.type', 'staff')
            ->where('organizations.0.role', 'Ketua')
            ->where('organizations.1.name', 'UKM B')
            ->where('organizations.1.type', 'member')
            ->where('organizations.2.name', 'UKM D')
            ->where('organizations.2.type', 'member');
    });
});
