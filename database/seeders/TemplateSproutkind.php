<?php

namespace Database\Seeders;

class TemplateSproutkind
{
    public static function theme(): array
    {
        return [
            'primary' => '#f9b000', 'secondary' => '#245746', 'accent' => '#e6decb',
            'background' => '#f7f7f2', 'surface' => '#e6decb', 'text' => '#191818', 'muted' => '#727171',
            'headingFont' => 'Sproutkind Sans, sans-serif', 'bodyFont' => 'Sproutkind Sans, sans-serif',
            'headingWeight' => 500, 'bodyWeight' => 400, 'buttonRadius' => '999px',
            'cardRadius' => '26px', 'containerWidth' => '1240px', 'sectionSpacing' => '88px',
        ];
    }

    public static function pages(): array
    {
        $s = fn (string $id, string $type, array $props = []) => TemplateContent::section($id, $type.'.sproutkind', $props);
        $page = fn (string $name, string $slug, bool $home, array $sections) => TemplateContent::sitePage($name, $slug, $home, [], $sections, [], 'footer.sproutkind', 'navbar.sproutkind');
        $head = fn (string $eyebrow, string $heading, string $description) => $s('introduction', 'page_header', compact('eyebrow', 'heading', 'description'));
        return [
            $page('Home', 'home', true, [
                $s('welcome', 'hero'), $s('highlights', 'highlights'), $s('our-story', 'about'),
                $s('programs', 'programs', ['showFilters' => false]), $s('learning', 'benefits'),
                $s('family-voices', 'testimonials'), $s('events', 'events'), $s('invitation', 'cta'),
            ]),
            $page('About', 'about', false, [
                $head('A place to belong', "Little people.\nA whole world of possibility.", 'Get to know the ideas and everyday care behind our learning community.'),
                $s('story', 'about', ['buttonLabel' => 'Come meet us', 'buttonUrl' => '/contact', 'subheading' => 'Big hearts. Open minds.', 'body' => 'Sproutkind is a place for curious questions, muddy adventures, and friendships that start with a smile. We believe the best learning happens when children feel secure enough to explore.']),
                $s('values', 'benefits', ['eyebrow' => 'What matters to us', 'heading' => "Kindness at the heart\nof every day."]),
                $s('voices', 'testimonials'), $s('questions', 'faq'), $s('invitation', 'cta'),
            ]),
            $page('Programs', 'programs', false, [
                $head('Made for growing minds', "Find their next\nlittle adventure.", 'Discover play-based programs shaped around different stages of early childhood.'),
                $s('programs', 'programs', ['showFilters' => true, 'buttonLabel' => '', 'description' => 'Choose an age group and explore the daily experiences, learning focus, and session options.']),
                $s('daily-rhythm', 'steps', ['eyebrow' => 'A day at Sproutkind', 'heading' => "A familiar rhythm.\nFresh discoveries.", 'buttonLabel' => 'Ask about session times', 'buttonUrl' => '/contact', 'items' => [
                    ['title' => 'A warm welcome', 'description' => 'Time to arrive, greet familiar faces, and choose a gentle first activity.'],
                    ['title' => 'Explore and create', 'description' => 'Stories, hands-on play, and shared investigations make room for different interests.'],
                    ['title' => 'Recharge and reconnect', 'description' => 'A pause for food, conversation, and a little quiet time in a comfortable setting.'],
                    ['title' => 'Move and discover', 'description' => 'Outdoor play, movement, and a chance to share what made the day special.'],
                ]]), $s('questions', 'faq'), $s('invitation', 'cta'),
            ]),
            $page('Admissions', 'admissions', false, [
                $head('A gentle beginning', "Your family.\nOur warmest welcome.", 'Start with a conversation, take a look around, and find the right next step together.'),
                $s('admission-steps', 'steps'),
                $s('first-visit', 'about', ['eyebrow' => 'Make yourself at home', 'heading' => "Come see a little\nof our everyday.", 'description' => 'A visit is a chance to ask questions and picture your child here.', 'image' => '/template-assets/sproutkind/classroom.jpg', 'imageAlt' => 'Children exploring creative activities', 'imageCaption' => 'A conversation, not a commitment.', 'subheading' => 'Bring your questions.', 'body' => 'We can talk about the settling-in process, session availability, fees, and how we keep families involved. Share anything that would help us make your visit comfortable.', 'items' => [], 'buttonLabel' => 'Request a visit', 'buttonUrl' => '/contact']),
                $s('questions', 'faq'),
                $s('inquiry', 'form', ['heading' => "Tell us a little\nabout your plans.", 'formHeading' => 'Admissions inquiry', 'description' => 'Let us know which program interests you and when you hope to start. We will reply with the next steps.']),
            ]),
            $page('Gallery', 'gallery', false, [
                $head('The joy is in the everyday', "Small moments.\nLasting memories.", 'Explore a glimpse of our learning spaces, creative activities, and community.'),
                $s('photos', 'gallery'), $s('welcome', 'highlights', ['heading' => 'A day full of possibility.']),
                $s('invitation', 'cta', ['heading' => "Picture your little\none here.", 'description' => 'Come experience our spaces and meet the team in person.']),
            ]),
            $page('Events', 'events', false, [
                $head('Our community calendar', "Good things\nhappen together.", 'Family mornings, creative adventures, and moments to celebrate. Example events below can be replaced with your calendar.'),
                $s('events', 'events', ['buttonLabel' => '', 'heading' => 'What’s happening at Sproutkind?']),
                $s('event-questions', 'faq', ['eyebrow' => 'Before you join us', 'heading' => "A few helpful\nlittle details.", 'items' => [
                    ['question' => 'How do I ask about an event?', 'answer' => 'Open an event and choose “Ask about attending” to reach our contact page. The team will confirm the date, availability, and any arrangements.'],
                    ['question' => 'Can prospective families come along?', 'answer' => 'Some activities welcome new families. Contact us about the event that interests you so we can share the details.'],
                    ['question' => 'What should we bring?', 'answer' => 'Each activity is a little different. We will let you know about clothing, refreshments, and anything else before your visit.'],
                ]]), $s('invitation', 'cta'),
            ]),
            $page('Contact', 'contact', false, [
                $head('A friendly hello', "Every new story\nstarts with a conversation.", 'Ask a question, arrange a visit, or find out more about joining our community.'),
                $s('contact', 'form'),
                $s('visit', 'about', ['eyebrow' => 'Come and explore', 'heading' => "A little look around.\nA lovely place to start.", 'description' => '', 'image' => '/template-assets/sproutkind/care.jpg', 'imageAlt' => 'A welcoming early-learning space', 'imageCaption' => 'Visits arranged around your family.', 'subheading' => 'We will help you plan your visit.', 'body' => 'Use the inquiry form to suggest a convenient time. Our team will reply to confirm availability and share directions and arrival details.', 'items' => [], 'buttonLabel' => 'Explore our programs', 'buttonUrl' => '/programs']),
                $s('questions', 'faq'),
            ]),
        ];
    }
}
