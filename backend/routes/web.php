<?php

use App\Events\LocationUpdated;
use Illuminate\Support\Facades\Route;

Route::get('/test-location', function () {
    event(new LocationUpdated(
        agentId: 'AGENT-123',
        lat: 13.7563,    // Bangkok
        lng: 100.5018,
        status: 'testing'
    ));
    return 'Event dispatched';
});