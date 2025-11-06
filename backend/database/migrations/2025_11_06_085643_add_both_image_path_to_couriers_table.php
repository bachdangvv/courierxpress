<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::table('couriers', function (Blueprint $table) {
        $table->string('sender_image')->nullable()->after('content_description');
        $table->string('agent_image')->nullable()->after('sender_image');
    });
}

public function down(): void
{
    Schema::table('couriers', function (Blueprint $table) {
        $table->dropColumn('sender_image');
        $table->dropColumn('agent_image');
    });
}
};
