import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import '../globals.css'

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin', 'cyrillic'],
})

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'hero' })

    return {
        title: {
            default: 'Recenzija.mk',
            template: '%s | Recenzija.mk',
        },
        description: t('subtitle'),
    }
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const messages = (await import(`../../messages/${locale}.json`)).default

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${inter.variable} bg-background min-h-screen font-sans antialiased`}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
