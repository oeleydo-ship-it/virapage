<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\WorkspaceService;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = strtolower(trim((string) config('uidesired.super_admin.email')));
        $password = (string) config('uidesired.super_admin.password');
        $name = trim((string) config('uidesired.super_admin.name')) ?: 'Super Admin';

        if ($email === '' || $password === '') {
            return;
        }

        $user = User::query()->firstOrNew(['email' => $email]);
        $creating = ! $user->exists;
        $user->fill([
            'name' => $name,
            'is_super_admin' => true,
        ]);

        // The password is only ever written when the account is created. This
        // seeder runs from a migration, so it executes against live databases
        // where the administrator has long since changed their password -
        // filling it unconditionally would silently reset that to whatever
        // SUPER_ADMIN_PASSWORD happens to be, which defaults to "password".
        if ($creating) {
            $user->password = $password;
        }
        if ($user->email_verified_at === null) {
            $user->email_verified_at = now();
        }
        $user->save();

        if (! $user->workspaces()->exists()) {
            app(WorkspaceService::class)->createPersonal($user, 'Admin Workspace');
        }
    }
}
