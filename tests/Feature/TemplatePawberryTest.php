<?php

use App\Models\Site;
use App\Models\Template;
use App\Services\Ai\SiteKitProfile;
use App\Services\FormService;
use App\Support\TemplateCopySlots;
use Database\Seeders\PawberryTemplateSeeder;

it('installs seven complete Pawberry pages with editable registered blocks and local assets', function () {
    $this->seed(PawberryTemplateSeeder::class);
    $template = Template::where('slug', 'pawberry')->firstOrFail();
    expect($template->pages)->toHaveCount(7)->and($template->pages->where('is_homepage', true))->toHaveCount(1);
    $catalog = collect(json_decode(file_get_contents(resource_path('blocks/block-catalog.json')), true)['blocks'])->keyBy('type');
    expect($catalog->keys()->filter(fn ($type) => str_ends_with($type, '.pawberry')))->toHaveCount(14);
    $paths = $template->pages->pluck('slug')->map(fn ($slug) => '/'.$slug)->push('/')->all();
    foreach ($template->pages as $page) {
        $sections = $page->content_json['sections'];
        expect($sections[0]['type'])->toBe('navbar.pawberry')->and(end($sections)['type'])->toBe('footer.pawberry');
        foreach ($sections as $section) {
            expect($catalog->has($section['type']))->toBeTrue();
            $inspect = function ($props) use (&$inspect, $paths) {
                foreach ($props as $key => $value) {
                    if (is_array($value)) { $inspect($value); continue; }
                    if (! is_string($value) || ! str_starts_with($value, '/')) { continue; }
                    if (in_array($key, ['url', 'buttonUrl', 'logoUrl', 'detailUrl'])) {
                        expect($paths)->toContain($value);
                    } elseif (in_array($key, ['image', 'videoUrl'])) {
                        expect(is_file(public_path(ltrim($value, '/'))))->toBeTrue();
                    }
                }
            };
            $inspect($section['props']);
        }
    }
    $this->seed(PawberryTemplateSeeder::class);
    expect($template->fresh()->pages)->toHaveCount(7);
    $this->getJson('/api/v1/public/templates/pawberry')->assertOk()->assertJsonCount(7, 'data.pages');
});

it('supports AI SiteKit copy editing while preserving block design and addresses', function () {
    $this->seed(PawberryTemplateSeeder::class);
    $template = Template::where('slug', 'pawberry')->firstOrFail();
    $sections = $template->pages->firstWhere('is_homepage', true)->content_json['sections'];
    $kit = app(SiteKitProfile::class)->kit('pawberry');
    expect($kit['label'])->toBe('Pawberry')->and($kit['types'])->toHaveCount(14);
    $slots = collect(TemplateCopySlots::collect($sections));
    expect($slots->pluck('path'))->toContain('1.heading', '2.items.0.title', '5.items.0.quote');
    expect($slots->pluck('path')->filter(fn ($path) => str_ends_with($path, '.videoUrl') || str_ends_with($path, '.buttonUrl') || str_ends_with($path, '.currency') || str_ends_with($path, '.price')))->toHaveCount(0);
    $updated = TemplateCopySlots::apply($sections, ['1.heading' => 'Fresh copy for a fresh coat.']);
    expect($updated[1]['props']['heading'])->toBe('Fresh copy for a fresh coat.')
        ->and($updated[1]['props']['image'])->toBe($sections[1]['props']['image'])
        ->and($updated[1]['props']['buttonUrl'])->toBe($sections[1]['props']['buttonUrl'])
        ->and(array_column($updated, 'type'))->toBe(array_column($sections, 'type'));
});

it('connects Pawberry booking inquiries to the contact form', function () {
    ['workspace' => $workspace] = tenant();
    $site = Site::factory()->create(['workspace_id' => $workspace->id]);
    $service = app(FormService::class);
    $service->create($site, ['name' => 'Newsletter', 'type' => 'newsletter']);
    $contact = $service->create($site, ['name' => 'Booking inquiries', 'type' => 'contact']);
    $content = $service->bindContent($site, ['sections' => [['type' => 'form.pawberry', 'props' => []]]]);
    expect($content['sections'][0]['props']['formId'])->toBe((string) $contact->id);
});
