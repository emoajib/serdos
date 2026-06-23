<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Meningkatkan kapasitas sim_settings agar bisa menampung JSON Bank yang panjang
        Schema::table('sim_settings', function (Blueprint $table) {
            $table->text('value')->change(); 
        });
    }

    public function down(): void
    {
        Schema::table('sim_settings', function (Blueprint $table) {
            $table->string('value')->change();
        });
    }
};
