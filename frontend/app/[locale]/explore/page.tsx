'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { BusinessCard } from '@/components/business-card'
import { Business, Category, SearchFilters } from '@/types/business'
import { getBusinesses, getCategories } from '@/lib/api'

export default function ExplorePage() {
    const t = useTranslations('explore')
    const commonT = useTranslations('common')
    const searchParams = useSearchParams()
    const locale = useLocale()

    const [businesses, setBusinesses] = useState<Business[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [query, setQuery] = useState(searchParams.get('q') ?? '')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('rating')
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        setLoading(true)
        const filters: SearchFilters = {
            query: query || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            sortBy,
        }
        const [businessResult, categoryResult] = await Promise.all([
            getBusinesses(filters),
            getCategories(),
        ])
        setBusinesses(businessResult)
        setCategories(categoryResult)
        setLoading(false)
    }, [query, selectedCategory, sortBy])

    useEffect(() => {
        const fetch = async () => {
            await fetchData()
        }
        fetch()
    }, [fetchData])

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Title */}
            <h1 className="mb-6 text-3xl font-bold tracking-tight">{t('title')}</h1>

            {/* Filters */}
            <div className="mb-8 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder={t('filterCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allCategories')}</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug}>
                                {locale === 'mk' ? cat.nameМк : cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={sortBy}
                    onValueChange={(v) => setSortBy(v as SearchFilters['sortBy'])}
                >
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder={t('sortBy')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rating">{t('sortRating')}</SelectItem>
                        <SelectItem value="reviews">{t('sortReviews')}</SelectItem>
                        <SelectItem value="name">{t('sortName')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Results count */}
            {!loading && (
                <p className="text-muted-foreground mb-4 text-sm">
                    {t('results', { count: businesses.length })}
                </p>
            )}

            {/* Results */}
            {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-muted h-72 animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : businesses.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground">{t('noResults')}</p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {businesses.map((business) => (
                        <BusinessCard
                            key={business.id}
                            business={business}
                            reviewLabel={commonT('reviewCount', {
                                count: business.reviewCount,
                            })}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
