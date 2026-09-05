<?php

use App\Models\Template;
use Database\Seeders\TemplateSeeder;

it('seeds Forma with five complete pages and registered reusable blocks', function () {
    $this->seed(TemplateSeeder::class);
    $template = Template::query()->where('slug', 'forma')->firstOrFail();
    expect($template->is_active)->toBeTrue()
        ->and($template->pages)->toHaveCount(5)
        ->and($template->pages->where('is_homepage', true))->toHaveCount(1);
    $catalog = collect(json_decode(file_get_contents(resource_path('blocks/block-catalog.json')), true)['blocks'])->keyBy('type');
    foreach ($template->pages as $page) {
        foreach ($page->content_json['sections'] as $section) {
            expect($catalog->has($section['type']))->toBeTrue();
            if (str_ends_with($section['type'], '.forma')) {
                expect($section['props']['heading'])->not->toBeEmpty();
            }
        }
    }
    $services = $template->pages->firstWhere('slug', 'services');
    expect(collect($services->content_json['sections'])->firstWhere('type', 'services.forma')['props']['layout'])->toBe('list');
});
