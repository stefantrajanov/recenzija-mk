export interface Business {
    id: string
    placeId: string
    name: string
    address: string
    category: string
    categorySlug: string
    rating: number
    reviewCount: number
    priceLevel: number | null
    photoUrl: string
    location: {
        lat: number
        lng: number
    }
    openNow: boolean | null
    description: string
}

export interface Review {
    id: string
    businessId: string
    userId: string
    userName: string
    userAvatar: string | null
    rating: number
    comment: string
    createdAt: string
}

export interface Category {
    slug: string
    name: string
    nameМк: string
    icon: string
    count: number
}

export interface SearchFilters {
    query?: string
    category?: string
    sortBy?: 'rating' | 'reviews' | 'name'
}

export interface ReviewFormData {
    businessId: string
    rating: number
    comment: string
}
