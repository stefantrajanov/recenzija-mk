'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
    rating: number
    maxStars?: number
    size?: 'sm' | 'md' | 'lg'
    interactive?: boolean
    onRatingChange?: (rating: number) => void
}

const sizeMap = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4.5 w-4.5',
    lg: 'h-6 w-6',
}

export function StarRating({
    rating,
    maxStars = 5,
    size = 'md',
    interactive = false,
    onRatingChange,
}: StarRatingProps) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: maxStars }, (_, i) => {
                const starIndex = i + 1
                const filled = starIndex <= Math.round(rating)
                return (
                    <Star
                        key={i}
                        className={cn(
                            sizeMap[size],
                            filled
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground/40 fill-transparent',
                            interactive && 'cursor-pointer transition-colors hover:text-yellow-400'
                        )}
                        onClick={
                            interactive && onRatingChange
                                ? () => onRatingChange(starIndex)
                                : undefined
                        }
                    />
                )
            })}
        </div>
    )
}
