<?php

namespace App\Http\Resources;

use App\Models\FunnelStepRevision;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin FunnelStepRevision
 *
 * A step's whole content is stored per revision, so the history list omits it
 * and callers fetch one revision when they actually want to preview it.
 */
class FunnelStepRevisionResource extends JsonResource
{
    private bool $withContent = true;

    /** Omit the step content, for listings. */
    public function withoutContent(): self
    {
        $this->withContent = false;

        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $content = is_array($this->content_json) ? $this->content_json : [];
        $sections = is_array($content['sections'] ?? null) ? $content['sections'] : [];

        return array_filter([
            'id' => $this->id,
            'funnel_step_id' => $this->funnel_step_id,
            'version_number' => $this->version_number,
            'reason' => $this->reason,
            'section_count' => count($sections),
            'author' => $this->whenLoaded('user', fn () => $this->user?->name),
            'created_at' => $this->created_at,
            'content' => $this->withContent ? $content : null,
        ], fn ($value) => $value !== null);
    }
}
