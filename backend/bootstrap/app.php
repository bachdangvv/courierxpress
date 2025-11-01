<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        // Keep channels for broadcasting
        channels: __DIR__.'/../routes/channels.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
         $middleware->alias([
            // If you need 'auth' alias as well you can add: 'auth' => \App\Http\Middleware\Authenticate::class,
            // Sanctum ability middlewares:
            'role' => \App\Http\Middleware\EnsureUserRole::class,
        ]);
        $middleware->web(append: [
        \Illuminate\Http\Middleware\HandleCors::class, // ✅ Bật CORS cho route web
    ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->withProviders([
        \App\Providers\AppServiceProvider::class,   // <-- add this line
    ])
    ->create();
