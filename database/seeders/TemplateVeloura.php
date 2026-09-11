<?php

namespace Database\Seeders;

class TemplateVeloura
{
    public static function theme(): array
    {
        return [
            'primary' => '#fabb0e', 'secondary' => '#1d261b', 'accent' => '#f1c376',
            'background' => '#f5f0f0', 'surface' => '#fdfcfc', 'text' => '#1d261b', 'muted' => '#4e4d4d',
            'headingFont' => 'Inter, sans-serif', 'bodyFont' => 'Inter, sans-serif',
            'headingWeight' => 600, 'bodyWeight' => 400, 'buttonRadius' => '12px',
            'cardRadius' => '15px', 'containerWidth' => '1240px', 'sectionSpacing' => '88px',
        ];
    }

    public static function pages(): array
    {
        $s = fn (string $id, string $type, array $props = []) => TemplateContent::section($id, $type.'.veloura', $props);
        $page = fn (string $name, string $slug, bool $home, array $sections) => TemplateContent::sitePage($name, $slug, $home, [], $sections, [], 'footer.veloura', 'navbar.veloura');
        $head = fn (string $eyebrow, string $heading, string $description) => $s('introduction', 'page_header', compact('eyebrow', 'heading', 'description'));

        return [
            $page('Home', 'home', true, [
                $s('welcome', 'hero'), $s('our-story', 'story'), $s('salon-menu', 'services'),
                $s('your-visit', 'process'), $s('lookbook', 'gallery', ['showFilters' => false, 'buttonLabel' => 'Explore the lookbook', 'buttonUrl' => '/gallery']),
                $s('kind-words', 'testimonials'), $s('stylists', 'team'), $s('questions', 'faq'), $s('invitation', 'cta'),
            ]),
            $page('About', 'about', false, [
                $head('WELCOME TO VELOURA', 'A little space to feel like yourself.', 'A personal approach to hair, grounded in good conversations and considered craft.'),
                $s('story', 'story', ['heading' => 'It starts with listening.', 'description' => 'A good salon visit begins before the scissors come out. We want to know how your hair feels, how you wear it, and what you would love to change. Together, we make a plan that works beyond the salon chair.', 'buttonLabel' => 'Meet our people', 'buttonUrl' => '/team']),
                $s('approach', 'process'), $s('people', 'team'), $s('invitation', 'cta'),
            ]),
            $page('Services', 'services', false, [
                $head('THE SALON MENU', 'Small refresh. Big possibility.', 'Find your next cut, explore a new colour or give your hair a little extra care.'),
                $s('services', 'services'), $s('visit', 'process'), $s('questions', 'faq'), $s('invitation', 'cta'),
            ]),
            $page('Pricing', 'pricing', false, [
                $head('YOUR APPOINTMENT, YOUR WAY', 'Good hair begins with a clear plan.', 'Explore our example starting prices and discuss a personal quote with your stylist.'),
                $s('menu', 'pricing'), $s('questions', 'faq'), $s('invitation', 'cta'),
            ]),
            $page('Gallery', 'gallery', false, [
                $head('A FEW FRESH PERSPECTIVES', 'Make room for your next look.', 'Explore our example lookbook, then bring your ideas to a personal consultation.'),
                $s('lookbook', 'gallery'), $s('invitation', 'cta'),
            ]),
            $page('Team', 'team', false, [
                $head('MEET YOUR STYLIST', 'A shared love of great hair.', 'Our example team brings individual creativity and a thoughtful approach to every chair.'),
                $s('stylists', 'team'), $s('studio', 'story', ['reverse' => true, 'heading' => 'Your ideas. Our attention.', 'description' => 'Bring your inspiration, questions and everyday routine. Your stylist will help shape a look that feels comfortable, personal and easy to wear.', 'buttonLabel' => 'Talk to the team', 'buttonUrl' => '/contact']),
                $s('kind-words', 'testimonials'), $s('invitation', 'cta'),
            ]),
            $page('Contact', 'contact', false, [
                $head('COME SAY HELLO', 'We would love to hear from you.', 'Questions about a service, a special occasion or your next visit? Send the team a note.'),
                $s('contact', 'form', ['heading' => 'Start a conversation.', 'formHeading' => 'Contact the studio']), $s('questions', 'faq'),
            ]),
            $page('Appointment', 'appointment', false, [
                $head('MAKE TIME FOR YOURSELF', 'Your next good hair day awaits.', 'Send your preferred service and availability. The salon will get in touch to confirm the details.'),
                $s('booking', 'form'), $s('visit', 'process'), $s('questions', 'faq'),
            ]),
        ];
    }
}
