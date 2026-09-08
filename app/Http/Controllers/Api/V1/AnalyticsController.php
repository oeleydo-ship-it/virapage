<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Site;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function summary(Request $request, Site $site, AnalyticsService $analytics)
    {
        $this->authorize('view', $site);

        $days = (int) $request->integer('days', 7);

        return response()->json(['data' => $analytics->summary($site, $days ?: 7)]);
    }
}
