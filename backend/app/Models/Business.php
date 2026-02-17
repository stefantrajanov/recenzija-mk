<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Business extends Model
{
    protected $fillable = [
        'place_id',
        'name',
        'address',
        'category_slug',
        'rating',
        'review_count',
        'price_level',
        'photo_url',
        'latitude',
        'longitude',
        'open_now',
        'description',
        'types',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'float',
            'review_count' => 'integer',
            'price_level' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
            'open_now' => 'boolean',
            'types' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_slug', 'slug');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Recalculate rating and review_count from reviews.
     */
    public function recalculateRating(): void
    {
        $this->rating = round((float) $this->reviews()->avg('rating'), 1);
        $this->review_count = $this->reviews()->count();
        $this->saveQuietly();
    }

    // --- Query Scopes ---

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (! $search) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        });
    }

    public function scopeInCategory(Builder $query, ?string $categorySlug): Builder
    {
        if (! $categorySlug) {
            return $query;
        }

        return $query->where('category_slug', $categorySlug);
    }

    public function scopeNearby(Builder $query, float $lat, float $lng, float $radiusKm = 10): Builder
    {
        // Haversine formula for SQLite — use whereRaw instead of HAVING
        // since SQLite doesn't support HAVING on non-aggregate queries
        $haversine = "(6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(?)) +
            sin(radians(?)) * sin(radians(latitude))
        ))";

        return $query
            ->selectRaw("*, {$haversine} as distance", [$lat, $lng, $lat])
            ->whereRaw("{$haversine} <= ?", [$lat, $lng, $lat, $radiusKm])
            ->orderBy('distance');
    }

    public function scopeSorted(Builder $query, ?string $sortBy): Builder
    {
        return match ($sortBy) {
            'name' => $query->orderBy('name'),
            'reviews' => $query->orderByDesc('review_count'),
            'price' => $query->orderBy('price_level'),
            default => $query->orderByDesc('rating'),
        };
    }
}
