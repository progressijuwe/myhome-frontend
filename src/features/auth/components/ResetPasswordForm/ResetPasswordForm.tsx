'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2Icon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/api-error';
import { applyServerFieldErrors } from '@/lib/form-errors';
import { authService } from '@/services/auth';
import { resetPasswordSchema, type ResetPasswordInput } from '@/validators/auth';

/* Only the two the user can actually see and correct. A server message about
   `token` or `email` must fall through to the banner instead of being set on a
   hidden field, where it would leave the form invalid with nothing to fix. */
const VISIBLE_FIELDS = ['password', 'password_confirmation'] as const;

/**
 * Sets a new password from an emailed link.
 *
 * The token and address arrive in the query string — the API builds the link as
 * `{FRONTEND_URL}/reset-password?token=…&email=…` — and are submitted as hidden
 * values rather than asked for again.
 */
export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const email = searchParams.get('email') ?? '';

    /* Whether the last failure landed on a visible field. Drives the banner, so
       a token or email rejection is never swallowed. */
    const [handledInline, setHandledInline] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { token, email, password: '', password_confirmation: '' },
    });

    const mutation = useMutation({
        mutationFn: (values: ResetPasswordInput) => authService.resetPassword(values),
        onError: (error) => {
            setHandledInline(
                applyServerFieldErrors<ResetPasswordInput>(error, setError, VISIBLE_FIELDS),
            );
        },
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    /* A link that lost its query string cannot be completed — say so rather
       than presenting a form that is guaranteed to fail on submit. */
    if (!token || !email) {
        return (
            <div className="flex flex-col gap-4">
                <Alert variant="destructive">
                    <AlertTitle>This link is incomplete</AlertTitle>
                    <AlertDescription>
                        Open the link from your email directly, or request a new one.
                    </AlertDescription>
                </Alert>

                <Button size="lg" fullWidth asChild variant="outline">
                    <Link href={ROUTES.forgotPassword}>Request a new link</Link>
                </Button>
            </div>
        );
    }

    if (mutation.isSuccess) {
        return (
            <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle2Icon aria-hidden="true" className="text-brand size-10" />
                <div className="flex flex-col gap-2">
                    <h2 className="font-heading text-h4 text-foreground">Password updated</h2>
                    <Text size="small" muted>
                        {mutation.data.message}
                    </Text>
                </div>
                <Button
                    size="lg"
                    fullWidth
                    asChild
                    className="bg-brand text-brand-foreground hover:bg-brand-hover mt-2"
                >
                    <Link href={ROUTES.login}>Go to log in</Link>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {mutation.isError && !handledInline ? (
                <Alert variant="destructive">
                    <AlertTitle>Couldn&apos;t reset your password</AlertTitle>
                    <AlertDescription className="flex flex-col items-start gap-2">
                        {getErrorMessage(mutation.error)}
                        <Link
                            href={ROUTES.forgotPassword}
                            className="text-brand font-semibold underline underline-offset-4"
                        >
                            Request a new link
                        </Link>
                    </AlertDescription>
                </Alert>
            ) : null}

            <Text size="small" muted>
                Setting a new password for{' '}
                <span className="text-foreground font-semibold">{email}</span>.
            </Text>

            {/* Carried from the link; the user has nothing to enter here. */}
            <input type="hidden" {...register('token')} />
            <input type="hidden" {...register('email')} />

            <Input
                label="New password"
                type="password"
                autoComplete="new-password"
                description="At least 8 characters, with upper and lower case, a number and a symbol."
                error={errors.password?.message}
                {...register('password')}
            />

            <Input
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                error={errors.password_confirmation?.message}
                {...register('password_confirmation')}
            />

            <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isSubmitting || mutation.isPending}
                loadingLabel="Updating your password"
                className="bg-brand text-brand-foreground hover:bg-brand-hover mt-2"
            >
                Set new password
            </Button>
        </form>
    );
}
