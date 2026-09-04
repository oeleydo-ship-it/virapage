<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Records when someone last chose their own password.
 *
 * Sign-in through Google creates the account with a random password the person
 * never sees, so "confirm your current password" would lock those users out of
 * ever setting one. This column tells the two cases apart: null means the
 * password on the row was generated for them and they are setting a first
 * password, otherwise they must confirm the one they already know.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('password_set_at')->nullable()->after('password');
        });

        // Everyone who registered with a password chose it themselves, so they
        // must keep confirming it. Only Google-created rows stay null.
        DB::table('users')
            ->whereNull('google_id')
            ->update(['password_set_at' => DB::raw('created_at')]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('password_set_at');
        });
    }
};
