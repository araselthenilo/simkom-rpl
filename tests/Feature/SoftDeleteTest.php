<?php

use App\Models\Organisasi;
use App\Models\PembinaOrganisasi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('organisasi can be soft deleted', function () {
    // 1. Create an organisasi
    $organisasi = Organisasi::create([
        'nama_organisasi' => 'Test UKM Soft Delete',
        'status_aktif' => true,
    ]);

    expect($organisasi->deleted_at)->toBeNull();

    // 2. Delete the organisasi (soft delete)
    $organisasi->delete();

    // 3. Verify it is marked as deleted in database
    expect($organisasi->fresh()->deleted_at)->not->toBeNull();

    // 4. Verify it is not retrieved by default query
    $exists = Organisasi::where('id_organisasi', $organisasi->id_organisasi)->exists();
    expect($exists)->toBeFalse();

    // 5. Verify it is retrieved when using withTrashed()
    $existsWithTrashed = Organisasi::withTrashed()->where('id_organisasi', $organisasi->id_organisasi)->exists();
    expect($existsWithTrashed)->toBeTrue();
});

test('pembina organisasi can be soft deleted', function () {
    // 1. Create a parent user with matching role for foreign key constraint
    $user = User::create([
        'username' => 'testpembina_sd',
        'email' => 'pembinasd@example.com',
        'password' => bcrypt('password'),
        'role' => 'Pembina Organisasi',
    ]);

    // 2. Create pembina organisasi
    $pembina = PembinaOrganisasi::create([
        'nip_pembina' => '123456789012345678',
        'username' => 'testpembina_sd',
        'nama_lengkap' => 'Test Pembina Soft Delete',
        'nomor_telepon' => '081234567890',
    ]);

    expect($pembina->deleted_at)->toBeNull();

    // 3. Delete pembina organisasi (soft delete)
    $pembina->delete();

    // 4. Verify it is marked as deleted in database
    expect($pembina->fresh()->deleted_at)->not->toBeNull();

    // 5. Verify it is not retrieved by default query
    $exists = PembinaOrganisasi::where('nip_pembina', $pembina->nip_pembina)->exists();
    expect($exists)->toBeFalse();

    // 6. Verify it is retrieved when using withTrashed()
    $existsWithTrashed = PembinaOrganisasi::withTrashed()->where('nip_pembina', $pembina->nip_pembina)->exists();
    expect($existsWithTrashed)->toBeTrue();
});
