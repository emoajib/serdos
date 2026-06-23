<?php

namespace App\Services;

use App\Domain\Serdos\Actions\CalculateNAPAction;
use App\Domain\Serdos\Actions\NAPValidator;
use App\Domain\Serdos\Actions\ValidateAntiFailAction;

class SerdosEngine
{
    /**
     * Orchestrator tipis untuk mengelola simulasi NAP
     */
    public function __construct(
        private CalculateNAPAction $calculateNAP,
        private NAPValidator $validator,
        private ValidateAntiFailAction $validateAntiFail
    ) {}

    public function simulate(array $data)
    {
        $this->validator->validate($data);

        $result = $this->calculateNAP->execute(
            nkajf: $data['nkajf'],
            npd: $data['npd'],
            npdd: $data['npdd']
        );

        $isValid = $this->validateAntiFail->execute($result);

        return [
            'result' => $result->toArray(),
            'valid' => $isValid,
            'reason' => $this->validateAntiFail->getReason($result),
        ];
    }
}
