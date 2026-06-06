<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anggota_organisasi', function (Blueprint $table) {
            $table->increments('id_keanggotaan');
            $table->unsignedInteger('id_organisasi');
            $table->string('nim', 9);
            $table->date('tanggal_bergabung');
            $table->enum('status_keanggotaan', [
                'Diproses',
                'Ditolak',
                'Aktif',
                'Tidak Aktif',
            ])->default('Diproses');
            $table->string('alasan_penolakan', 500)->nullable();
            $table->timestamps();

            $table->foreign('id_organisasi')
                ->references('id_organisasi')
                ->on('organisasi')
                ->onDelete('restrict');

            $table->foreign('nim')
                ->references('nim')
                ->on('mahasiswa')
                ->onDelete('restrict');

            $table->unique(['id_organisasi', 'nim']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggota_organisasi');
    }
};
