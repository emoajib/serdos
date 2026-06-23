<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Vetted by AI - Manual Review Required by Senior Engineer/Manager
     */
    public function up(): void
    {
        Schema::create('simulations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->foreign('user_id', 'fk_simulations_user_id')->references('id')->on('users')->onDelete('cascade');
            $table->decimal('nkajf', 5, 2);
            $table->decimal('npd', 5, 2);
            $table->decimal('npdd', 5, 2);
            $table->decimal('nap', 5, 2);
            $table->string('status'); // e.g., 'diterima', 'ditolak'
            $table->string('status_code'); // e.g., 'valid', 'anti_fail'
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('simulations');
    }
};
