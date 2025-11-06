<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agent extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'image',
        'gender',
        'age',
        'national_id',
        'contact',
        'status',
        'agent_current_lat',
        'agent_current_lng',
    ];

    public const AVAILABLE     = 'Available';
    public const NOT_AVAILABLE = 'Not Available';
    public const DELIVERING_OK = 'Delivering OK';
    public const DELIVERING_FULL = 'Delivering Full';

    // protected $attributes = [
    //     'status' => self::NOT_AVAILABLE,
    // ];

    // Agents Admin is allowed to assign

    public function couriers(): HasMany {
        return $this->hasMany(Courier::class);
    }

    public function activeCouriersCount(): int {
        return $this->couriers()
            ->whereIn('status', [Courier::STATUS_ASSIGNED, Courier::STATUS_DELIVERING])
            ->count();
    }

    /** is this agent eligible for new assignment? */
    public function isAssignable(): bool {
        if (is_null($this->agent_current_lat) || is_null($this->agent_current_lng)) return false;
        if (!in_array($this->status, [self::ST_AVAILABLE, self::ST_DELIV_OK])) return false;
        return $this->activeCouriersCount() < 4;
    }

    /** After any event that may change capacity, normalize status by rules. */
    public function normalizeStatusAfterCapacityChange(): void
    {
        $active = $this->activeCouriersCount();

        // If 4 → force Delivering Full
        if ($active >= 4) {
            if ($this->status !== self::DELIVERING_FULL) {
                $this->status = self::DELIVERING_FULL;
                $this->save();
            }
            return;
        }

        // If <4 and currently Delivering Full → switch to Delivering OK
        if ($this->status === self::DELIVERING_FULL && $active < 4) {
            $this->status = self::DELIVERING_OK;
            $this->save();
        }
        // If <4 and Not Available → leave as is (only manual can go to Available)
        // If <4 and Available or Delivering OK → keep as is
    }
}
