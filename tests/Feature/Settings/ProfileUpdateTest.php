<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

function createStudentUser(): User
{
    $user = User::factory()->create(['role' => 'Mahasiswa']);

    DB::table('mahasiswa')->insert([
        'username' => $user->username,
        'nim' => fake()->unique()->numerify('#########'),
        'nama_lengkap' => 'Original Name',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '08123456789',
    ]);

    return $user;
}

test('profile page is displayed', function () {
    $user = createStudentUser();

    $response = $this
        ->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = createStudentUser();

    $response = $this
        ->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'Test User',
            'nomor_telepon' => '08987654321',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->nomor_telepon)->toBe('08987654321');
});

test('user can delete their account', function () {
    $user = createStudentUser();

    $response = $this
        ->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = createStudentUser();

    $response = $this
        ->actingAs($user)
        ->from(route('profile.edit'))
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
