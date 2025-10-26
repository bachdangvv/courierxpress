<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void {
    Schema::create('agents', function (Blueprint $t) {
      $t->id();
      $t->foreignId('user_id')->constrained()->cascadeOnDelete();
      $t->string('name');
      $t->string('image')->nullable();
      $t->string('gender',10)->nullable();
      $t->unsignedSmallInteger('age')->nullable();
      $t->string('national_id')->nullable();
      $t->string('contact')->nullable();
      $t->enum('status',['Available','Not Available','Delivering','Agent Assigned'])->default('Available')->index();
      $t->timestamps();
    });
  }
  public function down(): void { Schema::dropIfExists('agents'); }
};
