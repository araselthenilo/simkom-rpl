<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

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
