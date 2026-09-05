<?php

namespace Database\Seeders;

/**
 * Kirki — a revenue-consulting / growth-agency template.
 *
 * Four pages (Home, About, Insights, Case studies) built from the `*.kirki`
 * block family: an off-white sheet, tight 600-weight Inter headlines, one
 * lime-yellow accent carrying every button and the footer's contact band, a
 * white star-rating pill opening every hero, and heavily rounded 16-20px
 * cards and photography with a stat or client name proving nearly every claim.
 */
class TemplateKirki
{
    private const INK = '#0a0a0a';

    private const LIME = '#e8f019';

    /** @return array<string, mixed> */
    public static function theme(): array
    {
        return [
            'primary' => self::INK,
            'secondary' => '#4b4b4b',
            'accent' => self::LIME,
            'background' => '#ffffff',
            'surface' => '#f3f3f1',
            'text' => self::INK,
            'muted' => '#8a8a8a',
            'headingFont' => 'Inter, system-ui, sans-serif',
            'bodyFont' => 'Inter, system-ui, sans-serif',
            'serifFont' => 'Georgia, serif',
            'monoFont' => 'JetBrains Mono, ui-monospace, monospace',
            'headingWeight' => 600,
            'bodyWeight' => 400,
            'buttonRadius' => '12px',
            'cardRadius' => '20px',
            'containerWidth' => '1200px',
            'sectionSpacing' => '88px',
        ];
    }

    /** @return array<string, mixed> */
    private static function motion(int $delay = 0, string $trigger = 'scroll'): array
    {
        return [
            'animation' => 'fade-up',
            'animationTrigger' => $trigger,
            'animationDuration' => 600,
            'animationDelay' => $delay,
        ];
    }

    /** @return array<string, mixed> */
    private static function nav(): array
    {
        return array_merge([
            'logoText' => 'Kirki',
            'logoImage' => '',
            'links' => [
                ['label' => 'Home', 'url' => '/'],
                ['label' => 'About', 'url' => '/about'],
                ['label' => 'Insights', 'url' => '/insights'],
                ['label' => 'Case studies', 'url' => '/case-studies'],
            ],
            'buttonLabel' => 'Get a Proposal',
            'buttonUrl' => '/contact',
            'sticky' => true,
        ], ['animation' => 'fade-down', 'animationTrigger' => 'load']);
    }

    /** @return array<string, mixed> */
    private static function footer(): array
    {
        return [
            'logoText' => 'Kirki',
            'columns' => [
                [
                    'title' => 'Services',
                    'links' => [
                        ['label' => 'Biz strategy & growth', 'url' => '#'],
                        ['label' => 'Financial Consulting', 'url' => '#'],
                        ['label' => 'Operational Excellence', 'url' => '#'],
                    ],
                ],
                [
                    'title' => 'Pages',
                    'links' => [
                        ['label' => 'Home', 'url' => '/'],
                        ['label' => 'About', 'url' => '/about'],
                        ['label' => 'Contact', 'url' => '/contact'],
                        ['label' => 'Blogs', 'url' => '/insights'],
                    ],
                ],
                [
                    'title' => 'Pages',
                    'links' => [
                        ['label' => 'FAQs', 'url' => '#'],
                    ],
                ],
            ],
            'phone' => '1222-5453-5432',
            'email' => 'contact@example.com',
            'offices' => [
                ['city' => 'Vancouver', 'address' => '750 W Pender St, Suite 1750, Vancouver, British Columbia V6C 1G8'],
                ['city' => 'London', 'address' => '750 W Pender St, Suite 1750, Vancouver, British Columbia V6C 1G8'],
            ],
            'socials' => [
                ['label' => 'Facebook', 'url' => '#'],
                ['label' => 'Instagram', 'url' => '#'],
                ['label' => 'X.com', 'url' => '#'],
                ['label' => 'Linkedin', 'url' => '#'],
            ],
            'copyright' => '© 2026 Kirki Business. All Rights Reserved.',
        ];
    }

    /** @return list<array<string, mixed>> */
    private static function caseStudies(): array
    {
        return [
            [
                'title' => 'We turn complex ideas into simple',
                'client' => 'Ryan Cooper',
                'text' => 'We turn complex ideas into simple, compelling stories. Working with this team has been a great experience. They understand requirements quickly.',
                'image' => TemplateContent::photo('1494790108377-be9c29b29330', 900),
                'stats' => [
                    ['value' => '300%+', 'label' => 'Average Project ROI'],
                    ['value' => '11,000', 'label' => 'Install of their new mobile app.'],
                ],
            ],
            [
                'title' => 'Turning bold ideas into market-ready products',
                'client' => 'Ryan Cooper',
                'text' => 'They refined our early concept into a launch-ready digital product. The process was efficient, collaborative, and goal-focused. Their team aligned design, tech and business seamlessly.',
                'image' => TemplateContent::photo('1556228720-195a672e8a03', 900),
                'stats' => [
                    ['value' => '275%+', 'label' => 'Average Project ROI'],
                    ['value' => '9,500', 'label' => 'Install of their new mobile app.'],
                ],
            ],
            [
                'title' => 'Simplifying operations for rapid scale',
                'client' => 'Ryan Cooper',
                'text' => 'Complex internal processes were streamlined into scalable workflows. The team brought clarity, structure, and consistent improvement. They identified bottlenecks early and resolved them effectively.',
                'image' => TemplateContent::photo('1520523839897-bd0b52f945a0', 900),
                'stats' => [
                    ['value' => '400%+', 'label' => 'Average Project ROI'],
                    ['value' => '12,000', 'label' => 'Install of their new mobile app.'],
                ],
            ],
            [
                'title' => 'Unlocking revenue through smarter strategy',
                'client' => 'Ryan Cooper',
                'text' => 'They uncovered new revenue opportunities across our product ecosystem. Working together was transparent, fast, and data-driven. Their insights directly increased conversions and retention.',
                'image' => TemplateContent::photo('1487412720507-e7ab37603c6f', 900),
                'stats' => [
                    ['value' => '600%+', 'label' => 'Average Project ROI'],
                    ['value' => '12,500', 'label' => 'Install of their new mobile app.'],
                ],
            ],
        ];
    }

    /** @return list<array<string, mixed>> */
    private static function articles(): array
    {
        return [
            [
                'title' => 'Staging Secrets for a Fast and Lucrative Home Sale',
                'author' => 'Emily',
                'date' => '19 Jan 2027',
                'image' => TemplateContent::photo('1520880867055-1e30d1cb001c', 900),
                'url' => '/insights',
            ],
            [
                'title' => 'How to Stage Your Home for a Quick Sale',
                'author' => 'Emily',
                'image' => TemplateContent::photo('1521341957697-b93449760f30', 700),
                'url' => '/insights',
            ],
            [
                'title' => 'Tips for Staging Your Home Effectively',
                'author' => 'Emily',
                'image' => TemplateContent::photo('1524504388940-b1c1722653e1', 700),
                'url' => '/insights',
            ],
            [
                'title' => 'How to Stage Your Home for a Quick and Profitable Sale',
                'author' => 'Emily',
                'image' => TemplateContent::photo('1519085360753-af0119f7cbe7', 700),
                'url' => '/insights',
            ],
        ];
    }

    /** @return list<array<string, mixed>> */
    public static function pages(): array
    {
        return [
            self::home(),
            self::about(),
            self::insights(),
            self::caseStudiesPage(),
        ];
    }

    /** @return array<string, mixed> */
    private static function home(): array
    {
        return TemplateContent::sitePage('Home', 'home', true, self::nav(), [
            TemplateContent::section('hero', 'hero.kirki', array_merge(self::motion(0, 'load'), [
                'ratingScore' => '4.8',
                'ratingSource' => 'Trustpilot',
                'heading' => 'Your Revenue Growth Partner in the AI Era',
                'description' => 'We turn complex ideas into simple, compelling stories. Stories that connect emotionally, build trust, and move audiences to take action.',
                'buttonLabel' => 'Get a Proposal',
                'buttonUrl' => '/contact',
                'secondaryLabel' => 'Explore services',
                'secondaryUrl' => '/about',
                'image' => TemplateContent::photo('1544005313-94ddf0286df2', 900),
                'logosTitle' => 'Trusted by 100+ brands',
            ])),
            TemplateContent::section('services', 'features.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Current Services',
                'heading' => "People don't buy products. They buy Clarity.",
                'buttonLabel' => 'Get a Proposal',
                'buttonUrl' => '/contact',
                'items' => [
                    ['title' => 'Grown', 'text' => 'We turn complex ideas into simple, compelling stories.', 'icon' => 'trending-up'],
                    ['title' => 'Consulting', 'text' => 'We turn complex ideas into simple, compelling stories.', 'icon' => 'compass'],
                    ['title' => 'Excellence', 'text' => 'We turn complex ideas into simple, compelling stories.', 'icon' => 'award'],
                ],
            ])),
            TemplateContent::section('about', 'about.kirki', array_merge(self::motion(0), [
                'layout' => 'image-left',
                'eyebrow' => 'Brief about',
                'heading' => 'Driving Exceptional Results for Modern Businesses',
                'description' => 'We specialize in helping businesses navigate complex challenges and achieve sustainable growth.',
                'checklist' => ["Strategic solutions for growth", "Proven methodologies & secure data handling", 'Flexible partnerships on your own terms'],
                'buttonLabel' => 'Get a Proposal',
                'buttonUrl' => '/contact',
                'image' => TemplateContent::photo('1580489944761-15a19d654956', 900),
            ])),
            TemplateContent::section('industries', 'industries.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Sector of Expertise',
                'heading' => 'Customized Solutions for Various Industries',
                'items' => [
                    ['label' => 'Healthcare', 'tint' => '#7cbf6a'],
                    ['label' => 'Finance', 'tint' => '#3a6bd8'],
                    ['label' => 'E-commerce', 'tint' => '#e8b23a'],
                    ['label' => 'Technology', 'tint' => '#2f6f8f'],
                ],
            ])),
            TemplateContent::section('quote', 'testimonial.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Real Stories of Expertise',
                'heading' => 'Genuine Insights from Our Clients',
                'items' => [array_merge(self::caseStudies()[0], ['name' => 'Ryan Cooper', 'role' => 'Clients'])],
            ])),
            TemplateContent::section('insights', 'blog.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Well thought Insights',
                'heading' => 'Ideas That Move Businesses Forward',
                'showFeatured' => false,
                'items' => self::articles(),
            ])),
            TemplateContent::section('reviews', 'reviews.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Trusted by Clients',
                'heading' => 'Real Feedback From Our Clients',
            ])),
            TemplateContent::section('cta', 'cta.kirki', array_merge(self::motion(0), [
                'heading' => 'Ready to simplify your business finances?',
                'description' => 'We turn complex ideas into simple, compelling stories. Stories that connect emotionally, build trust, and move audiences to take action.',
                'buttonLabel' => 'Contact now',
                'buttonUrl' => '/contact',
                'image' => TemplateContent::photo('1506126613408-eca07ce68773', 900),
            ])),
        ], self::footer(), 'footer.kirki', 'navbar.kirki');
    }

    /** @return array<string, mixed> */
    private static function about(): array
    {
        return TemplateContent::sitePage('About', 'about', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.kirki', array_merge(self::motion(0, 'load'), [
                'heading' => 'Our Story, Your Success: The Kirki Difference',
                'description' => 'Growing a business today means navigating constant change, complex decisions, and high expectations. We exist to turn them into opportunities for sustainable growth.',
                'buttonLabel' => 'Get a Proposal',
                'buttonUrl' => '/contact',
                'secondaryLabel' => 'Explore services',
                'secondaryUrl' => '/about',
                'showRating' => false,
            ])),
            TemplateContent::section('stats', 'stats.kirki', array_merge(self::motion(0), [
                'image' => TemplateContent::photo('1487412720507-e7ab37603c6f', 900),
                'stats' => [
                    ['value' => '95%', 'label' => 'Client Satisfaction'],
                    ['value' => '1,200+', 'label' => 'Projects Delivered'],
                    ['value' => '300%+', 'label' => 'Average Project ROI'],
                    ['value' => '50+', 'label' => 'Industries Served'],
                ],
            ])),
            TemplateContent::section('mission', 'about.kirki', array_merge(self::motion(0), [
                'layout' => 'centered',
                'eyebrow' => 'Our Mission',
                'heading' => 'To empower businesses with strategic insights and innovative solutions that drive sustainable growth. To become a trusted global consulting partner shaping smarter, stronger, and more resilient businesses.',
                'description' => '',
                'checklist' => '',
                'image' => TemplateContent::photo('1519085360753-af0119f7cbe7', 400),
            ])),
            TemplateContent::section('industries', 'industries.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Sector of Expertise',
                'heading' => 'Customized Solutions for Various Industries',
                'items' => [
                    ['label' => 'Healthcare', 'tint' => '#7cbf6a'],
                    ['label' => 'Finance', 'tint' => '#3a6bd8'],
                    ['label' => 'E-commerce', 'tint' => '#e8b23a'],
                    ['label' => 'Technology', 'tint' => '#2f6f8f'],
                ],
            ])),
            TemplateContent::section('awards', 'awards.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Awards we achieved',
                'heading' => 'Celebrating Success',
                'image' => TemplateContent::photo('1567521464027-f127ff144326', 700),
                'items' => [
                    ['title' => 'Most Innovative Consultancy Firm', 'year' => '2022'],
                    ['title' => 'Top Client Satisfaction Award', 'year' => '2023'],
                    ['title' => 'Leading Strategic Advisory', 'year' => '2024'],
                    ['title' => 'Excellence in Business Performance', 'year' => '2025'],
                ],
            ])),
            TemplateContent::section('team', 'team.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Team Behind the success',
                'heading' => 'Customized Solutions for Various Industries',
                'buttonLabel' => 'Get a Proposal',
                'buttonUrl' => '/contact',
                'items' => [
                    ['name' => 'Jerry Helfer', 'role' => 'Founder & Strategy Lead', 'image' => TemplateContent::photo('1580489944761-15a19d654956', 500)],
                    ['name' => 'Alex Morgan', 'role' => 'Founder & Strategy Lead', 'image' => TemplateContent::photo('1500648767791-00dcc994a43e', 500)],
                    ['name' => 'Jerry Helfer', 'role' => 'Founder & Strategy Lead', 'image' => TemplateContent::photo('1438761681033-6461ffad8d80', 500), 'featured' => true],
                ],
            ])),
            TemplateContent::section('cta', 'cta.kirki', array_merge(self::motion(0), [
                'heading' => 'Ready to simplify your business finances?',
                'description' => 'We turn complex ideas into simple, compelling stories. Stories that connect emotionally, build trust, and move audiences to take action.',
                'buttonLabel' => 'Contact now',
                'buttonUrl' => '/contact',
                'image' => TemplateContent::photo('1506126613408-eca07ce68773', 900),
            ])),
        ], self::footer(), 'footer.kirki', 'navbar.kirki');
    }

    /** @return array<string, mixed> */
    private static function insights(): array
    {
        return TemplateContent::sitePage('Insights', 'insights', false, self::nav(), [
            TemplateContent::section('head', 'blog.kirki', array_merge(self::motion(0, 'load'), [
                'eyebrow' => 'Trusted by Insights',
                'heading' => 'Innovative Ideas to Propel Your Business',
                'showFeatured' => false,
                'items' => array_slice(self::articles(), 0, 3),
                'columns' => 2,
            ])),
            TemplateContent::section('grid', 'blog.kirki', array_merge(self::motion(0), [
                'eyebrow' => 'Trusted by Insides',
                'heading' => 'Ideas That Move Businesses Forward',
                'showFeatured' => true,
                'items' => self::articles(),
            ])),
            TemplateContent::section('cta', 'cta.kirki', array_merge(self::motion(0), [
                'heading' => 'Ready to simplify your business finances?',
                'description' => 'We turn complex ideas into simple, compelling stories. Stories that connect emotionally, build trust, and move audiences to take action.',
                'buttonLabel' => 'Contact now',
                'buttonUrl' => '/contact',
                'image' => TemplateContent::photo('1506126613408-eca07ce68773', 900),
            ])),
        ], self::footer(), 'footer.kirki', 'navbar.kirki');
    }

    /** @return array<string, mixed> */
    private static function caseStudiesPage(): array
    {
        return TemplateContent::sitePage('Case studies', 'case-studies', false, self::nav(), [
            TemplateContent::section('head', 'pagehead.kirki', array_merge(self::motion(0, 'load'), [
                'heading' => 'Your Revenue Growth Partner in the AI Era',
                'description' => '',
                'buttonLabel' => 'Get a Proposal',
                'buttonUrl' => '/contact',
                'secondaryLabel' => '',
                'secondaryUrl' => '',
            ])),
            TemplateContent::section('list', 'casestudies.kirki', array_merge(self::motion(0), [
                'items' => self::caseStudies(),
            ])),
            TemplateContent::section('cta', 'cta.kirki', array_merge(self::motion(0), [
                'heading' => 'Ready to simplify your business finances?',
                'description' => 'We turn complex ideas into simple, compelling stories. Stories that connect emotionally, build trust, and move audiences to take action.',
                'buttonLabel' => 'Contact now',
                'buttonUrl' => '/contact',
                'image' => TemplateContent::photo('1506126613408-eca07ce68773', 900),
            ])),
        ], self::footer(), 'footer.kirki', 'navbar.kirki');
    }
}
