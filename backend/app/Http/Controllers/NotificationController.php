<?php
namespace App\Http\Controllers;

use App\Models\NotificationCustom;
use Illuminate\Http\Request;

class NotificationController extends Controller {
    public function index(Request $r) {
        return NotificationCustom::where('user_id',$r->user()->id)->latest()->paginate(20);
    }
}
