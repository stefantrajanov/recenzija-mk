import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BusinessCard } from '@/components/business-card'
import { getCategoryBySlug, getBusinesses } from '@/lib/api'
import { Link } from '@/i18n/routing'

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>
}) {
    const { locale, slug } = await params
    const [category, businesses] = await Promise.all([
        getCategoryBySlug(slug),
        getBusinesses({ category: slug }),
    ])

    if (!category) {
        notFound()
    }

    const t = await getTranslations({
        locale,
        namespace: 'category',
    })
    const commonT = await getTranslations({
        locale,
        namespace: 'common',
    })

    const displayName = locale === 'mk' ? category.nameМк : category.name

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Back link */}
            <Button variant="ghost" size="sm" className="mb-6 gap-1.5" asChild>
                <Link href="/">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {commonT('back')}
                </Link>
            </Button>

            {/* Category Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
                <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
                <p className="text-muted-foreground mt-2 text-sm">
                    {t('businessCount', {
                        count: businesses.length,
                    })}
                </p>
            </div>

            {/* Business Grid */}
            {businesses.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground">No businesses found in this category.</p>
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
