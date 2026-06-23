<?php

namespace App\Domain\Serdos\Actions;

use App\Domain\Serdos\ValueObjects\NAPResult;

class CalculateNAPAction
{
    /**
     * Rumus Juknis 2025:
     * PHPNAP = round((0.35 * NKAJF) + (0.10 * NPD) + (0.55 * NPDD), 2)
     * Anti-Gagal Total: NAP ≤ 4.2 otomatis ditolak
     */
    public function execute(float $nkajf, float $npd, float $npdd): NAPResult
    {
        $nap = round((0.35 * $nkajf) + (0.10 * $npd) + (0.55 * $npdd), 2);
        
        $status = $nap <= 4.2 ? 'ditolak' : 'diterima';
        $statusCode = $nap <= 4.2 ? 'anti_fail' : 'valid';
        
        return new NAPResult(
            nap: $nap,
            nkajf: $nkajf,
            npd: $npd,
            npdd: $npdd,
            status: $status,
            statusCode: $statusCode,
            timestamp: now()
        );
    }
}
