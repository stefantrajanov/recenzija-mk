<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Category;
use App\Services\GooglePlacesService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlacesSeeder extends Seeder
{
    /**
     * Category definitions: query => [name, name_mk, slug, icon, types for nearby]
     */
    private array $categoryMap = [
        'Restaurants in Skopje' => [
            'name' => 'Restaurants',
            'name_mk' => 'Ресторани',
            'slug' => 'restaurants',
            'icon' => 'UtensilsCrossed',
            'types' => ['restaurant'],
        ],
        'Cafes in Skopje' => [
            'name' => 'Cafes',
            'name_mk' => 'Кафулиња',
            'slug' => 'cafes',
            'icon' => 'Coffee',
            'types' => ['cafe'],
        ],
        'Auto services in Skopje' => [
            'name' => 'Services',
            'name_mk' => 'Услуги',
            'slug' => 'services',
            'icon' => 'Wrench',
            'types' => ['car_repair'],
        ],
        'Shopping in Skopje' => [
            'name' => 'Shopping',
            'name_mk' => 'Шопинг',
            'slug' => 'shopping',
            'icon' => 'ShoppingBag',
            'types' => ['shopping_mall', 'store'],
        ],
    ];

    // Skopje city center coordinates
    private float $skopjeLat = 41.9981;
    private float $skopjeLng = 21.4254;

    public function run(): void
    {
        $service = new GooglePlacesService();

        $this->command->info('Seeding categories and businesses from Google Places API...');

        // Location bias for Text Search (Skopje area)
        $locationBias = [
            'circle' => [
                'center' => [
                    'latitude' => $this->skopjeLat,
                    'longitude' => $this->skopjeLng,
                ],
                'radius' => 10000.0,
            ],
        ];

        foreach ($this->categoryMap as $query => $categoryDef) {
            // Upsert category
            $category = Category::updateOrCreate(
                ['slug' => $categoryDef['slug']],
                [
                    'name' => $categoryDef['name'],
                    'name_mk' => $categoryDef['name_mk'],
                    'icon' => $categoryDef['icon'],
                ]
            );

            $this->command->info("Searching: \"{$query}\"...");

            // Text Search for this category
            $places = $service->textSearch($query, $locationBias);

            $this->command->info('  Found ' . count($places) . ' places');

            foreach ($places as $place) {
                $this->upsertBusiness($place, $category);
            }

            // Also run Nearby Search for additional coverage
            $nearbyPlaces = $service->nearbySearch(
                $this->skopjeLat,
                $this->skopjeLng,
                5000.0,
                $categoryDef['types'],
                10
            );

            $this->command->info('  + ' . count($nearbyPlaces) . ' nearby places');

            foreach ($nearbyPlaces as $place) {
                $this->upsertBusiness($place, $category);
            }
        }

        $totalBusinesses = Business::count();
        $totalCategories = Category::count();
        $this->command->info("Done! Seeded {$totalCategories} categories and {$totalBusinesses} businesses.");
    }

    /**
     * Upsert a business record from a Google Places API response.
     */
    private function upsertBusiness(array $place, Category $category): void
    {
        $placeId = $place['id'] ?? null;

        if (! $placeId) {
            return;
        }

        $displayName = $place['displayName']['text'] ?? 'Unknown';
        $address = $place['formattedAddress'] ?? '';
        $rating = (float) ($place['rating'] ?? 0);
        $reviewCount = (int) ($place['userRatingCount'] ?? 0);
        $priceLevel = GooglePlacesService::mapPriceLevel($place['priceLevel'] ?? null);
        $photoUrl = GooglePlacesService::extractPhotoUrl($place);
        $lat = (float) ($place['location']['latitude'] ?? 0);
        $lng = (float) ($place['location']['longitude'] ?? 0);
        $description = $place['editorialSummary']['text'] ?? null;
        $types = $place['types'] ?? [];

        Business::updateOrCreate(
            ['place_id' => $placeId],
            [
                'name' => $displayName,
                'address' => $address,
                'category_slug' => $category->slug,
                'rating' => $rating,
                'review_count' => $reviewCount,
                'price_level' => $priceLevel,
                'photo_url' => $photoUrl,
                'latitude' => $lat,
                'longitude' => $lng,
                'open_now' => null, // Not reliably available in search responses
                'description' => $description,
                'types' => $types,
            ]
        );
    }
}
