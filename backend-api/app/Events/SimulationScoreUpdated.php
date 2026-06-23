<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SimulationScoreUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $userId,
        public array $scoreData
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('private-simulation.' . $this->userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'simulation.score.updated';
    }
}
