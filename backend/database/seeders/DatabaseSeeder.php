<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Gọi các seeder khác tại đây, ví dụ:
        // $this->call([
        //     UserSeeder::class,
        //     CustomerSeeder::class,
        // ]);

        // Hoặc thêm dữ liệu mẫu
        \App\Models\User::factory(5)->create();
    }
}
