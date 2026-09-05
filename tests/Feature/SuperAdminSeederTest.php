<?php

use App\Models\User;
use Database\Seeders\SuperAdminSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    config([
        'uidesired.super_admin.email' => 'admin@example.test',
        'uidesired.super_admin.password' => 'seeded-password',
        'uidesired.super_admin.name' => 'Super Admin',
    ]);
});

it('creates the super admin with the configured password', function () {
    $this->seed(SuperAdminSeeder::class);

    $user = User::query()->where('email', 'admin@example.test')->firstOrFail();

    expect($user->is_super_admin)->toBeTrue()
        ->and(Hash::check('seeded-password', $user->password))->toBeTrue()
        ->and($user->workspaces()->count())->toBe(1);
});

it('never resets a password the administrator has already changed', function () {
    $this->seed(SuperAdminSeeder::class);
    $user = User::query()->where('email', 'admin@example.test')->firstOrFail();

    // The administrator picks their own password after the first deploy.
    $user->forceFill(['password' => Hash::make('chosen-by-a-human')])->save();

    // This seeder runs from a migration, so it re-executes against live
    // databases. Re-running it must not hand the account back to whatever
    // SUPER_ADMIN_PASSWORD says.
    $this->seed(SuperAdminSeeder::class);

    $user->refresh();
    expect(Hash::check('chosen-by-a-human', $user->password))->toBeTrue()
        ->and(Hash::check('seeded-password', $user->password))->toBeFalse();
});

it('is safe to run repeatedly', function () {
    $this->seed(SuperAdminSeeder::class);
    $this->seed(SuperAdminSeeder::class);

    expect(User::query()->where('email', 'admin@example.test')->count())->toBe(1)
        ->and(User::query()->where('email', 'admin@example.test')->firstOrFail()->workspaces()->count())->toBe(1);
});
