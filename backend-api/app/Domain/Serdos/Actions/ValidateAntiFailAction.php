<?php

namespace App\Domain\Serdos\Actions;

use App\Domain\Serdos\ValueObjects\NAPResult;

class ValidateAntiFailAction
{
    /**
     * Validasi Anti-Gagal Total: NAP ≤ 4.2 otomatis ditolak
     */
    public function execute(NAPResult $result): bool
    {
        return $result->nap > 4.2;
    }

    public function getReason(NAPResult $result): string
    {
        if ($result->nap <= 4.2) {
            return 'NAP score ' . $result->nap . ' tidak memenuhi standar minimum (> 4.2)';
        }
        return 'Valid';
    }
}
