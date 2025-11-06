<?php
namespace App\Http\Controllers;

use App\Events\CourierLocationUpdated;
use App\Events\CourierStatusUpdated;
use App\Models\Courier;
use App\Models\Agent;
use App\Models\CourierLocation;
use App\Models\NotificationCustom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Models\CourierStatusHistory;

class AgentController extends Controller
{
    public function notifications(Request $r) {
        Gate::authorize('agent');
        return NotificationCustom::where('user_id',$r->user()->id)->latest()->paginate(20);
    }

    public function placedList(Request $r) {
        Gate::authorize('agent');
        $cid = $r->user()->agent->id;
        return Courier::with('sender','locations','agent')
            ->where('agent_id',$cid)->latest()->paginate(10);
    }

    
public function setStatus(Request $r)
{
    \Gate::authorize('agent');

    $data = $r->validate([
        'status' => 'required|in:Available,Not Available,Delivering OK,Delivering Full',
        'lat' => 'nullable|numeric',
        'lng' => 'nullable|numeric',
    ]);

    /** @var Agent $agent */
    $agent = $r->user()->agent;

    // Always allow switch to Not Available
    if ($data['status'] === Agent::NOT_AVAILABLE) {
        $agent->status = Agent::NOT_AVAILABLE;
        $agent->save();
        return response()->json(['agent' => $agent->fresh(), 'message' => 'Switched to Not Available']);
    }

    // Available is only reachable from Not Available + requires coords
    if ($data['status'] === Agent::AVAILABLE) {
        if ($agent->status !== Agent::NOT_AVAILABLE) {
            return response()->json(['message' => 'Can only switch to Available from Not Available'], 422);
        }
        if (!isset($data['lat'], $data['lng'])) {
            return response()->json(['message' => 'lat & lng are required when going Available'], 422);
        }

        $agent->agent_current_lat = (float)$data['lat'];
        $agent->agent_current_lng = (float)$data['lng'];
        // Temporarily mark Available, then immediately normalize to Delivering OK/Full:
        $agent->status = Agent::AVAILABLE;
        $agent->save();

        // Compute based on active count
        $active = $agent->activeCouriersCount();
        if ($active >= 4) {
            $agent->status = Agent::DELIVERING_FULL;
        } else {
            $agent->status = Agent::DELIVERING_OK; // becomes eligible
        }
        $agent->save();

        return response()->json(['agent' => $agent->fresh(), 'message' => 'Became Available (computed to '.$agent->status.')']);
    }

    // Manual set to Delivering OK / Full is not allowed (computed states)
    return response()->json(['message' => 'Delivering states are computed automatically'], 422);
}

public function activeCourier(Request $r)
{
    \Gate::authorize('agent');

    $agentId = $r->user()->agent->id;

    // Chỉ lấy những đơn còn đang hoạt động
    $rows = Courier::where('agent_id', $agentId)
        ->whereIn('status', [
            Courier::STATUS_ASSIGNED,
            Courier::STATUS_DELIVERING,
        ])
        ->latest()
        ->paginate(50);

    return $rows;
}

public function courierHistory(Request $r)
{
    \Gate::authorize('agent');
    $agentId = $r->user()->agent->id;

    return Courier::where('agent_id', $agentId)
        ->whereIn('status', [
            Courier::STATUS_DONE,
            Courier::STATUS_CANCELED,
        ])
        ->latest()
        ->paginate(50);
}

public function uploadProof(Request $r, Courier $courier)
{
    Gate::authorize('agent');
    abort_unless(optional($r->user()->agent)->id === $courier->agent_id, 403);

    $data = $r->validate([
        'image' => ['required', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
    ]);

    $path = $r->file('image')->store('couriers', 'public');
    $courier->update(['agent_image' => $path]);

    return response()->json([
        'message' => 'Proof uploaded successfully',
        'courier' => $courier
    ]);
}

    public function updateLocation(Request $r, Courier $courier)
{
    Gate::authorize('agent');
    $agent = $r->user()->agent;
    abort_unless($agent && $agent->id === $courier->agent_id, 403);

    $data = $r->validate([
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
    ]);

    \App\Models\CourierLocation::create([
        'courier_id' => $courier->id,
        'agent_id' => $agent->id,
        'latitude' => $data['latitude'],
        'longitude' => $data['longitude'],
        'recorded_at' => now(),
    ]);

    $courier->update(['last_located_at' => now()]);

    return response()->json(['message' => 'Location recorded']);
}


    public function updateCourierStatus(Request $r, Courier $courier)
{
    Gate::authorize('agent');
    abort_unless(optional($r->user()->agent)->id === $courier->agent_id, 403);


    $data = $r->validate([
        'status' => 'required|in:' .
            implode(',', [
                Courier::STATUS_DELIVERING,
                Courier::STATUS_DONE,
                Courier::STATUS_CANCELED,
            ]),
    ]);

    if ($r->hasFile('image')) {
        $path = $r->file('image')->store('couriers', 'public');
        $courier->agent_image = $path;
    }

    $courier->status = $data['status'];
    $courier->save();
    $agent = $r->user()->agent;

    CourierStatusHistory::create([
    'courier_id' => $courier->id,
    'status' => $data['status'],
    'changed_at' => now(),
]);

    event(new CourierStatusUpdated($courier));

    if ($courier->agent_id) {
        $courier->agent?->normalizeStatusAfterCapacityChange();
    }

    return ['ok'=>true,'status'=>$courier->status];
}


    private function notifyAll(int $userId, int $agentId, int $courierId, string $msg): void {
        NotificationCustom::create(['user_id'=>$userId,'agent-id'=>$agentId,'courier_id'=>$courierId,'message'=>$msg]);
    }
}
