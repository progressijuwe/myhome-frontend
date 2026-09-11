'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Text } from '@/components/shared/Text';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/types';

import { useSession } from '../../hooks';
import { AccountStateNotice } from '../AccountStateNotice';

export interface RequireAuthProps {
    children: ReactNode;
    /** Restrict to specific roles. Omit to allow any signed-in user. */
    roles?: readonly UserRole[];
}

/**
 * Client-side route guard.
 *
 * NOTE: this is a UX guard, not a security boundary. The token lives in
 * localStorage, so neither a Next middleware nor a server component can see it
 * — the check has to happen after hydration. Nothing here protects data; the
 * API authorises every request on its own, which is what actually matters.
 * Moving to an httpOnly cookie would allow a real server-side redirect, and
 * `lib/token-store.ts` is deliberately the only thing that would change.
 */
export function RequireAuth({ children, roles }: RequireAuthProps) {
    const { user, isLoading, isAuthenticated, blockedBy, error } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const mustSignIn = !isLoading && !isAuthenticated && !blockedBy;

    useEffect(() => {
        if (!mustSignIn) return;

        /* Carry the destination so login can return them here afterwards. */
        router.replace(`${ROUTES.login}?next=${encodeURIComponent(pathname)}`);
    }, [mustSignIn, pathname, router]);

    if (isLoading) {
        return (
            <Container className="flex justify-center py-24">
                <Spinner />
                <span className="sr-only">Checking your session</span>
            </Container>
        );
    }

    /* Signed in, but the account is not usable yet. Bouncing to login would
       loop — the credentials are fine, the account state is not — so explain
       it instead. */
    if (blockedBy) {
        return (
            <Container className="flex max-w-md flex-col gap-4 py-20">
                <AccountStateNotice error={error} />
            </Container>
        );
    }

    if (mustSignIn) {
        /* The redirect is in flight; render nothing rather than a flash of
           protected chrome. */
        return null;
    }

    if (roles && user && !roles.includes(user.role)) {
        return (
            <Container className="flex flex-col items-center gap-3 py-24 text-center">
                <Heading as="h1" size="h3">
                    You don’t have access to this page
                </Heading>
                <Text size="small" muted>
                    This area is for a different kind of account.
                </Text>
            </Container>
        );
    }

    return <>{children}</>;
}
