<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('log_aktivitas', function (Blueprint $table) {
            $table->increments('id_log');
            $table->string('username', 30)->nullable();
            $table->unsignedInteger('id_organisasi')->nullable();
            $table->string('kategori');
            $table->text('deskripsi');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->foreign('username')
                ->references('username')
                ->on('users')
                ->onDelete('set null');

            $table->foreign('id_organisasi')
                ->references('id_organisasi')
                ->on('organisasi')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
    }
};
