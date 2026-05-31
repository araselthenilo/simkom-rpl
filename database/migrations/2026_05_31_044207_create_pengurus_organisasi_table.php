<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengurus_organisasi', function (Blueprint $table) {
            $table->increments('id_pengurus');
            $table->unsignedInteger('id_profil');
            $table->unsignedInteger('id_keanggotaan');
            $table->string('jabatan', 255);
            $table->boolean('status_aktif');

            $table->foreign('id_profil')
                ->references('id_profil')
                ->on('profil_organisasi')
                ->onDelete('restrict');

            $table->foreign('id_keanggotaan')
                ->references('id_keanggotaan')
                ->on('anggota_organisasi')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengurus_organisasi');
    }
};
