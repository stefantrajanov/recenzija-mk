<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    /**
     * List all categories with business counts.
     */
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::withCount('businesses')->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Get a single category by slug.
     */
    public function show(string $slug): CategoryResource
    {
        $category = Category::where('slug', $slug)
            ->withCount('businesses')
            ->firstOrFail();

        return new CategoryResource($category);
    }
}
