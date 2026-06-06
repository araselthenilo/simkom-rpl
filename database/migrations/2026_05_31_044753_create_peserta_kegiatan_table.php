<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peserta_kegiatan', function (Blueprint $table) {
            $table->increments('id_peserta');
            $table->string('nim', 9);
            $table->unsignedInteger('id_kegiatan');
            $table->unsignedInteger('id_transaksi')->nullable();
            $table->timestamps();

            $table->foreign('nim')
                ->references('nim')
                ->on('mahasiswa')
                ->onDelete('restrict');

            $table->foreign('id_kegiatan')
                ->references('id_kegiatan')
                ->on('kegiatan')
                ->onDelete('restrict');

            $table->foreign('id_transaksi')
                ->references('id_transaksi')
                ->on('transaksi_keuangan')
                ->onDelete('restrict');

            $table->unique(['nim', 'id_kegiatan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta_kegiatan');
    }
};
