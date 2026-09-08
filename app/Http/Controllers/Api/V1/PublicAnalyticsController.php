<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use App\Services\PublicSiteResolver;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PublicAnalyticsController extends Controller
{
    public function track(Request $request, PublicSiteResolver $resolver, AnalyticsService $analytics): Response
    {
        $site = $resolver->resolve($request->getHost());

        // A tracking beacon has no visible failure state for a visitor, and
        // whether a host resolves to a site is not something this endpoint
        // needs to reveal - an unknown host or a disabled site both just get
        // the same empty response as a normal recorded view.
        if ($site && $site->status !== 'disabled') {
            $data = $request->validate([
                'path' => ['nullable', 'string', 'max:500'],
                'referrer' => ['nullable', 'string', 'max:2000'],
            ]);

            $analytics->record($site, $request, $data);
        }

        return response()->noContent();
    }
}
