<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 *
 * Risk Assessment:
 * - Default seeded passwords are intentionally weak for development only.
 * - Change all passwords before deploying to production.
 *
 * Technical Assumptions:
 * - Run via: php artisan migrate --seed
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SimulationRuleSeeder::class,
        ]);
    }
}
