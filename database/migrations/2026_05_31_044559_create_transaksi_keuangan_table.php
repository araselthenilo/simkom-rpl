<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi_keuangan', function (Blueprint $table) {
            $table->increments('id_transaksi');
            $table->unsignedInteger('id_kegiatan');
            $table->enum('jenis_transaksi', [
                'Pemasukan',
                'Pengeluaran',
            ]);
            $table->decimal('nominal_transaksi', 15, 2);
            $table->date('tanggal_transaksi');
            $table->string('sumber_tujuan_transaksi', 200);
            $table->string('foto_bukti_transaksi', 500);
            $table->string('catatan_koreksi', 500)->nullable();
            $table->timestamps();

            $table->foreign('id_kegiatan')
                ->references('id_kegiatan')
                ->on('kegiatan')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_keuangan');
    }
};
