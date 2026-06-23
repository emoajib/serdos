<?php

/**
 * SERDOS Digital Nusantara Helper Functions
 * Common utility functions for the application
 */

if (! function_exists('serdos_version')) {
    /**
     * Get SERDOS version
     */
    function serdos_version(): string
    {
        return '2.1.0';
    }
}

if (! function_exists('format_nap')) {
    /**
     * Format NAP value with proper decimal places
     */
    function format_nap(float $nap): string
    {
        return number_format($nap, 2, '.', '');
    }
}

if (! function_exists('is_anti_fail')) {
    /**
     * Check if NAP meets anti-fail threshold
     */
    function is_anti_fail(float $nap): bool
    {
        return $nap <= 4.2;
    }
}

if (! function_exists('get_nap_status')) {
    /**
     * Get NAP status description
     */
    function get_nap_status(float $nap): string
    {
        if (is_anti_fail($nap)) {
            return 'REJECTED - Below Minimum Threshold';
        }
        
        if ($nap >= 9.0) {
            return 'EXCELLENT';
        }
        
        if ($nap >= 8.0) {
            return 'VERY GOOD';
        }
        
        if ($nap >= 7.0) {
            return 'GOOD';
        }
        
        if ($nap >= 6.0) {
            return 'SATISFACTORY';
        }
        
        return 'NEEDS IMPROVEMENT';
    }
}
