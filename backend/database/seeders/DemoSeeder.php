<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Agent;
use App\Models\Customer;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // --- Admin
            $admin = User::updateOrCreate(
                ['email' => 'admin@cx.test'],
                ['name' => 'Admin', 'password' => 'password', 'role' => 'admin']
            );

            // --- Agent One
            $agentUser = User::updateOrCreate(
                ['email' => 'agent@cx.test'],
                ['name' => 'Agent One', 'password' => 'password', 'role' => 'agent']
            );

            Agent::updateOrCreate(
                ['user_id' => $agentUser->id],
                ['name' => $agentUser->name, 'status' => 'Available']
            );

            // --- Customers: Alice & Bob
            $aliceUser = User::updateOrCreate(
                ['email' => 'alice@cx.test'],
                ['name' => 'Alice', 'password' => 'password', 'role' => 'customer']
            );
            Customer::updateOrCreate(
                ['user_id' => $aliceUser->id],
                ['name' => 'Alice', 'email' => 'alice@cx.test']
            );

            $bobUser = User::updateOrCreate(
                ['email' => 'bob@cx.test'],
                ['name' => 'Bob', 'password' => 'password', 'role' => 'customer']
            );
            Customer::updateOrCreate(
                ['user_id' => $bobUser->id],
                ['name' => 'Bob', 'email' => 'bob@cx.test']
            );
        });
    }
}
