<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('funnel_step_revisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('funnel_step_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('version_number');
            $table->json('content_json');
            $table->string('reason')->nullable();
            $table->timestamps();
            $table->unique(['funnel_step_id', 'version_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funnel_step_revisions');
    }
};
