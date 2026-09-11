<?php

use App\Models\Page;
use App\Services\Ai\FakeAiProvider;
use App\Support\BlockCatalog;
use Laravel\Sanctum\Sanctum;

/**
 * Rewriting the words on a template must not rebuild it.
 *
 * A customer picks a ready-made template for its layout. Chat used to answer
 * "rewrite the content" with a freshly composed page, so the design they chose
 * was replaced by generated.* blocks. These cover the two halves of the fix:
 * the copy route never returns a different page, and a kit site is no longer
 * forbidden from answering in its own blocks.
 */
beforeEach(function () {
    FakeAiProvider::reset();
    BlockCatalog::flush();
    config(['ai.api_key' => null]);
});

/** A page built from the Voltera kit, with the design props a kit page carries. */
function volteraPage(): array
{
    $design = ['animation' => 'fade-up', 'animationTrigger' => 'scroll', 'contentWidth' => 'wide'];

    return [
        [
            'id' => 'nav',
            'type' => 'navbar.voltera',
            'version' => 1,
            'hidden' => false,
            'props' => ['logo' => 'Template Brand', 'anchorId' => 'top'],
        ],
        [
            'id' => 'hero',
            'type' => 'hero.voltera',
            'version' => 1,
            'hidden' => false,
            'props' => $design + [
                'heading' => 'Template heading',
                'description' => 'Template description.',
                'buttonLabel' => 'Template CTA',
                'buttonUrl' => 'https://example.com/keep-me',
            ],
        ],
        [
            'id' => 'services',
            'type' => 'services.voltera',
            'version' => 1,
            'hidden' => false,
            'props' => $design + ['heading' => 'Template services'],
        ],
        [
            'id' => 'why',
            'type' => 'why.voltera',
            'version' => 1,
            'hidden' => false,
            'props' => $design + ['heading' => 'Template why'],
        ],
        [
            'id' => 'footer',
            'type' => 'footer.voltera',
            'version' => 1,
            'hidden' => false,
            'props' => ['copyright' => 'Template copyright'],
        ],
    ];
}

/**
 * @return array{headers: array<string, string>, site: int, page: Page}
 */
function chatCopyFixture(): array
{
    ['user' => $user, 'workspace' => $workspace] = tenant();
    Sanctum::actingAs($user);
    $headers = ['X-Workspace-Id' => (string) $workspace->id];
    enableAi();
    allowAi($workspace);

    $siteId = test()->withHeaders($headers)
        ->postJson('/api/v1/sites', ['name' => 'Kit Site', 'subdomain' => 'kitsite'])
        ->assertCreated()
        ->json('data.id');

    $page = Page::query()->where('site_id', $siteId)->firstOrFail();

    return ['headers' => $headers, 'site' => (int) $siteId, 'page' => $page];
}

/** The slot reply the fake provider gives back for a copy rewrite. */
function slotReply(int $count): string
{
    $slots = [];
    for ($i = 0; $i < $count; $i++) {
        $slots[] = ['i' => $i, 'text' => 'Rewritten '.$i];
    }

    return json_encode(['slots' => $slots]) ?: '{}';
}

it('rewrites the words and keeps every block, order and design prop', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();
    $sections = volteraPage();

    FakeAiProvider::push(slotReply(40));

    $result = $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'page_name' => 'Home',
            'page_slug' => 'home',
            'generation_mode' => 'copy',
            'current_content' => ['schemaVersion' => 1, 'sections' => $sections],
            'messages' => [['role' => 'user', 'content' => 'Rewrite the content for a bakery.']],
        ])
        ->assertOk()
        ->json('data');

    expect($result['action'])->toBe('rewrite_copy');
    expect($result['pages'])->toBe([]);

    // The layout is the thing under test: same types, same order, same count.
    expect(array_column($result['sections'], 'type'))
        ->toBe(['navbar.voltera', 'hero.voltera', 'services.voltera', 'why.voltera', 'footer.voltera']);

    $hero = $result['sections'][1]['props'];
    expect($hero['animation'])->toBe('fade-up');
    expect($hero['contentWidth'])->toBe('wide');
    // A url is an address, not writing, so the rewriter leaves it alone.
    expect($hero['buttonUrl'])->toBe('https://example.com/keep-me');
    expect($hero['heading'])->toStartWith('Rewritten');
});

it('answers copy mode without asking the model to route it', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();

    FakeAiProvider::push(slotReply(40));

    $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'generation_mode' => 'copy',
            'current_content' => ['schemaVersion' => 1, 'sections' => volteraPage()],
            'messages' => [['role' => 'user', 'content' => 'Rewrite the content for a bakery.']],
        ])
        ->assertOk();

    // One call, and it is the copy-slot prompt rather than the chat router.
    $calls = FakeAiProvider::calls();
    expect($calls)->toHaveCount(1);
    expect($calls[0]['system'])->toContain('one numbered slot at a time');
    expect($calls[0]['prompt'])->toContain('Rewrite the content for a bakery.');
});

it('carries the complete long business brief into the rewrite', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();
    $brief = str_repeat('Business details and services. ', 1600).'Final instruction: family bakery in Leeds.';

    FakeAiProvider::push(slotReply(40));

    $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'generation_mode' => 'copy',
            'current_content' => ['schemaVersion' => 1, 'sections' => volteraPage()],
            'messages' => [['role' => 'user', 'content' => $brief]],
        ])
        ->assertOk();

    $prompt = FakeAiProvider::calls()[0]['prompt'];
    expect($prompt)->toContain('Kit Site');
    expect($prompt)->toContain($brief);
    // The existing copy is what the model is asked to replace, slot by slot.
    expect($prompt)->toContain('Template heading');
});

it('rewrites in place when the model itself asks for a copy change', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();

    // The router answers rewrite_copy but also sends a rebuilt page. The
    // sections must be ignored: they are exactly how the template used to be lost.
    FakeAiProvider::push(json_encode([
        'action' => 'rewrite_copy',
        'message' => 'I rewrote the copy.',
        'sections' => [
            ['type' => 'generated.composition', 'props' => ['blockName' => 'Something else']],
        ],
    ]));
    FakeAiProvider::push(slotReply(40));

    $result = $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'current_content' => ['schemaVersion' => 1, 'sections' => volteraPage()],
            'messages' => [['role' => 'user', 'content' => 'Improve the wording.']],
        ])
        ->assertOk()
        ->json('data');

    expect($result['action'])->toBe('rewrite_copy');
    expect(array_column($result['sections'], 'type'))->not->toContain('generated.composition');
    expect(array_column($result['sections'], 'type'))->toContain('hero.voltera');
});

it('treats a bare revise as a copy edit rather than a rebuild', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();

    FakeAiProvider::push(json_encode(['action' => 'revise', 'message' => 'Revised.']));
    FakeAiProvider::push(slotReply(40));

    $result = $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'current_content' => ['schemaVersion' => 1, 'sections' => volteraPage()],
            'messages' => [['role' => 'user', 'content' => 'Revise this page.']],
        ])
        ->assertOk()
        ->json('data');

    expect($result['action'])->toBe('rewrite_copy');
    expect(array_column($result['sections'], 'type'))->toContain('navbar.voltera');
});

it('lets a kit site answer in its own blocks instead of banning them', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();

    FakeAiProvider::push(json_encode([
        'action' => 'insert_blocks',
        'message' => 'Added a FAQ.',
        'sections' => [['type' => 'faq.voltera', 'props' => ['heading' => 'Questions']]],
    ]));

    $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'current_content' => ['schemaVersion' => 1, 'sections' => volteraPage()],
            'messages' => [['role' => 'user', 'content' => 'Add a FAQ.']],
        ])
        ->assertOk();

    $system = FakeAiProvider::calls()[0]['system'];
    expect($system)->not->toContain('Never use catalog kits');
    expect($system)->toContain('Reuse the exact type a section already has');
});

it('art-directs a blank canvas into a kit instead of the generic blocks', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();

    pushArtDirection('halcyon');
    FakeAiProvider::push(json_encode(['action' => 'reply', 'message' => 'Which pages?']));

    $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'current_content' => ['schemaVersion' => 1, 'sections' => []],
            'messages' => [['role' => 'user', 'content' => 'Build me a site.']],
        ])
        ->assertOk();

    $chat = FakeAiProvider::calls()[1];
    expect($chat['system'])->not->toContain('Never use catalog kits');
    expect($chat['prompt'])->toContain('hero.halcyon');
});

it('still forbids catalog kits when no kit could be chosen', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();

    // Art direction answers with no usable kit, so there is nothing to preserve
    // and the original rule applies.
    pushArtDirection(null);
    FakeAiProvider::push(json_encode(['action' => 'reply', 'message' => 'Which pages?']));

    $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'current_content' => ['schemaVersion' => 1, 'sections' => []],
            'messages' => [['role' => 'user', 'content' => 'Build me a site.']],
        ])
        ->assertOk();

    expect(FakeAiProvider::calls()[1]['system'])->toContain('Never use catalog kits');
});

it('inherits the saved template when generating from an empty new page', function () {
    ['headers' => $headers, 'site' => $siteId, 'page' => $page] = chatCopyFixture();
    $existing = volteraPage();
    $existing[1]['props']['headingColor'] = '#123456';
    $this->withHeaders($headers)->putJson('/api/v1/pages/'.$page->id.'/draft', [
        'content' => ['schemaVersion' => 1, 'sections' => $existing],
    ])->assertOk();

    FakeAiProvider::push(json_encode([
        'action' => 'create_page',
        'theme' => ['primary' => '#ff0000'],
        'pages' => [['name' => 'About', 'slug' => 'about', 'sections' => [[
            'type' => 'hero.voltera',
            'props' => ['heading' => 'Our new story', 'headingColor' => '#ff0000', 'contentWidth' => 'narrow'],
        ]]]],
    ]));

    $result = $this->withHeaders($headers)->postJson('/api/v1/ai/chat', [
        'site_id' => $siteId,
        'current_content' => ['schemaVersion' => 1, 'sections' => []],
        'messages' => [['role' => 'user', 'content' => 'Create an About page']],
    ])->assertOk()->json('data');

    expect(FakeAiProvider::calls())->toHaveCount(1);
    expect($result['theme'])->toBe([]);
    $sections = $result['pages'][0]['content']['sections'];
    expect($sections[0]['props'])->toBe($existing[0]['props']);
    $hero = collect($sections)->firstWhere('type', 'hero.voltera');
    expect($hero['props']['heading'])->toBe('Our new story')
        ->and($hero['props']['headingColor'])->toBe('#123456')
        ->and($hero['props']['contentWidth'])->toBe('wide');
    expect(end($sections)['props'])->toBe($existing[4]['props']);
});

it('rejects a new page built from a different template', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();
    FakeAiProvider::push(json_encode([
        'action' => 'create_page',
        'pages' => [['name' => 'About', 'slug' => 'about', 'sections' => [[
            'type' => 'hero.halcyon', 'props' => ['heading' => 'Different design'],
        ]]]],
    ]));
    $this->withHeaders($headers)->postJson('/api/v1/ai/chat', [
        'site_id' => $siteId,
        'current_content' => ['schemaVersion' => 1, 'sections' => volteraPage()],
        'messages' => [['role' => 'user', 'content' => 'Create an About page']],
    ])->assertStatus(422);
});

it('adds matching sections for overflow content without changing existing blocks', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();
    $existing = volteraPage();
    FakeAiProvider::push(json_encode([
        'slots' => [],
        'additional_blocks' => [[
            'type' => 'services.voltera',
            'props' => ['heading' => 'Additional services', 'contentWidth' => 'narrow', 'headingColor' => '#ff0000'],
        ]],
    ]));
    $result = $this->withHeaders($headers)->postJson('/api/v1/ai/chat', [
        'site_id' => $siteId,
        'generation_mode' => 'copy',
        'current_content' => ['schemaVersion' => 1, 'sections' => $existing],
        'messages' => [['role' => 'user', 'content' => 'Include our additional services when the existing blocks are not enough.']],
    ])->assertOk()->json('data');
    expect($result['report']['added'])->toBe(1)
        ->and($result['theme'])->toBe([])
        ->and($result['sections'])->toHaveCount(6);
    $added = $result['sections'][4];
    expect($added['type'])->toBe('services.voltera')
        ->and($added['props']['contentWidth'])->toBe('wide')
        ->and($added['props'])->not->toHaveKey('headingColor');
    $after = $result['sections'];
    array_splice($after, 4, 1);
    expect($after)->toBe($existing);
});

it('rejects overflow blocks from another template', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();
    FakeAiProvider::push(json_encode([
        'slots' => [['i' => 0, 'text' => 'Updated brand']],
        'additional_blocks' => [['type' => 'hero.halcyon', 'props' => ['heading' => 'Foreign design']]],
    ]));
    $this->withHeaders($headers)->postJson('/api/v1/ai/chat', [
        'site_id' => $siteId,
        'generation_mode' => 'copy',
        'current_content' => ['schemaVersion' => 1, 'sections' => volteraPage()],
        'messages' => [['role' => 'user', 'content' => 'Add the missing content.']],
    ])->assertStatus(422);
});

it('explains itself rather than rewriting an empty page', function () {
    ['headers' => $headers, 'site' => $siteId] = chatCopyFixture();

    $this->withHeaders($headers)
        ->postJson('/api/v1/ai/chat', [
            'site_id' => $siteId,
            'generation_mode' => 'copy',
            'current_content' => ['schemaVersion' => 1, 'sections' => []],
            'messages' => [['role' => 'user', 'content' => 'Rewrite the content.']],
        ])
        ->assertStatus(422);

    expect(FakeAiProvider::calls())->toBe([]);
});
