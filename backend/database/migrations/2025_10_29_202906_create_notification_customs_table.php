<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('notifications_custom', function (Blueprint $t) {
      $t->id();
      $t->foreignId('user_id')->constrained()->cascadeOnDelete();
      $t->foreignId('courier_id')->nullable()->constrained()->cascadeOnDelete();
      $t->string('message');
      $t->timestamp('sent_at')->useCurrent();
      $t->timestamps();
    });
  }
  public function down(): void { Schema::dropIfExists('notifications_custom'); }
};
