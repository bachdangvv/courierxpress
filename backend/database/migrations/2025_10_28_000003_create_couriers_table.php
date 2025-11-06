<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // CREATORS NOTE:
        // - Assumes you have tables: customers (id), agents (id)
        // - MySQL recommended. Adjust enums if you use PostgreSQL.

        Schema::create('couriers', function (Blueprint $t) {
            $t->id();

            // Basic
            $t->string('type')->nullable();               // e.g. Parcel, Document
            $t->decimal('weight', 8, 2)->nullable();      // kg
            $t->decimal('distance', 8, 2)->nullable();    // km (optional if you compute server-side)
            $t->decimal('charge', 10, 2)->nullable();     // total price
            $t->string('size')->nullable();               // optional free-form (S/M/L) if you want

            // From (sender) - textual snapshot for label
            $t->string('from_full_name')->nullable();
            $t->string('from_email')->nullable();
            $t->string('from_phone')->nullable();
            $t->string('from_country')->nullable();
            $t->string('from_address')->nullable();
            $t->string('from_city')->nullable();
            $t->string('from_state')->nullable();
            $t->string('from_zip')->nullable();

            // To (receiver) - textual snapshot for label
            $t->string('to_full_name')->nullable()->index();
            $t->string('to_email')->nullable();
            $t->string('to_phone')->nullable();
            $t->string('to_country')->nullable();
            $t->string('to_address')->nullable();
            $t->string('to_city')->nullable();
            $t->string('to_state')->nullable();
            $t->string('to_zip')->nullable();

            // Coordinates (sender + receiver)
            $t->decimal('sender_lng', 11, 7)->nullable();
            $t->decimal('sender_lat', 10, 7)->nullable();
            $t->decimal('to_lng', 11, 7)->nullable();
            $t->decimal('to_lat', 10, 7)->nullable();
            $t->timestamp('last_located_at')->nullable();

            // Package detail
            $t->decimal('length_cm', 8, 2)->nullable();
            $t->decimal('width_cm', 8, 2)->nullable();
            $t->decimal('height_cm', 8, 2)->nullable();
            $t->text('content_description')->nullable();

            // Status & payment
            $t->enum('status', ['Pending','Assigned','Delivering','Done','Canceled'])
              ->default('Pending')->index();
            $t->enum('payment_status', ['Unpaid','Paid','Refunded'])
              ->default('Unpaid')->index();
            $t->string('payment_method')->nullable();

            // Tracking / references
            $t->string('tracking_code')->nullable()->unique();

            // Relations
            $t->foreignId('sender_id')->constrained('customers')->cascadeOnDelete();
            $t->foreignId('agent_id')->nullable()->constrained('agents')->nullOnDelete();

            $t->index(['sender_lat','sender_lng'], 'couriers_sender_coords_idx');
            $t->index('status', 'couriers_status_idx');
            $t->index('agent_id', 'couriers_agent_id_idx');
            

            $t->timestamps();
        });

        Schema::create('courier_locations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('courier_id')->constrained('couriers')->cascadeOnDelete();

            // Allow null agent for initial/customer-sourced points (optional).
            $t->foreignId('agent_id')->nullable()->constrained('agents')->nullOnDelete();

            $t->decimal('longitude', 11, 7);
            $t->decimal('latitude', 10, 7);
            $t->timestamp('recorded_at')->useCurrent();
            $t->timestamps();

            $t->index(['courier_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courier_locations');
        Schema::dropIfExists('couriers');
    }
};
