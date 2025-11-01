<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\AuthController;

    Route::middleware(['web'])->group(function () {
// session
Route::get('/auth/me',     [AuthController::class, 'me']);
Route::post('/auth/logout',[AuthController::class, 'logout']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/agent/login', [AuthController::class, 'login']);
Route::post('/customer/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Đăng ký
Route::post('/register', [AuthController::class, 'register']);
});