<?php

use App\Models\Template;
use Database\Seeders\TemplateSeeder;

it('installs seven Marigold pages with registered blocks and working internal destinations', function () {
    $this->seed(TemplateSeeder::class);
    $template = Template::where('slug', 'marigold')->firstOrFail();

    expect($template->pages)->toHaveCount(7)
        ->and($template->pages->where('is_homepage', true))->toHaveCount(1);

    $catalog = collect(json_decode(file_get_contents(resource_path('blocks/block-catalog.json')), true)['blocks'])->keyBy('type');
    expect($catalog->keys()->filter(fn ($type) => str_ends_with($type, '.marigold')))->toHaveCount(15);

    // Every internal destination has to land on a page this template ships,
    // or the demo sends a visitor to a 404 the moment they click.
    $slugs = $template->pages->pluck('slug')->map(fn ($slug) => '/'.$slug)->push('/')->all();

    foreach ($template->pages as $page) {
        $sections = $page->content_json['sections'];
        expect($sections[0]['type'])->toBe('navbar.marigold')
            ->and(end($sections)['type'])->toBe('footer.marigold');

        foreach ($sections as $section) {
            expect($catalog->has($section['type']))->toBeTrue();

            $walk = function ($props) use (&$walk, $slugs) {
                foreach ($props as $key => $value) {
                    if (is_array($value)) {
                        $walk($value);

                        continue;
                    }
                    if (in_array($key, ['url', 'buttonUrl', 'secondaryUrl'], true)
                        && is_string($value) && str_starts_with($value, '/')) {
                        expect($slugs)->toContain(explode('#', $value)[0]);
                    }
                }
            };
            $walk($section['props']);
        }
    }
});
