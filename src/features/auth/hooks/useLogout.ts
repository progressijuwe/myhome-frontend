'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/auth';

/**
 * Signs out and clears every cached query.
 *
 * `queryClient.clear()` rather than invalidating the session key alone: caches
 * populated while signed in may hold another user's saved properties, bookings
 * or enquiries, and leaving those readable after a sign-out is a real leak on
 * a shared machine.
 */
export function useLogout() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.logout(),
        /* `authService.logout` clears the token even when the request fails, so
           settle rather than success — a network blip must not strand someone
           in a half-signed-out state. */
        onSettled: () => {
            queryClient.clear();
            router.push(ROUTES.home);
            router.refresh();
        },
    });
}
