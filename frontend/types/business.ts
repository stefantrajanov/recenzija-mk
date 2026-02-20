export interface Business {
    id: number
    placeId: string
    name: string
    address: string
    category: string
    categorySlug: string
    rating: number
    reviewCount: number
    priceLevel: number | null
    photoUrl: string | null
    location: {
        lat: number
        lng: number
    }
    openNow: boolean | null
    description: string | null
    distance?: number
}

export interface Review {
    id: number
    businessId: number
    authorName: string
    rating: number
    comment: string
    createdAt: string
}

export interface Category {
    slug: string
    name: string
    nameMk: string
    icon: string
    count: number
}

export interface SearchFilters {
    query?: string
    category?: string
    sortBy?: 'rating' | 'reviews' | 'name'
}

export interface ReviewFormData {
    businessId: number
    authorName: string
    rating: number
    comment: string
}
