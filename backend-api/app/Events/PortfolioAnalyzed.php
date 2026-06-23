<?php

namespace App\Events;

use App\Models\Portfolio;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
class PortfolioAnalyzed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Portfolio $portfolio
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->portfolio->user_id),
        ];
    }

    /**
     * Data to broadcast
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->portfolio->id,
            'title' => $this->portfolio->title,
            'similarity_score' => $this->portfolio->similarity_score,
            'status' => $this->portfolio->status,
        ];
    }
}
