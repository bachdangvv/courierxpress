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

    
public function setAvailability(Request $r)
{
    Gate::authorize('agent');

    $data = $r->validate([
        // Accept both spellings coming from the UI
        'status' => 'required|in:Available,NotAvailable,Not Available',
    ]);

    // Normalize incoming value to match constants
    $status = $data['status'] === 'Not Available'
        ? Agent::NOT_AVAILABLE
        : $data['status']; // "Available" or "Not Available"

    $agent = $r->user()->agent;

    // Prevent switching to Available if currently Delivering
    if ($agent->status === Agent::DELIVERING && $status === Agent::AVAILABLE) {
        return response()->json(['message' => 'Finish current deliveries first.'], 422);
    }

    $agent->update(['status' => $status]);

    return ['ok' => true, 'agent' => $agent->fresh()];
}

    public function updateLocation(Request $r, Courier $courier)
    {
        Gate::authorize('agent');
        abort_unless(optional($r->user()->agent)->id === $courier->agent_id, 403);

        $data = $r->validate([
            'longitude' => 'required|numeric',
            'latitude'  => 'required|numeric',
        ]);

        $point = CourierLocation::create([
            'courier_id'  => $courier->id,
            'agent_id'    => $courier->agent_id,  
            'longitude'   => $data['longitude'],
            'latitude'    => $data['latitude'],
            'recorded_at' => now(),
        ]);

        // $courier->update([
        //     'longitude'       => $data['longitude'],
        //     'latitude'        => $data['latitude'],
        //     'last_located_at' => now(),
        // ]);

         // First movement => flip statuses
        $agent = $r->user()->agent;
        if ($agent->status !== Agent::DELIVERING) {
            $agent->update(['status' => Agent::DELIVERING]);
        }
        if ($courier->status === 'Pending' || 'Assigned') {
            $courier->update(['status' => 'Delivering']);
            event(new CourierStatusUpdated($courier));
        }

        event(new CourierLocationUpdated($point));

        return ['ok'=>true,'point'=>$point,'courier'=>$courier->fresh(),'agent'=>$agent->fresh()];
    }

    public function updateCourierStatus(Request $r, Courier $courier)
{
    Gate::authorize('agent');
    abort_unless(optional($r->user()->agent)->id === $courier->agent_id, 403);

    $data = $r->validate([
        'status' => 'required|in:Done,Canceled', // only allow these from Agent
    ]);

    $courier->status = $data['status'];
    $courier->save();
    $agent = $r->user()->agent;

    event(new CourierStatusUpdated($courier));

    if ($r->user()->agent) {
        $r->user()->agent->update(['status' => Agent::AVAILABLE]);
    }

    return ['ok'=>true,'status'=>$courier->status];
}


    private function notifyAll(int $userId, int $agentId, int $courierId, string $msg): void {
        NotificationCustom::create(['user_id'=>$userId,'agent-id'=>$agentId,'courier_id'=>$courierId,'message'=>$msg]);
    }
}
