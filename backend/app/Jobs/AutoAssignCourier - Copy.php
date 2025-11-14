<?php

namespace App\Jobs;

use App\Models\Agent;
use App\Models\Courier;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class AutoAssignCourier implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $courierId;
    public float $radiusKm;

    public function __construct(int $courierId, float $radiusKm = 5.0)
    {
        $this->courierId = $courierId;
        $this->radiusKm  = $radiusKm;
    }

    public function handle(): void
    {
        $courier = Courier::find($this->courierId);
        if (!$courier) return;
        if ($courier->agent_id || $courier->status !== Courier::STATUS_PENDING) return;
        if (is_null($courier->sender_lat) || is_null($courier->sender_lng)) return;

        $lat = (float) $courier->sender_lat;
        $lng = (float) $courier->sender_lng;

        // Haversine on agent_current_lat/lng
        $h = "(6371 * acos(cos(radians(?)) * cos(radians(agent_current_lat)) * cos(radians(agent_current_lng) - radians(?)) + sin(radians(?)) * sin(radians(agent_current_lat))))";

        // Only candidates with status in {Available, Delivering OK} and coords set
        $candidates = Agent::query()
            ->whereIn('status', [Agent::AVAILABLE, Agent::DELIVERING_OK])
            ->whereNotNull('agent_current_lat')
            ->whereNotNull('agent_current_lng')
            ->select('agents.*')
            ->selectRaw("$h AS distance_km", [$lat, $lng, $lat])
            ->whereRaw("$h <= ?", [$lat, $lng, $lat, $this->radiusKm])
            ->orderBy('distance_km', 'asc')
            ->limit(30)
            ->get()
            ->map(function ($a) {
                $a->active_count = $a->activeCouriersCount();
                return $a;
            })
            ->filter(fn($a) => $a->active_count < 4) // capacity
            ->sortBy([['active_count','asc'],['distance_km','asc']]);

        foreach ($candidates as $agent) {
            $ok = DB::transaction(function () use ($courier, $agent) {
                $locked = Agent::where('id', $agent->id)->lockForUpdate()->first();
                if (!$locked) return false;

                // Re-check eligibility under lock
                if (!in_array($locked->status, [Agent::AVAILABLE, Agent::DELIVERING_OK])) return false;
                if (is_null($locked->agent_current_lat) || is_null($locked->agent_current_lng)) return false;
                $active = $locked->activeCouriersCount();
                if ($active >= 4) return false;

                // Assign
                $courier->agent_id = $locked->id;
                $courier->status   = Courier::STATUS_ASSIGNED;
                $courier->save();

                // Normalize resulting state (may flip to Delivering Full if now 4)
                $locked->normalizeStatusAfterCapacityChange();

                return true;
            });

            \Log::info("AutoAssignCourier running", [
    'courierId' => $this->courierId,
    'radiusKm'  => $this->radiusKm,
]);

            if ($ok) {
                // event(new CourierStatusUpdated($courier)); // broadcast if needed
                return;
            }
        }
    }
}