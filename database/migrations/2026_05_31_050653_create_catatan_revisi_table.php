<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('catatan_revisi', function (Blueprint $table) {
            $table->increments('id_catatan');
            $table->unsignedInteger('id_dokumentasi');
            $table->string('username_petugas', 30);
            $table->text('isi_catatan');
            $table->boolean('status_tindaklanjut')->default(false);
            $table->dateTime('waktu_ditindaklanjuti')->nullable();
            $table->timestamps();

            $table->foreign('id_dokumentasi')
                ->references('id_dokumentasi')
                ->on('dokumentasi_kegiatan')
                ->onDelete('restrict');

            $table->foreign('username_petugas')
                ->references('username')
                ->on('pengguna')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catatan_revisi');
    }
};
