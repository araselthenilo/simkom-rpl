<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembinaan', function (Blueprint $table) {
            $table->increments('id_pembinaan');
            $table->string('nip_pembina', 18);
            $table->unsignedInteger('id_organisasi');
            $table->string('periode_pembinaan', 9);
            $table->timestamps();

            $table->foreign('nip_pembina')
                ->references('nip_pembina')
                ->on('pembina_organisasi')
                ->onDelete('restrict');

            $table->foreign('id_organisasi')
                ->references('id_organisasi')
                ->on('organisasi')
                ->onDelete('restrict');

            $table->unique(['nip_pembina', 'id_organisasi', 'periode_pembinaan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembinaan');
    }
};
