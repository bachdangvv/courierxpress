<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Courier extends Model {

    public const STATUS_PENDING    = 'Pending';
    public const STATUS_ASSIGNED   = 'Assigned';
    public const STATUS_DELIVERING = 'Delivering';
    public const STATUS_DONE       = 'Done';
    public const STATUS_CANCELED   = 'Canceled';

  protected $fillable=[
    'type','weight','size','charge','distance',
    'longitude','latitude','last_located_at',
    'status','sender_id','agent_id'
  ];

  protected $casts = ['last_located_at'=>'datetime'];

  public function sender(){ return $this->belongsTo(Customer::class,'sender_id'); }
  public function agent(){ return $this->belongsTo(Agent::class); }
  public function status(){ return $this->belongsTo(Courier::class,'status'); }
  public function locations(){ return $this->hasMany(CourierLocation::class); }
}
