<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BusinessResource;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BusinessController extends Controller
{
    /**
     * List businesses with search, category filter, and sorting.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $businesses = Business::query()
            ->with('category')
            ->search($request->query('q'))
            ->inCategory($request->query('category'))
            ->sorted($request->query('sort', 'rating'))
            ->paginate($request->query('per_page', 20));

        return BusinessResource::collection($businesses);
    }

    /**
     * Get a single business by ID with its category.
     */
    public function show(int $id): BusinessResource
    {
        $business = Business::with('category')->findOrFail($id);

        return new BusinessResource($business);
    }

    /**
     * Get businesses nearby a given lat/lng coordinate.
     * Reads from the local database using Haversine distance.
     */
    public function nearby(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lng' => ['required', 'numeric', 'between:-180,180'],
            'radius' => ['sometimes', 'numeric', 'min:0.1', 'max:50'],
        ]);

        $businesses = Business::query()
            ->with('category')
            ->nearby(
                (float) $request->query('lat'),
                (float) $request->query('lng'),
                (float) $request->query('radius', 10)
            )
            ->limit(20)
            ->get();

        return BusinessResource::collection($businesses);
    }
}
