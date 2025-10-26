<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',          // admin | agent | customer
    ];

    /**
     * Attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /* -----------------------------------------------------------------
     |  Relationships
     | -----------------------------------------------------------------
     */

    /** An agent user may have one Agent profile. */
    public function agent()
    {
        return $this->hasOne(Agent::class);
    }

    /** A customer user may have one Customer profile. */
    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    /* -----------------------------------------------------------------
     |  Accessors / Helpers
     | -----------------------------------------------------------------
     */

    /**
     * Automatically hash password when setting.
     */
    public function setPasswordAttribute($value): void
    {
        if (empty($value)) {
        return;
    }
    // Only hash if it's not already a valid hash
    $this->attributes['password'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
    }

    /**
     * Quick role checks.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isAgent(): bool
    {
        return $this->role === 'agent';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }
}
