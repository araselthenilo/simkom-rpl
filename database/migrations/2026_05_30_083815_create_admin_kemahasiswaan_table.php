<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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
            if (DB::getDriverName() === 'mysql') {
                $table->enum('role', [
                    'Mahasiswa',
                    'Pembina Organisasi',
                    'Admin Kemahasiswaan',
                ])->default('Admin Kemahasiswaan');
            } else {
                $table->enum('role', ['Admin Kemahasiswaan'])->default('Admin Kemahasiswaan');
            }
            $table->timestamps();

            $table->foreign(['username', 'role'])
                ->references(['username', 'role'])
                ->on('users')
                ->cascadeOnDelete();
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE admin_kemahasiswaan ADD CONSTRAINT chk_admin_role CHECK (role = "Admin Kemahasiswaan")');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_kemahasiswaan');
    }
};
