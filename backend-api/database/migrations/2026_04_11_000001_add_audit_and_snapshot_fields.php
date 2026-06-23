<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Audit Trail Table
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // e.g., 'update_threshold'
            $table->json('payload'); // Data before/after
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });

        // 2. Add Snapshot to Simulations
        Schema::table('simulations', function (Blueprint $table) {
            // Menyimpan aturan yang berlaku SAAT simulasi ini dibuat
            $table->json('applied_rules')->nullable()->after('details'); 
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::table('simulations', function (Blueprint $table) {
            $table->dropColumn('applied_rules');
        });
    }
};
