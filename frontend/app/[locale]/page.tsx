import { getTranslations } from 'next-intl/server'
import { SearchBar } from '@/components/search-bar'
import { BusinessCard } from '@/components/business-card'
import { CategoryCard } from '@/components/category-card'
import { getFeaturedBusinesses, getCategories } from '@/lib/api'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'hero' })
    const homeT = await getTranslations({ locale, namespace: 'home' })
    const commonT = await getTranslations({
        locale,
        namespace: 'common',
    })
    const categoryT = await getTranslations({
        locale,
        namespace: 'category',
    })

    const [featuredBusinesses, categories] = await Promise.all([
        getFeaturedBusinesses(),
        getCategories(),
    ])

    return (
        <div>
            {/* Hero Section */}
            <section className="border-border/40 via-background to-background relative overflow-hidden border-b bg-gradient-to-b from-blue-50/80 py-20 dark:from-blue-950/20">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mx-auto max-w-2xl space-y-6 text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            {t('title')}
                        </h1>
                        <p className="text-muted-foreground text-lg">{t('subtitle')}</p>
                        <div className="mx-auto max-w-lg">
                            <SearchBar
                                placeholder={t('searchPlaceholder')}
                                buttonText={t('searchButton')}
                                size="large"
                            />
                        </div>
                    </div>
                </div>
                {/* Decorative dots */}
                <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/20" />
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-slate-100/50 blur-3xl dark:bg-slate-900/20" />
            </section>

            {/* Featured Businesses */}
            <section className="mx-auto max-w-6xl px-4 py-16">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {homeT('featuredTitle')}
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {homeT('featuredSubtitle')}
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/explore" className="gap-1 text-sm">
                            {homeT('viewAll')}
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredBusinesses.map((business) => (
                        <BusinessCard
                            key={business.id}
                            business={business}
                            reviewLabel={commonT('reviewCount', {
                                count: business.reviewCount,
                            })}
                        />
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="border-border/40 bg-muted/20 border-t py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {homeT('categoriesTitle')}
                        </h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {homeT('categoriesSubtitle')}
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.slug}
                                category={category}
                                locale={locale}
                                businessCountLabel={categoryT('businessCount', {
                                    count: category.count,
                                })}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
