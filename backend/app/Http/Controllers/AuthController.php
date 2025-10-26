<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Agent;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $r) {
        $data = $r->validate([
            'name'=>'required|string|max:255',
            'email'=>'required|email|unique:users,email',
            'password'=>'required|string|min:6',
            'role'=>['required', Rule::in(['admin','agent','customer'])],
        ]);
        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>Hash::make($data['password']),
            'role'=>$data['role'],
        ]);
        if($user->role==='agent'){
            Agent::create(['user_id'=>$user->id,'name'=>$user->name]);
        } elseif($user->role==='customer'){
            Customer::create(['user_id'=>$user->id,'name'=>$user->name,'email'=>$user->email]);
        }
        $token = $user->createToken('web')->plainTextToken;
        return response()->json(['token'=>$token,'user'=>$user->load('agent','customer')], 201);
    }

    public function login(Request $r) {
        $data = $r->validate(['email'=>'required|email','password'=>'required']);
        $user = User::where('email',$data['email'])->first();
        if(!$user || !Hash::check($data['password'],$user->password)) {
            return response()->json(['message'=>'Invalid credentials'], 422);
        }
        $token = $user->createToken('web')->plainTextToken;
        return ['token'=>$token,'user'=>$user->load('agent','customer')];
    }

    public function me(Request $r) {
        return $r->user()->load('agent','customer');
    }

    public function logout(Request $r) {
        $r->user()->currentAccessToken()->delete();
        return response()->noContent();
    }
}
