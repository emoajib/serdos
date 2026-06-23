<?php

namespace App\Domain\Serdos\ValueObjects;

use Carbon\Carbon;

class NAPResult
{
    public function __construct(
        public float $nap,
        public float $nkajf,
        public float $npd,
        public float $npdd,
        public string $status,
        public string $statusCode,
        public Carbon $timestamp
    ) {}

    public function toArray(): array
    {
        return [
            'nap' => $this->nap,
            'nkajf' => $this->nkajf,
            'npd' => $this->npd,
            'npdd' => $this->npdd,
            'status' => $this->status,
            'status_code' => $this->statusCode,
            'timestamp' => $this->timestamp->toIso8601String(),
        ];
    }
}
