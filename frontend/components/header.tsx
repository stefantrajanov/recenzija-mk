'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { Locale } from '@/i18n/routing'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { Globe, Menu, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

export function Header() {
    const t = useTranslations('nav')
    const heroT = useTranslations('hero')
    const locale = useLocale() as Locale
    const router = useRouter()
    const pathname = usePathname()
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery('')
        }
    }

    function switchLocale(newLocale: Locale) {
        router.replace(pathname, { locale: newLocale })
    }

    return (
        <header className="border-border/40 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-xl font-bold tracking-tight"
                    >
                        <span className="sm:inline">Recenzija.mk</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden items-center gap-6 md:flex">
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                        >
                            {t('home')}
                        </Link>
                        <Link
                            href="/explore"
                            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                        >
                            {t('explore')}
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center justify-between">
                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden max-w-xs flex-1 px-6 md:flex">
                        <div className="relative w-full">
                            <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder={heroT('searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 pl-8 text-sm"
                            />
                        </div>
                    </form>
                    <div className="flex items-center">
                        {/* Right side */}
                        <div className="flex items-center">
                            {/* Language Switcher */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                                        <Globe className="h-3.5 w-3.5" />
                                        {locale.toUpperCase()}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => switchLocale('en')}
                                        className={locale === 'en' ? 'font-semibold' : ''}
                                    >
                                        English
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => switchLocale('mk')}
                                        className={locale === 'mk' ? 'font-semibold' : ''}
                                    >
                                        Македонски
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {/* Mobile Menu */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <div className="flex flex-col gap-6 pt-8">
                                    <form
                                        onSubmit={(e) => {
                                            handleSearch(e)
                                            setMobileMenuOpen(false)
                                        }}
                                    >
                                        <div className="relative p-5">
                                            {' '}
                                            <Input
                                                type="text"
                                                placeholder={heroT('searchPlaceholder')}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </form>
                                    <nav className="flex flex-col gap-3 p-5">
                                        <Link
                                            href="/"
                                            className="text-sm font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Button className="w-full">{t('home')}</Button>
                                        </Link>
                                        <Link
                                            href="/explore"
                                            className="text-sm font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <Button className="w-full">{t('explore')}</Button>
                                        </Link>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
