import type { ReactNode } from 'react';

import { Logo } from '@/components/shared/Logo';
import { Container } from '@/components/shared/Container';

/**
 * Chrome for the auth screens: the logo, centred, and nothing else.
 *
 * The site header and footer are suppressed for these routes by ChromeGate in
 * the root layout, so there is no nav to wander off into mid-signup.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Container className="flex flex-col items-center py-10 sm:py-14">
            <Logo className="h-10" />

            <div className="mt-10 flex w-full justify-center sm:mt-12">{children}</div>
        </Container>
    );
}
