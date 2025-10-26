<?php
namespace App\Http\Controllers;

use App\Events\CourierStatusUpdated;
use App\Models\Agent;
use App\Models\Courier;
use App\Models\NotificationCustom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AdminController extends Controller
{
    public function assignAgent(Request $r, Courier $courier, Agent $agent)
    {
        Gate::authorize('admin');

        // Block assigning agents that are not eligible
        if (! $agent->isAssignable()) {
            return response()->json([
                'message' => "Agent cannot be assigned (status: {$agent->status})."
            ], 422);
        }

        // Prevent reassign if courier already has an agent and is in delivery flow
        if ($courier->agent_id && in_array($courier->status, ['Delivering','Done'], true)) {
            return response()->json([
                'message' => 'Courier already in delivery workflow.'
            ], 422);
        }

        // perform assignment
        $courier->agent_id = $agent->id;
        $courier->status   = Courier::STATUS_ASSIGNED;
        $courier->save();

        


        // <<< IMPORTANT: flip agent to ASSIGNED so they vanish from “assignable” lists
        $agent->update(['status' => Agent::ASSIGNED]);

        event(new CourierStatusUpdated($courier->fresh()));
        $this->notifyAll($courier, "Courier #{$courier->id} assigned to agent #{$agent->id}.");

        return [
            'ok' => true,
            'courier' => $courier->fresh(['agent']),
            'agent' => $agent->fresh(),
        ];
    }

    // Optional helper for admin to list only assignable agents
    public function listAssignableAgents()
{
    Gate::authorize('admin');
    $agents = Agent::assignable()->orderBy('name')->get();
    return response()->json($agents->values());
}

    public function cancel(Courier $courier) {
        Gate::authorize('admin');
        $courier->update(['status' => Courier::STATUS_CANCELED]);
        event(new CourierStatusUpdated($courier->fresh()));
        $this->notifyAll($courier, "Courier #{$courier->id} canceled by admin.");
        return $courier;
    }

    public function placedList(Request $r) {
        Gate::authorize('admin');
        return Courier::with('sender','agent')
        ->where('status', Courier::STATUS_PENDING) 
        ->latest()
        ->paginate(10);
    }

    public function agents() {
        Gate::authorize('admin');
        return Agent::assignable()->get(['id','name','status']);
    }

    public function notifications(Request $request)
    {
        try {
            $perPage = min(50, (int) $request->query('per_page', 15));
            $rows = NotificationCustom::query()
                ->orderByDesc('created_at')
                ->paginate($perPage);

            // shape rows for frontend
            $data = collect($rows->items())->map(function ($n) {
                return [
                    'id'         => $n->id,
                    'courier_id' => $n->courier_id ?? null,
                    'status'     => $n->status ?? null,
                    'message'    => $n->message ?? null,
                    'created_at' => $n->created_at,
                ];
            });

            return response()->json([
                'data' => $data,
                'meta' => [
                    'page'     => $rows->currentPage(),
                    'per_page' => $rows->perPage(),
                    'total'    => $rows->total(),
                ],
            ]);
        } catch (\Throwable $e) {
            // Log exact error for you; return safe message to client
            \Log::error('Admin notifications error', ['e' => $e]);
            return response()->json(['message' => 'Failed to load notifications'], 500);
        }
    }

    private function notifyAll(Courier $c, string $msg): void {
        $uids = collect([
            optional($c->agent?->user)->id,
            optional($c->sender?->user)->id,
        ])->filter()->unique()->all();
        foreach($uids as $uid){
            NotificationCustom::create(['user_id'=>$uid,'courier_id'=>$c->id,'message'=>$msg]);
        }
    }
}
