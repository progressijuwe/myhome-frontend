'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { isAuthRoute } from '@/constants/routes';

/**
 * Hides the site header and footer on auth screens, which supply their own
 * minimal chrome.
 *
 * The alternative — a second root layout under a route group — is what the
 * framework suggests for "a completely different UI", but navigating between
 * two root layouts forces a full page reload. That would discard the query
 * cache on every login, which is precisely where the session lives.
 *
 * `children` is passed through rather than rendered here, so Header and Footer
 * stay Server Components despite this boundary being a client one.
 */
export function ChromeGate({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    if (isAuthRoute(pathname)) return null;

    return <>{children}</>;
}
