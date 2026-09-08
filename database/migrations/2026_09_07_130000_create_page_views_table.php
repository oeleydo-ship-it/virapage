<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->string('path', 500);
            $table->string('referrer_host', 255)->nullable();
            // A daily-rotating hash of ip+user agent+site, never the ip itself -
            // enough to tell two visits from the same person apart within a day
            // for a unique-visitor count, but it cannot be correlated across
            // days or reversed back to an identity.
            $table->string('visitor_hash', 64);
            $table->string('country', 2)->nullable();
            $table->string('device', 20)->nullable();
            $table->string('browser', 40)->nullable();
            $table->string('os', 40)->nullable();
            $table->timestamps();

            $table->index(['site_id', 'created_at']);
            $table->index(['site_id', 'path']);
            $table->index(['site_id', 'visitor_hash']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
    }
};
