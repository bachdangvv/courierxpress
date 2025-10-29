<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        if (! Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $t) {
                $t->string('role')->default('customer')->index();
            });
        }
    }

    public function down(): void {
        if (Schema::hasColumn('users', 'role')) {
            Schema::table('users', function (Blueprint $t) {
                $t->dropIndex(['role']); // safe if created above
                $t->dropColumn('role');
            });
        }
    }
};
