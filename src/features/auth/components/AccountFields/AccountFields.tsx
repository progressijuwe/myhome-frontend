'use client';

import type { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/Input';
import type { AccountFieldValues } from '@/validators/auth';

export interface AccountFieldsProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
}

/**
 * The six fields every registration form collects, whatever the role.
 *
 * Generic over the form's own value type so each role can add its fields
 * without this component knowing about them. The two casts below are the price
 * of that: every accepted `T` contains these keys by construction, but
 * TypeScript cannot narrow `Path<T>` to a literal on an unresolved generic.
 */
export function AccountFields<T extends FieldValues>({ register, errors }: AccountFieldsProps<T>) {
    const field = register as unknown as UseFormRegister<AccountFieldValues>;
    const error = errors as FieldErrors<AccountFieldValues>;

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="First name"
                    autoComplete="given-name"
                    error={error.first_name?.message}
                    {...field('first_name')}
                />
                <Input
                    label="Last name"
                    autoComplete="family-name"
                    error={error.last_name?.message}
                    {...field('last_name')}
                />
            </div>

            <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={error.email?.message}
                {...field('email')}
            />

            <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                description="At least 8 characters, with upper and lower case, a number and a symbol."
                error={error.password?.message}
                {...field('password')}
            />

            <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                error={error.password_confirmation?.message}
                {...field('password_confirmation')}
            />
        </>
    );
}
