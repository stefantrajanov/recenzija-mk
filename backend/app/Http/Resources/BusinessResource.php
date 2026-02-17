<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BusinessResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'placeId' => $this->place_id,
            'name' => $this->name,
            'address' => $this->address,
            'category' => $this->category?->name,
            'categorySlug' => $this->category_slug,
            'rating' => (float) $this->rating,
            'reviewCount' => (int) $this->review_count,
            'priceLevel' => $this->price_level,
            'photoUrl' => $this->photo_url,
            'location' => [
                'lat' => (float) $this->latitude,
                'lng' => (float) $this->longitude,
            ],
            'openNow' => $this->open_now,
            'description' => $this->description,
            'distance' => $this->when(isset($this->distance), fn () => round((float) $this->distance, 2)),
        ];
    }
}
