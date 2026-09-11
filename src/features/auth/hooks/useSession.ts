'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { useMounted } from '@/hooks';
import { ApiError } from '@/lib/api-error';
import { getToken } from '@/lib/token-store';
import { authService } from '@/services/auth';
import type { AccountAction, User } from '@/types';

export interface Session {
    user: User | null;
    /** True until we know one way or the other. Render a placeholder, not a guess. */
    isLoading: boolean;
    isAuthenticated: boolean;
    /**
     * Set when a token exists but the account cannot use the app yet —
     * unverified, awaiting approval, rejected or locked out.
     */
    blockedBy: AccountAction | null;
    error: ApiError | null;
}

/**
 * The signed-in user, or null.
 *
 * There is no provider: every caller shares one request because TanStack Query
 * dedupes on the key. `useMounted` gates the whole thing because the token
 * lives in localStorage — reading it during render would make the server and
 * client disagree about who is signed in, which React reports as a hydration
 * error and resolves by throwing away the server's markup.
 */
export function useSession(): Session {
    const mounted = useMounted();
    const hasToken = mounted && Boolean(getToken());

    const query = useQuery({
        queryKey: queryKeys.auth.session(),
        queryFn: () => authService.profile(),
        enabled: hasToken,
        /* A rejected token will not become valid by asking again. */
        retry: false,
        staleTime: 5 * 60_000,
    });

    const error = query.error instanceof ApiError ? query.error : null;

    return {
        user: query.data ?? null,
        /* Before mount we genuinely do not know yet, so stay in the loading
           state rather than briefly claiming the user is signed out. */
        isLoading: !mounted || (hasToken && query.isPending),
        isAuthenticated: Boolean(query.data),
        blockedBy:
            error?.status === 403 || error?.status === 423 ? (error.body?.action ?? null) : null,
        error,
    };
}
