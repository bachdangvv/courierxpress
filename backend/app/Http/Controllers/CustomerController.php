<?php
namespace App\Http\Controllers;

use App\Events\CourierStatusUpdated;
use App\Models\Courier;
use App\Models\CourierLocation;
use App\Models\Customer;
use App\Models\NotificationCustom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CustomerController extends Controller
{
    public function placeOrder(Request $r) {
        Gate::authorize('customer');
        $data = $r->validate([
            'type'=>'nullable|string',
            'weight'=>'nullable|numeric',
            'size'=>'nullable|string',
            'charge'=>'nullable|string',
            'distance'=>'nullable|numeric',
        ]);

        $data['status'] = Courier::STATUS_PENDING;
        $data['sender_id'] = $r->user()->customer->id;
        $c = Courier::create($data);

        $this->notify($r->user()->id, $c->id, "Courier #{$c->id} placed.");
        event(new CourierStatusUpdated($c));
        return $c;
    }

    public function myCouriers(Request $r) {
        Gate::authorize('customer');
        $cid = $r->user()->customer->id;
        return Courier::with('agent','status')
            ->where('sender_id',$cid)->latest()->paginate(10);
    }

    public function courierLocations(Courier $courier, Request $r) {
        Gate::authorize('customer');
        $cid = $r->user()->customer->id;
        abort_unless(in_array($cid, [$courier->sender_id]), 403);
        return $courier->locations()->orderBy('recorded_at')->get();
    }

    public function notifications(Request $r) {
        Gate::authorize('customer');
        return NotificationCustom::where('user_id',$r->user()->id)->latest()->paginate(20);
    }

    private function notify(int $userId, int $courierId, string $msg): void {
        NotificationCustom::create(['user_id'=>$userId,'courier_id'=>$courierId,'message'=>$msg]);
    }
}
