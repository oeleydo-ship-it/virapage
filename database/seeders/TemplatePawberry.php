<?php

namespace Database\Seeders;

class TemplatePawberry
{
    public static function theme(): array
    {
        return [
            'primary' => '#fdcb6e', 'secondary' => '#a6c1e7', 'accent' => '#ff6f61',
            'background' => '#fffbf1', 'surface' => '#fff9e5', 'text' => '#3f2e1f', 'muted' => '#776556',
            'headingFont' => 'Pawberry Display, sans-serif', 'bodyFont' => 'Pawberry Sans, sans-serif',
            'headingWeight' => 600, 'bodyWeight' => 400, 'buttonRadius' => '7px',
            'cardRadius' => '13px', 'containerWidth' => '1180px', 'sectionSpacing' => '85px',
        ];
    }

    public static function pages(): array
    {
        $s = fn (string $id, string $type, array $props = []) => TemplateContent::section($id, $type.'.pawberry', $props);
        $page = fn (string $name, string $slug, bool $home, array $sections) => TemplateContent::sitePage($name, $slug, $home, [], $sections, [], 'footer.pawberry', 'navbar.pawberry');
        $head = fn (string $eyebrow, string $heading, string $description) => $s('introduction', 'page_header', compact('eyebrow', 'heading', 'description'));
        return [
            $page('Home', 'home', true, [
                $s('welcome', 'hero'), $s('our-people', 'team'), $s('our-story', 'story'),
                $s('services', 'services'), $s('kind-words', 'testimonials'), $s('packages', 'pricing'),
                $s('visit', 'video_cta'), $s('journal', 'journal'), $s('questions', 'faq'),
            ]),
            $page('About', 'about', false, [
                $head('Hello, we’re Pawberry', "A small studio.\nA very big heart.", 'We believe a good grooming visit starts with trust, a gentle approach, and time to get to know each pet.'),
                $s('story', 'story', ['heading' => "For the love\nof little companions.", 'description' => 'We are a close-knit team who enjoy making everyday care feel personal. From the first hello to the journey home, we pay attention to what helps your pet feel at ease.', 'buttonLabel' => 'Meet the team', 'buttonUrl' => '/team']),
                $s('approach', 'process'), $s('people', 'team'), $s('kind-words', 'testimonials'),
                $s('invitation', 'video_cta'),
            ]),
            $page('Services', 'services', false, [
                $head('Nose-to-tail care', "A little care\nfor every companion.", 'Explore our grooming services and talk to the team about the right fit for your pet.'),
                $s('services', 'services', ['layout' => 'image-cards', 'showFilters' => true, 'buttonLabel' => '', 'items' => self::services()]),
                $s('visit-journey', 'process'), $s('questions', 'faq'),
                $s('invitation', 'video_cta', ['buttonLabel' => 'Compare packages', 'buttonUrl' => '/pricing']),
            ]),
            $page('Pricing', 'pricing', false, [
                $head('Straightforward choices', "Their next fresh start.\nYour kind of package.", 'Compare our example packages, then talk with us about your pet’s coat and care needs.'),
                $s('packages', 'pricing'),
                $s('price-questions', 'faq', ['heading' => "A clear plan,\nbefore we begin.", 'items' => [
                    ['question' => 'Are the displayed prices final?', 'answer' => 'These are example starting prices. Your pet’s size, coat, and the care required can affect the final quote. The team confirms the details before beginning.'],
                    ['question' => 'Can you help me choose a package?', 'answer' => 'Yes. Tell us a little about your pet and the result you have in mind. We will explain the options and suggest a suitable starting point.'],
                    ['question' => 'Can I request additional coat care?', 'answer' => 'Let us know what you are looking for when you inquire. We will discuss the time, suitability, and any additional price together.'],
                    ['question' => 'Does an inquiry reserve an appointment?', 'answer' => 'No. The team will reply to confirm availability, the service, and the appointment time.'],
                ]]), $s('booking', 'form', ['heading' => "Let’s find\nthe right fit.", 'description' => 'Tell us about your pet and the package that interests you.']),
            ]),
            $page('Team', 'team', false, [
                $head('Your pet’s new friends', "Friendly faces.\nCaring hands.", 'Get to know the people behind the brushes, bubbles, and reassuring hellos.'),
                $s('team', 'team', ['layout' => 'grid', 'animate' => false, 'buttonLabel' => '', 'heading' => 'Meet the Pawberry people.', 'description' => 'Example team profiles — replace names, photos, and biographies with your studio’s team.']),
                $s('values', 'story', ['reverse' => true, 'heading' => "Good care starts\nwith good listening.", 'description' => 'You know your pet best. We want to hear about their habits, favorite things, and anything that helps us make their visit more comfortable.', 'buttonLabel' => 'Talk to us', 'buttonUrl' => '/contact']),
                $s('kind-words', 'testimonials'), $s('invitation', 'video_cta'),
            ]),
            $page('Journal', 'journal', false, [
                $head('A little reading, a lot of love', "Everyday moments.\nHappier companions.", 'Simple stories about spending time together and making everyday routines feel good.'),
                $s('stories', 'journal', ['showSearch' => true, 'buttonLabel' => '', 'heading' => 'From our little notebook.']),
                $s('questions', 'faq', ['heading' => "Something on\nyour mind?", 'description' => 'We are happy to talk about your pet’s next grooming visit.']),
                $s('invitation', 'video_cta'),
            ]),
            $page('Contact', 'contact', false, [
                $head('Come say hello', "Your buddy’s\nnext happy visit.", 'Tell us about your companion and we will help plan a comfortable, unrushed appointment.'),
                $s('booking', 'form'), $s('what-to-expect', 'process'), $s('questions', 'faq'),
            ]),
        ];
    }

    private static function services(): array
    {
        $catalog = json_decode(file_get_contents(resource_path('blocks/block-catalog.json')), true);
        $defaults = collect($catalog['blocks'] ?? [])->firstWhere('type', 'services.pawberry')['defaultProps']['items'] ?? [];
        $defaults[] = [
            'title' => 'Gentle cat grooming', 'category' => 'Cats', 'icon' => 'sparkles',
            'description' => 'An individual approach to brushing and coat care for your feline companion.',
            'details' => 'We discuss your cat’s coat and temperament before arranging a suitable session. Our priority is a calm experience, with breaks and an approach tailored to your cat.',
            'duration' => 'Time agreed during consultation',
            'image' => '/template-assets/pawberry/team-3.jpg', 'imageAlt' => 'A cat held by a pet-care specialist',
        ];
        return $defaults;
    }
}
