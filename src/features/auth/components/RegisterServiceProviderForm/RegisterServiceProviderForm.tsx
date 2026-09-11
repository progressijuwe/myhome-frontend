'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { authService } from '@/services/auth';
import {
    registerServiceProviderSchema,
    type RegisterServiceProviderInput,
} from '@/validators/auth';

import { AccountFields } from '../AccountFields';
import { useRegisterMutation } from '../../hooks';

const FIELDS = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'password',
    'password_confirmation',
    'business_name',
    'trade_specialty',
    'years_of_experience',
    'service_coverage_area',
] as const;

export function RegisterServiceProviderForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterServiceProviderInput>({
        resolver: zodResolver(registerServiceProviderSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            password_confirmation: '',
            business_name: '',
            trade_specialty: '',
            /* Empty rather than 0 so the field starts blank; the schema coerces. */
            years_of_experience: undefined as unknown as number,
            service_coverage_area: '',
        },
    });

    const mutation = useRegisterMutation<RegisterServiceProviderInput>({
        mutationFn: authService.registerServiceProvider,
        setError,
        fields: FIELDS,
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    const error = mutation.error instanceof ApiError ? mutation.error : null;
    const showBanner = mutation.isError && !error?.isValidationError;

    return (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {showBanner ? (
                <Alert variant="destructive">
                    <AlertTitle>Couldn&apos;t create your account</AlertTitle>
                    <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
            ) : null}

            <AccountFields register={register} errors={errors} />

            <hr className="border-border my-2" />

            <Input
                label="Business name"
                autoComplete="organization"
                placeholder="Bello Plumbing Works"
                error={errors.business_name?.message}
                {...register('business_name')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Trade"
                    placeholder="Plumbing"
                    error={errors.trade_specialty?.message}
                    {...register('trade_specialty')}
                />
                {/* `valueAsNumber` matters: without it the input hands the
                    schema a string and every value fails the number check. */}
                <Input
                    label="Years of experience"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={60}
                    placeholder="7"
                    error={errors.years_of_experience?.message}
                    {...register('years_of_experience', { valueAsNumber: true })}
                />
            </div>

            <Input
                label="Areas you cover"
                placeholder="Lekki, Ajah, Victoria Island"
                error={errors.service_coverage_area?.message}
                {...register('service_coverage_area')}
            />

            <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isSubmitting || mutation.isPending}
                loadingLabel="Creating your account"
                className="bg-brand text-brand-foreground hover:bg-brand-hover mt-2"
            >
                Create account
            </Button>
        </form>
    );
}
