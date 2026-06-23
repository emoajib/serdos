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
        Schema::create('simulation_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('simulation_id');
            $table->json('nkajf_breakdown')->nullable();
            $table->json('npd_breakdown')->nullable();
            $table->json('npdd_breakdown')->nullable();
            $table->json('perceptual_multirater')->nullable();
            $table->timestamps();

            $table->foreign('simulation_id', 'fk_details_simulation_id')
                  ->references('id')->on('simulations')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('simulation_details');
    }
};
