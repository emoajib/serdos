<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SimRubric extends Model
{
    protected $fillable = ['role_group', 'order', 'label', 'low_label', 'high_label', 'is_inverse'];
}
