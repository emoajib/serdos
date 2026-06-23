<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SimSetting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * BOOT MODEL: CLEAR CACHE ON UPDATE
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($model) {
            Cache::forget('sim_settings_map');
        });
    }

    /**
     * HIGH PERFORMANCE CACHED RETRIEVAL
     */
    public static function getMap()
    {
        return Cache::rememberForever('sim_settings_map', function () {
            return self::all()->pluck('value', 'key')->toArray();
        });
    }

    public static function getValue($key, $default = null)
    {
        $map = self::getMap();
        return $map[$key] ?? $default;
    }
}
