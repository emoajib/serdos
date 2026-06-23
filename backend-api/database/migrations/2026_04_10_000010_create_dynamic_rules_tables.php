<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * DYNAMIC RULE ENGINE - SETTINGS REGISTRY
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
return new class extends Migration
{
    public function up(): void
    {
        // 1. GLOBAL SETTINGS (THRESHOLD, WEIGHTS, GATE)
        Schema::create('sim_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g., perception_gate, nap_min
            $table->string('value');       // e.g., 4.5, 4.2
            $table->string('group')->default('rule'); // e.g., 'rule', 'payment'
            $table->timestamps();
        });

        // 2. RUBRIC/ITEM MANAGER (THE 149 ITEMS)
        Schema::create('sim_rubrics', function (Blueprint $table) {
            $table->id();
            $table->string('role_group'); // mahasiswa, sejawat, atasan, self, assessor
            $table->integer('order')->default(0);
            $table->text('label');
            $table->string('low_label')->nullable();
            $table->string('high_label')->nullable();
            $table->boolean('is_inverse')->default(false);
            $table->string('category')->nullable(); // Teaching, Research, PkM (for Assessor)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sim_rubrics');
        Schema::dropIfExists('sim_settings');
    }
};
