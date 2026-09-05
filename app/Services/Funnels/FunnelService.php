<?php

namespace App\Services\Funnels;

use App\Models\Funnel;
use App\Models\FunnelConnection;
use App\Models\FunnelStep;
use App\Models\FunnelStepRevision;
use App\Models\Product;
use App\Models\User;
use App\Models\Workspace;
use App\Services\AuditService;
use App\Services\PlanLimitService;
use App\Support\PageSchemaValidator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class FunnelService
{
    public function __construct(
        private readonly AuditService $audit,
        private readonly PageSchemaValidator $validator,
        private readonly PlanLimitService $limits,
    ) {}

    /** @param array<string, mixed> $data */
    public function create(Workspace $workspace, User $user, array $data): Funnel
    {
        $this->limits->assertOrFail($workspace, 'funnels');

        return DB::transaction(function () use ($workspace, $user, $data) {
            $slug = $this->uniqueFunnelSlug($workspace->id, $data['slug'] ?? $data['name']);
            $funnel = Funnel::query()->create([
                'workspace_id' => $workspace->id,
                'public_id' => (string) Str::uuid(),
                'site_id' => null,
                'domain_id' => $data['domain_id'] ?? null,
                'created_by' => $user->id,
                'name' => $data['name'],
                'slug' => $slug,
                'description' => $data['description'] ?? null,
                'type' => $data['type'] ?? 'lead_generation',
                'goal' => $data['goal'] ?? 'collect_leads',
                'status' => 'draft',
                'settings' => $data['settings'] ?? ['cookie_consent' => 'essential', 'bot_filtering' => true],
            ]);

            // A product picked at creation time is what a template's checkout
            // steps sell from the moment they exist, rather than sitting blank
            // until someone opens each step and assigns one by hand. Its price
            // is copied onto the button too - what a shopper is actually
            // charged always comes from the product row, but a checkout page
            // that shows $0.00 looks broken before anyone has touched it.
            $product = null;
            if (! empty($data['product_id'])) {
                $product = Product::query()->where('workspace_id', $workspace->id)->find($data['product_id']);
            }

            $blueprint = $this->templateSteps($data['template'] ?? null, $funnel->name, $funnel->type, $funnel->goal, $product);
            $createdSteps = [];
            foreach ($blueprint as $index => $step) {
                $createdSteps[] = $this->addStep($funnel, $user, [
                    'name' => $step['name'],
                    'slug' => $step['slug'],
                    'type' => $step['type'],
                    'position' => $index + 1,
                    'canvas_x' => 80 + ($index * 310),
                    'canvas_y' => 100 + (($index % 2) * 40),
                    'content' => $step['content'],
                ]);
            }
            for ($i = 0; $i < count($createdSteps) - 1; $i++) {
                $this->connect($funnel, [
                    'source_step_id' => $createdSteps[$i]->id,
                    'target_step_id' => $createdSteps[$i + 1]->id,
                    'connection_type' => 'default',
                ]);
            }

            $this->audit->log('funnel.created', $funnel, ['standalone' => true, 'template' => $data['template'] ?? null], $workspace, $user);

            return $this->load($funnel);
        });
    }

    /** @param array<string, mixed> $data */
    public function update(Funnel $funnel, array $data): Funnel
    {
        $funnel->fill(collect($data)->only(['name', 'description', 'type', 'goal', 'domain_id', 'settings'])->all())->save();

        return $this->load($funnel);
    }

    /** @param array<string, mixed> $data */
    public function addStep(Funnel $funnel, User $user, array $data): FunnelStep
    {
        $appending = ! isset($data['position']);
        $position = $appending ? ((int) $funnel->steps()->max('position') + 1) : (int) $data['position'];
        // Captured before the insert, so it is whichever step the new one is
        // landing after - the one a visitor would otherwise be stuck on with
        // nowhere the flow sends them next.
        $previous = $appending ? $funnel->steps()->orderByDesc('position')->first() : null;
        $slug = $this->uniqueStepSlug($funnel, $data['slug'] ?? $data['name']);
        $content = $this->validator->validate($data['content'] ?? $this->stepContent($data['name'], $data['type'] ?? 'custom_page'));

        $step = FunnelStep::query()->create([
            'workspace_id' => $funnel->workspace_id,
            'funnel_id' => $funnel->id,
            'page_id' => null,
            'draft_content' => $content,
            'name' => $data['name'],
            'slug' => $slug,
            'type' => $data['type'] ?? 'custom_page',
            'status' => 'draft',
            'position' => $position,
            'canvas_x' => (int) ($data['canvas_x'] ?? 80 + ($position * 310)),
            'canvas_y' => (int) ($data['canvas_y'] ?? 100),
            'settings' => $data['settings'] ?? [],
        ]);

        if ($previous) {
            $this->connect($funnel, [
                'source_step_id' => $previous->id,
                'target_step_id' => $step->id,
                'connection_type' => 'default',
            ]);
        }

        $this->createStepRevision($step, $user, $content, 'created');

        return $step;
    }

    /** @param array<string, mixed> $data */
    public function updateStep(Funnel $funnel, FunnelStep $step, array $data): FunnelStep
    {
        $this->assertStep($funnel, $step);
        $step->fill(collect($data)->only(['name', 'type', 'status', 'position', 'canvas_x', 'canvas_y', 'settings'])->all())->save();

        return $step->fresh('page');
    }

    /** @param array<string, mixed> $content */
    public function saveStepContent(Funnel $funnel, FunnelStep $step, array $content, User $user): FunnelStep
    {
        $this->assertStep($funnel, $step);
        $validated = $this->validator->validate($content);
        $step->update(['draft_content' => $validated]);
        $this->createStepRevision($step, $user, $validated, 'draft');

        return $step->fresh();
    }

    /** A version of a step's content, so an accidental delete or a bad edit has a way back. */
    public function restoreStepRevision(Funnel $funnel, FunnelStep $step, FunnelStepRevision $revision, User $user): FunnelStep
    {
        $this->assertStep($funnel, $step);
        abort_unless($revision->funnel_step_id === $step->id, 404);

        $content = $this->validator->validate($revision->content_json ?? ['schemaVersion' => 1, 'sections' => []]);
        $step->update(['draft_content' => $content]);
        $this->createStepRevision($step, $user, $content, 'restore');

        return $step->fresh();
    }

    /**
     * Snapshots a step's content, so a mistaken delete or a bad edit has a way
     * back. Pruned to the workspace plan's `revision_history` depth - the same
     * ceiling a page's own history already respects, so a funnel step is not
     * a way around it.
     *
     * @param  array<string, mixed>  $content
     */
    private function createStepRevision(FunnelStep $step, ?User $user, array $content, string $reason): FunnelStepRevision
    {
        $next = (int) ($step->revisions()->max('version_number') ?? 0) + 1;
        $revision = FunnelStepRevision::query()->create([
            'funnel_step_id' => $step->id,
            'user_id' => $user?->id,
            'version_number' => $next,
            'content_json' => $content,
            'reason' => $reason,
        ]);

        $this->pruneStepRevisions($step);

        return $revision;
    }

    private function pruneStepRevisions(FunnelStep $step): void
    {
        $step->loadMissing('funnel.workspace');
        $workspace = $step->funnel?->workspace;
        if (! $workspace) {
            return;
        }

        $limit = $this->limits->revisionLimit($workspace);
        if ($limit === null || $limit < 0) {
            return;
        }

        $keep = max($limit, 1);
        // SQLite (used in tests) requires a LIMIT alongside OFFSET.
        $keepIds = $step->revisions()->orderByDesc('version_number')->limit($keep)->pluck('id');
        if ($keepIds->isEmpty()) {
            return;
        }

        $step->revisions()->whereNotIn('id', $keepIds)->delete();
    }

    /** @param array<string, mixed> $data */
    public function connect(Funnel $funnel, array $data): FunnelConnection
    {
        $source = $funnel->steps()->findOrFail($data['source_step_id']);
        $target = $funnel->steps()->findOrFail($data['target_step_id']);
        if ($source->is($target)) {
            throw ValidationException::withMessages(['target_step_id' => ['A step cannot connect to itself.']]);
        }

        $connection = FunnelConnection::query()->updateOrCreate([
            'source_step_id' => $source->id,
            'target_step_id' => $target->id,
            'connection_type' => $data['connection_type'] ?? 'default',
        ], [
            'workspace_id' => $funnel->workspace_id,
            'funnel_id' => $funnel->id,
            'conditions' => $data['conditions'] ?? [],
            'priority' => (int) ($data['priority'] ?? 0),
        ]);

        $this->pointDefaultButtonsToStep($source, $funnel, $target);

        return $connection;
    }

    /**
     * Aims a step's untouched "Continue" button at wherever the flow now
     * sends the visitor next.
     *
     * A button only gets rewritten while it is still on its default `''`
     * or `'#'` - the value nobody has typed over yet. One somebody has set on
     * purpose, even to the same page, is never touched again: a builder who
     * pasted a link in deliberately should not watch it change back to
     * whatever the canvas connects to.
     */
    private function pointDefaultButtonsToStep(FunnelStep $source, Funnel $funnel, FunnelStep $target): void
    {
        $content = $source->draft_content;
        if (! is_array($content) || ! is_array($content['sections'] ?? null)) {
            return;
        }

        $href = '/f/'.$funnel->public_id.'/'.$target->slug;
        $changed = false;

        foreach ($content['sections'] as &$section) {
            $props = $section['props'] ?? null;
            if (! is_array($props) || ! array_key_exists('buttonUrl', $props)) {
                continue;
            }
            if (in_array($props['buttonUrl'], ['', '#'], true)) {
                $section['props']['buttonUrl'] = $href;
                $changed = true;
            }
        }
        unset($section);

        if ($changed) {
            $source->update(['draft_content' => $content]);
        }
    }

    public function publish(Funnel $funnel, User $user): Funnel
    {
        if ($funnel->steps()->count() < 1) {
            throw ValidationException::withMessages(['steps' => ['Add at least one step before publishing.']]);
        }
        DB::transaction(function () use ($funnel, $user) {
            foreach ($funnel->steps()->with('variants')->get() as $step) {
                $validated = $this->validator->validate($step->draft_content ?? ['schemaVersion' => 1, 'sections' => []]);
                $step->update(['published_content' => $validated, 'status' => 'published']);
                $this->createStepRevision($step, $user, $validated, 'published');

                // A variant that is still a draft would be assigned traffic and
                // then have nothing of its own to serve, so it goes live with
                // the step it belongs to.
                foreach ($step->variants as $variant) {
                    $variant->update([
                        'published_content' => $this->validator->validate(
                            $variant->draft_content ?? $step->draft_content ?? ['schemaVersion' => 1, 'sections' => []],
                        ),
                    ]);
                }
            }
            $funnel->update(['status' => 'published', 'published_at' => now()]);
            $this->audit->log('funnel.published', $funnel, [], $funnel->workspace, $user);
        });

        return $this->load($funnel);
    }

    public function duplicate(Funnel $source, User $user): Funnel
    {
        return DB::transaction(function () use ($source, $user) {
            $copy = Funnel::query()->create([
                'workspace_id' => $source->workspace_id, 'site_id' => $source->site_id,
                'public_id' => (string) Str::uuid(),
                'domain_id' => $source->domain_id, 'created_by' => $user->id,
                'name' => $source->name.' Copy', 'slug' => $this->uniqueFunnelSlug($source->workspace_id, $source->slug.'-copy'),
                'description' => $source->description, 'type' => $source->type, 'goal' => $source->goal,
                'status' => 'draft', 'settings' => $source->settings,
            ]);
            $map = [];
            foreach ($source->steps()->get() as $step) {
                $new = $this->addStep($copy, $user, [
                    'name' => $step->name, 'slug' => $step->slug, 'type' => $step->type,
                    'position' => $step->position, 'canvas_x' => $step->canvas_x, 'canvas_y' => $step->canvas_y,
                    'settings' => $step->settings, 'content' => $step->draft_content ?? ['schemaVersion' => 1, 'sections' => []],
                ]);
                $map[$step->id] = $new->id;
            }
            foreach ($source->connections as $connection) {
                $this->connect($copy, ['source_step_id' => $map[$connection->source_step_id], 'target_step_id' => $map[$connection->target_step_id], 'connection_type' => $connection->connection_type, 'conditions' => $connection->conditions, 'priority' => $connection->priority]);
            }

            return $this->load($copy);
        });
    }

    /**
     * A portable snapshot of a funnel's structure - its steps and how they
     * connect - addressed by slug rather than by id, so it means the same
     * thing imported into a different workspace as it does exported from
     * this one.
     *
     * @return array<string, mixed>
     */
    public function export(Funnel $funnel): array
    {
        $funnel->loadMissing(['steps' => fn ($query) => $query->orderBy('position'), 'connections']);
        $slugById = $funnel->steps->pluck('slug', 'id');

        return [
            'name' => $funnel->name,
            'description' => $funnel->description,
            'type' => $funnel->type,
            'goal' => $funnel->goal,
            'settings' => $funnel->settings,
            'steps' => $funnel->steps->map(fn (FunnelStep $step) => [
                'name' => $step->name,
                'slug' => $step->slug,
                'type' => $step->type,
                'canvas_x' => $step->canvas_x,
                'canvas_y' => $step->canvas_y,
                'settings' => $step->settings,
                'content' => $step->draft_content ?? ['schemaVersion' => 1, 'sections' => []],
            ])->values()->all(),
            'connections' => $funnel->connections
                ->map(fn (FunnelConnection $connection) => [
                    'source_slug' => $slugById->get($connection->source_step_id),
                    'target_slug' => $slugById->get($connection->target_step_id),
                    'connection_type' => $connection->connection_type,
                    'conditions' => $connection->conditions,
                    'priority' => $connection->priority,
                ])
                ->filter(fn (array $row) => $row['source_slug'] && $row['target_slug'])
                ->values()
                ->all(),
        ];
    }

    /**
     * Rebuilds a funnel from an export - a copy of the structure, not a
     * pointer back to the funnel it came from.
     *
     * @param  array<string, mixed>  $payload
     */
    public function import(Workspace $workspace, User $user, array $payload): Funnel
    {
        $this->limits->assertOrFail($workspace, 'funnels');

        return DB::transaction(function () use ($workspace, $user, $payload) {
            $slug = $this->uniqueFunnelSlug($workspace->id, $payload['name']);
            $funnel = Funnel::query()->create([
                'workspace_id' => $workspace->id,
                'public_id' => (string) Str::uuid(),
                'site_id' => null,
                'domain_id' => null,
                'created_by' => $user->id,
                'name' => $payload['name'],
                'slug' => $slug,
                'description' => $payload['description'] ?? null,
                'type' => $payload['type'] ?? 'lead_generation',
                'goal' => $payload['goal'] ?? 'collect_leads',
                'status' => 'draft',
                'settings' => $payload['settings'] ?? ['cookie_consent' => 'essential', 'bot_filtering' => true],
            ]);

            // Keyed by the slug the export carried, not by whatever unique
            // slug the new funnel actually assigns - a collision there must
            // not break the connections that follow.
            $stepsBySourceSlug = [];
            foreach (($payload['steps'] ?? []) as $index => $stepData) {
                $step = $this->addStep($funnel, $user, [
                    'name' => $stepData['name'] ?? ('Step '.($index + 1)),
                    'slug' => $stepData['slug'] ?? null,
                    'type' => $stepData['type'] ?? 'custom_page',
                    'position' => $index + 1,
                    'canvas_x' => $stepData['canvas_x'] ?? 80 + ($index * 310),
                    'canvas_y' => $stepData['canvas_y'] ?? 100,
                    'settings' => $stepData['settings'] ?? [],
                    'content' => $stepData['content'] ?? ['schemaVersion' => 1, 'sections' => []],
                ]);
                if (! empty($stepData['slug'])) {
                    $stepsBySourceSlug[$stepData['slug']] = $step;
                }
            }

            foreach (($payload['connections'] ?? []) as $connectionData) {
                $source = $stepsBySourceSlug[$connectionData['source_slug'] ?? ''] ?? null;
                $target = $stepsBySourceSlug[$connectionData['target_slug'] ?? ''] ?? null;
                if (! $source || ! $target) {
                    continue;
                }
                $this->connect($funnel, [
                    'source_step_id' => $source->id,
                    'target_step_id' => $target->id,
                    'connection_type' => $connectionData['connection_type'] ?? 'default',
                    'conditions' => $connectionData['conditions'] ?? [],
                    'priority' => $connectionData['priority'] ?? 0,
                ]);
            }

            $this->audit->log('funnel.imported', $funnel, [], $workspace, $user);

            return $this->load($funnel);
        });
    }

    public function load(Funnel $funnel): Funnel
    {
        return $funnel->fresh(['site', 'steps', 'connections'])->loadCount(['steps', 'leads', 'events']);
    }

    private function assertStep(Funnel $funnel, FunnelStep $step): void
    {
        abort_unless($step->funnel_id === $funnel->id, 404);
    }

    private function uniqueFunnelSlug(int $workspaceId, string $value): string
    {
        return $this->uniqueSlug(Str::slug($value) ?: 'funnel', fn ($slug) => Funnel::withTrashed()->where('workspace_id', $workspaceId)->where('slug', $slug)->exists());
    }

    private function uniqueStepSlug(Funnel $funnel, string $value): string
    {
        return $this->uniqueSlug(Str::slug($value) ?: 'step', fn ($slug) => FunnelStep::withTrashed()->where('funnel_id', $funnel->id)->where('slug', $slug)->exists());
    }

    private function uniqueSlug(string $base, callable $exists): string
    {
        $slug = $base;
        $i = 2;
        while ($exists($slug)) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    private function page(array $sections): array
    {
        return ['schemaVersion' => 1, 'sections' => $sections];
    }

    private function section(string $id, string $type, array $props): array
    {
        return ['id' => $id.'-'.Str::lower(Str::random(5)), 'type' => $type, 'version' => 1, 'hidden' => false, 'props' => $props];
    }

    /**
     * A landing page that looks like one, not a headline on a blank page.
     *
     * Every real site template pairs a hero with proof and a close - a funnel
     * step that skips straight from "Get started" to nothing is asking a
     * stranger to trust a page that has not shown them why yet.
     */
    private function landingContent(string $name): array
    {
        return $this->page([
            $this->section('hero', 'hero.saas', [
                'eyebrow' => 'A better next step',
                'heading' => $name,
                'description' => 'A focused experience designed to help you make a confident decision.',
                'buttonLabel' => 'Get started',
                'buttonUrl' => '#',
                'secondaryLabel' => '',
                'secondaryUrl' => '#',
                'features' => [
                    ['label' => 'Set up in minutes', 'icon' => 'check-circle'],
                    ['label' => 'No technical skills needed', 'icon' => 'check-circle'],
                    ['label' => 'Cancel any time', 'icon' => 'check-circle'],
                ],
                'logosTitle' => '',
                'logos' => [],
                'image' => '',
            ]),
            $this->section('benefits', 'features.cards', [
                'eyebrow' => 'Why people choose this',
                'heading' => "Everything you need, nothing you don't",
                'description' => 'Built around the parts that actually move the needle.',
                'columns' => 3,
                'items' => [
                    ['title' => 'Fast to get going', 'text' => 'Start seeing results the same day you sign up.', 'icon' => 'zap'],
                    ['title' => 'Built to fit', 'text' => 'Flexible enough for how you already work.', 'icon' => 'puzzle'],
                    ['title' => 'Real support', 'text' => 'Help from a person, not a ticket queue.', 'icon' => 'life-buoy'],
                ],
            ]),
            $this->section('proof', 'testimonials.cards', [
                'eyebrow' => 'What people say',
                'heading' => 'Trusted by people like you',
                'showRating' => true,
                'items' => [
                    ['text' => 'This made the decision easy - exactly what we needed.', 'name' => 'Jamie Rivera', 'role' => 'Operations Lead', 'rating' => 5],
                    ['text' => 'Simple, clear, and it just works.', 'name' => 'Priya Nair', 'role' => 'Founder', 'rating' => 5],
                    ['text' => 'I would recommend this to anyone on the fence.', 'name' => 'Sam Okafor', 'role' => 'Marketing Manager', 'rating' => 5],
                ],
            ]),
            $this->section('close', 'cta.simple', [
                'eyebrow' => 'Ready when you are',
                'heading' => 'Take the next step',
                'description' => 'It only takes a minute to get started.',
                'buttonLabel' => 'Get started',
                'buttonUrl' => '#',
                'secondaryLabel' => '',
                'secondaryUrl' => '',
            ]),
            $this->section('footer', 'footer.simple', [
                'brand' => $name,
                'copyright' => '© '.date('Y').' '.$name.'. All rights reserved.',
            ]),
        ]);
    }

    /**
     * The blocks a new step starts with.
     *
     * A step whose job is to collect details gets a form that actually collects
     * them. Every type used to get the same placeholder hero, so a funnel built
     * to capture leads shipped with nothing on it that could.
     */
    private function stepContent(string $name, string $type, ?Product $product = null): array
    {
        if (in_array($type, ['lead_form', 'survey', 'opt_in'], true)) {
            return $this->page([$this->section('optin', 'funnel.optin', [
                'eyebrow' => Str::headline($type),
                'heading' => $name,
                'description' => 'Leave your details and we will take it from here.',
                'fields' => $type === 'survey' ? ['name', 'email', 'company'] : ['name', 'email'],
                'buttonLabel' => 'Continue',
                'successMessage' => 'Thanks — that is everything we need.',
                'footnote' => 'We will only use these details to get back to you.',
            ])]);
        }

        if ($type === 'quiz') {
            return $this->page([$this->section('quiz', 'funnel.quiz', [
                'eyebrow' => 'Quick quiz',
                'heading' => $name,
                'description' => 'Answer a few questions and we will point you the right way.',
                'questions' => [
                    [
                        'question' => 'What matters most to you?',
                        'options' => [['label' => 'Speed'], ['label' => 'Price'], ['label' => 'Support']],
                        'correctIndex' => -1,
                    ],
                ],
                'buttonLabel' => 'See my result',
                'resultHeading' => 'Thanks for answering',
                'resultDescription' => 'Here is what we recommend based on your answers.',
            ])]);
        }

        // A step whose job is to take money starts with something that can.
        // The product is left for the customer to choose - the button says so
        // on the canvas, and refuses to sell until one is picked.
        if (in_array($type, ['checkout', 'upsell', 'order_bump'], true)) {
            return $this->page([$this->section('buy', 'commerce.buy', [
                'productId' => $product ? (string) $product->id : '',
                'heading' => $product?->name ?? $name,
                'description' => $type === 'upsell'
                    ? 'Add this to your order before you go.'
                    : 'Confirm your order below.',
                'price' => $product?->price ?? 0,
                'currency' => $product?->currency ?? 'USD',
                'buttonLabel' => $type === 'upsell' ? 'Yes, add it' : 'Pay now',
                'askForEmail' => $type !== 'upsell',
                'footnote' => 'Secure checkout by Stripe.',
            ])]);
        }

        return $this->page([$this->section('step', 'hero.centered', [
            'eyebrow' => Str::headline($type),
            'heading' => $name,
            'description' => 'Customize this funnel step in the visual page editor.',
            'buttonLabel' => 'Continue',
            'buttonUrl' => '#',
            'showTrust' => false,
        ])]);
    }

    /**
     * @return list<array{name: string, slug: string, type: string, content: array<string, mixed>}>
     */
    private function templateSteps(?string $template, string $name, string $type, string $goal, ?Product $product = null): array
    {
        $key = match (true) {
            in_array($template, ['lead_magnet', 'consultation', 'product_launch'], true) => $template,
            $type === 'booking' || $goal === 'book_appointments' => 'consultation',
            $type === 'sales' || $goal === 'sell_product' => 'product_launch',
            default => $template ?: 'lead_magnet',
        };

        return match ($key) {
            'consultation' => [
                ['name' => 'Offer', 'slug' => 'start', 'type' => 'offer_page', 'content' => $this->landingContent($name)],
                ['name' => 'Qualification', 'slug' => 'qualify', 'type' => 'survey', 'content' => $this->stepContent('Tell us about your project', 'survey')],
                ['name' => 'Booking', 'slug' => 'book', 'type' => 'booking', 'content' => $this->stepContent('Pick a time that works', 'booking')],
                ['name' => 'Confirmation', 'slug' => 'thanks', 'type' => 'thank_you', 'content' => $this->stepContent('You are booked', 'thank_you')],
            ],
            'product_launch' => [
                ['name' => 'Landing Page', 'slug' => 'start', 'type' => 'landing_page', 'content' => $this->landingContent($name)],
                ['name' => 'Offer', 'slug' => 'offer', 'type' => 'offer_page', 'content' => $this->stepContent('Your offer', 'offer_page')],
                ['name' => 'Checkout', 'slug' => 'checkout', 'type' => 'checkout', 'content' => $this->stepContent('Checkout', 'checkout', $product)],
                ['name' => 'Upsell', 'slug' => 'upsell', 'type' => 'upsell', 'content' => $this->stepContent('One more upgrade', 'upsell', $product)],
                ['name' => 'Thank You', 'slug' => 'thanks', 'type' => 'thank_you', 'content' => $this->stepContent('You are in', 'thank_you')],
            ],
            default => [
                ['name' => 'Landing Page', 'slug' => 'start', 'type' => 'landing_page', 'content' => $this->landingContent($name)],
                ['name' => 'Lead Form', 'slug' => 'capture', 'type' => 'lead_form', 'content' => $this->stepContent('Leave your details', 'lead_form')],
                ['name' => 'Thank You', 'slug' => 'thanks', 'type' => 'thank_you', 'content' => $this->stepContent('Thanks — we will be in touch', 'thank_you')],
            ],
        };
    }
}
