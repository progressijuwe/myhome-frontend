'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/lib/api-error';
import { authService } from '@/services/auth';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/validators/auth';

/**
 * Requests a password reset link.
 *
 * The API answers 200 with the same wording whether or not the address is
 * registered, so this shows one neutral confirmation. Saying "sent to you@…"
 * only for real accounts would make the form an account-enumeration oracle —
 * the exact thing the endpoint is written to avoid.
 *
 * The form stays on screen after success so a mistyped address can be
 * corrected without navigating away.
 */
export function ForgotPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { email: '' },
    });

    const mutation = useMutation({
        mutationFn: (values: ForgotPasswordInput) => authService.forgotPassword(values),
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
                isLoading={isSubmitting || mutation.isPending}
                loadingLabel="Sending the link"
                className="bg-brand text-brand-foreground hover:bg-brand-hover mt-2"
            >
                {mutation.isSuccess ? 'Send again' : 'Send reset link'}
            </Button>
        </form>
    );
}
