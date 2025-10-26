<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $fillable = ['user_id','status'];

    public const AVAILABLE     = 'Available';
    public const ASSIGNED      = 'Agent Assigned';
    public const DELIVERING    = 'Delivering';
    public const NOT_AVAILABLE = 'Not Available';

    // protected $attributes = [
    //     'status' => self::NOT_AVAILABLE,
    // ];

    // Agents Admin is allowed to assign

    public function scopeAssignable($q)
    {
        return $q->whereNotIn('status', [self::ASSIGNED, self::DELIVERING, self::NOT_AVAILABLE]);
    }

    public function isAssignable(): bool
    {
        return ! in_array($this->status, [self::ASSIGNED, self::DELIVERING, self::NOT_AVAILABLE], true);
    }

    public function user(){ return $this->belongsTo(User::class); }
}
