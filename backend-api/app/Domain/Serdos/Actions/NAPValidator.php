<?php

namespace App\Domain\Serdos\Actions;

use Illuminate\Validation\ValidationException;

class NAPValidator
{
    public function validate(array $data): bool
    {
        $rules = [
            'nkajf' => 'required|numeric|between:0,100',
            'npd' => 'required|numeric|between:0,100',
            'npdd' => 'required|numeric|between:0,100',
        ];

        $validator = \Illuminate\Support\Facades\Validator::make($data, $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return true;
    }
}
