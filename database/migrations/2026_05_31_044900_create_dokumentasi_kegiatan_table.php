<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dokumentasi_kegiatan', function (Blueprint $table) {
            $table->increments('id_dokumentasi');
            $table->unsignedInteger('id_kegiatan')->unique();
            $table->string('dokumen_proposal', 500);
            $table->string('dokumen_lpj', 500)->nullable();
            $table->string('hasil_evaluasi', 500)->nullable();
            $table->enum('status_dokumentasi', [
                'Diproses',
                'Butuh Revisi',
                'Diterima',
            ])->default('Diproses');
            $table->timestamps();

            $table->foreign('id_kegiatan')
                ->references('id_kegiatan')
                ->on('kegiatan')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumentasi_kegiatan');
    }
};
