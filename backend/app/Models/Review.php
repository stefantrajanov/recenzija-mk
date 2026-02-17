<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'business_id',
        'author_name',
        'rating',
        'comment',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    protected static function booted(): void
    {
        static::created(function (Review $review) {
            $review->business->recalculateRating();
        });

        static::deleted(function (Review $review) {
            $review->business->recalculateRating();
        });
    }
}
