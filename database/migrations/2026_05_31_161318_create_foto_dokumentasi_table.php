<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('foto_dokumentasi', function (Blueprint $table) {
            $table->increments('id_foto');
            $table->unsignedInteger('id_dokumentasi');
            $table->string('foto_dokumentasi', 500);

            $table->foreign('id_dokumentasi')
                ->references('id_dokumentasi')
                ->on('dokumentasi_kegiatan')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foto_dokumentasi');
    }
};
