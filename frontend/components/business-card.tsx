import { MapPin } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/star-rating'
import { Business } from '@/types/business'
import { Link } from '@/i18n/routing'

interface BusinessCardProps {
    business: Business
    reviewLabel: string
}

function getPriceLevelDisplay(level: number | null): string {
    if (level === null) return ''
    return '$'.repeat(level)
}

export function BusinessCard({ business, reviewLabel }: BusinessCardProps) {
    return (
        <Link href={`/business/${business.id}`}>
            <Card className="group border-border/50 bg-card hover:border-border h-full overflow-hidden border transition-all duration-300 hover:shadow-lg">
                <div className="bg-muted relative h-44 w-full overflow-hidden">
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <span className="text-muted-foreground/30 text-4xl">
                            {business.name.charAt(0)}
                        </span>
                    </div>
                    {business.priceLevel && (
                        <Badge
                            variant="secondary"
                            className="bg-background/90 absolute top-3 right-3 backdrop-blur-sm"
                        >
                            {getPriceLevelDisplay(business.priceLevel)}
                        </Badge>
                    )}
                </div>
                <CardHeader className="pb-2">
                    <h3 className="line-clamp-1 text-lg font-semibold tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {business.name}
                    </h3>
                    <Badge variant="outline" className="w-fit text-xs font-normal">
                        {business.category}
                    </Badge>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex items-center gap-2">
                        <StarRating rating={business.rating} size="sm" />
                        <span className="text-sm font-medium">{business.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground text-xs">({reviewLabel})</span>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{business.address}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
