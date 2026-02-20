import { Business, Category, Review, ReviewFormData, SearchFilters } from '@/types/business'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'

/**
 * API layer — fetches data from the Laravel backend.
 */

interface PaginatedResponse<T> {
    data: T[]
    meta: {
        current_page: number
        last_page: number
        total: number
    }
}

interface SingleResponse<T> {
    data: T
}

// ─── Businesses ─────────────────────────────────────────

export async function getBusinesses(filters?: SearchFilters): Promise<Business[]> {
    const params = new URLSearchParams()

    if (filters?.query) params.set('q', filters.query)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.sortBy) params.set('sort', filters.sortBy)
    params.set('per_page', '50')

    const res = await fetch(`${API_URL}/api/businesses?${params.toString()}`, {
        next: { revalidate: 60 },
    })

    if (!res.ok) return []

    const json: PaginatedResponse<Business> = await res.json()
    return json.data
}

export async function getBusinessById(id: string): Promise<Business | null> {
    const res = await fetch(`${API_URL}/api/businesses/${id}`, {
        next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const json: SingleResponse<Business> = await res.json()
    return json.data
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
    const params = new URLSearchParams({
        sort: 'rating',
        per_page: '4',
    })

    const res = await fetch(`${API_URL}/api/businesses?${params.toString()}`, {
        next: { revalidate: 60 },
    })

    if (!res.ok) return []

    const json: PaginatedResponse<Business> = await res.json()
    return json.data
}

export async function getNearbyBusinesses(
    lat: number,
    lng: number,
    radius: number = 10
): Promise<Business[]> {
    const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radius: radius.toString(),
    })

    const res = await fetch(`${API_URL}/api/businesses/nearby?${params.toString()}`, {
        next: { revalidate: 60 },
    })

    if (!res.ok) return []

    const json: { data: Business[] } = await res.json()
    return json.data
}

// ─── Reviews ────────────────────────────────────────────

export async function getReviewsByBusinessId(businessId: string): Promise<Review[]> {
    const res = await fetch(`${API_URL}/api/businesses/${businessId}/reviews`, {
        next: { revalidate: 0 },
    })

    if (!res.ok) return []

    const json: { data: Review[] } = await res.json()
    return json.data
}

export async function submitReview(data: ReviewFormData): Promise<Review> {
    const res = await fetch(`${API_URL}/api/businesses/${data.businessId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            author_name: data.authorName,
            rating: data.rating,
            comment: data.comment,
        }),
    })

    if (!res.ok) {
        throw new Error('Failed to submit review')
    }

    const json: SingleResponse<Review> = await res.json()
    return json.data
}

// ─── Categories ─────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_URL}/api/categories`, {
        next: { revalidate: 60 },
    })

    if (!res.ok) return []

    const json: { data: Category[] } = await res.json()
    return json.data
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const res = await fetch(`${API_URL}/api/categories/${slug}`, {
        next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const json: SingleResponse<Category> = await res.json()
    return json.data
}
