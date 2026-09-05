<?php

namespace Database\Seeders;

class TemplateForma
{
    public static function theme(): array
    {
        return [
            'primary' => '#963f2d', 'secondary' => '#302e29', 'accent' => '#d5d9cb',
            'background' => '#faf7f1', 'surface' => '#eee8df', 'text' => '#302e29', 'muted' => '#716b62',
            'headingFont' => 'Fraunces, Georgia, serif', 'bodyFont' => 'Inter, system-ui, sans-serif',
            'headingWeight' => 500, 'bodyWeight' => 400, 'buttonRadius' => '999px',
            'cardRadius' => '12px', 'containerWidth' => '1180px', 'sectionSpacing' => '88px',
        ];
    }

    public static function pages(): array
    {
        $nav = TemplateContent::nav('forma.', [
            ['label' => 'Work', 'url' => '/work'], ['label' => 'Services', 'url' => '/services'],
            ['label' => 'Studio', 'url' => '/about'],
        ], ['buttonLabel' => 'Let’s talk', 'buttonUrl' => '/contact', 'sticky' => true]);
        $footer = TemplateContent::footer('forma.', [
            'tagline' => 'Independent minds. Thoughtful design.',
            'columns' => [
                ['title' => 'Explore', 'links' => "Work|/work\nServices|/services\nStudio|/about"],
                ['title' => 'Say hello', 'links' => "Start a project|/contact"],
            ], 'showNewsletter' => false,
        ]);
        $section = fn (string $id, string $type, array $props = []) => TemplateContent::section($id, $type, $props);
        return [
            TemplateContent::sitePage('Home', 'home', true, $nav, [
                $section('hero', 'hero.forma'), $section('services', 'services.forma'),
                $section('work', 'gallery.forma'), $section('process', 'content.forma'), $section('contact', 'cta.forma'),
            ], $footer),
            TemplateContent::sitePage('Work', 'work', false, $nav, [
                $section('hero', 'hero.forma', ['heading' => 'A collection of considered ideas.', 'layout' => 'centered', 'showArtwork' => false, 'buttonLabel' => '', 'secondaryLabel' => '']),
                $section('work', 'gallery.forma', ['layout' => 'grid']), $section('contact', 'cta.forma'),
            ], $footer),
            TemplateContent::sitePage('Services', 'services', false, $nav, [
                $section('hero', 'hero.forma', ['heading' => 'From first thought to final detail.', 'layout' => 'reverse', 'buttonLabel' => 'Discuss your project', 'buttonUrl' => '/contact']),
                $section('services', 'services.forma', ['layout' => 'list']),
                $section('process', 'content.forma', ['layout' => 'accordion']), $section('contact', 'cta.forma', ['layout' => 'split']),
            ], $footer),
            TemplateContent::sitePage('Studio', 'about', false, $nav, [
                $section('hero', 'hero.forma', ['heading' => 'Curious people. Shared purpose.', 'description' => 'We are an independent studio working at the intersection of strategy, identity, and digital design. We believe the best work starts with a good conversation.', 'buttonLabel' => 'Meet your next creative partner', 'buttonUrl' => '/contact', 'secondaryLabel' => '']),
                $section('process', 'content.forma'), $section('contact', 'cta.forma'),
            ], $footer),
            TemplateContent::sitePage('Contact', 'contact', false, $nav, [
                $section('hero', 'hero.forma', ['heading' => 'Every good project starts here.', 'description' => 'Tell us about your idea, timeline, and what you hope to achieve.', 'layout' => 'centered', 'showArtwork' => false, 'buttonLabel' => '', 'secondaryLabel' => '']),
                $section('form', 'form.contact', ['heading' => 'Tell us what you have in mind', 'buttonLabel' => 'Send inquiry', 'details' => []]),
            ], $footer),
        ];
    }
}
