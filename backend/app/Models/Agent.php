<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    ];
}
