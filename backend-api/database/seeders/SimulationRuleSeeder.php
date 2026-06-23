<?php

namespace Database\Seeders;

use App\Models\SimSetting;
use App\Models\SimRubric;
use Illuminate\Database\Seeder;

/**
 * 2025 MASTER SETTINGS SEEDER (The 149 Gold Pillars)
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class SimulationRuleSeeder extends Seeder
{
    public function run(): void
    {
        // 1. MASTER RULES (THRESHOLD & PRICE)
        $settings = [
            ['key' => 'perception_gate', 'value' => '4.5', 'group' => 'gate'],
            ['key' => 'assessor_gate', 'value' => '4.0', 'group' => 'gate'],
            ['key' => 'nap_threshold', 'value' => '4.2', 'group' => 'gate'],
            ['key' => 'simulation_price', 'value' => '150000', 'group' => 'payment'],
            ['key' => 'payment_method', 'value' => 'manual', 'group' => 'payment'], // e.g., manual, midtrans
            ['key' => 'bank_info', 'value' => 'BCA 123456789 A/N Serdos Digital', 'group' => 'payment'],
            // Word count limits for narratives
            ['key' => 'biodata_word_limit', 'value' => '150', 'group' => 'validation'],
            ['key' => 'penelitian_word_min', 'value' => '250', 'group' => 'validation'],
            ['key' => 'penelitian_word_max', 'value' => '300', 'group' => 'validation'],
            ['key' => 'pkm_word_min', 'value' => '250', 'group' => 'validation'],
            ['key' => 'pkm_word_max', 'value' => '300', 'group' => 'validation'],
        ];

        foreach ($settings as $s) {
            SimSetting::updateOrCreate(['key' => $s['key']], $s);
        }

        // 2. MASTER RUBRICS (EXAMPLE FOR EACH ROLE)
        // Note: For real prod, I'll seed all 149.
        $mahasiswaItems = [
            'Penyampaian & tampilan materi',
            'Materi ikuti kemauan dosen',
            'Pemanfaatan strategi & media',
            'Penilaian hasil belajar mhs (Objektif)',
            'Struktur materi runtut',
            'Penguasaan bidang ilmu',
            'Referensi terkini',
            'Keteladanan sikap',
            'Pengendalian diri',
            'Pilih kasih perlakuan (Inverse)',
            'Komunikasi lisan/tulis',
            'Terima kritik/saran',
            'Interaksi dengan mhs'
        ];

        foreach ($mahasiswaItems as $idx => $label) {
            SimRubric::updateOrCreate(['role_group' => 'mahasiswa', 'order' => $idx + 1], [
                'label' => $label,
                'low_label' => 'Buruk',
                'high_label' => 'Baik',
                'is_inverse' => str_contains($label, '(Inverse)')
            ]);
        }

        // ... seeding sejawat, atasan, etc. (Can implement bulk-add in Admin UI)
    }
}
