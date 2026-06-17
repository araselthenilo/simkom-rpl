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
            'email' => 'test@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'Mahasiswa',
        ]);

        // Create Admin Kemahasiswaan user
        User::factory()->create([
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'Admin Kemahasiswaan',
        ]);

        DB::table('mahasiswa')->insert([
            'nim' => '220010011',
            'username' => 'testuser',
            'nama_lengkap' => 'Test Mahasiswa',
            'program_studi' => 'Sistem Informasi',
            'nomor_telepon' => '081234567890',
            'role' => 'Mahasiswa',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('admin_kemahasiswaan')->insert([
            'nip_admin' => '198001012026061001',
            'username' => 'admin',
            'nama_lengkap' => 'Administrator Kemahasiswaan',
            'nomor_telepon' => '081234567890',
            'role' => 'Admin Kemahasiswaan',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->call([
            DummyOrganisasiSeeder::class,
        ]);

        $ukmId = DB::table('organisasi')->first()?->id_organisasi;

        DB::table('log_aktivitas')->insert([
            [
                'username' => 'admin',
                'id_organisasi' => null,
                'kategori' => 'Autentikasi',
                'deskripsi' => 'User admin (Admin Kemahasiswaan) berhasil masuk ke dalam sistem',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'username' => 'admin',
                'id_organisasi' => $ukmId,
                'kategori' => 'Profil',
                'deskripsi' => 'Admin menyetujui pengajuan profil UKM untuk periode kepengurusan terbaru',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                'created_at' => now()->subHour(),
                'updated_at' => now()->subHour(),
            ],
            [
                'username' => 'testuser',
                'id_organisasi' => $ukmId,
                'kategori' => 'Keuangan',
                'deskripsi' => 'Bendahara UKM menambahkan transaksi kas masuk sebesar Rp500.000',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                'created_at' => now()->subMinutes(30),
                'updated_at' => now()->subMinutes(30),
            ],
        ]);
    }
}
