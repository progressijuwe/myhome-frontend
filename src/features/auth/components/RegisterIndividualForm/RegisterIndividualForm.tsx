'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { authService } from '@/services/auth';
import { registerIndividualSchema, type RegisterIndividualInput } from '@/validators/auth';

import { AccountFields } from '../AccountFields';
import { useRegisterMutation } from '../../hooks';

const FIELDS = ['first_name', 'last_name', 'email', 'password', 'password_confirmation'] as const;

const DEFAULTS: RegisterIndividualInput = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
};

export function RegisterIndividualForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterIndividualInput>({
        resolver: zodResolver(registerIndividualSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: DEFAULTS,
    });

    const mutation = useRegisterMutation<RegisterIndividualInput>({
        mutationFn: authService.registerIndividual,
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
