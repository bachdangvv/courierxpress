<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create an admin account
        User::updateOrCreate([
            'email' => 'admin@xpress.com',
        ], [
            'name' => 'Admin',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);
    }
}
