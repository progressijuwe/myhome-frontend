'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/lib/api-error';
import { authService } from '@/services/auth';
import { resendVerificationSchema, type ResendVerificationInput } from '@/validators/auth';

/**
 * Asks the API for another verification link.
 *
 * The endpoint answers identically whether or not the address is registered,
 * so this shows one neutral confirmation — echoing "we sent it" only for known
 * addresses would turn the form into an account-enumeration oracle.
 */
export function ResendVerificationForm() {
    const searchParams = useSearchParams();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResendVerificationInput>({
        resolver: zodResolver(resendVerificationSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        /* Carried over from registration so the user doesn't retype it. */
        defaultValues: { email: searchParams.get('email') ?? '' },
    });

    const mutation = useMutation({
        mutationFn: (values: ResendVerificationInput) =>
            authService.resendVerification(values.email),
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {mutation.isSuccess ? (
                <Alert variant="success">
                    <AlertTitle>Check your inbox</AlertTitle>
                    <AlertDescription>{mutation.data.message}</AlertDescription>
                </Alert>
            ) : null}

            {mutation.isError ? (
                <Alert variant="destructive">
                    <AlertTitle>Couldn&apos;t send the link</AlertTitle>
                    <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
            ) : null}

            <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
            />

            <Button
                type="submit"
                size="lg"
                fullWidth
                variant="outline"
                isLoading={isSubmitting || mutation.isPending}
                loadingLabel="Sending"
            >
                Send another link
            </Button>
        </form>
    );
}
