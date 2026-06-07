<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

DB::listen(function($query) {
    echo "SQL: " . $query->sql . " | Bindings: " . json_encode($query->bindings) . "\n";
});

DB::transaction(function() {
    $user = User::factory()->create(['role' => 'Mahasiswa']);
    DB::table('mahasiswa')->insert([
        'username' => $user->username,
        'nim' => fake()->unique()->numerify('#########'),
        'nama_lengkap' => 'Original Name',
        'program_studi' => 'Sistem Informasi',
        'nomor_telepon' => '08123456789',
    ]);

    // Retrieve fresh instance
    $user = User::find($user->username);

    echo "Initial name: " . ($user->name ?? 'NULL') . "\n";

    $user->name = 'Test User';

    // Save user
    $user->save();

    echo "Refreshing user...\n";
    $user->refresh();
    
    echo "Accessing name after refresh...\n";
    echo "Role is: " . $user->role . "\n";
    echo "Username is: " . $user->username . "\n";
    echo "Relation loaded?: " . ($user->relationLoaded('profilPengguna') ? 'Yes' : 'No') . "\n";
    
    $profil = $user->profilPengguna;
    echo "Profil is null?: " . (is_null($profil) ? 'Yes' : 'No') . "\n";
    if ($profil) {
        echo "Profil class: " . get_class($profil) . "\n";
        echo "Profil nama_lengkap: " . $profil->nama_lengkap . "\n";
    }
    
    echo "After refresh, database name: " . ($user->name ?? 'NULL') . "\n";
});
