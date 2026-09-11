import type { Metadata } from 'next';

import { Hero } from '@/components/sections/Hero';
import { Showcase } from '@/components/sections/Showcase';

export const metadata: Metadata = {
    title: 'Style guide',
    description: 'Every design token and UI primitive rendered on one page.',
    robots: { index: false, follow: false },
};

/**
 * The starter's component gallery, kept here now that `/` is the landing page.
 *
 * This is the page docs/design-system.md refers to for verifying a token
 * change: load it and every token and primitive is on one page. (The theme
 * toggle it used to mention is gone — the app is light-only.)
 */
export default function StyleGuidePage() {
    return (
        <>
            <Hero />
            <Showcase />
        </>
    );
}
