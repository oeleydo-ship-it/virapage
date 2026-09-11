<?php

use App\Models\Site;
use App\Models\Template;
use App\Services\Ai\SiteKitProfile;
use App\Services\FormService;
use App\Support\TemplateCopySlots;
use Database\Seeders\VelouraTemplateSeeder;

it('installs eight Veloura pages with registered editable blocks, valid links and local photographs', function () {
    $this->seed(VelouraTemplateSeeder::class);
    $template = Template::where('slug', 'veloura')->firstOrFail();
    expect($template->pages)->toHaveCount(8)->and($template->pages->where('is_homepage', true))->toHaveCount(1);
    $catalog = collect(json_decode(file_get_contents(resource_path('blocks/block-catalog.json')), true)['blocks'])->keyBy('type');
    expect($catalog->keys()->filter(fn ($type) => str_ends_with($type, '.veloura')))->toHaveCount(14);
    $paths = $template->pages->pluck('slug')->map(fn ($slug) => '/'.$slug)->push('/')->all();
    foreach ($template->pages as $page) {
        $sections = $page->content_json['sections'];
        expect($sections[0]['type'])->toBe('navbar.veloura')->and(end($sections)['type'])->toBe('footer.veloura');
        foreach ($sections as $section) {
            expect($catalog->has($section['type']))->toBeTrue();
            $inspect = function ($props) use (&$inspect, $paths) {
                foreach ($props as $key => $value) {
                    if (is_array($value)) { $inspect($value); continue; }
                    if (! is_string($value) || ! str_starts_with($value, '/')) { continue; }
                    if (in_array($key, ['url', 'buttonUrl', 'logoUrl'])) {
                        expect($paths)->toContain($value);
                    } elseif ($key === 'image') {
                        expect(is_file(public_path(ltrim($value, '/'))))->toBeTrue();
                    }
                }
            };
            $inspect($section['props']);
        }
    }
    $this->seed(VelouraTemplateSeeder::class);
    expect($template->fresh()->pages)->toHaveCount(8);
    $this->getJson('/api/v1/public/templates/veloura')->assertOk()->assertJsonCount(8, 'data.pages');
});

it('makes every Veloura page writable by AI without changing its layout or destinations', function () {
    $this->seed(VelouraTemplateSeeder::class);
    $kit = app(SiteKitProfile::class)->kit('veloura');
    expect($kit['label'])->toBe('Veloura')->and($kit['types'])->toHaveCount(14);
    foreach (Template::where('slug', 'veloura')->firstOrFail()->pages as $page) {
        $sections = $page->content_json['sections'];
        $slots = collect(TemplateCopySlots::collect($sections));
        expect($slots->pluck('path'))->toContain('1.heading');
        expect($slots->pluck('path')->filter(fn ($path) => preg_match('/\.(buttonUrl|logoUrl|url|image|price|formId)$/', $path)))->toHaveCount(0);
        $updated = TemplateCopySlots::apply($sections, ['1.heading' => 'Your own salon story']);
        $expected = $sections;
        $expected[1]['props']['heading'] = 'Your own salon story';
        expect($updated)->toBe($expected);
    }
});

it('binds Veloura appointment inquiries to the site contact form', function () {
    ['workspace' => $workspace] = tenant();
    $site = Site::factory()->create(['workspace_id' => $workspace->id]);
    $service = app(FormService::class);
    $service->create($site, ['name' => 'Newsletter', 'type' => 'newsletter']);
    $contact = $service->create($site, ['name' => 'Appointments', 'type' => 'contact']);
    $content = $service->bindContent($site, ['sections' => [['type' => 'form.veloura', 'props' => []]]]);
    expect($content['sections'][0]['props']['formId'])->toBe((string) $contact->id);
});
