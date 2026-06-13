<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'testuser',
            'email' => 'test@example.com',
        ]);

        // Create Admin Kemahasiswaan user
        User::factory()->create([
            'username' => 'userAdmin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('passwordAdmin'),
            'role' => 'Admin Kemahasiswaan',
        ]);

        DB::table('admin_kemahasiswaan')->insert([
            'nip_admin' => '198001012026061001',
            'username' => 'userAdmin',
            'nama_lengkap' => 'Administrator Kemahasiswaan',
            'nomor_telepon' => '081234567890',
            'role' => 'Admin Kemahasiswaan',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->call([
            DummyOrganisasiSeeder::class,
        ]);
    }
}
