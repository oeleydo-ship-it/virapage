<?php

use App\Support\TemplateCopySlots;

it('exposes shared image layouts to AI while protecting images and preview URLs', function () {
    $catalog = collect(json_decode(file_get_contents(resource_path('blocks/block-catalog.json')), true)['blocks'])->keyBy('type');
    foreach (['gallery.full_image', 'gallery.vertical_duo', 'gallery.full_masonry', 'gallery.preview_strip', 'gallery.filtered_tabs'] as $type) {
        $block = $catalog->get($type);
        expect($block)->not->toBeNull();
        $sections = [['id' => 'gallery', 'type' => $type, 'props' => $block['defaultProps']]];
        $slots = collect(TemplateCopySlots::collect($sections));
        expect($slots->pluck('path'))->toContain('0.heading');
        expect($slots->pluck('path')->filter(fn ($path) => preg_match('/\.(image|previewUrl)$/', $path)))->toHaveCount(0);
        $updated = TemplateCopySlots::apply($sections, ['0.heading' => 'My image collection']);
        $expected = $sections;
        $expected[0]['props']['heading'] = 'My image collection';
        expect($updated)->toBe($expected);
    }
});
