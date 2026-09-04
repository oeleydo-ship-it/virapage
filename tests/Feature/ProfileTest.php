<?php

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

/**
 * Signs in the way the dashboard does - a real personal access token in the
 * Authorization header - rather than with Sanctum::actingAs, which hands the
 * request a transient token. The difference matters here: half of this feature
 * is about which token rows survive a password change.
 */
function bearer(User $user, string $name = 'api'): array
{
    return ['Authorization' => 'Bearer '.$user->createToken($name)->plainTextToken];
}

it('updates the name without touching the email or verification', function () {
    ['user' => $user] = tenant(['name' => 'Ada', 'email' => 'ada-profile@example.com']);
    $headers = bearer($user);

    $this->patchJson('/api/v1/auth/profile', ['name' => 'Ada Lovelace'], $headers)
        ->assertOk()
        ->assertJsonPath('data.name', 'Ada Lovelace')
        ->assertJsonPath('data.email', 'ada-profile@example.com');

    expect($user->fresh()->email_verified_at)->not->toBeNull();
});

it('un-verifies the account and sends a fresh link when the email changes', function () {
    Notification::fake();
    ['user' => $user] = tenant(['email' => 'old@example.com']);
    $headers = bearer($user);

    expect($user->fresh()->email_verified_at)->not->toBeNull();

    $this->patchJson('/api/v1/auth/profile', [
        'email' => 'new@example.com',
        'current_password' => 'password',
    ], $headers)->assertOk()->assertJsonPath('data.email_verified', false);

    expect($user->fresh()->email_verified_at)->toBeNull();
    Notification::assertSentTo($user->fresh(), VerifyEmail::class);
});

it('refuses an email change without the current password', function () {
    ['user' => $user] = tenant(['email' => 'stay@example.com']);
    $headers = bearer($user);

    $this->patchJson('/api/v1/auth/profile', ['email' => 'moved@example.com'], $headers)
        ->assertStatus(422)
        ->assertJsonValidationErrors('current_password');

    $this->patchJson('/api/v1/auth/profile', [
        'email' => 'moved@example.com',
        'current_password' => 'not-the-password',
    ], $headers)->assertStatus(422)->assertJsonValidationErrors('current_password');

    expect($user->fresh()->email)->toBe('stay@example.com');
});

it('will not move an account onto an address someone else uses', function () {
    ['user' => $taken] = tenant(['email' => 'taken@example.com']);
    ['user' => $user] = tenant(['email' => 'mine@example.com']);

    $this->patchJson('/api/v1/auth/profile', [
        'email' => $taken->email,
        'current_password' => 'password',
    ], bearer($user))->assertStatus(422)->assertJsonValidationErrors('email');
});

it('lets an unverified account correct the address it mistyped', function () {
    Notification::fake();
    ['user' => $user] = tenant(['email' => 'typo@example.com']);
    $user->forceFill(['email_verified_at' => null])->save();

    // The rest of the API is behind verified.api; this route deliberately is
    // not, because otherwise a typo at sign-up is unrecoverable.
    $this->patchJson('/api/v1/auth/profile', [
        'email' => 'correct@example.com',
        'current_password' => 'password',
    ], bearer($user))->assertOk();

    expect($user->fresh()->email)->toBe('correct@example.com');
});

it('changes the password and signs out the other devices but not this one', function () {
    ['user' => $user] = tenant();
    $headers = bearer($user, 'api');
    $user->createToken('phone');
    $user->createToken('laptop');

    expect($user->tokens()->count())->toBe(3);

    $this->putJson('/api/v1/auth/password', [
        'current_password' => 'password',
        'password' => 'a-brand-new-password',
        'password_confirmation' => 'a-brand-new-password',
    ], $headers)->assertOk()->assertJsonPath('data.sessions_signed_out', 2);

    expect($user->tokens()->count())->toBe(1)
        ->and(Hash::check('a-brand-new-password', $user->fresh()->password))->toBeTrue();

    // The token that made the change still works.
    $this->getJson('/api/v1/auth/user', $headers)->assertOk();
});

it('refuses a password change without the correct current password', function () {
    ['user' => $user] = tenant();
    $headers = bearer($user);

    $this->putJson('/api/v1/auth/password', [
        'password' => 'a-brand-new-password',
        'password_confirmation' => 'a-brand-new-password',
    ], $headers)->assertStatus(422)->assertJsonValidationErrors('current_password');

    $this->putJson('/api/v1/auth/password', [
        'current_password' => 'wrong',
        'password' => 'a-brand-new-password',
        'password_confirmation' => 'a-brand-new-password',
    ], $headers)->assertStatus(422)->assertJsonValidationErrors('current_password');

    expect(Hash::check('password', $user->fresh()->password))->toBeTrue();
});

it('rejects a short, unconfirmed or unchanged password', function () {
    ['user' => $user] = tenant();
    $headers = bearer($user);

    $this->putJson('/api/v1/auth/password', [
        'current_password' => 'password', 'password' => 'short', 'password_confirmation' => 'short',
    ], $headers)->assertStatus(422)->assertJsonValidationErrors('password');

    $this->putJson('/api/v1/auth/password', [
        'current_password' => 'password', 'password' => 'long-enough-here', 'password_confirmation' => 'something-else',
    ], $headers)->assertStatus(422)->assertJsonValidationErrors('password');

    $this->putJson('/api/v1/auth/password', [
        'current_password' => 'password', 'password' => 'password', 'password_confirmation' => 'password',
    ], $headers)->assertStatus(422)->assertJsonValidationErrors('password');
});

it('lets a Google account set a first password without confirming a generated one', function () {
    ['user' => $user] = tenant();
    // Google sign-up: a random password nobody has ever seen, so there is
    // nothing the person could confirm.
    $user->forceFill(['google_id' => 'g-123', 'password_set_at' => null])->save();

    $this->getJson('/api/v1/auth/user', bearer($user))
        ->assertOk()
        ->assertJsonPath('data.has_password', false)
        ->assertJsonPath('data.google_connected', true);

    $this->putJson('/api/v1/auth/password', [
        'password' => 'my-first-password',
        'password_confirmation' => 'my-first-password',
    ], bearer($user))->assertOk();

    $fresh = $user->fresh();
    expect(Hash::check('my-first-password', $fresh->password))->toBeTrue()
        ->and($fresh->password_set_at)->not->toBeNull();

    // Having set one, they must confirm it from now on.
    $this->putJson('/api/v1/auth/password', [
        'password' => 'another-password',
        'password_confirmation' => 'another-password',
    ], bearer($user))->assertStatus(422)->assertJsonValidationErrors('current_password');
});

it('records that registering counts as choosing a password', function () {
    $this->postJson('/api/v1/auth/register', [
        'name' => 'Grace Hopper',
        'email' => 'grace-profile@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertCreated()->assertJsonPath('data.user.has_password', true);
});

it('stores and removes a profile picture', function () {
    Storage::fake('public');
    ['user' => $user] = tenant();
    $headers = bearer($user);

    $this->post('/api/v1/auth/avatar', ['file' => UploadedFile::fake()->image('me.png', 200, 200)], $headers)
        ->assertOk()
        ->assertJsonPath('data.avatar_url', fn ($url) => is_string($url) && $url !== '');

    $stored = $user->fresh()->avatar_url;
    expect($stored)->toStartWith('avatars/');
    Storage::disk('public')->assertExists($stored);

    $this->deleteJson('/api/v1/auth/avatar', [], $headers)->assertOk();

    expect($user->fresh()->avatar_url)->toBeNull();
    Storage::disk('public')->assertMissing($stored);
});

it('refuses a file that is not an image', function () {
    Storage::fake('public');
    ['user' => $user] = tenant();

    $this->post('/api/v1/auth/avatar', [
        'file' => UploadedFile::fake()->create('notes.pdf', 10, 'application/pdf'),
    ], bearer($user))->assertStatus(422)->assertJsonValidationErrors('file');

    expect($user->fresh()->avatar_url)->toBeNull();
});

it('replaces the previous picture rather than leaving it behind', function () {
    Storage::fake('public');
    ['user' => $user] = tenant();
    $headers = bearer($user);

    $this->post('/api/v1/auth/avatar', ['file' => UploadedFile::fake()->image('one.png')], $headers)->assertOk();
    $first = $user->fresh()->avatar_url;

    $this->post('/api/v1/auth/avatar', ['file' => UploadedFile::fake()->image('two.png')], $headers)->assertOk();
    $second = $user->fresh()->avatar_url;

    expect($second)->not->toBe($first);
    Storage::disk('public')->assertMissing($first);
    Storage::disk('public')->assertExists($second);
});

it('keeps a Google avatar URL rather than trying to delete a file it never stored', function () {
    Storage::fake('public');
    ['user' => $user] = tenant();
    $user->forceFill(['avatar_url' => 'https://lh3.googleusercontent.com/a/photo'])->save();

    $this->getJson('/api/v1/auth/user', bearer($user))
        ->assertOk()
        ->assertJsonPath('data.avatar_url', 'https://lh3.googleusercontent.com/a/photo');

    // Uploading over it must not blow up trying to delete a remote file.
    $this->post('/api/v1/auth/avatar', ['file' => UploadedFile::fake()->image('mine.png')], bearer($user))->assertOk();
    expect($user->fresh()->avatar_url)->toStartWith('avatars/');
});

it('lists the signed-in devices and marks the current one', function () {
    ['user' => $user] = tenant();
    $headers = bearer($user, 'api');
    $user->createToken('google');

    $response = $this->getJson('/api/v1/auth/sessions', $headers)->assertOk();
    $rows = $response->json('data');

    expect($rows)->toHaveCount(2)
        ->and(collect($rows)->where('current', true))->toHaveCount(1)
        ->and(collect($rows)->pluck('kind')->all())->toContain('Google sign-in', 'Password sign-in');
});

it('signs out other devices and leaves this one working', function () {
    ['user' => $user] = tenant();
    $headers = bearer($user);
    $user->createToken('phone');
    $user->createToken('tablet');

    $this->deleteJson('/api/v1/auth/sessions', [], $headers)
        ->assertOk()
        ->assertJsonPath('data.sessions_signed_out', 2);

    expect($user->tokens()->count())->toBe(1);
    $this->getJson('/api/v1/auth/user', $headers)->assertOk();
});

it('keeps every profile route behind authentication', function () {
    $this->patchJson('/api/v1/auth/profile', ['name' => 'Nobody'])->assertStatus(401);
    $this->putJson('/api/v1/auth/password', ['password' => 'x', 'password_confirmation' => 'x'])->assertStatus(401);
    $this->postJson('/api/v1/auth/avatar')->assertStatus(401);
    $this->deleteJson('/api/v1/auth/avatar')->assertStatus(401);
    $this->getJson('/api/v1/auth/sessions')->assertStatus(401);
    $this->deleteJson('/api/v1/auth/sessions')->assertStatus(401);
});

it('never lets one account edit another through these routes', function () {
    ['user' => $victim] = tenant(['name' => 'Victim', 'email' => 'victim@example.com']);
    ['user' => $attacker] = tenant(['email' => 'attacker@example.com']);

    // There is no user id in any of these routes; they act on the token holder.
    $this->patchJson('/api/v1/auth/profile', ['name' => 'Owned'], bearer($attacker))->assertOk();

    expect($victim->fresh()->name)->toBe('Victim');
});
