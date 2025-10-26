<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationCustom extends Model {
  protected $table='notifications_custom';
  protected $fillable=['user_id','courier_id','message','sent_at'];
  protected $casts=['sent_at'=>'datetime'];
  public function user(){ return $this->belongsTo(User::class); }
  public function courier(){ return $this->belongsTo(Courier::class); }
}
