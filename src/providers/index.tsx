import type { ReactNode } from 'react';

import { QueryProvider } from './QueryProvider';

/**
 * Every app-wide provider, composed once and mounted in the root layout.
 *
 * This component itself is a Server Component — only the individual providers
 * carry `'use client'`. That keeps the client boundary as deep in the tree as
 * possible, so `children` passed through from the layout stay server-rendered.
 *
 * There is no theme provider: the app is light-only. See styles/globals.css.
 */
export function Providers({ children }: { children: ReactNode }) {
    return <QueryProvider>{children}</QueryProvider>;
}

export { QueryProvider } from './QueryProvider';
