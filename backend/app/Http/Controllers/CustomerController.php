<?php
namespace App\Http\Controllers;

use App\Events\CourierStatusUpdated;
use App\Models\Courier;
use App\Models\CourierLocation;
use App\Models\Customer;
use App\Models\NotificationCustom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    public function placeOrder(Request $r)
    {
        Gate::authorize('customer');

        // Validate full payload from your 4-step flow
        $data = $r->validate([
            // basic
            'type'      => ['nullable','string','max:50'],
            'weight'    => ['nullable','numeric','min:0'],
            'distance'  => ['nullable','numeric','min:0'],
            'size'      => ['nullable','string','max:50'],
            'charge'    => ['nullable','numeric','min:0'], // ensure numeric, not string

            // FROM (sender)
            'from_full_name' => ['required','string','max:120'],
            'from_email'     => ['nullable','email','max:120'],
            'from_phone'     => ['required','string','max:50'],
            'from_country'   => ['nullable','string','max:80'],
            'from_address'   => ['required','string','max:255'],
            'from_city'      => ['required','string','max:120'],
            'from_state'     => ['nullable','string','max:120'],
            'from_zip'       => ['nullable','string','max:40'],

            // TO (receiver)
            'to_full_name' => ['required','string','max:120'],
            'to_email'     => ['nullable','email','max:120'],
            'to_phone'     => ['required','string','max:50'],
            'to_country'   => ['nullable','string','max:80'],
            'to_address'   => ['required','string','max:255'],
            'to_city'      => ['required','string','max:120'],
            'to_state'     => ['nullable','string','max:120'],
            'to_zip'       => ['nullable','string','max:40'],

            // Package
            'length_cm' => ['required','numeric','min:0'],
            'width_cm'  => ['required','numeric','min:0'],
            'height_cm' => ['required','numeric','min:0'],
            'content_description' => ['nullable','string','max:2000'],

            // Payment
            'payment_method' => ['nullable','string','max:50'],
        ]);

        // Build create array
        $create = array_merge($data, [
            // sender
            'sender_id'       => $r->user()->customer->id, // you already use customers table
            // status/payment
            'status'          => defined(Courier::class.'::STATUS_PENDING')
                                ? Courier::STATUS_PENDING : 'Pending',
            'payment_status'  => 'Unpaid',
            // tracking/reference
            'tracking_code'   => 'TRK-'.Str::upper(Str::random(8)),
            'reference_code'  => Str::upper(Str::random(10)),
            // timestamps
            'last_located_at' => now(),
        ]);

        $courier = Courier::create($create);

        // Notify + broadcast
        $this->notify($r->user()->id, $courier->id, "Courier #{$courier->id} placed.");
        event(new CourierStatusUpdated($courier));

        return response()->json([
            'message' => 'Order placed',
            'courier' => $courier,
        ], 201);
    }

    public function trackByCode(string $trackingCode, Request $r)
{
    Gate::authorize('customer');

    $customerId = $r->user()->customer->id;

    // Find this user's courier by tracking_code
    $courier = Courier::with(['agent'])   // add more relations if you have them
        ->where('tracking_code', $trackingCode)
        ->where('sender_id', $customerId)
        ->first();

    if (!$courier) {
        return response()->json(['message' => 'Tracking not found'], 404);
    }

    return response()->json($courier);
}

    public function myCouriers(Request $r) {
        Gate::authorize('customer');
        $cid = $r->user()->customer->id;

        // NOTE: `with('status')` will break if there's no relation named 'status'.
        // Keep only 'agent' unless you actually have a Status model/relation.
        return Courier::with('agent')
            ->where('sender_id',$cid)->latest()->paginate(10);
    }

    public function courierLocations(Courier $courier, Request $r) {
        Gate::authorize('customer');
        $cid = $r->user()->customer->id;
        abort_unless($courier->sender_id === $cid, 403);
        return $courier->locations()->orderBy('recorded_at')->get();
    }

    public function notifications(Request $r) {
        Gate::authorize('customer');
        return NotificationCustom::where('user_id',$r->user()->id)->latest()->paginate(20);
    }

    private function notify(int $userId, int $courierId, string $msg): void {
        NotificationCustom::create([
            'user_id'=>$userId,
            'courier_id'=>$courierId,
            'message'=>$msg
        ]);
    }
}