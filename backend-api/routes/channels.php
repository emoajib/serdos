<?php

use Illuminate\Support\Facades\Broadcast;

// Private channels untuk realtime updates
Broadcast::channel('private-payment.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('private-ai-result.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('private-simulation.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
