<?php
namespace App\Policies;

use App\Models\User;

class RolePolicy {
    public function admin(User $u): bool { return $u->role==='admin'; }
    public function agent(User $u): bool { return $u->role==='agent'; }
    public function customer(User $u): bool { return $u->role==='customer'; }
}
