<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class LocationUpdated implements ShouldBroadcast
{
    use Dispatchable;

    public function __construct(
        public string $agentId,
        public float $lat,
        public float $lng,
        public string $status = 'moving'
    ) {}

    // Public (non-auth) channel; use Private/Presence if you need auth later
    public function broadcastOn(): Channel
    {
        return new Channel('courier-location');
    }

    public function broadcastAs(): string
    {
        return 'location.updated';
    }

    // Optional: shape payload
    public function broadcastWith(): array
    {
        return [
            'agentId' => $this->agentId,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'status' => $this->status,
            'at' => now()->toISOString(),
        ];
    }
}