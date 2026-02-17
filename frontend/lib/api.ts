import { mockBusinesses, mockCategories, mockReviews } from './mock-data'
import { Business, Category, Review, ReviewFormData, SearchFilters } from '@/types/business'

/**
 * API layer for fetching business and review data.
 * Currently uses mock data. Replace implementations with actual
 * Laravel API calls when the backend is ready.
 *
 * Base URL placeholder: process.env.NEXT_PUBLIC_API_URL
 */

export async function getBusinesses(filters?: SearchFilters): Promise<Business[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    let results = [...mockBusinesses]

    if (filters?.query) {
        const query = filters.query.toLowerCase()
        results = results.filter(
            (b) =>
                b.name.toLowerCase().includes(query) ||
                b.address.toLowerCase().includes(query) ||
                b.category.toLowerCase().includes(query)
        )
    }

    if (filters?.category) {
        results = results.filter((b) => b.categorySlug === filters.category)
    }

    if (filters?.sortBy) {
        switch (filters.sortBy) {
            case 'rating':
                results.sort((a, b) => b.rating - a.rating)
                break
            case 'reviews':
                results.sort((a, b) => b.reviewCount - a.reviewCount)
                break
            case 'name':
                results.sort((a, b) => a.name.localeCompare(b.name))
                break
        }
    }

    return results
}

export async function getBusinessById(id: string): Promise<Business | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockBusinesses.find((b) => b.id === id) ?? null
}

export async function getReviewsByBusinessId(businessId: string): Promise<Review[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockReviews.filter((r) => r.businessId === businessId)
}

export async function getCategories(): Promise<Category[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockCategories
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockCategories.find((c) => c.slug === slug) ?? null
}

export async function getFeaturedBusinesses(): Promise<Business[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [...mockBusinesses].sort((a, b) => b.rating - a.rating).slice(0, 4)
}

export async function submitReview(data: ReviewFormData): Promise<Review> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newReview: Review = {
        id: `r_${Date.now()}`,
        businessId: data.businessId,
        userId: 'current_user',
        userName: 'Current User',
        userAvatar: null,
        rating: data.rating,
        comment: data.comment,
        createdAt: new Date().toISOString(),
    }

    // In production, POST to Laravel API:
    // const res = await fetch(`${API_URL}/api/reviews`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })
    // return res.json()

    return newReview
}
