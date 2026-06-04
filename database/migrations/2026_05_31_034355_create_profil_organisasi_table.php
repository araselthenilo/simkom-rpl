<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('profil_organisasi', function (Blueprint $table) {
            $table->increments('id_profil');
            $table->unsignedInteger('id_organisasi');
            $table->string('periode_kepengurusan', 9);
            $table->string('logo_organisasi', 500);
            $table->text('deskripsi_organisasi');
            $table->text('visi_organisasi');
            $table->text('misi_organisasi');
            $table->boolean('status_aktif');
            $table->timestamps();

            $table->foreign('id_organisasi')
                ->references('id_organisasi')
                ->on('organisasi')
                ->onDelete('restrict');

            $table->unique(['id_organisasi', 'periode_kepengurusan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profil_organisasi');
    }
};
