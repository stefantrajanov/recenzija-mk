<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->string('place_id')->unique();
            $table->string('name');
            $table->string('address');
            $table->string('category_slug');
            $table->decimal('rating', 2, 1)->default(0);
            $table->unsignedInteger('review_count')->default(0);
            $table->unsignedTinyInteger('price_level')->nullable();
            $table->string('photo_url')->nullable();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->boolean('open_now')->nullable();
            $table->text('description')->nullable();
            $table->json('types')->nullable();
            $table->timestamps();

            $table->foreign('category_slug')
                ->references('slug')
                ->on('categories')
                ->onDelete('cascade');

            $table->index(['latitude', 'longitude']);
            $table->index('category_slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
