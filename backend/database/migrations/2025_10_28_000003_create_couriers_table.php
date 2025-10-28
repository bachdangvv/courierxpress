<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('couriers', function (Blueprint $t) {
      $t->id();
      $t->string('type')->nullable();
      $t->decimal('weight',8,2)->nullable();
      $t->string('size')->nullable();
      $t->string('charge')->nullable();
      $t->decimal('distance',8,2)->nullable();

      $t->decimal('sender_lgi',11,7)->nullable();
      $t->decimal('sender_lat',10,7)->nullable();
      $t->timestamp('last_located_at')->nullable();

      $t->enum('status',['Pending','Assigned','Delivering','Done','Canceled'])->default('Pending')->index();
      $t->foreignId('sender_id')->constrained('customers')->cascadeOnDelete();
      $t->foreignId('agent_id')->nullable()->constrained('agents')->nullOnDelete();

      $t->timestamps();
    });

    // optional history table for map timeline
    Schema::create('courier_locations', function (Blueprint $t) {
      $t->id();
      $t->foreignId('courier_id')->constrained()->cascadeOnDelete();
      $t->foreignId('agent_id')->constrained()->cascadeOnDelete();
      $t->decimal('longitude',11,7);
      $t->decimal('latitude',10,7);
      $t->timestamp('recorded_at')->useCurrent();
      $t->timestamps();
    });
  }
  public function down(): void {
    Schema::dropIfExists('courier_locations');
    Schema::dropIfExists('couriers');
  }
};
