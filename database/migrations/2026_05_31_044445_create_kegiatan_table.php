<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->increments('id_kegiatan');
            $table->unsignedInteger('id_profil');
            $table->string('username_petugas', 30)->nullable();
            $table->string('nama_kegiatan', 200);
            $table->enum('jenis_kegiatan', [
                'Seminar',
                'Pelatihan',
                'Lomba',
                'Pengabdian Masyarakat',
            ]);
            $table->text('deskripsi_kegiatan');
            $table->decimal('biaya_pendaftaran', 15, 2);
            $table->date('tanggal_pelaksanaan');
            $table->string('lokasi_kegiatan', 200);
            $table->unsignedInteger('kuota_peserta');
            $table->enum('status_kegiatan', [
                'Mendatang',
                'Sedang berlangsung',
                'Selesai',
                'Dibatalkan',
            ])->default('Mendatang');
            $table->string('alasan_pembatalan', 500)->nullable();
            $table->timestamps();

            $table->foreign('id_profil')
                ->references('id_profil')
                ->on('profil_organisasi')
                ->onDelete('restrict');

            $table->foreign('username_petugas')
                ->references('username')
                ->on('pengguna')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};
