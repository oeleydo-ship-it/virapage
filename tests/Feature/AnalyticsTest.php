<?php

use App\Models\Domain;
use App\Models\PageView;
use App\Models\Site;

/**
 * Creates a site reachable at $host, owned by a fresh workspace, and returns
 * the workspace owner alongside it so the caller can hit the authenticated
 * summary endpoint too.
 */
function analyticsSite(string $host): array
{
    ['user' => $user, 'workspace' => $workspace] = tenant();

    $site = Site::query()->create([
        'workspace_id' => $workspace->id,
        'name' => 'Tracked Site',
        'slug' => 'tracked-site',
        'status' => 'published',
        'created_by' => $user->id,
    ]);

    Domain::query()->create([
        'workspace_id' => $workspace->id,
        'site_id' => $site->id,
        'hostname' => $host,
        'type' => 'subdomain',
        'status' => 'active',
    ]);

    return compact('site', 'user', 'workspace');
}

it('records a page view from the public beacon, drops self-referrals, and reports totals in the summary', function () {
    ['site' => $site, 'user' => $user, 'workspace' => $workspace] = analyticsSite('trackme.sites.localhost');

    // A visit to the homepage with no referrer.
    $this->postJson('http://trackme.sites.localhost/api/v1/public/track', [
        'path' => '/',
        'referrer' => '',
    ])->assertNoContent();

    // A visit that arrived by clicking a link on the site's own about page -
    // this must not be counted as a referrer.
    $this->postJson('http://trackme.sites.localhost/api/v1/public/track', [
        'path' => '/about',
        'referrer' => 'http://trackme.sites.localhost/',
    ])->assertNoContent();

    // A visit that genuinely arrived from somewhere else.
    $this->withHeaders(['User-Agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'])
        ->postJson('http://trackme.sites.localhost/api/v1/public/track', [
            'path' => '/',
            'referrer' => 'https://search.example.com/results?q=hello',
        ])->assertNoContent();

    expect(PageView::query()->count())->toBe(3);
    expect(PageView::query()->whereNotNull('referrer_host')->count())->toBe(1);
    expect(PageView::query()->whereNotNull('referrer_host')->value('referrer_host'))->toBe('search.example.com');

    // Every view stored is attached to the right site and workspace, and
    // never carries the visitor's ip.
    $view = PageView::query()->first();
    expect($view->site_id)->toBe($site->id);
    expect($view->workspace_id)->toBe($workspace->id);
    expect($view->getAttributes())->not->toHaveKey('ip');

    $headers = authHeaders($user, $workspace);
    $summary = $this->withHeaders($headers)
        ->getJson('/api/v1/sites/'.$site->id.'/analytics?days=7')
        ->assertOk()
        ->json('data');

    expect($summary['views'])->toBe(3);
    // Two different User-Agents against the same IP within the same day hash
    // to two different visitors.
    expect($summary['uniques'])->toBe(2);
    expect(collect($summary['top_pages'])->firstWhere('path', '/')['views'])->toBe(2);
    expect(collect($summary['top_referrers'])->firstWhere('host', 'search.example.com')['views'])->toBe(1);
    expect($summary['trend'])->toHaveCount(7);
});

it('silently accepts a beacon for a host with no site, and never resolves it into a view', function () {
    $this->postJson('http://nobody-here.sites.localhost/api/v1/public/track', [
        'path' => '/',
    ])->assertNoContent();

    expect(PageView::query()->count())->toBe(0);
});

it('refuses to show one workspace analytics to a member of another', function () {
    ['site' => $site] = analyticsSite('private-analytics.sites.localhost');
    $this->postJson('http://private-analytics.sites.localhost/api/v1/public/track', ['path' => '/'])
        ->assertNoContent();

    ['user' => $other, 'workspace' => $otherWorkspace] = tenant();
    $this->withHeaders(authHeaders($other, $otherWorkspace))
        ->getJson('/api/v1/sites/'.$site->id.'/analytics')
        ->assertNotFound();
});
