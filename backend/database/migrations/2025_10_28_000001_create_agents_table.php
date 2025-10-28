<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('image')->nullable();
            $table->string('gender',10)->nullable();
            $table->unsignedSmallInteger('age')->nullable();
            $table->string('national_id')->nullable();
            $table->string('contact')->nullable();
            $table->enum('status',['Available','Not Available','Delivering','Agent Assigned'])->default('Available')->index();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('agents');
    }
};
