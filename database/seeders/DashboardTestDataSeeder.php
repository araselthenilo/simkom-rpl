<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DashboardTestDataSeeder extends Seeder
{
    public function run(): void
    {
        $idOrganisasi = 1; // UKM Musik
        $idProfil = 1; // UKM Musik Profil

        // Create 4 dummy students
        $students = [
            [
                'nim' => '220020001',
                'username' => 'test_student1',
                'email' => 'test_student1@simkom.ac.id',
                'nama' => 'Andi Wijaya',
                'status' => 'Aktif',
                'tanggal_bergabung' => '2026-06-05', // Joined this month
            ],
            [
                'nim' => '220020002',
                'username' => 'test_student2',
                'email' => 'test_student2@simkom.ac.id',
                'nama' => 'Clara Indah',
                'status' => 'Aktif',
                'tanggal_bergabung' => '2026-06-06', // Joined this month
            ],
            [
                'nim' => '220020003',
                'username' => 'test_student3',
                'email' => 'test_student3@simkom.ac.id',
                'nama' => 'Doni Pratama',
                'status' => 'Diproses', // Pending member
                'tanggal_bergabung' => '2026-06-08',
            ],
            [
                'nim' => '220020004',
                'username' => 'test_student4',
                'email' => 'test_student4@simkom.ac.id',
                'nama' => 'Elisa Putri',
                'status' => 'Diproses', // Pending member
                'tanggal_bergabung' => '2026-06-08',
            ],
        ];

        $defaultPassword = Hash::make('password');

        foreach ($students as $s) {
            // Check if user already exists
            if (!DB::table('users')->where('username', $s['username'])->exists()) {
                DB::table('users')->insert([
                    'username' => $s['username'],
                    'email' => $s['email'],
                    'password' => $defaultPassword,
                    'role' => 'Mahasiswa',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('mahasiswa')->insert([
                    'nim' => $s['nim'],
                    'username' => $s['username'],
                    'nama_lengkap' => $s['nama'],
                    'program_studi' => 'Sistem Informasi',
                    'nomor_telepon' => '081234567890',
                    'role' => 'Mahasiswa',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // check unique keanggotaan
            $exists = DB::table('anggota_organisasi')
                ->where('id_organisasi', $idOrganisasi)
                ->where('nim', $s['nim'])
                ->exists();

            if (!$exists) {
                DB::table('anggota_organisasi')->insert([
                    'id_organisasi' => $idOrganisasi,
                    'nim' => $s['nim'],
                    'tanggal_bergabung' => $s['tanggal_bergabung'],
                    'status_keanggotaan' => $s['status'],
                    'foto_ktm' => 'foto_ktm/dummy.png',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Create some dummy activities
        $activities = [
            [
                'nama_kegiatan' => 'Lomba Musik Akustik',
                'jenis_kegiatan' => 'Lomba',
                'deskripsi_kegiatan' => 'Kompetisi akustik mahasiswa.',
                'biaya_pendaftaran' => 50000.00,
                'tanggal_pelaksanaan' => '2026-06-15',
                'lokasi_kegiatan' => 'Areal Parkir UKM',
                'kuota_peserta' => 50,
                'status_kegiatan' => 'Mendatang',
            ],
            [
                'nama_kegiatan' => 'Workshop Harmoni Vokal',
                'jenis_kegiatan' => 'Pelatihan',
                'deskripsi_kegiatan' => 'Pelatihan teknik vokal grup.',
                'biaya_pendaftaran' => 25000.00,
                'tanggal_pelaksanaan' => '2026-06-08',
                'lokasi_kegiatan' => 'Studio Musik UKM',
                'kuota_peserta' => 30,
                'status_kegiatan' => 'Sedang berlangsung',
            ],
        ];

        foreach ($activities as $act) {
            $existing = DB::table('kegiatan')
                ->where('id_profil', $idProfil)
                ->where('nama_kegiatan', $act['nama_kegiatan'])
                ->first();

            $idKegiatan = $existing ? $existing->id_kegiatan : null;

            if (!$existing) {
                $idKegiatan = DB::table('kegiatan')->insertGetId([
                    'id_profil' => $idProfil,
                    'nama_kegiatan' => $act['nama_kegiatan'],
                    'jenis_kegiatan' => $act['jenis_kegiatan'],
                    'deskripsi_kegiatan' => $act['deskripsi_kegiatan'],
                    'biaya_pendaftaran' => $act['biaya_pendaftaran'],
                    'tanggal_pelaksanaan' => $act['tanggal_pelaksanaan'],
                    'lokasi_kegiatan' => $act['lokasi_kegiatan'],
                    'kuota_peserta' => $act['kuota_peserta'],
                    'status_kegiatan' => $act['status_kegiatan'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Add financial transactions
                if ($act['nama_kegiatan'] === 'Lomba Musik Akustik') {
                    DB::table('transaksi_keuangan')->insert([
                        'id_kegiatan' => $idKegiatan,
                        'jenis_transaksi' => 'Pemasukan',
                        'nominal_transaksi' => 500000.00,
                        'tanggal_transaksi' => '2026-06-05',
                        'sumber_tujuan_transaksi' => 'Uang pendaftaran kontestan',
                        'foto_bukti_transaksi' => 'transaksi_keuangan/bukti/dummy.png',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } else {
                    DB::table('transaksi_keuangan')->insert([
                        'id_kegiatan' => $idKegiatan,
                        'jenis_transaksi' => 'Pengeluaran',
                        'nominal_transaksi' => 150000.00,
                        'tanggal_transaksi' => '2026-06-07',
                        'sumber_tujuan_transaksi' => 'Konsumsi instruktur',
                        'foto_bukti_transaksi' => 'transaksi_keuangan/bukti/dummy.png',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Add participant registrations spread over last 7 days
            if ($idKegiatan) {
                $regDates = [
                    now()->format('Y-m-d'), // today
                    now()->format('Y-m-d'),
                    now()->subDays(1)->format('Y-m-d'), // yesterday
                    now()->subDays(1)->format('Y-m-d'),
                    now()->subDays(1)->format('Y-m-d'),
                    now()->subDays(1)->format('Y-m-d'),
                    now()->subDays(2)->format('Y-m-d'), // 2 days ago
                    now()->subDays(4)->format('Y-m-d'), // 4 days ago
                    now()->subDays(4)->format('Y-m-d'),
                    now()->subDays(4)->format('Y-m-d'),
                ];

                foreach ($regDates as $idx => $dateStr) {
                    $randNim = '22002000' . (($idx % 4) + 1); // Andi, Clara, Doni, Elisa
                    
                    // check unique key on (nim, id_kegiatan)
                    $exists = DB::table('peserta_kegiatan')
                        ->where('nim', $randNim)
                        ->where('id_kegiatan', $idKegiatan)
                        ->exists();

                    if (!$exists) {
                        DB::table('peserta_kegiatan')->insert([
                            'nim' => $randNim,
                            'id_kegiatan' => $idKegiatan,
                            'created_at' => $dateStr . ' 10:00:00',
                            'updated_at' => $dateStr . ' 10:00:00',
                        ]);
                    }
                }
            }
        }
    }
}
