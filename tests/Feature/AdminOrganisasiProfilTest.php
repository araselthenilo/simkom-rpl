<?php

use App\Models\Organisasi;
use App\Models\ProfilOrganisasi;
use App\Models\PembinaOrganisasi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

test('guests are redirected to login when visiting admin organisasi profil', function () {
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $response = $this->get(route('admin.organisasi.profil', $organisasi));
    $response->assertRedirect(route('login'));
});

test('non-admins cannot visit admin organisasi profil', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $this->actingAs($user);
    $response = $this->get(route('admin.organisasi.profil', $organisasi));
    $response->assertForbidden();
});

test('admin can visit admin organisasi profil and view historical profiles with mapped pembinas', function () {
    // 1. Create admin user
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);

    // 2. Create organization
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM Musik',
        'status_aktif' => true,
    ]);

    // 3. Create pembina user and pembina_organisasi profile
    $pembinaUser = User::create([
        'username' => 'test_pembina',
        'email' => 'pembina@test.com',
        'password' => bcrypt('password'),
        'role' => 'Pembina Organisasi',
    ]);
    $pembina = PembinaOrganisasi::create([
        'nip_pembina' => '123456789012345678',
        'username' => 'test_pembina',
        'nama_lengkap' => 'Pak Pembina',
        'nomor_telepon' => '0812345678',
    ]);

    // 4. Create historical profiles (2 periods)
    $profil1 = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2025/2026',
        'logo_organisasi' => 'logo1.png',
        'deskripsi_organisasi' => 'Deskripsi lama',
        'visi_organisasi' => 'Visi lama',
        'misi_organisasi' => 'Misi lama',
        'status_aktif' => false,
    ]);

    $profil2 = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo2.png',
        'deskripsi_organisasi' => 'Deskripsi baru',
        'visi_organisasi' => 'Visi baru',
        'misi_organisasi' => 'Misi baru',
        'status_aktif' => true,
    ]);

    // 5. Assign pembina to organization for the 2026/2027 period
    DB::table('pembinaan')->insert([
        'nip_pembina' => $pembina->nip_pembina,
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_pembinaan' => '2026/2027',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // 6. Request page as admin
    $this->actingAs($admin);
    $response = $this->get(route('admin.organisasi.profil', $organisasi));
    $response->assertOk();

    // 7. Verify Inertia data structure
    $response->assertInertia(fn ($page) => $page
        ->component('admin/riwayat-profil')
        ->has('organisasi')
        ->has('profils', 2)
        ->where('profils.0.periode_kepengurusan', '2026/2027')
        ->where('profils.0.pembina.0.nama_lengkap', 'Pak Pembina')
        ->where('profils.1.periode_kepengurusan', '2025/2026')
        ->where('profils.1.pembina', [])
    );
});
