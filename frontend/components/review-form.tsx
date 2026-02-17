'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/star-rating'
import { submitReview } from '@/lib/api'

interface ReviewFormProps {
    businessId: string
    translations: {
        yourRating: string
        yourReview: string
        placeholder: string
        submit: string
        thankYou: string
    }
}

export function ReviewForm({ businessId, translations }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (rating === 0 || !comment.trim()) return

        setIsSubmitting(true)
        try {
            await submitReview({
                businessId,
                rating,
                comment: comment.trim(),
            })
            setSubmitted(true)
            setRating(0)
            setComment('')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="border-border/50 bg-muted/30 rounded-lg border p-6 text-center">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ {translations.thankYou}
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">{translations.yourRating}</label>
                <StarRating rating={rating} size="lg" interactive onRatingChange={setRating} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">{translations.yourReview}</label>
                <Textarea
                    placeholder={translations.placeholder}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="resize-none"
                />
            </div>
            <Button
                type="submit"
                disabled={rating === 0 || !comment.trim() || isSubmitting}
                className="w-full"
            >
                {isSubmitting ? '...' : translations.submit}
            </Button>
        </form>
    )
}
