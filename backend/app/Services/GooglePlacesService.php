<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GooglePlacesService
{
    private string $apiKey;

    private string $baseUrl = 'https://places.googleapis.com/v1/places';

    private string $fieldMask;

    public function __construct()
    {
        $this->apiKey = config('services.google_places.api_key');

        $this->fieldMask = implode(',', [
            'places.id',
            'places.displayName',
            'places.formattedAddress',
            'places.types',
            'places.primaryType',
            'places.priceLevel',
            'places.rating',
            'places.userRatingCount',
            'places.location',
            'places.editorialSummary',
            'places.photos',
        ]);
    }

    /**
     * Text Search — find places by a text query string.
     * Used for seeding the database by category.
     *
     * @return array<int, array<string, mixed>>
     */
    public function textSearch(string $query, ?array $locationBias = null): array
    {
        $body = [
            'textQuery' => $query,
            'languageCode' => 'en',
            'pageSize' => 20,
        ];

        if ($locationBias) {
            $body['locationBias'] = $locationBias;
        }

        return $this->request("{$this->baseUrl}:searchText", $body);
    }

    /**
     * Nearby Search — find places by type within a radius.
     * Used for discovering businesses near a given location.
     *
     * @param  array<int, string>  $includedTypes
     * @return array<int, array<string, mixed>>
     */
    public function nearbySearch(
        float $lat,
        float $lng,
        float $radius = 5000.0,
        array $includedTypes = [],
        int $maxResults = 20
    ): array {
        $body = [
            'locationRestriction' => [
                'circle' => [
                    'center' => [
                        'latitude' => $lat,
                        'longitude' => $lng,
                    ],
                    'radius' => $radius,
                ],
            ],
            'maxResultCount' => $maxResults,
            'languageCode' => 'en',
        ];

        if (! empty($includedTypes)) {
            $body['includedTypes'] = $includedTypes;
        }

        return $this->request("{$this->baseUrl}:searchNearby", $body);
    }

    /**
     * Execute a POST request to the Google Places API.
     *
     * @return array<int, array<string, mixed>>
     */
    private function request(string $url, array $body): array
    {
        $response = Http::withHeaders([
            'X-Goog-Api-Key' => $this->apiKey,
            'X-Goog-FieldMask' => $this->fieldMask,
        ])->post($url, $body);

        if ($response->failed()) {
            Log::error('Google Places API error', [
                'url' => $url,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return [];
        }

        return $response->json('places', []);
    }

    /**
     * Map a Google Places API price level string to integer.
     */
    public static function mapPriceLevel(?string $priceLevel): ?int
    {
        return match ($priceLevel) {
            'PRICE_LEVEL_FREE' => 0,
            'PRICE_LEVEL_INEXPENSIVE' => 1,
            'PRICE_LEVEL_MODERATE' => 2,
            'PRICE_LEVEL_EXPENSIVE' => 3,
            'PRICE_LEVEL_VERY_EXPENSIVE' => 4,
            default => null,
        };
    }

    /**
     * Extract a photo URL from the API response.
     * Returns the first photo reference or null.
     */
    public static function extractPhotoUrl(array $place): ?string
    {
        $photos = $place['photos'] ?? [];

        if (empty($photos)) {
            return null;
        }

        // The photo name is in format "places/{placeId}/photos/{photoReference}"
        $photoName = $photos[0]['name'] ?? null;

        if (! $photoName) {
            return null;
        }

        return "https://places.googleapis.com/v1/{$photoName}/media?maxWidthPx=800&key=" . config('services.google_places.api_key');
    }
}
