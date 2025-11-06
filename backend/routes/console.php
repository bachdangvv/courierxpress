<?php

use Illuminate\Support\Facades\Schedule;
use App\Models\Courier;
use App\Jobs\AutoAssignCourier;

Schedule::call(function () {
    Courier::where('status', Courier::STATUS_PENDING)
        ->whereNotNull('sender_lat')
        ->whereNotNull('sender_lng')
        ->limit(50)
        ->pluck('id')
        ->each(fn ($id) => AutoAssignCourier::dispatch($id)->onQueue('assignments'));
})->everyMinute();
