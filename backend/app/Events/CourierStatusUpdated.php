<?php

namespace App\Events;

use App\Models\Courier;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class CourierStatusUpdated implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(public Courier $courier) {}

    public function broadcastOn(): array {
        return [
            new \Illuminate\Broadcasting\PrivateChannel('couriers'.$this->courier->courier_id),                            // global admin feed
            new \Illuminate\Broadcasting\PrivateChannel('agent.'.$this->courier->agent_id), // agent feed
            new \Illuminate\Broadcasting\PrivateChannel('customer.'.$this->courier->sender_id),
        ];
    }

    public function broadcastAs(): string { return 'status.updated'; }

    public function broadcastWith(): array {
        return [
            'id'=>$this->courier->id,
            'status'=>$this->courier->status,
            'agent_id'=>$this->courier->agent_id,
            'sender_id'=>$this->courier->sender_id,
            'updated_at'=>$this->courier->updated_at?->toIso8601String(),
        ];
    }
}
