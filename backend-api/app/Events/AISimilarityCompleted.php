<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AISimilarityCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $documentId,
        public array $result
    ) {}

    public function broadcastOn(): array
    {
        $userId = $this->result['user_id'] ?? null;
        
        return [
            new Channel('private-ai-result.' . $userId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ai.similarity.completed';
    }
}
