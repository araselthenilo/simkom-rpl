<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DummyOrganisasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $organizationsData = [
                [
                    'name' => 'UKM Musik',
                    'desc' => 'Wadah bagi mahasiswa mengembangkan minat dan bakat di bidang seni musik dan vokal.',
                    'visi' => 'Menjadi UKM musik yang profesional, kreatif, dan dikenal luas di tingkat nasional.',
                    'misi' => 'Mengadakan pelatihan musik rutin, memfasilitasi penampilan musik internal/eksternal, dan mengasah bakat kolaboratif anggota.',
                    'pembina' => [
                        'username' => 'pembina_musik',
                        'email' => 'pembina.musik@simkom.ac.id',
                        'nip' => '198801012026061001',
                        'nama' => 'Dr. Adi Nugroho, M.Sn.',
                        'telepon' => '081234567001',
                    ],
                    'ketua' => [
                        'username' => 'ketua_musik',
                        'email' => 'ketua.musik@simkom.ac.id',
                        'nim' => '220010001',
                        'nama' => 'Budi Setiawan',
                        'prodi' => 'Sistem Informasi',
                        'telepon' => '082345678001',
                    ],
                ],
                [
                    'name' => 'UKM Olahraga',
                    'desc' => 'Wadah penyaluran bakat olahraga mahasiswa untuk mewujudkan tubuh yang sehat dan berprestasi.',
                    'visi' => 'Terciptanya solidaritas mahasiswa melalui olahraga serta menghasilkan atlet mahasiswa berprestasi.',
                    'misi' => 'Menyelenggarakan latihan cabang olahraga rutin, mengikuti kompetisi antar kampus, dan mengkampanyekan gaya hidup sehat.',
                    'pembina' => [
                        'username' => 'pembina_olahraga',
                        'email' => 'pembina.olahraga@simkom.ac.id',
                        'nip' => '198801012026061002',
                        'nama' => 'Drs. Iwan Setiawan, M.Pd.',
                        'telepon' => '081234567002',
                    ],
                    'ketua' => [
                        'username' => 'ketua_olahraga',
                        'email' => 'ketua.olahraga@simkom.ac.id',
                        'nim' => '220010002',
                        'nama' => 'Rian Hidayat',
                        'prodi' => 'Sistem Komputer',
                        'telepon' => '082345678002',
                    ],
                ],
                [
                    'name' => 'UKM Fotografi',
                    'desc' => 'Media belajar seni menangkap momen melalui lensa kamera dan seni visual digital.',
                    'visi' => 'Menjadi pusat kreatif fotografi mahasiswa yang berkarakter, peka visual, dan adaptif teknologi.',
                    'misi' => 'Mengadakan workshop fotografi dasar dan lanjut, hunting foto tematik bersama, serta menyelenggarakan pameran foto tahunan.',
                    'pembina' => [
                        'username' => 'pembina_fotografi',
                        'email' => 'pembina.fotografi@simkom.ac.id',
                        'nip' => '198801012026061003',
                        'nama' => 'Amir Hamzah, M.T.',
                        'telepon' => '081234567003',
                    ],
                    'ketua' => [
                        'username' => 'ketua_fotografi',
                        'email' => 'ketua.fotografi@simkom.ac.id',
                        'nim' => '220010003',
                        'nama' => 'Siti Rahma',
                        'prodi' => 'Teknologi Informasi',
                        'telepon' => '082345678003',
                    ],
                ],
                [
                    'name' => 'UKM Teater',
                    'desc' => 'Tempat berkumpulnya penikmat seni peran, sastra drama, musikalisasi puisi, dan tata panggung.',
                    'visi' => 'Menyalurkan ekspresi seni pertunjukan teater yang sarat nilai edukasi dan kebudayaan.',
                    'misi' => 'Melakukan latihan keaktoran berkala, memproduksi pementasan teater berkala, dan berpartisipasi dalam festival seni pertunjukan.',
                    'pembina' => [
                        'username' => 'pembina_teater',
                        'email' => 'pembina.teater@simkom.ac.id',
                        'nip' => '198801012026061004',
                        'nama' => 'Dewi Sartika, M.Hum.',
                        'telepon' => '081234567004',
                    ],
                    'ketua' => [
                        'username' => 'ketua_teater',
                        'email' => 'ketua.teater@simkom.ac.id',
                        'nim' => '220010004',
                        'nama' => 'Dewi Lestari',
                        'prodi' => 'Bisnis Digital',
                        'telepon' => '082345678004',
                    ],
                ],
                [
                    'name' => 'UKM Robotika',
                    'desc' => 'Komunitas pengembangan minat riset rekayasa robotika, mikrokontroler, dan kecerdasan buatan.',
                    'visi' => 'Pelopor inovasi teknologi robotika kampus yang unggul dalam kompetisi berskala nasional.',
                    'misi' => 'Mengadakan kelas pemrograman mikrokontroler dasar, merancang robot untuk kontes KRI, dan membimbing riset teknologi aplikatif.',
                    'pembina' => [
                        'username' => 'pembina_robotika',
                        'email' => 'pembina.robotika@simkom.ac.id',
                        'nip' => '198801012026061005',
                        'nama' => 'Prof. Dr. Ir. Harianto, M.T.',
                        'telepon' => '081234567005',
                    ],
                    'ketua' => [
                        'username' => 'ketua_robotika',
                        'email' => 'ketua.robotika@simkom.ac.id',
                        'nim' => '220010005',
                        'nama' => 'Faisal Haris',
                        'prodi' => 'Sistem Komputer',
                        'telepon' => '082345678005',
                    ],
                ],
                [
                    'name' => 'UKM Pecinta Alam',
                    'desc' => 'Organisasi petualangan alam bebas dan pelestarian lingkungan hidup.',
                    'visi' => 'Membentuk insan yang tangguh di alam bebas serta peduli terhadap kelestarian alam dan kemanusiaan.',
                    'misi' => 'Menyelenggarakan diksar mountaineering, melakukan aksi penanaman pohon/reboisasi, dan sigap membantu relawan bencana.',
                    'pembina' => [
                        'username' => 'pembina_pecintaalam',
                        'email' => 'pembina.mapala@simkom.ac.id',
                        'nip' => '198801012026061006',
                        'nama' => 'Drs. Hermawan, M.Si.',
                        'telepon' => '081234567006',
                    ],
                    'ketua' => [
                        'username' => 'ketua_pecintaalam',
                        'email' => 'ketua.mapala@simkom.ac.id',
                        'nim' => '220010006',
                        'nama' => 'Ayu Lestari',
                        'prodi' => 'Sistem Informasi',
                        'telepon' => '082345678006',
                    ],
                ],
                [
                    'name' => 'UKM Kewirausahaan',
                    'desc' => 'Wadah akselerasi pemikiran kreatif mahasiswa menjadi peluang bisnis bernilai ekonomi.',
                    'visi' => 'Menumbuhkan jiwa mandiri, adaptif, dan inovatif melahirkan wirausahawan muda berkualitas.',
                    'misi' => 'Mengadakan bazar produk kampus, pelatihan business plan, dan seminar sharing session dengan startup founder.',
                    'pembina' => [
                        'username' => 'pembina_wirausaha',
                        'email' => 'pembina.wirausaha@simkom.ac.id',
                        'nip' => '198801012026061007',
                        'nama' => 'Dr. Rina Wijaya, M.M.',
                        'telepon' => '081234567007',
                    ],
                    'ketua' => [
                        'username' => 'ketua_wirausaha',
                        'email' => 'ketua.wirausaha@simkom.ac.id',
                        'nim' => '220010007',
                        'nama' => 'Rizky Pratama',
                        'prodi' => 'Bisnis Digital',
                        'telepon' => '082345678007',
                    ],
                ],
                [
                    'name' => 'UKM Jurnalistik',
                    'desc' => 'Lembaga pers mahasiswa yang berdedikasi menyajikan berita kampus secara akurat dan objektif.',
                    'visi' => 'Pusat jurnalisme kampus yang kritis, kredibel, kreatif, dan menjunjung tinggi kode etik.',
                    'misi' => 'Mengembangkan majalah dinding digital, melatih keterampilan wawancara dan reportase, serta meliput kegiatan kampus.',
                    'pembina' => [
                        'username' => 'pembina_jurnalistik',
                        'email' => 'pembina.pers@simkom.ac.id',
                        'nip' => '198801012026061008',
                        'nama' => 'Dian Sastrowardoyo, M.I.Kom.',
                        'telepon' => '081234567008',
                    ],
                    'ketua' => [
                        'username' => 'ketua_jurnalistik',
                        'email' => 'ketua.pers@simkom.ac.id',
                        'nim' => '220010008',
                        'nama' => 'Eka Putri',
                        'prodi' => 'Manajemen Informatika',
                        'telepon' => '082345678008',
                    ],
                ],
                [
                    'name' => 'UKM Tari',
                    'desc' => 'Wadah apresiasi seni tari tradisional dan modern dance untuk melestarikan budaya bangsa.',
                    'visi' => 'Menjadikan seni tari sebagai sarana ekspresi kreasi pertunjukan estetik di lingkungan akademis.',
                    'misi' => 'Berlatih koreografi tari tradisional Nusantara secara terjadwal, melatih tari kontemporer/modern, serta tampil pada seremoni kampus.',
                    'pembina' => [
                        'username' => 'pembina_tari',
                        'email' => 'pembina.tari@simkom.ac.id',
                        'nip' => '198801012026061009',
                        'nama' => 'Sri Wahyuni, M.Pd.',
                        'telepon' => '081234567009',
                    ],
                    'ketua' => [
                        'username' => 'ketua_tari',
                        'email' => 'ketua.tari@simkom.ac.id',
                        'nim' => '220010009',
                        'nama' => 'Dimas Saputra',
                        'prodi' => 'Teknologi Informasi',
                        'telepon' => '082345678009',
                    ],
                ],
                [
                    'name' => 'UKM Penalaran & Riset',
                    'desc' => 'Kelompok kajian ilmiah, penalaran kritis, penulisan artikel ilmiah, dan inovasi gagasan PKM.',
                    'visi' => 'Menjadi katalisator pencapaian prestasi karya tulis ilmiah mahasiswa di tingkat nasional.',
                    'misi' => 'Mengadakan coaching clinic PKM (Program Kreativitas Mahasiswa), melatih public speaking presentasi ilmiah, serta merangsang riset inovasi.',
                    'pembina' => [
                        'username' => 'pembina_riset',
                        'email' => 'pembina.riset@simkom.ac.id',
                        'nip' => '198801012026061010',
                        'nama' => 'Dr. Eng. Ahmad Fauzi, M.T.',
                        'telepon' => '081234567010',
                    ],
                    'ketua' => [
                        'username' => 'ketua_riset',
                        'email' => 'ketua.riset@simkom.ac.id',
                        'nim' => '220010010',
                        'nama' => 'Nanda Kartika',
                        'prodi' => 'Sistem Informasi',
                        'telepon' => '082345678010',
                    ],
                ],
            ];

            $defaultPassword = Hash::make('password');

            foreach ($organizationsData as $data) {
                // 1. Create Pembina Organisasi User Account
                DB::table('users')->insert([
                    'username' => $data['pembina']['username'],
                    'email' => $data['pembina']['email'],
                    'password' => $defaultPassword,
                    'role' => 'Pembina Organisasi',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // 2. Create Pembina Organisasi Profile Record
                DB::table('pembina_organisasi')->insert([
                    'nip_pembina' => $data['pembina']['nip'],
                    'username' => $data['pembina']['username'],
                    'nama_lengkap' => $data['pembina']['nama'],
                    'nomor_telepon' => $data['pembina']['telepon'],
                    'role' => 'Pembina Organisasi',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // 3. Create Organisasi Record
                $id_organisasi = DB::table('organisasi')->insertGetId([
                    'nama_organisasi' => $data['name'],
                    'status_aktif' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // 4. Create Profil Organisasi Record
                $id_profil = DB::table('profil_organisasi')->insertGetId([
                    'id_organisasi' => $id_organisasi,
                    'periode_kepengurusan' => '2026/2027',
                    'logo_organisasi' => 'default_logo.png',
                    'deskripsi_organisasi' => $data['desc'],
                    'visi_organisasi' => $data['visi'],
                    'misi_organisasi' => $data['misi'],
                    'status_aktif' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // 5. Create Pembinaan Record (Linking Pembina and Organisasi)
                DB::table('pembinaan')->insert([
                    'nip_pembina' => $data['pembina']['nip'],
                    'id_organisasi' => $id_organisasi,
                    'periode_pembinaan' => '2026/2027',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // 6. Create Mahasiswa (Ketua) User Account
                DB::table('users')->insert([
                    'username' => $data['ketua']['username'],
                    'email' => $data['ketua']['email'],
                    'password' => $defaultPassword,
                    'role' => 'Mahasiswa',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // 7. Create Mahasiswa Profile Record
                DB::table('mahasiswa')->insert([
                    'nim' => $data['ketua']['nim'],
                    'username' => $data['ketua']['username'],
                    'nama_lengkap' => $data['ketua']['nama'],
                    'program_studi' => $data['ketua']['prodi'],
                    'nomor_telepon' => $data['ketua']['telepon'],
                    'role' => 'Mahasiswa',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // 8. Create Anggota Organisasi Record
                $id_keanggotaan = DB::table('anggota_organisasi')->insertGetId([
                    'id_organisasi' => $id_organisasi,
                    'nim' => $data['ketua']['nim'],
                    'tanggal_bergabung' => '2026-06-01',
                    'status_keanggotaan' => 'Aktif',
                    'foto_ktm' => 'foto_ktm/dummy.png',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // 9. Create Pengurus Organisasi Record
                DB::table('pengurus_organisasi')->insert([
                    'id_profil' => $id_profil,
                    'id_keanggotaan' => $id_keanggotaan,
                    'jabatan' => 'Ketua',
                    'status_aktif' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Create Dummy Kegiatan (Upcoming/Mendatang)
            $ukmMusikProfil = DB::table('profil_organisasi')
                ->join('organisasi', 'profil_organisasi.id_organisasi', '=', 'organisasi.id_organisasi')
                ->where('organisasi.nama_organisasi', 'UKM Musik')
                ->value('profil_organisasi.id_profil');

            $ukmRobotikaProfil = DB::table('profil_organisasi')
                ->join('organisasi', 'profil_organisasi.id_organisasi', '=', 'organisasi.id_organisasi')
                ->where('organisasi.nama_organisasi', 'UKM Robotika')
                ->value('profil_organisasi.id_profil');

            $ukmOlahragaProfil = DB::table('profil_organisasi')
                ->join('organisasi', 'profil_organisasi.id_organisasi', '=', 'organisasi.id_organisasi')
                ->where('organisasi.nama_organisasi', 'UKM Olahraga')
                ->value('profil_organisasi.id_profil');

            $ukmRisetProfil = DB::table('profil_organisasi')
                ->join('organisasi', 'profil_organisasi.id_organisasi', '=', 'organisasi.id_organisasi')
                ->where('organisasi.nama_organisasi', 'UKM Penalaran & Riset')
                ->value('profil_organisasi.id_profil');

            $idMusikKegiatan = null;
            if ($ukmMusikProfil) {
                $idMusikKegiatan = DB::table('kegiatan')->insertGetId([
                    'id_profil' => $ukmMusikProfil,
                    'nama_kegiatan' => 'Konser Harmoni Musik Kampus',
                    'jenis_kegiatan' => 'Seminar',
                    'deskripsi_kegiatan' => 'Konser sekaligus talkshow tentang perkembangan seni musik modern dan tradisional di kalangan mahasiswa ITB SIMKOM STIKOM Bali.',
                    'biaya_pendaftaran' => 0.00,
                    'tanggal_pelaksanaan' => '2026-07-15',
                    'lokasi_kegiatan' => 'Aula Utama Kampus',
                    'kuota_peserta' => 150,
                    'status_kegiatan' => 'Mendatang',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $idRobotikaKegiatan = null;
            if ($ukmRobotikaProfil) {
                $idRobotikaKegiatan = DB::table('kegiatan')->insertGetId([
                    'id_profil' => $ukmRobotikaProfil,
                    'nama_kegiatan' => 'Workshop IoT & Smart Device',
                    'jenis_kegiatan' => 'Pelatihan',
                    'deskripsi_kegiatan' => 'Pelatihan intensif merakit perangkat pintar berbasis mikrokontroler NodeMCU dan sensor IoT untuk otomatisasi rumah.',
                    'biaya_pendaftaran' => 75000.00,
                    'tanggal_pelaksanaan' => '2026-08-10',
                    'lokasi_kegiatan' => 'Lab Inovasi Robotika',
                    'kuota_peserta' => 30,
                    'status_kegiatan' => 'Mendatang',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $idOlahragaKegiatan = null;
            if ($ukmOlahragaProfil) {
                $idOlahragaKegiatan = DB::table('kegiatan')->insertGetId([
                    'id_profil' => $ukmOlahragaProfil,
                    'nama_kegiatan' => 'Turnamen Futsal Rektor Cup 2026',
                    'jenis_kegiatan' => 'Lomba',
                    'deskripsi_kegiatan' => 'Kompetisi futsal bergengsi antar angkatan dan program studi untuk merebut piala bergilir Rektor ITB SIMKOM STIKOM Bali.',
                    'biaya_pendaftaran' => 150000.00,
                    'tanggal_pelaksanaan' => '2026-09-05',
                    'lokasi_kegiatan' => 'Gelanggang Olahraga (GOR) Kampus',
                    'kuota_peserta' => 16,
                    'status_kegiatan' => 'Mendatang',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $idRisetKegiatan = null;
            if ($ukmRisetProfil) {
                $idRisetKegiatan = DB::table('kegiatan')->insertGetId([
                    'id_profil' => $ukmRisetProfil,
                    'nama_kegiatan' => 'Seminar Penulisan PKM & Karya Ilmiah',
                    'jenis_kegiatan' => 'Seminar',
                    'deskripsi_kegiatan' => 'Kupas tuntas strategi lolos pendanaan Program Kreativitas Mahasiswa (PKM) bersama pemateri nasional dan reviewer berpengalaman.',
                    'biaya_pendaftaran' => 0.00,
                    'tanggal_pelaksanaan' => '2026-07-28',
                    'lokasi_kegiatan' => 'Lab Teater Kampus',
                    'kuota_peserta' => 200,
                    'status_kegiatan' => 'Mendatang',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Create Dummy Transaksi Keuangan
            if ($idMusikKegiatan) {
                DB::table('transaksi_keuangan')->insert([
                    [
                        'id_kegiatan' => $idMusikKegiatan,
                        'jenis_transaksi' => 'Pemasukan',
                        'nominal_transaksi' => 5000000.00,
                        'tanggal_transaksi' => '2026-06-05',
                        'sumber_tujuan_transaksi' => 'Sponsorship Teh Botol Sosro',
                        'foto_bukti_transaksi' => 'transaksi_keuangan/bukti/dummy_invoice.png',
                        'catatan_koreksi' => null,
                        'created_at' => now()->subDays(5),
                        'updated_at' => now()->subDays(5),
                    ],
                    [
                        'id_kegiatan' => $idMusikKegiatan,
                        'jenis_transaksi' => 'Pengeluaran',
                        'nominal_transaksi' => 2500000.00,
                        'tanggal_transaksi' => '2026-06-08',
                        'sumber_tujuan_transaksi' => 'Sewa Sound System & Lighting',
                        'foto_bukti_transaksi' => 'transaksi_keuangan/bukti/dummy_nota.png',
                        'catatan_koreksi' => null,
                        'created_at' => now()->subDays(2),
                        'updated_at' => now()->subDays(2),
                    ],
                ]);
            }

            if ($idRobotikaKegiatan) {
                DB::table('transaksi_keuangan')->insert([
                    [
                        'id_kegiatan' => $idRobotikaKegiatan,
                        'jenis_transaksi' => 'Pemasukan',
                        'nominal_transaksi' => 2250000.00,
                        'tanggal_transaksi' => '2026-06-10',
                        'sumber_tujuan_transaksi' => 'Uang Pendaftaran Peserta (30 Orang)',
                        'foto_bukti_transaksi' => 'transaksi_keuangan/bukti/dummy_receipt.png',
                        'catatan_koreksi' => null,
                        'created_at' => now()->subDay(),
                        'updated_at' => now()->subDay(),
                    ],
                    [
                        'id_kegiatan' => $idRobotikaKegiatan,
                        'jenis_transaksi' => 'Pengeluaran',
                        'nominal_transaksi' => 1500000.00,
                        'tanggal_transaksi' => '2026-06-11',
                        'sumber_tujuan_transaksi' => 'Pembelian NodeMCU ESP8266 & Sensor DHT11',
                        'foto_bukti_transaksi' => 'transaksi_keuangan/bukti/dummy_invoice2.png',
                        'catatan_koreksi' => 'Harap lampirkan nota toko fisik juga',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);
            }

            if ($idOlahragaKegiatan) {
                DB::table('transaksi_keuangan')->insert([
                    [
                        'id_kegiatan' => $idOlahragaKegiatan,
                        'jenis_transaksi' => 'Pemasukan',
                        'nominal_transaksi' => 1500000.00,
                        'tanggal_transaksi' => '2026-06-12',
                        'sumber_tujuan_transaksi' => 'Kas Himpunan Mahasiswa',
                        'foto_bukti_transaksi' => 'transaksi_keuangan/bukti/dummy_transfer.png',
                        'catatan_koreksi' => null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                ]);
            }

            // Create Dummy Pengajuan Profil Organisasi
            $pengurusList = DB::table('pengurus_organisasi')->take(3)->get();
            $index = 1;
            foreach ($pengurusList as $p) {
                DB::table('pengajuan_profil_organisasi')->insert([
                    'id_pengurus' => $p->id_pengurus,
                    'periode_kepengurusan' => '2026/2027',
                    'logo_organisasi' => 'default_logo.png',
                    'deskripsi_organisasi' => 'Deskripsi usulan baru untuk organisasi ini. Kami mengajukan pembaruan karena kepengurusan baru telah resmi dilantik.',
                    'visi_organisasi' => 'Menjadi organisasi mahasiswa yang unggul, berintegritas, dan inovatif di era digital.',
                    'misi_organisasi' => "1. Menyelenggarakan kegiatan pengembangan soft skill.\n2. Membangun hubungan kemitraan dengan instansi eksternal.\n3. Meningkatkan rasa kekeluargaan antar anggota.",
                    'status_pengajuan' => 'Diproses',
                    'created_at' => now()->subHours($index * 2),
                    'updated_at' => now()->subHours($index * 2),
                ]);
                $index++;
            }
        });

    }
}
