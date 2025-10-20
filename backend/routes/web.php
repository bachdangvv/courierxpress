<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Events\LocationUpdated;

Route::get('/test-broadcast', function () {
    broadcast(new LocationUpdated(1, 21.0285, 105.8542));
    return 'Broadcast sent!';
});