import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Geist_Mono, Public_Sans } from 'next/font/google';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { siteConfig } from '@/config/site';
import { Providers } from '@/providers';

import './globals.css';

/* `variable` exposes each font as a CSS custom property, which
   styles/tokens.css maps onto `--font-sans` / `--font-heading` / `--font-mono`.
   Both faces are variable fonts, so one request covers the whole weight range. */
const bricolage = Bricolage_Grotesque({
    variable: '--font-bricolage',
    subsets: ['latin'],
    display: 'swap',
});

const publicSans = Public_Sans({
    variable: '--font-public-sans',
    subsets: ['latin'],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    /* Required for relative OG/twitter image URLs to resolve to absolute ones. */
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        /* Child routes set only their own title; this appends the site name. */
        template: `%s · ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    openGraph: {
        type: 'website',
        locale: siteConfig.locale,
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: siteConfig.creator,
    },
    robots: {
        index: true,
        follow: true,
    },
    /* No `icons` entry: app/favicon.ico, app/icon.png and app/apple-icon.png
       are file conventions, so Next emits the link tags itself. Declaring them
       here as well would duplicate those tags. */
};

export const viewport: Viewport = {
    /* One entry: the app is light-only, so the browser chrome should not
       follow the OS preference. */
    themeColor: '#ffffff',
    colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang="en"
            className={`${publicSans.variable} ${bricolage.variable} ${geistMono.variable} h-full`}
        >
            <body className="flex min-h-full flex-col">
                <Providers>
                    {/* First tabbable element on the page: lets keyboard and
                        screen-reader users jump past the nav on every route. */}
                    <a
                        href="#main"
                        className="sr-only-focusable bg-primary text-primary-foreground focus:top-4 focus:left-4 focus:rounded-md focus:px-4 focus:py-2"
                    >
                        Skip to content
                    </a>

                    <Header />

                    {/* tabIndex={-1} makes the skip link's target focusable, so
                        focus actually moves here rather than just scrolling. */}
                    <main id="main" tabIndex={-1} className="flex-1">
                        {children}
                    </main>

                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
