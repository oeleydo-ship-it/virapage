<?php

namespace Database\Seeders;

use App\Models\Template;
use App\Models\TemplateCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VelouraTemplateSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $category = TemplateCategory::firstOrCreate(['slug' => 'beauty'], ['name' => 'Beauty & Wellness']);
            $template = Template::updateOrCreate(['slug' => 'veloura'], [
                'template_category_id' => $category->id, 'name' => 'Veloura',
                'description' => 'An editorial hair salon with deep green and amber styling: eight pages, fourteen editable blocks, expandable services, a filterable lookbook, stylist profiles, client stories, price menus and connected appointment inquiries. Ready for AI Sitekit content generation.',
                'is_premium' => false, 'is_active' => true, 'is_featured' => true,
                'theme_tokens' => TemplateVeloura::theme(),
            ]);
            $template->pages()->delete();
            foreach (TemplateVeloura::pages() as $page) {
                $template->pages()->create($page);
            }
        });
    }
}
