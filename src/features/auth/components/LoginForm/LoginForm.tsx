'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/lib/api-error';
import { applyServerFieldErrors } from '@/lib/form-errors';
import { authService } from '@/services/auth';
import { loginSchema, type LoginInput } from '@/validators/auth';

import { AccountStateNotice } from '../AccountStateNotice';

const FIELDS = ['email', 'password'] as const;

/**
 * Only same-origin paths are honoured, so a crafted `?next=https://evil.test`
 * cannot turn the login page into an open redirect.
 */
function safeNext(value: string | null): string {
    if (!value || !value.startsWith('/') || value.startsWith('//')) return ROUTES.home;
    return value;
}

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = safeNext(searchParams.get('next'));

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { email: '', password: '' },
    });

    const mutation = useMutation({
        mutationFn: (values: LoginInput) => authService.login(values),
        onSuccess: () => {
            router.push(next);
            /* The header reads the session on the server, so the new token only
               shows up after the cache for the destination is refreshed. */
            router.refresh();
        },
        onError: (error) => applyServerFieldErrors<LoginInput>(error, setError, FIELDS),
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    const error = mutation.error instanceof ApiError ? mutation.error : null;

    /* Field-level messages are already rendered inline; don't repeat them. */
    const showBanner = mutation.isError && !error?.isValidationError;

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {showBanner ? <AccountStateNotice error={error} /> : null}

            <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
            />

            <div className="flex flex-col gap-1.5">
                <Input
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    error={errors.password?.message}
                    {...register('password')}
                />
                <Link
                    href={ROUTES.forgotPassword}
                    className="text-caption text-muted-foreground hover:text-brand focus-visible:ring-ring self-end rounded-sm outline-none focus-visible:ring-[3px]"
                >
                    Forgot your password?
                </Link>
            </div>

            <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isSubmitting || mutation.isPending}
                loadingLabel="Signing you in"
                className="bg-brand text-brand-foreground hover:bg-brand-hover mt-2"
            >
                Log in
            </Button>
        </form>
    );
}
