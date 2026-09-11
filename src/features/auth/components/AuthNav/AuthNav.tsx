'use client';

import { LogOutIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

import { useLogout, useSession } from '../../hooks';

/**
 * The header's right-hand side: sign-in links, or the current user.
 *
 * Renders a fixed-width placeholder until the session resolves. The token is
 * in localStorage, so the server cannot know who — if anyone — is signed in;
 * guessing would either flash the wrong state or trip a hydration error.
 */
export function AuthNav() {
    const { user, isLoading } = useSession();
    const logout = useLogout();

    if (isLoading) {
        /* Same footprint as the resolved state, so the bar doesn't jump. */
        return <div aria-hidden="true" className="h-9 w-40" />;
    }

    if (!user) {
        return (
            <>
                <Button variant="ghost" size="lg" asChild className="hidden md:inline-flex">
                    <Link href={ROUTES.login}>Log in</Link>
                </Button>

                <Button
                    size="lg"
                    asChild
                    className="bg-brand text-brand-foreground hover:bg-brand-hover hidden md:inline-flex"
                >
                    <Link href={ROUTES.register}>Create account</Link>
                </Button>
            </>
        );
    }

    return (
        <div className="hidden items-center gap-2 md:flex">
            <Link
                href={ROUTES.dashboard}
                className="text-small text-foreground hover:text-brand focus-visible:ring-ring rounded-md px-2 py-1 font-medium outline-none focus-visible:ring-[3px]"
            >
                {user.first_name}
            </Link>

            <Button
                variant="outline"
                size="lg"
                onClick={() => logout.mutate()}
                isLoading={logout.isPending}
                loadingLabel="Signing out"
                leftIcon={<LogOutIcon />}
            >
                Log out
            </Button>
        </div>
    );
}
