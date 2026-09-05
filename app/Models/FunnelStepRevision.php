<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['funnel_step_id', 'user_id', 'version_number', 'content_json', 'reason'])]
class FunnelStepRevision extends Model
{
    protected function casts(): array
    {
        return [
            'content_json' => 'array',
            'version_number' => 'integer',
        ];
    }

    public function step(): BelongsTo
    {
        return $this->belongsTo(FunnelStep::class, 'funnel_step_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
