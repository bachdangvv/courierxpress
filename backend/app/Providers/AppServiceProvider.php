<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use App\Models\User;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Role gates used by route middleware('can:...')
        Gate::define('admin', fn(User $u) => $u->role === 'admin');
        Gate::define('agent', fn(User $u) => $u->role === 'agent');
        Gate::define('customer', fn(User $u) => $u->role === 'customer');
    }
}
