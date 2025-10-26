<?php

namespace App\Events;

use App\Models\CourierLocation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class CourierLocationUpdated implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(public CourierLocation $point) {}

    public function broadcastOn(): array {
        return [
            new \Illuminate\Broadcasting\PrivateChannel('courier.'.$this->point->courier_id),
        ];
    }

    public function broadcastAs(): string { return 'location.updated'; }

    public function broadcastWith(): array {
        return [
            'courier_id'=>$this->point->courier_id,
            'longitude'=>$this->point->longitude,
            'latitude'=>$this->point->latitude,
            'recorded_at'=>$this->point->recorded_at->toIso8601String(),
        ];
    }
}
