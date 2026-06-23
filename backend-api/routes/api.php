<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SimulationController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| SERDOS DIGITAL NUSANTARA - API GATEWAY v2.0
|--------------------------------------------------------------------------
*/

Route::get("health", function () {
    return response()->json([
        "status" => "ok",
        "app" => config("app.name"),
        "version" => "2.0.0",
        "timestamp" => now()->toIso8601String(),
    ]);
});

Route::prefix("v1")->group(function () {
    
    // ─── PUBLIC AUTH ────────────────────────────────────────────────────────
    Route::post("register", [AuthController::class, "register"]);
    Route::post("login", [AuthController::class, "login"]);

    // ─── PROTECTED RESOURCES ────────────────────────────────────────────────
    Route::middleware("auth:sanctum")->group(function () {
        
        Route::post("logout", [AuthController::class, "logout"]);
        Route::get("me", [AuthController::class, "me"]);

        // ─── SIMULATION & PORTFOLIO ─────────────────────────────────────────
        Route::get("simulations/latest", [SimulationController::class, "latest"]);
        Route::post("simulations/audit-ai", [SimulationController::class, "auditAI"]);
        Route::apiResource("simulations", SimulationController::class);
        Route::apiResource("portfolios", PortfolioController::class);

        // ─── PAYMENT ENGINE ─────────────────────────────────────────────────
        Route::post("payments/checkout", [PaymentController::class, "checkout"]);
        Route::get("payments/history", [PaymentController::class, "history"]);

        // ─── SUPREME ADMIN CONSOLE (RBAC) ───────────────────────────────────
        Route::group(["prefix" => "admin"], function () {
            
            // Stats & Business Settings
            Route::get("stats", [AdminController::class, "stats"]);
            Route::get("settings", [AdminController::class, "getSettings"]);
            Route::post("settings", [AdminController::class, "updateSetting"]);
            
            // Content & Rubrics
            Route::get("rubrics", [AdminController::class, "getRubrics"]);
            
            // User Management (RBAC & Premium)
            Route::get("users", [AdminController::class, "getUsers"]);
            Route::post("users/{id}/toggle-premium", [AdminController::class, "togglePremium"]);
            Route::post("users/{id}/role", [AdminController::class, "updateUserRole"]);
            
            // Strategic Operations
            Route::get("payments/pending", [AdminController::class, "getPendingPayments"]);
            Route::post("payments/{id}/approve", [AdminController::class, "approvePayment"]);
        });

    });
});

