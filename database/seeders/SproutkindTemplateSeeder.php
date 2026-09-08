<?php

namespace Database\Seeders;

use App\Models\Template;
use App\Models\TemplateCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/** Install or refresh only Sproutkind; existing customer sites stay intact. */
class SproutkindTemplateSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $category = TemplateCategory::firstOrCreate(['slug' => 'education'], ['name' => 'Education']);
            $template = Template::updateOrCreate(['slug' => 'sproutkind'], [
                'template_category_id' => $category->id, 'name' => 'Sproutkind',
                'description' => 'A joyful early-learning school: seven complete pages and fifteen reusable blocks, with a video hero, program filters, gallery lightboxes, event details, admissions steps, parent stories, and connected inquiry forms.',
                'is_premium' => false, 'is_active' => true, 'is_featured' => true,
                'theme_tokens' => TemplateSproutkind::theme(),
            ]);
            $template->pages()->delete();
            foreach (TemplateSproutkind::pages() as $page) {
                $template->pages()->create($page);
            }
        });
    }
}
