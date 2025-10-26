<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Check the authenticated user's role.
     * Usage: ->middleware('role:admin') or ->middleware('role:admin,agent')
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Normalize roles list
        $allowed = collect($roles)
            ->flatMap(fn ($r) => explode(',', $r))
            ->map(fn ($r) => trim(strtolower($r)))
            ->filter()
            ->values();

        if ($allowed->isEmpty()) {
            // If no roles were provided, allow through (or change to 403 if you prefer strict)
            return $next($request);
        }

        $role = strtolower((string)($user->role ?? ''));
        if (!$allowed->contains($role)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return $next($request);
    }
}
