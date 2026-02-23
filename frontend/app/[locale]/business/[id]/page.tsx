import { ReviewCard } from '@/components/review-card'
import { ReviewForm } from '@/components/review-form'
import { StarRating } from '@/components/star-rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link } from '@/i18n/routing'
import { getBusinessById, getReviewsByBusinessId } from '@/lib/api'
import { ArrowLeft, DollarSign, MapPin, Tag } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function BusinessPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { locale, id } = await params
    const [business, reviews] = await Promise.all([getBusinessById(id), getReviewsByBusinessId(id)])

    if (!business) {
        notFound()
    }

    const t = await getTranslations({ locale, namespace: 'business' })
    const reviewT = await getTranslations({
        locale,
        namespace: 'review',
    })
    const commonT = await getTranslations({
        locale,
        namespace: 'common',
    })

    const priceLevelDisplay = business.priceLevel ? '$'.repeat(business.priceLevel) : null

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Back link */}
            <Button variant="ghost" size="sm" className="mb-6 gap-1.5" asChild>
                <Link href="/explore">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {commonT('back')}
                </Link>
            </Button>

            {/* Business Header */}
            <div className="space-y-4">
                {/* Hero */}
                <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    {business.photoUrl ? (
                        <Image
                            src={business.photoUrl}
                            alt={business.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 896px) 100vw, 896px"
                            priority
                        />
                    ) : (
                        <span className="text-muted-foreground/20 text-7xl">
                            {business.name.charAt(0)}
                        </span>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {business.category}
                        </Badge>
                        {business.openNow !== null && (
                            <Badge
                                variant={business.openNow ? 'default' : 'secondary'}
                                className={
                                    business.openNow
                                        ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400'
                                        : ''
                                }
                            >
                                {business.openNow ? t('openNow') : t('closed')}
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight">{business.name}</h1>

                    <div className="flex items-center gap-3">
                        <StarRating rating={business.rating} size="md" />
                        <span className="text-lg font-semibold">{business.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground text-sm">
                            (
                            {commonT('reviewCount', {
                                count: business.reviewCount,
                            })}
                            )
                        </span>
                    </div>

                    <p className="text-muted-foreground">{business.description}</p>

                    {/* Details */}
                    <div className="text-muted-foreground flex flex-wrap gap-4 pt-2 text-sm">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {business.address}
                        </div>
                        {priceLevelDisplay && (
                            <div className="flex items-center gap-1.5">
                                <DollarSign className="h-4 w-4" />
                                {priceLevelDisplay}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <Tag className="h-4 w-4" />
                            {business.category}
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />

            {/* Reviews Section */}
            <div className="grid gap-8 lg:grid-cols-5">
                {/* Reviews List */}
                <div className="lg:col-span-3">
                    <h2 className="mb-4 text-xl font-bold tracking-tight">
                        {t('reviews')} ({reviews.length})
                    </h2>
                    {reviews.length === 0 ? (
                        <p className="text-muted-foreground py-8 text-center text-sm">
                            {t('noReviews')}
                        </p>
                    ) : (
                        <div>
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Review Form */}
                <div className="lg:col-span-2">
                    <h2 className="mb-4 text-xl font-bold tracking-tight">{t('writeReview')}</h2>
                    <div className="border-border/50 rounded-xl border p-5">
                        <ReviewForm
                            businessId={business.id}
                            translations={{
                                yourName: reviewT('yourName'),
                                namePlaceholder: reviewT('namePlaceholder'),
                                yourRating: reviewT('yourRating'),
                                yourReview: reviewT('yourReview'),
                                placeholder: reviewT('placeholder'),
                                submit: reviewT('submit'),
                                thankYou: reviewT('thankYou'),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
