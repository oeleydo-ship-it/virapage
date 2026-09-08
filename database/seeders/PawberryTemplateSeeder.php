<?php

namespace Database\Seeders;

use App\Models\Template;
use App\Models\TemplateCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PawberryTemplateSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $category = TemplateCategory::firstOrCreate(['slug' => 'pets'], ['name' => 'Pets & Animals']);
            $template = Template::updateOrCreate(['slug' => 'pawberry'], [
                'template_category_id' => $category->id, 'name' => 'Pawberry',
                'description' => 'A warm pet-grooming studio: seven complete pages and fourteen editable blocks, with moving team portraits, service details, plan comparison, photo testimonials, searchable journal stories, and connected booking inquiries. AI SiteKit ready.',
                'is_premium' => false, 'is_active' => true, 'is_featured' => true,
                'theme_tokens' => TemplatePawberry::theme(),
            ]);
            $template->pages()->delete();
            foreach (TemplatePawberry::pages() as $page) {
                $template->pages()->create($page);
            }
        });
    }
}
