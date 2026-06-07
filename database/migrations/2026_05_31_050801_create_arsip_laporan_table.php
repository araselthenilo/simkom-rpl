<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('arsip_laporan', function (Blueprint $table) {
            $table->increments('id_laporan');
            $table->unsignedInteger('id_organisasi');
            $table->string('username_petugas', 30);
            $table->enum('jenis_laporan', [
                'Kegiatan',
                'Keuangan',
            ]);
            $table->string('file_laporan', 500);
            $table->timestamps();

            $table->foreign('id_organisasi')
                ->references('id_organisasi')
                ->on('organisasi')
                ->onDelete('restrict');

            $table->foreign('username_petugas')
                ->references('username')
                ->on('users')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('arsip_laporan');
    }
};
