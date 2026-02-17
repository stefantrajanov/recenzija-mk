<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Business;
use App\Models\Review;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    /**
     * List reviews for a given business.
     */
    public function index(int $businessId): AnonymousResourceCollection
    {
        $business = Business::findOrFail($businessId);

        $reviews = $business->reviews()
            ->orderByDesc('created_at')
            ->get();

        return ReviewResource::collection($reviews);
    }

    /**
     * Store a new review for a business (no auth required).
     */
    public function store(StoreReviewRequest $request, int $businessId): ReviewResource
    {
        $business = Business::findOrFail($businessId);

        $review = $business->reviews()->create($request->validated());

        return new ReviewResource($review);
    }
}
