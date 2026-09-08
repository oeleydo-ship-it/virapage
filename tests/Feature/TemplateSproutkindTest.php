<?php

use App\Models\Site;
use App\Models\Template;
use App\Services\FormService;
use Database\Seeders\SproutkindTemplateSeeder;

it('installs seven complete pages with registered blocks and valid internal links', function () {
    $this->seed(SproutkindTemplateSeeder::class);
    $template = Template::where('slug', 'sproutkind')->firstOrFail();
    expect($template->pages)->toHaveCount(7)
        ->and($template->pages->where('is_homepage', true))->toHaveCount(1);
    $catalog = collect(json_decode(file_get_contents(resource_path('blocks/block-catalog.json')), true)['blocks'])->keyBy('type');
    expect($catalog->keys()->filter(fn ($type) => str_ends_with($type, '.sproutkind')))->toHaveCount(15);
    $paths = $template->pages->pluck('slug')->map(fn ($slug) => '/'.$slug)->push('/')->all();
    foreach ($template->pages as $page) {
        $sections = $page->content_json['sections'];
        expect($sections[0]['type'])->toBe('navbar.sproutkind')
            ->and(end($sections)['type'])->toBe('footer.sproutkind');
        foreach ($sections as $section) {
            expect($catalog->has($section['type']))->toBeTrue();
            $inspect = function ($props) use (&$inspect, $paths) {
                foreach ($props as $key => $value) {
                    if (is_array($value)) { $inspect($value); continue; }
                    if (is_string($value) && str_starts_with($value, '/')) {
                        if (in_array($key, ['url', 'buttonUrl', 'secondaryUrl', 'detailUrl', 'logoUrl'])) {
                            expect($paths)->toContain(explode('#', $value)[0]);
                        } elseif (in_array($key, ['image', 'video'])) {
                            expect(is_file(public_path(ltrim($value, '/'))))->toBeTrue();
                        }
                    }
                }
            };
            $inspect($section['props']);
        }
    }
    $this->seed(SproutkindTemplateSeeder::class);
    expect($template->fresh()->pages)->toHaveCount(7);
    $this->getJson('/api/v1/public/templates/sproutkind')->assertOk()->assertJsonCount(7, 'data.pages');
});

it('binds Sproutkind inquiries to the site contact form instead of another form type', function () {
    ['workspace' => $workspace] = tenant();
    $site = Site::factory()->create(['workspace_id' => $workspace->id]);
    $service = app(FormService::class);
    $service->create($site, ['name' => 'Updates', 'type' => 'newsletter']);
    $contact = $service->create($site, ['name' => 'Family inquiries', 'type' => 'contact']);
    $content = $service->bindContent($site, ['schemaVersion' => 1, 'sections' => [
        ['id' => 'inquiry', 'type' => 'form.sproutkind', 'props' => ['formId' => '']],
    ]]);
    expect($content['sections'][0]['props']['formId'])->toBe((string) $contact->id);
});
