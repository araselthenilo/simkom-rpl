# Panduan Seeding & Migrasi Database SIMKOM

Dokumen ini berisi perintah-perintah Artisan yang dapat digunakan untuk melakukan migrasi fresh database beserta pengisian data dummy untuk 10 organisasi (UKM), Pembina, dan Pengurus (Ketua) terkait.

---

## Perintah Migrasi & Seeding

### 1. Migrasi Fresh dan Seeding Otomatis (Direkomendasikan)
Gunakan perintah ini jika Anda ingin menghapus seluruh tabel, membuat ulang struktur database, dan langsung mengisi semua data awal (termasuk 10 organisasi dummy baru):

```bash
php artisan migrate:fresh --seed
```

### 2. Menjalankan Seeder Secara Spesifik
Jika Anda hanya ingin menambahkan data dummy 10 organisasi ini pada database yang sudah berjalan (tanpa menghapus data lain):

```bash
php artisan db:seed --class=DummyOrganisasiSeeder
```

---

## Rincian Data Dummy yang Dibuat

Semua akun yang dibuat menggunakan kata sandi default: **`password`**

### Daftar Organisasi dan Akun Terkait

| No | Nama Organisasi (UKM) | Username Pembina | NIP Pembina | Username Ketua (Mahasiswa) | NIM Ketua |
|----|---|---|---|---|---|
| 1 | **UKM Musik** | `pembina_musik` | `198801012026061001` | `ketua_musik` | `220010001` |
| 2 | **UKM Olahraga** | `pembina_olahraga` | `198801012026061002` | `ketua_olahraga` | `220010002` |
| 3 | **UKM Fotografi** | `pembina_fotografi` | `198801012026061003` | `ketua_fotografi` | `220010003` |
| 4 | **UKM Teater** | `pembina_teater` | `198801012026061004` | `ketua_teater` | `220010004` |
| 5 | **UKM Robotika** | `pembina_robotika` | `198801012026061005` | `ketua_robotika` | `220010005` |
| 6 | **UKM Pecinta Alam** | `pembina_pecintaalam` | `198801012026061006` | `ketua_pecintaalam` | `220010006` |
| 7 | **UKM Kewirausahaan** | `pembina_wirausaha` | `198801012026061007` | `ketua_wirausaha` | `220010007` |
| 8 | **UKM Jurnalistik** | `pembina_jurnalistik` | `198801012026061008` | `ketua_jurnalistik` | `220010008` |
| 9 | **UKM Tari** | `pembina_tari` | `198801012026061009` | `ketua_tari` | `220010009` |
| 10 | **UKM Penalaran & Riset** | `pembina_riset` | `198801012026061010` | `ketua_riset` | `220010010` |

### Struktur Relasi Data

Setiap organisasi secara otomatis memiliki:
1. Akun login **Pembina** (`users` role `'Pembina Organisasi'`) dan data profil (`pembina_organisasi`).
2. Relasi pembinaan antara Pembina dan Organisasi (`pembinaan` periode `'2026/2027'`).
3. Profil Organisasi (`profil_organisasi` periode `'2026/2027'`) lengkap dengan deskripsi, visi, misi, dan status aktif.
4. Akun login **Mahasiswa** (`users` role `'Mahasiswa'`) dan data profil mahasiswa (`mahasiswa`).
5. Status keanggotaan aktif mahasiswa tersebut pada organisasi terkait (`anggota_organisasi` status `'Aktif'`).
6. Penugasan mahasiswa tersebut sebagai **Ketua** pada organisasi tersebut (`pengurus_organisasi` jabatan `'Ketua'`, status aktif `true`).
