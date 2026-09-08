<?php

namespace App\Services;

use App\Models\PageView;
use App\Models\Site;
use App\Support\BrowserDetector;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

/**
 * Basic, first-party page-view analytics for a published site - a lightweight
 * alternative to wiring up Google Analytics, not a replacement for it. Every
 * published page fires a tiny beacon on load (see
 * packages/site-render/src/render.tsx); this turns that into totals, a daily
 * trend, and top pages/referrers/countries for the site's dashboard.
 */
class AnalyticsService
{
    /**
     * @param  array{path?: string|null, referrer?: string|null}  $input
     */
    public function record(Site $site, Request $request, array $input): void
    {
        $agent = BrowserDetector::fromUserAgent($request->userAgent());
        $geo = BrowserDetector::locationFromRequest($request);

        PageView::query()->create([
            'workspace_id' => $site->workspace_id,
            'site_id' => $site->id,
            'path' => $this->normalizePath((string) ($input['path'] ?? '/')),
            'referrer_host' => $this->referrerHost((string) ($input['referrer'] ?? ''), $request->getHost()),
            'visitor_hash' => $this->visitorHash($site, $request),
            'country' => $geo['country'] ? mb_substr($geo['country'], 0, 2) : null,
            'device' => $agent['device'],
            'browser' => $agent['browser'],
            'os' => $agent['os'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function summary(Site $site, int $days = 7): array
    {
        $days = max(1, min($days, 90));
        $since = CarbonImmutable::now()->subDays($days - 1)->startOfDay();
        $query = fn () => PageView::query()->where('site_id', $site->id)->where('created_at', '>=', $since);

        $views = $query()->count();
        $uniques = $query()->distinct('visitor_hash')->count('visitor_hash');

        $topPages = $query()
            ->selectRaw('path, count(*) as views')
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['path' => $row->path, 'views' => (int) $row->views])
            ->values();

        $topReferrers = $query()
            ->whereNotNull('referrer_host')
            ->selectRaw('referrer_host, count(*) as views')
            ->groupBy('referrer_host')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['host' => $row->referrer_host, 'views' => (int) $row->views])
            ->values();

        $topCountries = $query()
            ->whereNotNull('country')
            ->selectRaw('country, count(*) as views')
            ->groupBy('country')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(fn ($row) => ['country' => $row->country, 'views' => (int) $row->views])
            ->values();

        $dailyViews = $query()->selectRaw('DATE(created_at) as date, count(*) as views')->groupBy('date')->pluck('views', 'date');
        $dailyUniques = $query()->selectRaw('DATE(created_at) as date, count(distinct visitor_hash) as uniques')->groupBy('date')->pluck('uniques', 'date');

        $trend = [];
        for ($i = 0; $i < $days; $i++) {
            $date = $since->addDays($i)->toDateString();
            $trend[] = [
                'date' => $date,
                'views' => (int) ($dailyViews[$date] ?? 0),
                'uniques' => (int) ($dailyUniques[$date] ?? 0),
            ];
        }

        return [
            'range_days' => $days,
            'views' => $views,
            'uniques' => $uniques,
            'top_pages' => $topPages,
            'top_referrers' => $topReferrers,
            'top_countries' => $topCountries,
            'trend' => $trend,
        ];
    }

    private function normalizePath(string $path): string
    {
        $path = strtok(trim($path), '?') ?: '/';
        $path = '/'.ltrim($path, '/');

        return mb_substr($path, 0, 500);
    }

    /**
     * Drops the referrer entirely when it is the same host currently serving
     * the page - visitors clicking between a site's own pages are not
     * "traffic from somewhere else", and this is what tells the two apart
     * without needing to look up the site's connected domains.
     */
    private function referrerHost(string $referrer, string $currentHost): ?string
    {
        if ($referrer === '') {
            return null;
        }
        $host = parse_url($referrer, PHP_URL_HOST);
        if (! is_string($host) || $host === '' || strcasecmp($host, $currentHost) === 0) {
            return null;
        }

        return mb_substr(strtolower($host), 0, 255);
    }

    /**
     * A hash of ip+user agent+site+day, never the ip itself - enough to tell
     * two visits from the same person apart within a day for a unique count,
     * but it rotates daily and cannot be correlated across days or reversed
     * back to an identity.
     */
    private function visitorHash(Site $site, Request $request): string
    {
        return hash('sha256', implode('|', [
            $request->ip(),
            (string) $request->userAgent(),
            $site->id,
            CarbonImmutable::now()->toDateString(),
        ]));
    }
}
