<?php

use App\Models\Template;
use Database\Seeders\TemplateSeeder;

it('installs six Lexara pages with registered blocks and working internal destinations', function () {
    $this->seed(TemplateSeeder::class);
    $template = Template::where('slug', 'lexara')->firstOrFail();

    expect($template->pages)->toHaveCount(6)
        ->and($template->pages->where('is_homepage', true))->toHaveCount(1);

    $catalog = collect(json_decode(file_get_contents(resource_path('blocks/block-catalog.json')), true)['blocks'])->keyBy('type');
    expect($catalog->keys()->filter(fn ($type) => str_ends_with($type, '.lexara')))->toHaveCount(14);

    // Every internal destination has to land on a page this template ships,
    // or the demo sends a visitor to a 404 the moment they click.
    $slugs = $template->pages->pluck('slug')->map(fn ($slug) => '/'.$slug)->push('/')->all();

    foreach ($template->pages as $page) {
        $sections = $page->content_json['sections'];
        expect($sections[0]['type'])->toBe('navbar.lexara')
            ->and(end($sections)['type'])->toBe('footer.lexara');

        foreach ($sections as $section) {
            expect($catalog->has($section['type']))->toBeTrue();

            $walk = function ($props) use (&$walk, $slugs) {
                foreach ($props as $key => $value) {
                    if (is_array($value)) {
                        $walk($value);

                        continue;
                    }
                    if (in_array($key, ['url', 'buttonUrl', 'secondaryUrl', 'announcementUrl'], true)
                        && is_string($value) && str_starts_with($value, '/')) {
                        expect($slugs)->toContain(explode('#', $value)[0]);
                    }
                }
            };
            $walk($section['props']);
        }
    }
});
