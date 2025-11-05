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
    'type','weight','distance','charge',
        'from_full_name','from_email','from_phone','from_country','from_address','from_city','from_state','from_zip',
        'to_full_name','to_email','to_phone','to_country','to_address','to_city','to_state','to_zip',
        'length_cm','width_cm','height_cm','content_description',
        'status','charge','payment_status','payment_method','tracking_code','reference_code',
        'sender_id','agent_id',
  ];

  protected $casts = ['weight' => 'decimal:2',
        'charge' => 'decimal:2',
        'distance' => 'decimal:2',
        'length_cm' => 'decimal:2',
        'width_cm' => 'decimal:2',
        'height_cm' => 'decimal:2',
        'sender_lng' => 'decimal:7',
        'sender_lat' => 'decimal:7',
        'to_lng' => 'decimal:7',
        'to_lat' => 'decimal:7',
        'last_located_at' => 'datetime',];

  public function sender(){ return $this->belongsTo(Customer::class,'sender_id'); }
  public function agent(){ return $this->belongsTo(Agent::class); }
  public function status(){ return $this->belongsTo(Courier::class,'status'); }
  public function locations(){ return $this->hasMany(CourierLocation::class); }
}
