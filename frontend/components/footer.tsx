import { Link } from '@/i18n/routing'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'

export function Footer() {
    const t = useTranslations('footer')
    const navT = useTranslations('nav')
    const year = new Date().getFullYear()

    return (
        <footer className="border-border/40 bg-muted/30 border-t">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Brand */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold tracking-tight">
                            <span className="text-blue-600 dark:text-blue-400">R</span>
                            ecenzija.mk
                        </h3>
                        <p className="text-muted-foreground text-sm">{t('description')}</p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">{t('quickLinks')}</h4>
                        <nav className="flex flex-col gap-2">
                            <Link
                                href="/"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                {navT('home')}
                            </Link>
                            <Link
                                href="/explore"
                                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                            >
                                {navT('explore')}
                            </Link>
                        </nav>
                    </div>
                </div>
                <Separator className="my-8" />
                <p className="text-muted-foreground text-center text-xs">
                    &copy; {year} Recenzija.mk. {t('rights')}
                </p>
            </div>
        </footer>
    )
}
