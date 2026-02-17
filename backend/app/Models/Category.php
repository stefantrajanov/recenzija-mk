<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'name_mk',
        'slug',
        'icon',
    ];

    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class, 'category_slug', 'slug');
    }
}
