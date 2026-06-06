<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembina_organisasi', function (Blueprint $table) {
            $table->string('nip_pembina', 18)->primary();
            $table->string('username', 30)->unique();
            $table->string('nama_lengkap', 150);
            $table->string('nomor_telepon', 15);
            $table->enum('role', ['Pembina Organisasi'])->default('Pembina Organisasi');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign(['username', 'role'])
                ->references(['username', 'role'])
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembina_organisasi');
    }
};
