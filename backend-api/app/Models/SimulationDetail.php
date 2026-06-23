<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class SimulationDetail extends Model
{
    protected $fillable = [
        'simulation_id',
        'nkajf_breakdown',
        'npd_breakdown',
        'npdd_breakdown',
        'perceptual_multirater',
    ];

    protected $casts = [
        'nkajf_breakdown' => 'array',
        'npd_breakdown' => 'array',
        'npdd_breakdown' => 'array',
        'perceptual_multirater' => 'array',
    ];

    public function simulation()
    {
        return $this->belongsTo(Simulation::class);
    }
}
