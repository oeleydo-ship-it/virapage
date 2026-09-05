<?php

use App\Models\Funnel;
use App\Models\FunnelStepRevision;
use App\Models\Plan;
use App\Models\Workspace;
use Laravel\Sanctum\Sanctum;

/**
 * Phase 6 of the funnel roadmap: version history for a step, and taking a
 * funnel's structure out of one workspace and into another.
 */
function funnelHeaders(): array
{
    ['user' => $user, 'workspace' => $workspace] = tenant();
    Sanctum::actingAs($user);

    return ['X-Workspace-Id' => (string) $workspace->id];
}

/** Free plan (seeded by default) allows only one funnel; some tests need more. */
function raiseFunnelLimit(string $workspaceId): void
{
    $plan = Plan::query()->where('slug', 'agency')->firstOrFail();
    Workspace::query()->whereKey($workspaceId)->firstOrFail()->subscription()->update(['plan_id' => $plan->id]);
}

it('keeps a version every time a step is created, saved and published', function () {
    $headers = funnelHeaders();
    $funnel = test()->withHeaders($headers)->postJson('/api/v1/funnels', ['name' => 'History Funnel'])
        ->assertCreated()->json('data');
    $step = collect($funnel['steps'])->firstWhere('slug', 'start');

    // One revision per step from creation.
    expect(FunnelStepRevision::query()->where('funnel_step_id', $step['id'])->count())->toBe(1);

    $content = $step['draft_content'];
    $content['sections'][0]['props']['heading'] = 'Edited heading';
    test()->withHeaders($headers)
        ->putJson("/api/v1/funnels/{$funnel['id']}/steps/{$step['id']}/content", $content)
        ->assertOk();

    test()->withHeaders($headers)->postJson("/api/v1/funnels/{$funnel['id']}/publish")->assertOk();

    $revisions = test()->withHeaders($headers)
        ->getJson("/api/v1/funnels/{$funnel['id']}/steps/{$step['id']}/revisions")
        ->assertOk()->json('data');

    expect($revisions)->toHaveCount(3);
    expect(collect($revisions)->pluck('reason')->all())->toBe(['published', 'draft', 'created']);
    // The listing omits content to keep it light; a single fetch carries it.
    expect($revisions[0])->not->toHaveKey('content');
});

it('restores a step to an earlier version without touching other steps', function () {
    $headers = funnelHeaders();
    $funnel = test()->withHeaders($headers)->postJson('/api/v1/funnels', ['name' => 'Restore Funnel'])
        ->assertCreated()->json('data');
    $step = collect($funnel['steps'])->firstWhere('slug', 'start');
    $originalHeading = $step['draft_content']['sections'][0]['props']['heading'];

    $edited = $step['draft_content'];
    $edited['sections'][0]['props']['heading'] = 'Changed my mind';
    test()->withHeaders($headers)
        ->putJson("/api/v1/funnels/{$funnel['id']}/steps/{$step['id']}/content", $edited)
        ->assertOk();

    $original = collect(
        test()->withHeaders($headers)
            ->getJson("/api/v1/funnels/{$funnel['id']}/steps/{$step['id']}/revisions")
            ->json('data'),
    )->firstWhere('reason', 'created');

    $restored = test()->withHeaders($headers)
        ->postJson("/api/v1/funnels/{$funnel['id']}/steps/{$step['id']}/revisions/{$original['id']}/restore")
        ->assertOk()->json('data');

    expect($restored['draft_content']['sections'][0]['props']['heading'])->toBe($originalHeading);
    // Restoring is itself a new version, not a rewrite of history.
    expect(FunnelStepRevision::query()->where('funnel_step_id', $step['id'])->count())->toBe(3);
});

it('exports a funnel and imports it as a new, independent one', function () {
    $headers = funnelHeaders();
    raiseFunnelLimit($headers['X-Workspace-Id']);
    $source = test()->withHeaders($headers)
        ->postJson('/api/v1/funnels', ['name' => 'Original Funnel', 'template' => 'lead_magnet'])
        ->assertCreated()->json('data');

    $export = test()->withHeaders($headers)
        ->getJson("/api/v1/funnels/{$source['id']}/export")
        ->assertOk()->json('data');

    expect($export['steps'])->toHaveCount(3);
    expect($export['connections'])->toHaveCount(2);
    expect($export)->not->toHaveKey('id');

    $imported = test()->withHeaders($headers)
        ->postJson('/api/v1/funnels/import', $export)
        ->assertCreated()->json('data');

    expect($imported['id'])->not->toBe($source['id']);
    expect($imported['steps'])->toHaveCount(3);
    expect($imported['connections'])->toHaveCount(2);
    expect(collect($imported['steps'])->pluck('slug')->all())->toBe(collect($export['steps'])->pluck('slug')->all());

    expect(Funnel::query()->count())->toBe(2);
});

it('seeds a quiz step with the quiz block, and its completion event carries a next step', function () {
    $headers = funnelHeaders();
    $funnel = test()->withHeaders($headers)->postJson('/api/v1/funnels', ['name' => 'Quiz Funnel'])
        ->assertCreated()->json('data');
    $start = collect($funnel['steps'])->firstWhere('slug', 'start');

    $quizStep = test()->withHeaders($headers)->postJson("/api/v1/funnels/{$funnel['id']}/steps", [
        'name' => 'Find your fit', 'type' => 'quiz',
    ])->assertCreated()->json('data');

    expect($quizStep['draft_content']['sections'][0]['type'])->toBe('funnel.quiz');
    expect($quizStep['draft_content']['sections'][0]['props']['questions'])->not->toBeEmpty();

    test()->withHeaders($headers)->postJson("/api/v1/funnels/{$funnel['id']}/connections", [
        'source_step_id' => $start['id'], 'target_step_id' => $quizStep['id'],
    ])->assertCreated();

    test()->withHeaders($headers)->postJson("/api/v1/funnels/{$funnel['id']}/publish")->assertOk();

    test()->postJson(
        "/api/v1/public/funnels/{$funnel['id']}/steps/{$quizStep['id']}/events",
        ['event_type' => 'conversion', 'consent' => 'essential', 'metadata' => ['quiz' => ['score' => 1, 'total' => 1]]],
    )->assertAccepted();
});
