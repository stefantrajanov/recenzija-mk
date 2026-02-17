import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StarRating } from '@/components/star-rating'
import { Review } from '@/types/business'

interface ReviewCardProps {
    review: Review
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function ReviewCard({ review }: ReviewCardProps) {
    return (
        <div className="border-border/50 flex gap-4 border-b py-5 last:border-b-0">
            <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-slate-100 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {getInitials(review.userName)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{review.userName}</span>
                        <StarRating rating={review.rating} size="sm" />
                    </div>
                    <span className="text-muted-foreground text-xs">
                        {formatDate(review.createdAt)}
                    </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
            </div>
        </div>
    )
}
