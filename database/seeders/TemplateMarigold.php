<?php

namespace Database\Seeders;

class TemplateMarigold
{
    public static function theme(): array
    {
        return [
            // `secondary` paints the shared dark tone, which is what makes the
            // hero panel, programs band, closing band and footer deep green.
            'primary' => '#2b6d36', 'secondary' => '#2b6d36', 'accent' => '#ef5e36',
            // Read by the family as --color-highlight: the lime that only ever
            // appears on green.
            'highlight' => '#d5df5d',
            'background' => '#f8f8f6', 'surface' => '#ffffff', 'text' => '#481427', 'muted' => '#6f6468',
            'headingFont' => 'Parkinsans, "Trebuchet MS", sans-serif', 'bodyFont' => 'Onest, system-ui, sans-serif',
            'headingWeight' => 500, 'bodyWeight' => 400, 'buttonRadius' => '100px',
            'cardRadius' => '26px', 'containerWidth' => '1200px', 'sectionSpacing' => '96px',
        ];
    }

    public static function pages(): array
    {
        $s = fn (string $id, string $type, array $props = []) => TemplateContent::section($id, $type.'.marigold', $props);
        $page = fn (string $title, string $slug, bool $home, array $sections) => TemplateContent::sitePage($title, $slug, $home, [], $sections, [], 'footer.marigold', 'navbar.marigold');

        /** Inner-page header: the hero block in its 'page' layout. */
        $head = fn (string $heading, string $description, string $eyebrow) => $s('head', 'hero', [
            'layout' => 'page', 'eyebrow' => $eyebrow, 'heading' => $heading, 'description' => $description,
            'paddingTop' => 96, 'paddingBottom' => 76, 'buttonLabel' => '', 'secondaryLabel' => '',
        ]);

        $closing = fn () => $s('next-step', 'cta');

        return [
            $page('Home', 'home', true, [
                $s('hero', 'hero'),
                $s('quicklinks', 'quicklinks', ['lift' => true]),
                $s('mission', 'about'),
                $s('programs', 'programs'),
                $s('enroll', 'steps'),
                $s('appeals', 'donations'),
                $s('voices', 'testimonials'),
                $s('environment', 'checklist'),
                $s('shop', 'products'),
                $s('team', 'team'),
                $s('faq', 'faq'),
                $s('stories', 'blog', ['buttonLabel' => '', 'buttonUrl' => '']),
                $closing(),
            ]),

            $page('About us', 'about', false, [
                $head('A place built around how children actually grow.', 'We began with one room and twelve families. The principle has not changed since: every child deserves somewhere they are known by name.', 'About us'),
                $s('mission', 'about'),
                $s('environment', 'checklist'),
                $s('team', 'team', ['columns' => '4', 'buttonLabel' => '']),
                $s('voices', 'testimonials'),
                $closing(),
            ]),

            $page('Programs', 'programs', false, [
                $head('Programs shaped around each stage.', 'Rooms and routines that match where a child is now, not where a curriculum says they should be.', 'Programs'),
                $s('programs', 'programs'),
                $s('enroll', 'steps'),
                $s('quicklinks', 'quicklinks', ['paddingTop' => 0, 'paddingBottom' => 96]),
                $s('faq', 'faq'),
                $closing(),
            ]),

            $page('Early years', 'early-years', false, [
                $head('The first thousand days matter most.', 'Our infant and toddler rooms keep ratios small, routines steady and the same familiar faces every day.', 'Early years'),
                $s('mission', 'about', [
                    'eyebrow' => 'How we work', 'heading' => 'Small rooms, steady rhythms, familiar faces.',
                    'items' => [
                        ['title' => 'Key educators', 'text' => 'One educator follows your child through the year, so nobody starts again each term.', 'icon' => 'heart'],
                        ['title' => 'Predictable days', 'text' => 'The same rhythm every day — play, activity, outdoors, meal, rest — so the day feels safe.', 'icon' => 'clock'],
                        ['title' => 'Daily notes', 'text' => 'A short written note each day on what they ate, how they slept and what they enjoyed.', 'icon' => 'book'],
                    ],
                ]),
                $s('environment', 'checklist'),
                $s('enroll', 'steps'),
                $s('stories', 'blog', ['buttonLabel' => '', 'buttonUrl' => '']),
                $closing(),
            ]),

            $page('Donate', 'donate', false, [
                $head('Give a child somewhere to begin.', 'Every appeal below is costed and reported on. You can see exactly what your donation paid for.', 'Donate'),
                $s('appeals', 'donations'),
                $s('enroll', 'steps', [
                    'eyebrow' => 'How giving works', 'heading' => 'Three steps, and you can stop any time.',
                    'buttonLabel' => 'Donate now', 'buttonUrl' => '/donate', 'secondaryLabel' => '',
                    'items' => [
                        ['title' => 'Choose an appeal', 'text' => 'Pick the programme you want to fund, or let us direct it where the need is greatest.'],
                        ['title' => 'Set your amount', 'text' => 'Give once or monthly. Monthly gifts are what let us plan a full school year.'],
                        ['title' => 'See the result', 'text' => 'We report back each quarter with what was bought, built or paid for.'],
                    ],
                ]),
                $s('voices', 'testimonials'),
                $closing(),
            ]),

            $page('Shop', 'shop', false, [
                $head('Toys and books that fund a place.', 'Every purchase supports a child’s enrolment. The margin goes straight into the programmes on this site.', 'Shop'),
                $s('shop', 'products'),
                $s('quicklinks', 'quicklinks', ['paddingTop' => 0, 'paddingBottom' => 96]),
                $s('faq', 'faq', [
                    'eyebrow' => 'Shop help', 'heading' => 'Ordering, delivery and returns.',
                    'items' => [
                        ['question' => 'Where do you deliver?', 'answer' => 'Anywhere in the UK, with a flat fee under £40 and free delivery above it.'],
                        ['question' => 'How long does an order take?', 'answer' => 'Two to four working days. We pack orders on site, so it is people not a warehouse.'],
                        ['question' => 'Can I return something?', 'answer' => 'Within thirty days, unused and in its packaging, for a full refund.'],
                        ['question' => 'How much goes to the charity?', 'answer' => 'The full margin after cost and postage — typically around forty percent of the price.'],
                    ],
                ]),
                $closing(),
            ]),

            $page('Contact', 'contact', false, [
                $head('Come and see it for yourself.', 'Book a visit, ask about a place, or just tell us what you are looking for.', 'Contact'),
                TemplateContent::section('contact', 'form.contact', [
                    'anchorId' => 'contact',
                    'heading' => 'Ask us anything.',
                    'description' => 'We answer every enquiry within two working days.',
                    'buttonLabel' => 'Send enquiry',
                    'details' => [],
                ]),
                $s('faq', 'faq'),
                $s('quicklinks', 'quicklinks', ['paddingTop' => 0, 'paddingBottom' => 96]),
            ]),
        ];
    }
}
