<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Global Admin Account
        User::updateOrCreate(
            ['email' => 'admin@serdos.digital'],
            [
                'name' => 'Admin Serdos Nusantara',
                'password' => Hash::make('admin123'),
                'user_type' => 'admin',
            ]
        );

        // Standard Dosen Account
        User::updateOrCreate(
            ['email' => 'dosen@university.ac.id'],
            [
                'name' => 'Dr. Ahmad Hidayat',
                'password' => Hash::make('dosen123'),
                'user_type' => 'dosen',
            ]
        );
    }
}
