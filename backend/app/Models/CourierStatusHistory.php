<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourierStatusHistory extends Model
{
    public $timestamps = false;

    protected $fillable = ['courier_id', 'status', 'changed_at'];

    protected $casts = [
        'changed_at' => 'datetime',
    ];

    public function courier()
    {
        return $this->belongsTo(Courier::class);
    }
}

