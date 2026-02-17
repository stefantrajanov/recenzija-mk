'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from '@/i18n/routing'

interface SearchBarProps {
    placeholder: string
    buttonText: string
    defaultValue?: string
    size?: 'default' | 'large'
}

export function SearchBar({
    placeholder,
    buttonText,
    defaultValue = '',
    size = 'default',
}: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue)
    const router = useRouter()

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/explore?q=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={size === 'large' ? 'h-12 pl-10 text-base' : 'h-10 pl-10'}
                />
            </div>
            <Button type="submit" className={size === 'large' ? 'h-12 px-6' : 'h-10'}>
                {buttonText}
            </Button>
        </form>
    )
}
