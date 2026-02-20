'use client'

import { StarRating } from '@/components/star-rating'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { submitReview } from '@/lib/api'
import { useState } from 'react'

interface ReviewFormProps {
    businessId: number
    translations: {
        yourName: string
        yourRating: string
        yourReview: string
        placeholder: string
        namePlaceholder: string
        submit: string
        thankYou: string
    }
}

export function ReviewForm({ businessId, translations }: ReviewFormProps) {
    const [authorName, setAuthorName] = useState('')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (rating === 0 || !comment.trim() || !authorName.trim()) return

        setIsSubmitting(true)
        try {
            await submitReview({
                businessId,
                authorName: authorName.trim(),
                rating,
                comment: comment.trim(),
            })
            setSubmitted(true)
            setRating(0)
            setComment('')
            setAuthorName('')
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
                <label className="text-sm font-medium">{translations.yourName}</label>
                <Input
                    type="text"
                    placeholder={translations.namePlaceholder}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                />
            </div>
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
                disabled={rating === 0 || !comment.trim() || !authorName.trim() || isSubmitting}
                className="w-full"
            >
                {isSubmitting ? '...' : translations.submit}
            </Button>
        </form>
    )
}
