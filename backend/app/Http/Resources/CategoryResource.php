<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'nameMk' => $this->name_mk,
            'icon' => $this->icon,
            'count' => $this->when(
                $this->businesses_count !== null,
                fn () => (int) $this->businesses_count
            ),
        ];
    }
}
