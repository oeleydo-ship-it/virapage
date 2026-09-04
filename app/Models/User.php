<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'password_set_at', 'google_id', 'avatar_url', 'current_workspace_id', 'is_super_admin', 'blocked_at', 'blocked_reason'])]
#[Hidden(['password', 'remember_token', 'two_factor_secret'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * A new account is assumed to know its own password unless whoever
     * created it says otherwise.
     *
     * The alternative default is unsafe: a row created by any path that does
     * not think about this column would look like a Google account, and
     * Google accounts are allowed to set a password without confirming the
     * old one. Only GoogleAuthService passes null here, deliberately.
     */
    protected static function booted(): void
    {
        static::creating(function (self $user) {
            if (! array_key_exists('password_set_at', $user->getAttributes())) {
                $user->password_set_at = now();
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_set_at' => 'datetime',
            'is_super_admin' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
            'blocked_at' => 'datetime',
        ];
    }

    public function isBlocked(): bool
    {
        return $this->blocked_at !== null;
    }

    public function currentWorkspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class, 'current_workspace_id');
    }

    public function workspaces(): BelongsToMany
    {
        return $this->belongsToMany(Workspace::class, 'workspace_users')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function ownedWorkspaces(): HasMany
    {
        return $this->hasMany(Workspace::class, 'owner_id');
    }

    public function membershipFor(int $workspaceId): ?WorkspaceUser
    {
        return WorkspaceUser::query()
            ->where('workspace_id', $workspaceId)
            ->where('user_id', $this->id)
            ->first();
    }

    public function roleIn(int $workspaceId): ?string
    {
        return $this->membershipFor($workspaceId)?->role;
    }
}
