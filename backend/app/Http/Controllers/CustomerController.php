<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Events\CourierStatusUpdated;
use App\Models\Courier;
use App\Models\CourierLocation;
use App\Models\Customer;
use App\Models\NotificationCustom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use App\Jobs\AutoAssignCourier;
use App\Models\CourierStatusHistory;


class CustomerController extends Controller
{

    public function locations(Courier $courier)
{
    return CourierLocation::where('courier_id', $courier->id)
        ->orderBy('recorded_at', 'desc')
        ->get(['latitude', 'longitude', 'recorded_at']);
}

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
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],

            // Payment
            'payment_method' => ['nullable','string','max:50'],

            'sender_lat'     => ['nullable','numeric','between:-90,90'],
            'sender_lng'     => ['nullable','numeric','between:-180,180'],
            'to_lat'        => ['nullable','numeric','between:-90,90'],
            'to_lng'        => ['nullable','numeric','between:-180,180'],
        ]);

        // Xử lý upload ảnh TRƯỚC KHI tạo courier
    $path = null;
    if ($r->hasFile('image')) {
        $path = $r->file('image')->store('couriers', 'public');
    }

    // Chuẩn bị dữ liệu tạo
    $create = array_merge($data, [
        'sender_id'      => $r->user()->customer->id,
        'status'         => defined(Courier::class.'::STATUS_PENDING') ? Courier::STATUS_PENDING : 'Pending',
        'payment_status' => 'Unpaid',
        'tracking_code'  => 'BMT-'.Str::upper(Str::random(8)),
        'last_located_at'=> now(),
    ]);

    // Nếu có ảnh thì thêm vào create
    if ($path) {
        $create['sender_image'] = $path;
    }

    // ✅ Tạo courier
    $courier = Courier::create($create);

    CourierStatusHistory::create([
    'courier_id' => $courier->id,
    'status' => $courier->status,
    'changed_at' => now(),
]);

    \Log::info('📦 Received order payload', $r->all());
    \Log::info('✅ Stored sender image path', ['path' => $path]);

        // Notify + broadcast
        $this->notify($r->user()->id, $courier->id, "Courier #{$courier->id} placed.");
        event(new CourierStatusUpdated($courier));

        AutoAssignCourier::dispatch($courier->id)->onQueue('assignments');

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

public function trackDetail($trackingCode, Request $r)
{
    Gate::authorize('customer');

    $customerId = $r->user()->customer->id;

    $courier = \App\Models\Courier::where('tracking_code', $trackingCode)
        ->where('sender_id', $customerId)
        ->with([
            'agent:id,name',
            'locations' => function($q) {
                $q->orderBy('recorded_at', 'asc');
            }
        ])
        ->first();

    if (!$courier) {
        return response()->json(['message' => 'Tracking not found'], 404);
    }

    // 🟢 Sender Location
    $sender = [
        'lat' => $courier->sender_lat,
        'lng' => $courier->sender_lng,
        'label' => 'Sender',
    ];

    // 🟢 Receiver Location
    $receiver = [
        'lat' => $courier->to_lat,
        'lng' => $courier->to_lng,
        'label' => 'Receiver',
    ];

    // 🟢 Agent (courier) path from CourierLocation
    $agentPath = $courier->locations->map(fn($loc) => [
        'lat' => $loc->latitude,
        'lng' => $loc->longitude,
        'recorded_at' => $loc->recorded_at,
    ])->values();

    // 🟢 Nếu agent chưa di chuyển, thêm vị trí khởi đầu
    if ($agentPath->isEmpty() && $courier->sender_lat && $courier->sender_lng) {
        $agentPath->push([
            'lat' => $courier->sender_lat,
            'lng' => $courier->sender_lng,
            'recorded_at' => $courier->last_located_at,
        ]);
    }

    return response()->json([
        'tracking_code' => $courier->tracking_code,
        'status' => $courier->status,
        'sender' => $sender,
        'receiver' => $receiver,
        'agent' => [
            'id' => $courier->agent?->id,
            'name' => $courier->agent?->name,
        ],
        'agent_locations' => $agentPath,
    ]);
}


public function trackingHistory(Courier $courier, Request $r)
{
    Gate::authorize('customer');
    abort_unless($courier->sender_id === $r->user()->customer->id, 403);

    return CourierStatusHistory::where('courier_id', $courier->id)
        ->orderBy('changed_at', 'asc')
        ->get();
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

    public function show(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->isCustomer()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Get or create customer profile
        $customer = $user->customer;
        if (!$customer) {
            $customer = Customer::create([
                'user_id' => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
            ]);
        }

        return response()->json([
            'name'    => $customer->name ?? $user->name,
            'email'   => $user->email,   // from users table
            'phone'   => $customer->phone,
            'address' => $customer->address,
        ]);
    }

    /**
     * PUT /api/customer/profile
     * Update profile info and/or change password in one endpoint.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->isCustomer()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate both profile fields and password fields (all optional)
        $data = $request->validate([
            // profile fields
            'name'    => 'sometimes|required|string|max:255',
            'phone'   => 'sometimes|nullable|string|max:50',
            'address' => 'sometimes|nullable|string|max:255',

            // password fields
            'currentPassword' => 'sometimes|required_with:newPassword,confirmPassword|string',
            'newPassword'     => 'sometimes|required_with:currentPassword,confirmPassword|string|min:6',
            'confirmPassword' => 'sometimes|required_with:currentPassword,newPassword|same:newPassword',
        ]);

        $updatedProfile = false;
        $changedPassword = false;

        // --- Update profile info (name / phone / address) ---
        if ($request->hasAny(['name', 'phone', 'address'])) {
            $customer = $user->customer;
            if (!$customer) {
                $customer = new Customer([
                    'user_id' => $user->id,
                    'email'   => $user->email,
                ]);
            }

            if ($request->has('name')) {
                $customer->name = $data['name'];
                $user->name = $data['name'];   // keep user.name in sync
            }
            if ($request->has('phone')) {
                $customer->phone = $data['phone'] ?? null;
            }
            if ($request->has('address')) {
                $customer->address = $data['address'] ?? null;
            }

            $customer->save();
            $user->save();
            $updatedProfile = true;
        }

        // --- Change password if requested ---
        if ($request->filled('currentPassword') || $request->filled('newPassword')) {
            // Check current password
            if (!Hash::check($data['currentPassword'], $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect.',
                ], 422);
            }

            // Use mutator on User model to hash
            $user->password = $data['newPassword'];
            $user->save();
            $changedPassword = true;
        }

        if (!$updatedProfile && !$changedPassword) {
            return response()->json([
                'message' => 'Nothing to update.',
            ], 400);
        }

        return response()->json([
            'message' => trim(
                ($updatedProfile ? 'Profile updated. ' : '') .
                ($changedPassword ? 'Password changed.' : '')
            ),
        ]);
    }

}