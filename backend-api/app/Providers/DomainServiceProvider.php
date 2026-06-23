<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Domain\Serdos\Actions\CalculateNAPAction;
use App\Domain\Serdos\Actions\NAPValidator;
use App\Domain\Serdos\Actions\ValidateAntiFailAction;
use App\Services\SerdosEngine;
use App\Services\AIProxyService;
use App\Services\PaymentGateway;

class DomainServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Domain Actions
        $this->app->singleton(CalculateNAPAction::class, fn() => new CalculateNAPAction());
        $this->app->singleton(NAPValidator::class, fn() => new NAPValidator());
        $this->app->singleton(ValidateAntiFailAction::class, fn() => new ValidateAntiFailAction());

        // Services
        $this->app->singleton(SerdosEngine::class, fn($app) => new SerdosEngine(
            $app->make(CalculateNAPAction::class),
            $app->make(NAPValidator::class),
            $app->make(ValidateAntiFailAction::class)
        ));

        $this->app->singleton(AIProxyService::class, fn() => new AIProxyService());
        $this->app->singleton(PaymentGateway::class, fn() => new PaymentGateway());
    }

    public function boot(): void
    {
        //
    }
}
