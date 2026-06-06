<?php

use App\Models\Organisasi;
use App\Models\PembinaOrganisasi;
use App\Models\ProfilOrganisasi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

test('guests are redirected to login when visiting admin edit profile', function () {
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $profil = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
        'status_aktif' => true,
    ]);

    $response = $this->get(route('admin.profil-organisasi.edit', $profil));
    $response->assertRedirect(route('login'));
});

test('non-admins cannot edit or update organization profile', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $profil = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
        'status_aktif' => true,
    ]);

    $this->actingAs($user);
    $response = $this->get(route('admin.profil-organisasi.edit', $profil));
    $response->assertForbidden();

    $response2 = $this->put(route('admin.profil-organisasi.update', $profil), [
        'periode_kepengurusan' => '2026/2027',
        'deskripsi_organisasi' => 'Updated deskripsi',
        'visi_organisasi' => 'Updated visi',
        'misi_organisasi' => 'Updated misi',
        'status_aktif' => true,
    ]);
    $response2->assertForbidden();
});

test('admin can view edit organization profile page', function () {
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $profil = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
        'status_aktif' => true,
    ]);

    $this->actingAs($admin);
    $response = $this->get(route('admin.profil-organisasi.edit', $profil));
    $response->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('admin/edit-profil-organisasi')
        ->has('profilOrganisasi')
        ->where('profilOrganisasi.id_profil', $profil->id_profil)
        ->where('profilOrganisasi.organisasi.nama_organisasi', 'Test UKM')
    );
});

test('admin can update organization profile successfully', function () {
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $profil = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
        'status_aktif' => true,
    ]);

    $this->actingAs($admin);
    $response = $this->put(route('admin.profil-organisasi.update', $profil), [
        'periode_kepengurusan' => '2027/2028',
        'deskripsi_organisasi' => 'Updated deskripsi',
        'visi_organisasi' => 'Updated visi',
        'misi_organisasi' => 'Updated misi',
        'status_aktif' => false,
    ]);

    $response->assertRedirect(route('admin.organisasi.profil', $organisasi));

    $profil->refresh();
    expect($profil->periode_kepengurusan)->toBe('2027/2028');
    expect($profil->deskripsi_organisasi)->toBe('Updated deskripsi');
    expect($profil->visi_organisasi)->toBe('Updated visi');
    expect($profil->misi_organisasi)->toBe('Updated misi');
    expect($profil->status_aktif)->toBeFalsy();
});

test('guests are redirected to login when visiting admin create profile page', function () {
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $response = $this->get(route('admin.profil-organisasi.create', $organisasi));
    $response->assertRedirect(route('login'));
});

test('non-admins cannot visit admin create profile page', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $this->actingAs($user);
    $response = $this->get(route('admin.profil-organisasi.create', $organisasi));
    $response->assertForbidden();
});

test('admin can view create organization profile page', function () {
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $this->actingAs($admin);
    $response = $this->get(route('admin.profil-organisasi.create', $organisasi));
    $response->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('admin/tambah-profil-organisasi')
        ->has('organisasi')
        ->where('organisasi.id_organisasi', $organisasi->id_organisasi)
        ->where('organisasi.nama_organisasi', 'Test UKM')
    );
});

test('admin can store organization profile successfully', function () {
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $this->actingAs($admin);

    Storage::fake('public');
    $file = UploadedFile::fake()->create('logo.png', 100, 'image/png');

    $response = $this->post(route('admin.profil-organisasi.store', $organisasi), [
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => $file,
        'deskripsi_organisasi' => 'Deskripsi ukm musik',
        'visi_organisasi' => 'Visi ukm musik',
        'misi_organisasi' => 'Misi ukm musik',
        'status_aktif' => true,
    ]);

    $response->assertRedirect(route('admin.organisasi.profil', $organisasi));

    $this->assertDatabaseHas('profil_organisasi', [
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'deskripsi_organisasi' => 'Deskripsi ukm musik',
        'visi_organisasi' => 'Visi ukm musik',
        'misi_organisasi' => 'Misi ukm musik',
        'status_aktif' => true,
    ]);

    $profil = ProfilOrganisasi::where('id_organisasi', $organisasi->id_organisasi)->first();
    Storage::disk('public')->assertExists($profil->logo_organisasi);
});

test('admin cannot store organization profile with duplicate period', function () {
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
        'status_aktif' => true,
    ]);

    $this->actingAs($admin);

    Storage::fake('public');
    $file = UploadedFile::fake()->create('logo.png', 100, 'image/png');

    $response = $this->post(route('admin.profil-organisasi.store', $organisasi), [
        'periode_kepengurusan' => '2026/2027', // duplicate
        'logo_organisasi' => $file,
        'deskripsi_organisasi' => 'Deskripsi ukm musik',
        'visi_organisasi' => 'Visi ukm musik',
        'misi_organisasi' => 'Misi ukm musik',
        'status_aktif' => true,
    ]);

    $response->assertSessionHasErrors('periode_kepengurusan');
});

test('guests are redirected to login when visiting admin view pengurus', function () {
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $profil = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
        'status_aktif' => true,
    ]);

    $response = $this->get(route('admin.profil-organisasi.pengurus', $profil));
    $response->assertRedirect(route('login'));
});

test('non-admins cannot view admin view pengurus', function () {
    $user = User::factory()->create([
        'role' => 'Mahasiswa',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $profil = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
        'status_aktif' => true,
    ]);

    $this->actingAs($user);
    $response = $this->get(route('admin.profil-organisasi.pengurus', $profil));
    $response->assertForbidden();
});

test('admin can visit admin view pengurus and see the list of officers', function () {
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    $profil = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi',
        'visi_organisasi' => 'Visi',
        'misi_organisasi' => 'Misi',
        'status_aktif' => true,
    ]);

    // Create student user first to satisfy foreign key constraint
    User::create([
        'username' => 'test_mahasiswa_officer',
        'email' => 'mahasiswa_officer@test.com',
        'password' => bcrypt('password'),
        'role' => 'Mahasiswa',
    ]);

    // Insert student, member, and officer
    DB::table('mahasiswa')->insert([
        'nim' => '220010999',
        'username' => 'test_mahasiswa_officer',
        'nama_lengkap' => 'Budi Officer',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '0899999999',
        'role' => 'Mahasiswa',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $idKeanggotaan = DB::table('anggota_organisasi')->insertGetId([
        'id_organisasi' => $organisasi->id_organisasi,
        'nim' => '220010999',
        'tanggal_bergabung' => '2026-06-01',
        'status_keanggotaan' => 'Aktif',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::table('pengurus_organisasi')->insert([
        'id_profil' => $profil->id_profil,
        'id_keanggotaan' => $idKeanggotaan,
        'jabatan' => 'Ketua',
        'status_aktif' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->actingAs($admin);
    $response = $this->get(route('admin.profil-organisasi.pengurus', $profil));
    $response->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('admin/pengurus-periode')
        ->has('profilOrganisasi')
        ->where('profilOrganisasi.id_profil', $profil->id_profil)
        ->where('profilOrganisasi.pengurus_organisasi.0.jabatan', 'Ketua')
        ->where('profilOrganisasi.pengurus_organisasi.0.anggota_organisasi.mahasiswa.nama_lengkap', 'Budi Officer')
    );
});
