<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use App\Models\Courier;



Broadcast::channel('private-user.{id}', fn ($user, $id) => (int)$user->id === (int)$id);

Broadcast::channel('agent.{agentId}', function (User $user, int $agentId) {
    return $user->role === 'agent' && optional($user->agent)->id === $agentId;
});

Broadcast::channel('customer.{customerId}', function (User $user, int $customerId) {
    return $user->role === 'customer' && optional($user->customer)->id === $customerId;
});

Broadcast::channel('courier.{courierId}', function (User $user, int $courierId) {
    // allow sender, receiver, assigned agent, and admins
    $c = Courier::find($courierId);
    if (!$c) return false;
    if ($user->role === 'admin') return true;
    if ($user->role === 'agent' && in_array(optional($user->agent)->id === $c->agent_id)) return true;
    if ($user->role === 'customer' && in_array(optional($user->customer)->id, [$c->sender_id])) return true;
    return false;
});
