<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes (Laravel 11/12)
|--------------------------------------------------------------------------
| Public auth endpoints (register/login) and protected routes guarded by
| Sanctum + Gates (admin/agent/customer). Broadcasting private channel
| auth is handled via POST /broadcasting/auth automatically.
*/



Route::middleware('auth:sanctum')->group(function () {
    

    // =========================
    // Admin
    // =========================
    Route::middleware('web','can:admin')->group(function () {
        // panels
        Route::get('/admin/placed',                 [AdminController::class, 'placedList']);       // list couriers with status=Placed
        Route::get('/admin/agents',                 [AdminController::class, 'agents']);           // available agents
        Route::get('/admin/notifications', [AdminController::class, 'notifications'])
        ->middleware('role:admin');    // all notifications (paginated)

        // actions
        Route::post('/admin/couriers/{courier}/assign/{agent}', [AdminController::class, 'assignAgent']);
        Route::get('/admin/agents/assignable', [AdminController::class, 'listAssignableAgents']);       // assign to agent (sets Delivering)
        Route::post('/admin/couriers/{courier}/cancel', [AdminController::class, 'cancel']);       // cancel courier
    });

    // =========================
    // Agent
    // =========================
    Route::middleware('web','can:agent')->group(function () {
        Route::get('/agent/notifications',                [AgentController::class, 'notifications']);
        Route::post('/agent/couriers/{courier}/location', [AgentController::class, 'updateLocation']);
        Route::post('/agent/couriers/{courier}/status', [AgentController::class, 'updateCourierStatus']);
        Route::post('/agent/availability', [AgentController::class, 'setAvailability']);
        Route::get('/agent/placed', [AgentController::class, 'placedList']);
    });

    // =========================
    // Customer
    // =========================
    Route::middleware('web','can:customer')->group(function () {
        Route::post('/customer/order',                        [CustomerController::class, 'placeOrder']);      // place courier
        Route::get('/customer/couriers',                      [CustomerController::class, 'myCouriers']);      // history (paginated)
        Route::get('/customer/couriers/{courier}/locations',  [CustomerController::class, 'courierLocations']); // map timeline
        Route::get('/customer/notifications',                 [CustomerController::class, 'notifications']);
        Route::get('/customer/track/{trackingCode}',          [CustomerController::class, 'trackByCode']);
    });
});

// Optional: quick health check
Route::get('/health', fn () => ['ok' => true, 'time' => now()->toIso8601String()]);
Route::post('/debug/echo', function (\Illuminate\Http\Request $r) {
    return response()->json([
        'json' => $r->json()->all(),
        'all'  => $r->all(),
    ]);
});