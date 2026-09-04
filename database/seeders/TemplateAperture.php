<?php

namespace Database\Seeders;

/**
 * Aperture — a creative-agency / design-studio template.
 *
 * Eight pages (Home, About, Services, Work, Team, Pricing, Journal, Contact)
 * built from the `*.aperture` block family: a white sheet broken by ink-black
 * service and ticker bands and faint cool-grey process bands, one warm coral
 * accent carrying kickers, numbering and every hover, large geometric headlines
 * set tight, and heavily rounded photography.
 */
class TemplateAperture
{
    private const INK = '#141414';

    private const CORAL = '#ff5a2b';

    /** @return array<string, mixed> */
    public static function theme(): array
    {
        return [
            'primary' => self::INK,
            'secondary' => '#494852',
            'accent' => self::CORAL,
            'background' => '#ffffff',
            'surface' => '#f6f6f9',
            'text' => self::INK,
            'muted' => '#8a8a96',
            'headingFont' => 'Plus Jakarta Sans, system-ui, sans-serif',
            'bodyFont' => 'Plus Jakarta Sans, system-ui, sans-serif',
            'serifFont' => 'Georgia, serif',
            'monoFont' => 'JetBrains Mono, ui-monospace, monospace',
            'headingWeight' => 700,
            'bodyWeight' => 400,
            'buttonRadius' => '999px',
            'cardRadius' => '20px',
            'containerWidth' => '1280px',
            'sectionSpacing' => '92px',
        ];
    }

    /** @return array<string, mixed> */
    private static function motion(int $delay = 0, string $trigger = 'scroll'): array
    {
        return [
            'animation' => 'fade-up',
            'animationTrigger' => $trigger,
            'animationDuration' => 620,
            'animationDelay' => $delay,
        ];
    }

    /** @return array<string, mixed> */
    private static function nav(): array
    {
        return array_merge([
            'logo' => 'Aperture',
            'logoImage' => '',
            'logoUrl' => '/',
            'links' => [
                ['label' => 'Home', 'url' => '/'],
                ['label' => 'About', 'url' => '/about'],
                ['label' => 'Studio', 'url' => '/about', 'children' => [
                    ['label' => 'Our people', 'url' => '/team'],
                    ['label' => 'How we work', 'url' => '/about'],
                    ['label' => 'Pricing', 'url' => '/pricing'],
                ]],
                ['label' => 'Services', 'url' => '/services'],
                ['label' => 'Work', 'url' => '/work'],
                ['label' => 'More', 'url' => '/journal', 'children' => [
                    ['label' => 'Journal', 'url' => '/journal'],
                    ['label' => 'Contact', 'url' => '/contact'],
                ]],
            ],
            'phoneLabel' => 'Call any time',
            'phone' => '+1 (555) 240 8890',
            'buttonLabel' => 'Start a project',
            'buttonUrl' => '/contact',
            'sticky' => true,
        ], ['animation' => 'fade-down', 'animationTrigger' => 'load']);
    }

    /** @return array<string, mixed> */
    private static function footer(): array
    {
        return array_merge([
            'logo' => 'Aperture',
            'logoImage' => '',
            'logoUrl' => '/',
            'newsletterHeading' => 'Studio notes, once a month. Nothing else.',
            'newsletterLabel' => 'Subscribe',
            'formId' => '',
            'columns' => [
                [
                    'title' => 'Studio',
                    'links' => [
                        ['label' => 'About', 'url' => '/about'],
                        ['label' => 'Our people', 'url' => '/team'],
                        ['label' => 'Journal', 'url' => '/journal'],
                        ['label' => 'Contact', 'url' => '/contact'],
                    ],
                ],
                [
                    'title' => 'Services',
                    'links' => [
                        ['label' => 'Brand identity', 'url' => '/services'],
                        ['label' => 'Web design', 'url' => '/services'],
                        ['label' => 'Development', 'url' => '/services'],
                        ['label' => 'Product design', 'url' => '/services'],
                    ],
                ],
                [
                    'title' => 'Work',
                    'links' => [
                        ['label' => 'Selected projects', 'url' => '/work'],
                        ['label' => 'Pricing', 'url' => '/pricing'],
                        ['label' => 'Start a project', 'url' => '/contact'],
                    ],
                ],
            ],
            'contactHeading' => 'Get in touch',
            'details' => [
                ['icon' => 'phone', 'value' => '+1 (555) 240 8890'],
                ['icon' => 'mail', 'value' => 'studio@aperture.example'],
                ['icon' => 'map-pin', 'value' => '18 Wexford Lane, Portland, OR 97209'],
            ],
            'social' => [
                ['icon' => 'twitter', 'url' => '#'],
                ['icon' => 'instagram', 'url' => '#'],
                ['icon' => 'linkedin', 'url' => '#'],
            ],
            'copyright' => '© '.date('Y').' Aperture Studio',
        ], self::motion(40));
    }

    /** @return list<array<string, mixed>> */
    private static function partners(): array
    {
        return [
            ['label' => 'Halden'],
            ['label' => 'Ovalfoot'],
            ['label' => 'Persimmon'],
            ['label' => 'Brightmoor'],
            ['label' => 'Turnstile'],
            ['label' => 'Kelp & Co'],
            ['label' => 'Vireo'],
            ['label' => 'Marlowe'],
        ];
    }

    /** @return array<string, mixed> */
    private static function ticker(): array
    {
        return [
            'items' => [
                ['label' => 'Brand identity'],
                ['label' => 'Web design'],
                ['label' => 'Product design'],
                ['label' => 'Art direction'],
                ['label' => 'Development'],
                ['label' => 'Motion'],
            ],
            'speed' => 26,
            'tone' => 'ink',
            'animation' => 'none',
        ];
    }

    /** @return array<string, mixed> */
    private static function cta(): array
    {
        return array_merge(self::motion(40), [
            'eyebrow' => '',
            'heading' => 'Have a project in mind? Tell us about it.',
            'description' => 'One call, no deck, no obligation — we will tell you honestly whether we are the right studio for it.',
            'buttonLabel' => 'Let us talk',
            'buttonUrl' => '/contact',
            'secondaryLabel' => 'See our work',
            'secondaryUrl' => '/work',
            'tone' => 'ink',
        ]);
    }

    /** @return list<array<string, mixed>> */
    private static function projects(): array
    {
        return [
            [
                'title' => 'Wayfinding for a city transit network',
                'text' => 'A signage and app system that cut wrong-platform boardings by a third in the first quarter.',
                'category' => 'Product design',
                'meta' => 'March 2026',
                'image' => TemplateContent::photo('1497366216548-37526070297c', 900),
                'url' => '/work',
            ],
            [
                'title' => 'A storefront rebuilt around one checkout',
                'text' => 'Collapsing four purchase paths into one lifted completed orders well past the target.',
                'category' => 'Development',
                'meta' => 'January 2026',
                'image' => TemplateContent::photo('1556742049-0cfed4f6a45d', 900),
                'url' => '/work',
            ],
            [
                'title' => 'Identity for an independent record label',
                'text' => 'A mark and sleeve system flexible enough for forty releases a year and still recognisable.',
                'category' => 'Brand identity',
                'meta' => 'November 2025',
                'image' => TemplateContent::photo('1526628953301-3e589a6a8b74', 900),
                'url' => '/work',
            ],
            [
                'title' => 'A learning portal children actually finish',
                'text' => 'Progress mechanics and plain language pushed course completion from a third to most of the cohort.',
                'category' => 'Web design',
                'meta' => 'September 2025',
                'image' => TemplateContent::photo('1531482615713-2afd69097998', 900),
                'url' => '/work',
            ],
        ];
    }

    /** @return list<array<string, mixed>> */
    private static function services(): array
    {
        return [
            [
                'title' => 'Brand identity',
                'text' => 'Naming, marks, palettes and the guidelines that keep it all intact once we hand it over.',
                'icon' => 'sparkles',
                'url' => '/services',
            ],
            [
                'title' => 'Web design',
                'text' => 'Layout, typography and motion built around what a visitor is actually trying to do.',
                'icon' => 'layout',
                'url' => '/services',
            ],
            [
                'title' => 'Development',
                'text' => 'Fast, accessible front-ends and the CMS work that lets your team publish without us.',
                'icon' => 'code',
                'url' => '/services',
            ],
            [
                'title' => 'Product design',
                'text' => 'Research, flows and interface systems for teams shipping software rather than pages.',
                'icon' => 'grid',
                'url' => '/services',
            ],
        ];
    }

    /** @return list<array<string, mixed>> */
    private static function quotes(): array
    {
        return [
            [
                'text' => 'They pushed back on half our brief, and they were right about most of it. The launch did what the old site never managed.',
                'name' => 'Rosa Feld',
                'role' => 'Marketing lead, Halden',
                'image' => TemplateContent::photo('1494790108377-be9c29b29330', 200),
            ],
            [
                'text' => 'We arrived with a vague idea and left with a plan we could actually budget. Nothing was ever a surprise.',
                'name' => 'Ingrid Mwangi',
                'role' => 'CTO, Ovalfoot',
                'image' => TemplateContent::photo('1438761681033-6461ffad8d80', 200),
            ],
            [
                'text' => 'The attention to detail is the part I keep noticing months later. Small things nobody would have missed, done properly anyway.',
                'name' => 'Tobias Renn',
                'role' => 'Founder, Persimmon',
                'image' => TemplateContent::photo('1500648767791-00dcc994a43e', 200),
            ],
            [
                'text' => 'Responsive, direct, and happy to say when something was a bad idea. Rarer than it should be.',
                'name' => 'Amara Lindqvist',
                'role' => 'Ops director, Brightmoor',
                'image' => TemplateContent::photo('1544005313-94ddf0286df2', 200),
            ],
        ];
    }

    /** @return list<array<string, mixed>> */
    private static function people(): array
    {
        return [
            [
                'name' => 'Rosa Feld',
                'role' => 'Founder, strategy',
                'bio' => 'Runs the first workshop and the last review, and very little in between.',
                'image' => TemplateContent::photo('1494790108377-be9c29b29330', 600),
            ],
            [
                'name' => 'Ingrid Mwangi',
                'role' => 'Design director',
                'bio' => 'Type, grid, and the argument for restraint when everyone wants more.',
                'image' => TemplateContent::photo('1438761681033-6461ffad8d80', 600),
            ],
            [
                'name' => 'Tobias Renn',
                'role' => 'Engineering lead',
                'bio' => 'Builds the thing, then keeps it fast for the two years afterwards.',
                'image' => TemplateContent::photo('1500648767791-00dcc994a43e', 600),
            ],
            [
                'name' => 'Amara Lindqvist',
                'role' => 'Client partner',
                'bio' => 'Scope, schedule, and the honest status update nobody enjoys writing.',
                'image' => TemplateContent::photo('1544005313-94ddf0286df2', 600),
            ],
        ];
    }

    /** @return list<array<string, mixed>> */
    public static function pages(): array
    {
        return [
            self::home(),
            self::about(),
            self::servicesPage(),
            self::work(),
            self::team(),
            self::pricing(),
            self::journal(),
            self::contact(),
        ];
    }

    /** @return array<string, mixed> */
    private static function home(): array
    {
        return TemplateContent::sitePage('Home', 'home', true, self::nav(), [
            TemplateContent::section('hero', 'hero.aperture', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'Creative ideas that inspire growth',
                'heading' => 'A studio for brands with something to prove',
                'description' => 'We build identities, sites and campaigns for teams who would rather be remembered than merely noticed — strategy first, craft all the way through.',
                'buttonLabel' => 'Start a project',
                'buttonUrl' => '/contact',
                'secondaryLabel' => 'See our work',
                'secondaryUrl' => '/work',
                'image' => TemplateContent::photo('1573496359142-b8d87734a5a2', 1100),
                'badge' => 'Trusted by 240+ teams',
            ])),
            TemplateContent::section('partners', 'logos.aperture', array_merge(self::motion(0), [
                'heading' => 'Trusted partners worldwide',
                'items' => self::partners(),
                'scroll' => true,
                'speed' => 32,
            ])),
            TemplateContent::section('about', 'about.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'About us',
                'heading' => 'Who we are, and how we got here',
                'description' => 'A team of strategists, designers and engineers who would rather ship one considered thing than five forgettable ones.',
                'stats' => [
                    ['value' => '12', 'suffix' => '+', 'label' => 'Years shipping work we still stand behind'],
                    ['value' => '240', 'suffix' => '+', 'label' => 'Brands launched, rebuilt or rescued'],
                    ['value' => '18', 'suffix' => '', 'label' => 'Industry awards, none of them self-nominated'],
                    ['value' => '96', 'suffix' => '%', 'label' => 'Of clients come back for a second project'],
                ],
                'buttonLabel' => 'More about us',
                'buttonUrl' => '/about',
                'phoneLabel' => 'Get a free quote',
                'phone' => '+1 (555) 240 8890',
            ])),
            TemplateContent::section('services', 'services.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Services',
                'heading' => 'Your needs, our expertise',
                'description' => 'Bring us a brief, a half-formed idea, or a business that has outgrown its brand. We take it from there.',
                'items' => self::services(),
                'buttonLabel' => 'All services',
                'buttonUrl' => '/services',
            ])),
            TemplateContent::section('work', 'portfolio.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Portfolio',
                'heading' => 'Selected work',
                'description' => '',
                'columns' => 2,
                'items' => self::projects(),
                'buttonLabel' => 'View all work',
                'buttonUrl' => '/work',
            ])),
            TemplateContent::section('process', 'process.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Working process',
                'heading' => 'Three steps, no mystery',
                'description' => '',
                'items' => [
                    ['title' => 'Discovery and strategy', 'text' => 'We learn the business, the audience, and the constraint nobody mentioned in the brief.'],
                    ['title' => 'Design and build', 'text' => 'Concepts, then a working thing you can click — reviewed in the open rather than revealed at the end.'],
                    ['title' => 'Launch and iterate', 'text' => 'We ship, watch how it performs, and keep tuning the parts that are underperforming.'],
                ],
                'buttonLabel' => 'Start a project',
                'buttonUrl' => '/contact',
            ])),
            TemplateContent::section('ticker', 'ticker.aperture', self::ticker()),
            TemplateContent::section('quotes', 'testimonials.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Testimonials',
                'heading' => 'What clients say once the work is live',
                'description' => '',
                'items' => self::quotes(),
                'columns' => 2,
            ])),
            TemplateContent::section('cta', 'cta.aperture', self::cta()),
            TemplateContent::section('journal', 'blog.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Journal',
                'heading' => 'Notes from the studio',
                'description' => '',
                'columns' => 3,
                'items' => self::articles(),
                'buttonLabel' => 'Browse the journal',
                'buttonUrl' => '/journal',
            ])),
        ], self::footer(), 'footer.aperture', 'navbar.aperture');
    }

    /** @return list<array<string, mixed>> */
    private static function articles(): array
    {
        return [
            [
                'title' => 'The brief is never the problem',
                'text' => 'What clients ask for and what they need are usually two questions apart. Here is how we find the second one.',
                'category' => 'Strategy',
                'meta' => '12 August 2026',
                'image' => TemplateContent::photo('1553877522-43269d4ea984', 900),
                'url' => '/journal',
            ],
            [
                'title' => 'Why we stopped designing in isolation',
                'text' => 'Static comps hide the decisions that matter. Moving to a working prototype earlier changed our whole review process.',
                'category' => 'Process',
                'meta' => '30 July 2026',
                'image' => TemplateContent::photo('1522071820081-009f0129c71c', 900),
                'url' => '/journal',
            ],
            [
                'title' => 'A type scale you can actually maintain',
                'text' => 'Six sizes, two weights, one ratio. What we use on every project, and why it survives a handover.',
                'category' => 'Craft',
                'meta' => '14 July 2026',
                'image' => TemplateContent::photo('1517180102446-f3ece451e9d8', 900),
                'url' => '/journal',
            ],
        ];
    }

    /** @return array<string, mixed> */
    private static function about(): array
    {
        return TemplateContent::sitePage('About', 'about', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.aperture', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'About us',
                'heading' => 'A studio built on saying the difficult thing early',
                'description' => 'Twelve years, four disciplines, and a strong preference for work that still holds up two years after launch.',
                'surface' => 'tint',
            ])),
            TemplateContent::section('intro', 'about.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Who we are',
                'heading' => 'Small on purpose, senior throughout',
                'description' => 'Every project is run by the people who pitched it. There is no junior team waiting behind the introductions, and no account layer between you and the work.',
                'stats' => [
                    ['value' => '12', 'suffix' => '+', 'label' => 'Years in practice'],
                    ['value' => '240', 'suffix' => '+', 'label' => 'Projects delivered'],
                    ['value' => '18', 'suffix' => '', 'label' => 'Awards won'],
                    ['value' => '96', 'suffix' => '%', 'label' => 'Client return rate'],
                ],
                'buttonLabel' => 'Meet the team',
                'buttonUrl' => '/team',
                'phoneLabel' => 'Get a free quote',
                'phone' => '+1 (555) 240 8890',
            ])),
            TemplateContent::section('process', 'process.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'How we work',
                'heading' => 'Three steps, no mystery',
                'description' => '',
                'items' => [
                    ['title' => 'Discovery and strategy', 'text' => 'Two weeks of interviews, audits and argument, ending in a written position you can disagree with.'],
                    ['title' => 'Design and build', 'text' => 'Weekly reviews on real screens. Nothing is saved up for a grand reveal at the end.'],
                    ['title' => 'Launch and iterate', 'text' => 'Thirty days of support included, then whatever comes next — usually more.'],
                ],
                'buttonLabel' => 'Start a project',
                'buttonUrl' => '/contact',
            ])),
            TemplateContent::section('ticker', 'ticker.aperture', self::ticker()),
            TemplateContent::section('team', 'team.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'The studio',
                'heading' => 'The people who do the work',
                'description' => '',
                'columns' => 4,
                'items' => self::people(),
            ])),
            TemplateContent::section('quotes', 'testimonials.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Testimonials',
                'heading' => 'What clients say once the work is live',
                'description' => '',
                'items' => self::quotes(),
                'columns' => 2,
            ])),
            TemplateContent::section('cta', 'cta.aperture', self::cta()),
        ], self::footer(), 'footer.aperture', 'navbar.aperture');
    }

    /** @return array<string, mixed> */
    private static function servicesPage(): array
    {
        return TemplateContent::sitePage('Services', 'services', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.aperture', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'Services',
                'heading' => 'Four disciplines, one team',
                'description' => 'Most projects use more than one of these. None of them are handed to a different agency halfway through.',
                'surface' => 'tint',
            ])),
            TemplateContent::section('services', 'services.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'What we do',
                'heading' => 'Your needs, our expertise',
                'description' => 'Bring us a brief, a half-formed idea, or a business that has outgrown its brand.',
                'items' => self::services(),
                'buttonLabel' => '',
                'buttonUrl' => '',
            ])),
            TemplateContent::section('stats', 'stats.aperture', array_merge(self::motion(0), [
                'heading' => '',
                'items' => [
                    ['value' => '12', 'suffix' => '+', 'label' => 'Years in practice'],
                    ['value' => '240', 'suffix' => '+', 'label' => 'Projects delivered'],
                    ['value' => '18', 'suffix' => '', 'label' => 'Awards won'],
                    ['value' => '96', 'suffix' => '%', 'label' => 'Client return rate'],
                ],
                'tone' => 'tint',
            ])),
            TemplateContent::section('process', 'process.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Working process',
                'heading' => 'Three steps, no mystery',
                'description' => '',
                'items' => [
                    ['title' => 'Discovery and strategy', 'text' => 'We learn the business, the audience, and the constraint nobody mentioned in the brief.'],
                    ['title' => 'Design and build', 'text' => 'Concepts, then a working thing you can click, reviewed in the open.'],
                    ['title' => 'Launch and iterate', 'text' => 'We ship, watch how it performs, and keep tuning what underperforms.'],
                ],
                'buttonLabel' => 'Start a project',
                'buttonUrl' => '/contact',
            ])),
            TemplateContent::section('faq', 'faq.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Questions',
                'heading' => 'Before you get in touch',
                'description' => '',
                'items' => [
                    ['question' => 'How long does a typical project take?', 'answer' => 'Most full engagements run eight to twelve weeks. Shorter sprints are two. We tell you which one your brief is on the first call.'],
                    ['question' => 'Do you work with in-house teams?', 'answer' => 'Often. We can lead the work, or sit alongside your designers and engineers and hand over cleanly at the end.'],
                    ['question' => 'What do you need from us to start?', 'answer' => 'A decision-maker who can attend reviews, whatever brand material already exists, and access to the people who talk to your customers.'],
                    ['question' => 'What happens after launch?', 'answer' => 'Thirty days of support is included on every project. After that most clients move to a partner retainer or come back for the next sprint.'],
                ],
            ])),
            TemplateContent::section('cta', 'cta.aperture', self::cta()),
        ], self::footer(), 'footer.aperture', 'navbar.aperture');
    }

    /** @return array<string, mixed> */
    private static function work(): array
    {
        return TemplateContent::sitePage('Work', 'work', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.aperture', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'Portfolio',
                'heading' => 'Work we are happy to be judged on',
                'description' => 'A selection rather than an archive. Ask us about the ones that are not here.',
                'surface' => 'ink',
            ])),
            TemplateContent::section('grid', 'portfolio.aperture', array_merge(self::motion(0), [
                'eyebrow' => '',
                'heading' => 'Selected projects',
                'description' => '',
                'columns' => 2,
                'items' => self::projects(),
                'buttonLabel' => '',
                'buttonUrl' => '',
            ])),
            TemplateContent::section('ticker', 'ticker.aperture', self::ticker()),
            TemplateContent::section('partners', 'logos.aperture', array_merge(self::motion(0), [
                'heading' => 'Trusted partners worldwide',
                'items' => self::partners(),
                'scroll' => true,
                'speed' => 32,
            ])),
            TemplateContent::section('quotes', 'testimonials.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Testimonials',
                'heading' => 'What clients say once the work is live',
                'description' => '',
                'items' => self::quotes(),
                'columns' => 2,
            ])),
            TemplateContent::section('cta', 'cta.aperture', self::cta()),
        ], self::footer(), 'footer.aperture', 'navbar.aperture');
    }

    /** @return array<string, mixed> */
    private static function team(): array
    {
        return TemplateContent::sitePage('Team', 'team', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.aperture', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'The studio',
                'heading' => 'The people who do the work',
                'description' => 'Four seniors and a rotating bench of specialists we have worked with for years.',
                'surface' => 'tint',
            ])),
            TemplateContent::section('team', 'team.aperture', array_merge(self::motion(0), [
                'eyebrow' => '',
                'heading' => 'Permanent studio',
                'description' => '',
                'columns' => 4,
                'items' => self::people(),
            ])),
            TemplateContent::section('stats', 'stats.aperture', array_merge(self::motion(0), [
                'heading' => '',
                'items' => [
                    ['value' => '12', 'suffix' => '+', 'label' => 'Years in practice'],
                    ['value' => '4', 'suffix' => '', 'label' => 'Permanent seniors'],
                    ['value' => '18', 'suffix' => '', 'label' => 'Awards won'],
                    ['value' => '96', 'suffix' => '%', 'label' => 'Client return rate'],
                ],
                'tone' => 'ink',
            ])),
            TemplateContent::section('quotes', 'testimonials.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Testimonials',
                'heading' => 'What it is like to work with us',
                'description' => '',
                'items' => self::quotes(),
                'columns' => 2,
            ])),
            TemplateContent::section('cta', 'cta.aperture', self::cta()),
        ], self::footer(), 'footer.aperture', 'navbar.aperture');
    }

    /** @return array<string, mixed> */
    private static function pricing(): array
    {
        return TemplateContent::sitePage('Pricing', 'pricing', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.aperture', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'Pricing',
                'heading' => 'Ways to work with us',
                'description' => 'Fixed scopes for defined problems, retainers for the ones that keep moving.',
                'surface' => 'tint',
            ])),
            TemplateContent::section('plans', 'pricing.aperture', array_merge(self::motion(0), [
                'eyebrow' => '',
                'heading' => 'Three ways in',
                'description' => 'Every engagement starts with the same call. What changes is how much of it we take on.',
                'items' => [
                    [
                        'name' => 'Sprint',
                        'price' => '$6,000',
                        'period' => 'per two weeks',
                        'text' => 'A short, defined piece of work: a landing page, a rebrand of one surface, an audit with a plan attached.',
                        'features' => "One workstream at a time\nWeekly review calls\nSource files handed over\nTwo rounds of revisions",
                        'buttonLabel' => 'Book a sprint',
                        'buttonUrl' => '/contact',
                        'featured' => false,
                    ],
                    [
                        'name' => 'Project',
                        'price' => '$28,000',
                        'period' => 'typical engagement',
                        'text' => 'The usual shape: discovery, design and build of a full site or identity, start to launch.',
                        'features' => "Strategy and discovery phase\nFull design system\nBuild and CMS setup\nLaunch support for 30 days",
                        'buttonLabel' => 'Scope a project',
                        'buttonUrl' => '/contact',
                        'featured' => true,
                    ],
                    [
                        'name' => 'Partner',
                        'price' => 'From $9,000',
                        'period' => 'per month',
                        'text' => 'An ongoing team for companies shipping continuously rather than once a year.',
                        'features' => "Dedicated designer and engineer\nShared roadmap and backlog\nSame-day response window\nQuarterly strategy review",
                        'buttonLabel' => 'Talk to us',
                        'buttonUrl' => '/contact',
                        'featured' => false,
                    ],
                ],
            ])),
            TemplateContent::section('faq', 'faq.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Questions',
                'heading' => 'What the numbers do and do not cover',
                'description' => '',
                'items' => [
                    ['question' => 'Are these fixed prices?', 'answer' => 'Sprints are. Projects are a typical figure — we quote properly once we understand the scope, and the quote does not move afterwards unless you change the brief.'],
                    ['question' => 'What is not included?', 'answer' => 'Photography, licensed fonts, stock and third-party subscriptions are billed at cost. We tell you the number before anything is bought.'],
                    ['question' => 'How does payment work?', 'answer' => 'Half on signature, half on launch, for projects. Retainers are billed monthly in advance with thirty days notice either way.'],
                    ['question' => 'Do you take equity instead of fees?', 'answer' => 'Occasionally, and only alongside a reduced fee rather than in place of one. Ask on the first call.'],
                ],
            ])),
            TemplateContent::section('cta', 'cta.aperture', self::cta()),
        ], self::footer(), 'footer.aperture', 'navbar.aperture');
    }

    /** @return array<string, mixed> */
    private static function journal(): array
    {
        return TemplateContent::sitePage('Journal', 'journal', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.aperture', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'Journal',
                'heading' => 'Notes from the studio',
                'description' => 'Occasional writing about the craft, the process, and the arguments we keep having.',
                'surface' => 'tint',
            ])),
            TemplateContent::section('posts', 'blog.aperture', array_merge(self::motion(0), [
                'eyebrow' => '',
                'heading' => 'Recent writing',
                'description' => '',
                'columns' => 3,
                'items' => self::articles(),
                'buttonLabel' => '',
                'buttonUrl' => '',
            ])),
            TemplateContent::section('note', 'richtext.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Colophon',
                'heading' => 'How this journal is put together',
                'body' => '<p>We publish when there is something worth saying, which works out at roughly once a month. Everything here is written by the person who did the work rather than by a marketing team reading over their shoulder.</p><p>If you want the short version in your inbox, the newsletter at the bottom of this page carries one link and no tracking pixels.</p>',
            ])),
            TemplateContent::section('cta', 'cta.aperture', self::cta()),
        ], self::footer(), 'footer.aperture', 'navbar.aperture');
    }

    /** @return array<string, mixed> */
    private static function contact(): array
    {
        return TemplateContent::sitePage('Contact', 'contact', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.aperture', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'Contact',
                'heading' => 'Tell us what you are working on',
                'description' => 'We reply to every enquiry within one working day, including the ones we turn down.',
                'surface' => 'tint',
            ])),
            TemplateContent::section('form', 'contact.aperture', array_merge(self::motion(0), [
                'eyebrow' => '',
                'heading' => 'Start a conversation',
                'description' => 'The more you can share up front — budget range, deadline, what has already been tried — the more useful our first reply will be.',
                'details' => [
                    ['icon' => 'phone', 'label' => 'Phone', 'value' => '+1 (555) 240 8890'],
                    ['icon' => 'mail', 'label' => 'Email', 'value' => 'studio@aperture.example'],
                    ['icon' => 'map-pin', 'label' => 'Studio', 'value' => '18 Wexford Lane, Portland, OR 97209'],
                ],
                'formId' => '',
                'buttonLabel' => 'Send enquiry',
                'fineprint' => 'We reply to every enquiry within one working day.',
            ])),
            TemplateContent::section('faq', 'faq.aperture', array_merge(self::motion(0), [
                'eyebrow' => 'Questions',
                'heading' => 'Before you get in touch',
                'description' => '',
                'items' => [
                    ['question' => 'What is the smallest project you take?', 'answer' => 'A two-week sprint. Below that we will usually point you at someone better suited rather than take the work.'],
                    ['question' => 'Do you work remotely?', 'answer' => 'Yes, with most clients. We travel for kickoffs and the big reviews when it is worth it.'],
                    ['question' => 'How soon can you start?', 'answer' => 'Usually four to six weeks out. Tell us your deadline on the first call and we will be straight about whether it is possible.'],
                ],
            ])),
            TemplateContent::section('cta', 'cta.aperture', array_merge(self::cta(), ['tone' => 'accent'])),
        ], self::footer(), 'footer.aperture', 'navbar.aperture');
    }
}
