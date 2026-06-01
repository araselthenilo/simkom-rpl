<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_kemahasiswaan', function (Blueprint $table) {
            $table->string('nip_admin', 18)->primary();
            $table->string('username', 30)->unique();
            $table->string('nama_lengkap', 150);
            $table->string('nomor_telepon', 15);
            $table->timestamps();

            $table->foreign('username')
                ->references('username')
                ->on('users')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_kemahasiswaan');
    }
};
