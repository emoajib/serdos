<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class Simulation extends Model
{
    use HasFactory, \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'user_id',
        'nkajf',
        'npd',
        'npdd',
        'nap',
        'status',
        'status_code',
    ];

    protected $casts = [
        'nkajf' => 'float',
        'npd' => 'float',
        'npdd' => 'float',
        'nap' => 'float',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
