import { UtensilsCrossed, Coffee, Wrench, ShoppingBag, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Category } from '@/types/business'
import { Link } from '@/i18n/routing'

const iconMap: Record<string, LucideIcon> = {
    UtensilsCrossed,
    Coffee,
    Wrench,
    ShoppingBag,
}

interface CategoryCardProps {
    category: Category
    locale: string
    businessCountLabel: string
}

export function CategoryCard({ category, locale, businessCountLabel }: CategoryCardProps) {
    const Icon = iconMap[category.icon] ?? UtensilsCrossed
    const displayName = locale === 'mk' ? category.nameМк : category.name

    return (
        <Link href={`/category/${category.slug}`}>
            <Card className="group border-border/50 border transition-all duration-300 hover:border-blue-500/30 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:group-hover:bg-blue-950">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold tracking-tight">{displayName}</h3>
                        <p className="text-muted-foreground text-sm">{businessCountLabel}</p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
