<?php

use App\Models\ArsipLaporan;
use App\Models\Kegiatan;
use App\Models\Organisasi;
use App\Models\ProfilOrganisasi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('admin can generate and archive Kegiatan reports', function () {
    Storage::fake('local');

    // 1. Create admin user
    $admin = User::factory()->create([
        'role' => 'Admin Kemahasiswaan',
    ]);

    // 2. Create organization
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM',
        'status_aktif' => true,
    ]);

    // 3. Create profil organisasi
    $profil = ProfilOrganisasi::create([
        'id_organisasi' => $organisasi->id_organisasi,
        'periode_kepengurusan' => '2026/2027',
        'logo_organisasi' => 'logo.png',
        'deskripsi_organisasi' => 'Deskripsi ukm',
        'visi_organisasi' => 'Visi ukm',
        'misi_organisasi' => 'Misi ukm',
        'status_aktif' => true,
    ]);

    // 4. Create a Kegiatan
    $kegiatan = Kegiatan::create([
        'id_profil' => $profil->id_profil,
        'nama_kegiatan' => 'Seminar RPL',
        'jenis_kegiatan' => 'Seminar',
        'deskripsi_kegiatan' => 'Belajar Rekayasa Perangkat Lunak',
        'biaya_pendaftaran' => 0,
        'tanggal_pelaksanaan' => now()->addDays(5)->format('Y-m-d'),
        'lokasi_kegiatan' => 'Kampus A',
        'kuota_peserta' => 100,
        'status_kegiatan' => 'Mendatang',
    ]);

    // 5. Post generate report request as admin
    $response = $this->actingAs($admin)->post(route('admin.laporan.generate'), [
        'id_organisasi' => $organisasi->id_organisasi,
        'format' => 'pdf',
        'jenis_laporan' => 'Kegiatan',
        'status_kegiatan' => 'Semua',
        'jenis_kegiatan' => 'Semua',
    ]);

    // 6. Verify response redirect
    $response->assertRedirect(route('admin.laporan.index'));

    // 7. Verify report was archived in the database
    $this->assertDatabaseHas('arsip_laporan', [
        'id_organisasi' => $organisasi->id_organisasi,
        'jenis_laporan' => 'Kegiatan',
        'username_petugas' => $admin->username,
    ]);

    // 8. Verify report file exists in storage
    $arsip = ArsipLaporan::first();
    expect($arsip->file_laporan)->not->toBeNull();
    Storage::disk('local')->assertExists($arsip->file_laporan);
});
