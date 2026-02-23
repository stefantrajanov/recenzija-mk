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
        'Restaurants in Skopje' => ['name' => 'Restaurants', 'name_mk' => 'Ресторани', 'slug' => 'restaurants', 'icon' => 'UtensilsCrossed', 'types' => ['restaurant']],
        'Cafes in Skopje' => ['name' => 'Cafes', 'name_mk' => 'Кафулиња', 'slug' => 'cafes', 'icon' => 'Coffee', 'types' => ['cafe']],
        'Auto services in Skopje' => ['name' => 'Auto Services', 'name_mk' => 'Автомеханичари', 'slug' => 'auto-services', 'icon' => 'Wrench', 'types' => ['car_repair']],
        'Shopping in Skopje' => ['name' => 'Shopping', 'name_mk' => 'Шопинг', 'slug' => 'shopping', 'icon' => 'ShoppingBag', 'types' => ['shopping_mall', 'store']],
        'Supermarkets in Skopje' => ['name' => 'Supermarkets', 'name_mk' => 'Маркети', 'slug' => 'supermarkets', 'icon' => 'ShoppingCart', 'types' => ['supermarket', 'grocery_or_supermarket']],
        'Pharmacies in Skopje' => ['name' => 'Pharmacies', 'name_mk' => 'Аптеки', 'slug' => 'pharmacies', 'icon' => 'Pill', 'types' => ['pharmacy']],
        'Gyms in Skopje' => ['name' => 'Gyms', 'name_mk' => 'Теретани', 'slug' => 'gyms', 'icon' => 'Dumbbell', 'types' => ['gym']],
        'Hotels in Skopje' => ['name' => 'Hotels', 'name_mk' => 'Хотели', 'slug' => 'hotels', 'icon' => 'BedDouble', 'types' => ['lodging']],
        'Hospitals in Skopje' => ['name' => 'Hospitals', 'name_mk' => 'Болници', 'slug' => 'hospitals', 'icon' => 'Hospital', 'types' => ['hospital']],
        'Banks in Skopje' => ['name' => 'Banks', 'name_mk' => 'Банки', 'slug' => 'banks', 'icon' => 'Landmark', 'types' => ['bank']],
        'Hair Salons in Skopje' => ['name' => 'Hair Salons', 'name_mk' => 'Фризерници', 'slug' => 'hair-salons', 'icon' => 'Scissors', 'types' => ['hair_care']],
        'Bakeries in Skopje' => ['name' => 'Bakeries', 'name_mk' => 'Пекари', 'slug' => 'bakeries', 'icon' => 'Croissant', 'types' => ['bakery']],
        'Dentists in Skopje' => ['name' => 'Dentists', 'name_mk' => 'Заболекари', 'slug' => 'dentists', 'icon' => 'Stethoscope', 'types' => ['dentist']],
        'Bars in Skopje' => ['name' => 'Bars', 'name_mk' => 'Барови', 'slug' => 'bars', 'icon' => 'Beer', 'types' => ['bar']],
        'Electronics in Skopje' => ['name' => 'Electronics', 'name_mk' => 'Електроника', 'slug' => 'electronics', 'icon' => 'Laptop', 'types' => ['electronics_store']],
        'Bookstores in Skopje' => ['name' => 'Bookstores', 'name_mk' => 'Книжарници', 'slug' => 'bookstores', 'icon' => 'BookOpen', 'types' => ['book_store']],
        'Museums in Skopje' => ['name' => 'Museums', 'name_mk' => 'Музеи', 'slug' => 'museums', 'icon' => 'Landmark', 'types' => ['museum']],
        'Parks in Skopje' => ['name' => 'Parks', 'name_mk' => 'Паркови', 'slug' => 'parks', 'icon' => 'TreePine', 'types' => ['park']],
        'Gas Stations in Skopje' => ['name' => 'Gas Stations', 'name_mk' => 'Бензински пумпи', 'slug' => 'gas-stations', 'icon' => 'Fuel', 'types' => ['gas_station']],
        'Cinemas in Skopje' => ['name' => 'Cinemas', 'name_mk' => 'Кина', 'slug' => 'cinemas', 'icon' => 'Film', 'types' => ['movie_theater']],
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
                'radius' => 50000.0,
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
                10000.0,
                $categoryDef['types'],
                20
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
