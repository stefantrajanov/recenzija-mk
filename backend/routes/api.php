<?php

use App\Http\Controllers\Api\BusinessController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

// Businesses
Route::get('/businesses/nearby', [BusinessController::class, 'nearby']);
Route::get('/businesses', [BusinessController::class, 'index']);
Route::get('/businesses/{id}', [BusinessController::class, 'show']);

// Reviews (nested under businesses)
Route::get('/businesses/{businessId}/reviews', [ReviewController::class, 'index']);
Route::post('/businesses/{businessId}/reviews', [ReviewController::class, 'store']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
