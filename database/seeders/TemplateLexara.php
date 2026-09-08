<?php

namespace Database\Seeders;

class TemplateLexara
{
    public static function theme(): array
    {
        return [
            // `secondary` is what the shared dark tone paints with, so it
            // carries the near-black band the family is built on.
            'primary' => '#0b1120', 'secondary' => '#0b1120', 'accent' => '#ea6a1e',
            'background' => '#ffffff', 'surface' => '#f7f5f2', 'text' => '#0b1120', 'muted' => '#6b7280',
            'headingFont' => 'Source Serif 4, Georgia, serif', 'bodyFont' => 'Inter, system-ui, sans-serif',
            'headingWeight' => 400, 'bodyWeight' => 400, 'buttonRadius' => '999px',
            'cardRadius' => '14px', 'containerWidth' => '1200px', 'sectionSpacing' => '104px',
        ];
    }

    public static function pages(): array
    {
        $s = fn (string $id, string $type, array $props = []) => TemplateContent::section($id, $type.'.lexara', $props);
        $page = fn (string $title, string $slug, bool $home, array $sections) => TemplateContent::sitePage($title, $slug, $home, [], $sections, [], 'footer.lexara', 'navbar.lexara');

        /** The standing page header used by every page except the home page. */
        $head = fn (string $heading, string $accent, string $description, string $eyebrow = '') => $s('head', 'hero', [
            'layout' => 'page', 'eyebrow' => $eyebrow, 'heading' => $heading, 'accentWord' => $accent,
            'description' => $description, 'paddingTop' => 132, 'paddingBottom' => 104,
            'buttonLabel' => '', 'secondaryLabel' => '',
        ]);

        $closing = fn () => $s('next-step', 'cta');

        return [
            $page('Home', 'home', true, [
                $s('hero', 'hero'),
                $s('outcomes', 'stats'),
                $s('clients', 'logos'),
                $s('platform', 'showcase'),
                $s('capabilities', 'features'),
                $s('signal', 'intro'),
                $s('principles', 'pillars'),
                $s('stories', 'testimonials'),
                $s('industries', 'cards'),
                $s('recognition', 'award'),
                $closing(),
            ]),

            $page('Platform', 'platform', false, [
                $head('One system for every stage of the', 'agreement.', 'From the first draft to the renewal notice three years later — with the evidence behind each decision kept alongside it.', 'The platform'),
                $s('platform', 'showcase'),
                $s('capabilities', 'features'),
                $s('impact', 'impact'),
                $s('build', 'pillars', [
                    'eyebrow' => 'Configuration', 'heading' => 'Shaped by the people who own the', 'accentWord' => 'process.',
                    'items' => [
                        ['title' => 'Point and click', 'text' => 'Approval chains, clause libraries and templates are configured in the interface, not in a support queue.'],
                        ['title' => 'Connected by default', 'text' => 'A thousand pre-built connectors put contract data into the systems finance and sales already work in.'],
                        ['title' => 'Evidence retained', 'text' => 'Every automated step records what it saw and why it acted, so an audit is a report rather than a project.'],
                    ],
                ]),
                $s('integrations', 'cards', [
                    'eyebrow' => 'Integrations', 'heading' => 'Works where your team already', 'accentWord' => 'works.', 'columns' => '2',
                    'items' => [
                        ['title' => 'Enterprise systems', 'text' => 'Sync records with your ERP, CRM and data warehouse so contract terms reach the teams acting on them.', 'icon' => 'database', 'url' => ''],
                        ['title' => 'Signature built in', 'text' => 'Send for signature and file the executed copy without leaving the agreement record.', 'icon' => 'pen', 'url' => ''],
                        ['title' => 'Collaboration tools', 'text' => 'Approvals and reminders arrive in email and chat, where the decision actually gets made.', 'icon' => 'message', 'url' => ''],
                        ['title' => 'Reporting', 'text' => 'Push obligations, renewals and spend into the dashboards your leadership already reads.', 'icon' => 'chart', 'url' => ''],
                    ],
                ]),
                $closing(),
            ]),

            $page('Solutions', 'solutions', false, [
                $head('The contracts your sector actually', 'signs.', 'The obligations that matter in manufacturing are not the ones that matter in biotech. Start from a model built for yours.', 'Solutions'),
                $s('industries', 'cards'),
                $s('impact', 'impact'),
                $s('platform', 'showcase', [
                    'eyebrow' => 'In practice', 'heading' => 'The same workflow, tuned to your', 'accentWord' => 'terms.',
                ]),
                $s('outcomes', 'stats', ['paddingTop' => 0, 'paddingBottom' => 0]),
                $s('stories', 'testimonials'),
                $closing(),
            ]),

            $page('Customers', 'customers', false, [
                $head('Teams who stopped chasing signatures and started reading the', 'terms.', 'A selection of the outcomes our customers measured in their first year.', 'Customers'),
                $s('stories', 'testimonials'),
                $s('outcomes', 'stats', ['paddingTop' => 0, 'paddingBottom' => 0]),
                $s('clients', 'logos'),
                $s('recognition', 'award'),
                $s('journeys', 'cards', [
                    'eyebrow' => 'Customer journeys', 'heading' => 'Different starting points, the same', 'accentWord' => 'destination.',
                    'items' => [
                        ['title' => 'A shorter close', 'text' => 'A manufacturer moved supplier terms into one repository and cut a fortnight from every renewal round.', 'icon' => 'clock', 'url' => ''],
                        ['title' => 'A defensible audit', 'text' => 'A regulated lender evidenced every approval decision without assembling the file by hand.', 'icon' => 'shield', 'url' => ''],
                        ['title' => 'A better first draft', 'text' => 'A software business learned which of its own clauses stalled deals, and stopped sending them.', 'icon' => 'pen', 'url' => ''],
                    ],
                ]),
                $closing(),
            ]),

            $page('Resources', 'resources', false, [
                $head('Reading for the people who own the', 'fine print.', 'Field notes, benchmarks and practical guides from teams doing this work now.', 'Resources'),
                $s('library', 'cards', [
                    'eyebrow' => 'Library', 'heading' => 'Start with the questions everyone asks', 'accentWord' => 'first.',
                    'items' => [
                        ['title' => 'The contract review benchmark', 'text' => 'What a healthy first-pass review looks like, and the four measurements worth tracking.', 'icon' => 'chart', 'url' => '/resources'],
                        ['title' => 'Building a clause playbook', 'text' => 'How to write fallback positions your team will actually use under deadline.', 'icon' => 'book', 'url' => '/resources'],
                        ['title' => 'Obligations after signature', 'text' => 'The commitments that quietly expire, and how to give each one an owner.', 'icon' => 'check', 'url' => '/resources'],
                        ['title' => 'A migration that finishes', 'text' => 'Moving a legacy repository without stalling live negotiations.', 'icon' => 'database', 'url' => '/resources'],
                        ['title' => 'Reading an AI output', 'text' => 'How to judge an automated risk flag, and when to escalate to a person.', 'icon' => 'cpu', 'url' => '/resources'],
                        ['title' => 'The renewal calendar', 'text' => 'Turning renewal dates into a revenue conversation instead of an administrative one.', 'icon' => 'calendar', 'url' => '/resources'],
                    ],
                ]),
                $s('recognition', 'award'),
                $s('signal', 'intro', [
                    'eyebrow' => 'Newsletter', 'heading' => 'A short note when we publish something', 'accentWord' => 'useful.',
                    'description' => 'No product announcements. Practical writing for contract teams, roughly once a month.',
                    'buttonLabel' => 'Get in touch', 'buttonUrl' => '/company#contact', 'secondaryLabel' => '',
                ]),
                $closing(),
            ]),

            $page('Company', 'company', false, [
                $head('Contract expertise, with a builder\'s', 'instinct.', 'We think better tools should give people more room to exercise judgement, not less.', 'Company'),
                $s('story', 'intro', [
                    'eyebrow' => 'Why we build', 'heading' => 'The best systems start by', 'accentWord' => 'listening.',
                    'description' => 'We work alongside legal and procurement teams to understand how the work really happens before we change any of it.',
                    'buttonLabel' => 'See the platform', 'buttonUrl' => '/platform', 'secondaryLabel' => '',
                ]),
                $s('principles', 'pillars'),
                $s('impact', 'impact'),
                TemplateContent::section('contact', 'form.contact', [
                    'anchorId' => 'contact',
                    'heading' => 'Tell us what you are working on.',
                    'description' => 'A short conversation is usually enough to tell whether this is a fit.',
                    'buttonLabel' => 'Send enquiry',
                    'details' => [],
                ]),
            ]),
        ];
    }
}
