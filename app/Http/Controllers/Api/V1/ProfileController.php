<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\AvatarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use Laravel\Sanctum\PersonalAccessToken;

/**
 * The signed-in person's own account: their name, email, picture, password and
 * the devices they are signed in on.
 *
 * Separate from WorkspaceController, which manages *other* people's membership
 * of a workspace. Everything here acts on `$request->user()` and never takes a
 * user id, so one account can never edit another through these routes.
 */
class ProfileController extends Controller
{
    public function __construct(private readonly AvatarService $avatars) {}

    /**
     * Name and email.
     *
     * Changing the email address un-verifies the account and sends a fresh
     * verification link, because otherwise anyone could move an account onto an
     * address they do not control and keep the verified badge.
     */
    public function update(Request $request): UserResource
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email:rfc', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'current_password' => ['nullable', 'string'],
        ]);

        $emailChanged = array_key_exists('email', $data) && $data['email'] !== $user->email;

        // Moving the account to another address is how a hijacked session turns
        // into a permanent takeover, so it costs a password when there is one to
        // give. Accounts created through Google have no password the person
        // knows, and their session is the only proof available.
        if ($emailChanged && $user->password_set_at !== null) {
            if (! is_string($data['current_password'] ?? null) || ! Hash::check($data['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Enter your current password to change your email address.'],
                ]);
            }
        }

        if (array_key_exists('name', $data)) {
            $user->name = $data['name'];
        }

        if ($emailChanged) {
            $user->email = $data['email'];
            $user->email_verified_at = null;
        }

        $user->save();

        if ($emailChanged) {
            $user->sendEmailVerificationNotification();
        }

        return new UserResource($user->fresh()->load('workspaces'));
    }

    /**
     * Change or set the account password.
     *
     * Signing in through Google creates the account with a random password the
     * person never sees. Demanding "your current password" there would lock
     * them out of ever setting one, so a first password is set from the
     * authenticated session alone; every later change confirms the old one.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();
        $hasPassword = $user->password_set_at !== null;

        $request->validate([
            'current_password' => [$hasPassword ? 'required' : 'nullable', 'string'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->max(72)],
        ]);

        if ($hasPassword && ! Hash::check((string) $request->input('current_password'), $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['That is not your current password.'],
            ]);
        }

        if (Hash::check((string) $request->input('password'), $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Choose a password you are not already using.'],
            ]);
        }

        $user->forceFill([
            'password' => (string) $request->input('password'),
            'password_set_at' => now(),
        ])->save();

        // A password change is how someone locks out a device they no longer
        // trust, so it has to end those sessions. The one making the change
        // stays signed in - otherwise every password change logs you out.
        $current = $request->user()->currentAccessToken();
        $keep = $current instanceof PersonalAccessToken ? $current->id : null;
        $revoked = $user->tokens()->when($keep, fn ($query) => $query->where('id', '!=', $keep))->delete();

        return response()->json(['data' => [
            'ok' => true,
            'sessions_signed_out' => (int) $revoked,
        ]]);
    }

    /** Upload a profile picture. */
    public function storeAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:2048'],
        ]);

        try {
            $url = $this->avatars->store($request->user(), $request->file('file'));
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages(['file' => [$e->getMessage()]]);
        }

        return response()->json(['data' => ['avatar_url' => $url]]);
    }

    /** Remove the profile picture and fall back to initials. */
    public function destroyAvatar(Request $request): JsonResponse
    {
        $this->avatars->clear($request->user());

        return response()->json(['data' => ['avatar_url' => null]]);
    }

    /**
     * Every device this account is signed in on.
     *
     * Sanctum stores no user agent, so a session is described by the way it was
     * created and when it was last used rather than by a device name we would
     * have to invent.
     */
    public function sessions(Request $request): JsonResponse
    {
        $current = $request->user()->currentAccessToken();
        $currentId = $current instanceof PersonalAccessToken ? $current->id : null;

        $rows = $request->user()->tokens()
            ->orderByDesc('last_used_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (PersonalAccessToken $token) => [
                'id' => $token->id,
                'name' => $token->name,
                'kind' => $token->name === 'google' ? 'Google sign-in' : 'Password sign-in',
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'current' => $token->id === $currentId,
            ]);

        return response()->json(['data' => $rows]);
    }

    /** Sign out every device except the one making the request. */
    public function revokeSessions(Request $request): JsonResponse
    {
        $current = $request->user()->currentAccessToken();
        $keep = $current instanceof PersonalAccessToken ? $current->id : null;

        $revoked = $request->user()->tokens()
            ->when($keep, fn ($query) => $query->where('id', '!=', $keep))
            ->delete();

        return response()->json(['data' => ['sessions_signed_out' => (int) $revoked]]);
    }
}
