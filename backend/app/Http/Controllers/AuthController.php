<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Models\Agent;
use App\Models\Customer;

class AuthController extends Controller
{
    /**
     * Đăng ký tài khoản mới
     */
    public function register(Request $r)
    {
        $data = $r->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:6',
            'role'      => ['required', Rule::in(['admin', 'agent', 'customer'])],
        ]);

        $user = User::create([
            'name'      => $data['name'],
            'email'     => $data['email'],
            'password'  => Hash::make($data['password']),
            'role'      => $data['role'],
        ]);

        // Tự động tạo bản ghi Agent/Customer tương ứng
        if ($user->role === 'agent') {
            Agent::create(['user_id' => $user->id, 'name' => $user->name]);
        } elseif ($user->role === 'customer') {
            Customer::create([
                'user_id' => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
            ]);
        }

        // Đăng nhập ngay sau khi đăng ký
        Auth::login($user);

        return response()->json([
            'message' => 'Registered successfully',
            'user'    => $user->load('agent', 'customer'),
        ], 201);
    }

    /**
     * Đăng nhập (dùng chung cho admin, agent, customer)
     * SPA dùng Sanctum → cookie session
     */
    public function login(Request $r)
    {
        $r->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($r->only('email', 'password'), true)) {
            \Log::info('Login failed for: '.$r->email);
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        // Nếu muốn giới hạn vai trò từng route riêng thì kiểm tra tại đây:
        // if ($role === 'agent' && $user->role !== 'agent') { ... }

        $r->session()->regenerate();

        return response()->json([
            'message' => 'Login successful',
            'user'    => $user->load('agent', 'customer'),
        ]);
    }

    /**
     * Trả về thông tin user hiện tại (phải auth:sanctum)
     */
    public function me(Request $r)
{
    $user = $r->user();

    if (!$user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    return response()->json($user->load('agent', 'customer'));
}

    /**
     * Đăng xuất
     */
    public function logout(Request $r)
    {
        Auth::guard('web')->logout();

        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return response()->noContent();
    }
}
