<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - SERDOS DIGITAL NUSANTARA
|--------------------------------------------------------------------------
|
| Routing ini berfungsi sebagai fallback untuk Single Page Application (SPA).
| Semua rute yang tidak diawali dengan /api akan diarahkan ke index.html
| agar React Router dapat menanganinya.
|
*/

// 🚀 CATCH-ALL ROUTE FOR REACT SPA
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api|storage|assets).*$'); 

// Rute ini memastikan bahwa jika user mengetik /login, /dashboard, dll
// maka file utama React (index.html) yang akan dikirim ke browser.
