import type { NavItem } from '@/types';

import { env } from './env';

/**
 * Single source of truth for the site's identity. Metadata, the header, the
 * footer and OG tags all read from here — change the name once, not in nine
 * places.
 */
export const siteConfig = {
    name: 'Myhome',
    tagline: 'Find Your Dream Property',
    /* Used verbatim as the default meta description; keep under ~155 chars. */
    description:
        'Buy, rent and view property across Nigeria. Every listing is reviewed before it goes live, and every agency is verified.',
    url: env.NEXT_PUBLIC_APP_URL,
    ogImage: '/og.png',
    locale: 'en_NG',
    creator: '@myhome',
    links: {
        support: '/contact',
    },
} as const;

export const mainNav: readonly NavItem[] = [
    { title: 'Buy', href: '/properties?listing_type=sale' },
    { title: 'Rent', href: '/properties?listing_type=rent' },
    { title: 'Services', href: '/service-providers' },
    { title: 'How it works', href: '/#how-it-works' },
] as const;

export type SiteConfig = typeof siteConfig;
