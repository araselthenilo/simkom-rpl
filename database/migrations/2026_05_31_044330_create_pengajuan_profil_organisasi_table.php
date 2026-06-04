<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pengajuan_profil_organisasi', function (Blueprint $table) {
            $table->increments('id_pengajuan');
            $table->unsignedInteger('id_pengurus');
            $table->string('username_petugas', 30)->nullable();
            $table->string('periode_kepengurusan', 9);
            $table->string('logo_organisasi', 500);
            $table->text('deskripsi_organisasi');
            $table->text('visi_organisasi');
            $table->text('misi_organisasi');
            $table->enum('status_pengajuan', [
                'Diproses',
                'Ditolak',
                'Diterima',
            ])->default('Diproses');
            $table->timestamps();

            $table->foreign('id_pengurus')
                ->references('id_pengurus')
                ->on('pengurus_organisasi')
                ->onDelete('restrict');

            $table->foreign('username_petugas')
                ->references('username')
                ->on('pengguna')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_profil_organisasi');
    }
};
