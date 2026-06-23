<?php
/**
 * SERDOS Digital Nusantara - API Entry Point
 * This routes all requests to the Laravel application
 */

// Define base path
define('LARAVEL_START', microtime(true));

// Load composer autoloader
require __DIR__ . '/../vendor/autoload.php';

// Create and run the application
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Get the HTTP kernel
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);

// Handle the request
$response = $kernel->handle(
    $request = \Illuminate\Http\Request::capture()
);

// Send the response
$response->send();

// Terminate the request
$kernel->terminate($request, $response);
