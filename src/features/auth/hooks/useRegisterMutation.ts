'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { FieldValues, UseFormSetError } from 'react-hook-form';

import { ROUTES } from '@/constants/routes';
import { applyServerFieldErrors } from '@/lib/form-errors';
import type { RegisterResponse } from '@/services/auth';

interface Options<T extends FieldValues> {
    mutationFn: (values: T) => Promise<RegisterResponse>;
    setError: UseFormSetError<T>;
    /** Field names this form renders, so server messages land somewhere visible. */
    fields: readonly string[];
}

/**
 * Shared behaviour for the three registration forms.
 *
 * Registration deliberately does not sign anyone in — the API returns no token
 * because the address is unverified — so success goes to the "check your
 * inbox" screen rather than into the app. The email is carried in the query so
 * that page can offer to resend without asking for it again.
 */
export function useRegisterMutation<T extends FieldValues & { email: string }>({
    mutationFn,
    setError,
    fields,
}: Options<T>) {
    const router = useRouter();

    return useMutation({
        mutationFn,
        onSuccess: (_data, variables) => {
            router.push(`${ROUTES.verifyEmail}?email=${encodeURIComponent(variables.email)}`);
        },
        onError: (error) => applyServerFieldErrors<T>(error, setError, fields),
    });
}
