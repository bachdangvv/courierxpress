<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourierLocation extends Model {
  public $timestamps = false;
  protected $fillable = ['courier_id','agent_id','latitude','longitude','recorded_at'];
  protected $casts = ['recorded_at' => 'datetime'];
  public function courier(){ return $this->belongsTo(Courier::class); }
}
