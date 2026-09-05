<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FunnelStepRevisionResource;
use App\Models\Funnel;
use App\Models\FunnelStep;
use App\Models\FunnelStepRevision;
use App\Services\Funnels\FunnelService;
use Illuminate\Http\Request;

/**
 * Version history for a single funnel step.
 *
 * A step keeps its own line of revisions rather than sharing one with the
 * funnel, since a builder restoring an old "Offer" step should never touch
 * what "Checkout" looks like right now.
 */
class FunnelStepRevisionController extends Controller
{
    public function index(Funnel $funnel, FunnelStep $funnelStep)
    {
        $this->authorize('view', $funnel);
        abort_unless($funnelStep->funnel_id === $funnel->id, 404);

        // Content is deliberately left out: a step's whole section tree per
        // revision would make the history list unwieldy.
        $rows = FunnelStepRevisionResource::collection($funnelStep->revisions()->with('user:id,name')->get());
        // Mutate in place: mapping the collection would drop the `data` wrapper.
        $rows->collection->each(fn (FunnelStepRevisionResource $row) => $row->withoutContent());

        return $rows;
    }

    public function show(Funnel $funnel, FunnelStep $funnelStep, FunnelStepRevision $revision)
    {
        $this->authorize('view', $funnel);
        abort_unless($funnelStep->funnel_id === $funnel->id, 404);
        abort_unless($revision->funnel_step_id === $funnelStep->id, 404);

        return new FunnelStepRevisionResource($revision->load('user:id,name'));
    }

    public function restore(Request $request, Funnel $funnel, FunnelStep $funnelStep, FunnelStepRevision $revision, FunnelService $funnels)
    {
        $this->authorize('update', $funnel);

        return response()->json(['data' => $funnels->restoreStepRevision($funnel, $funnelStep, $revision, $request->user())]);
    }
}
