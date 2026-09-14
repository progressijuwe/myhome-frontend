'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { authService } from '@/services/auth';
import {
    registerRealEstateCompanySchema,
    type RegisterRealEstateCompanyInput,
} from '@/validators/auth';

import { AccountFields } from '../AccountFields';
import { useRegisterMutation } from '../../hooks';

const FIELDS = [
    'first_name',
    'last_name',
    'email',
    'password',
    'password_confirmation',
    'company_name',
    'cac_number',
    'contact_person_name',
    'company_address',
] as const;

export function RegisterCompanyForm() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterRealEstateCompanyInput>({
        resolver: zodResolver(registerRealEstateCompanySchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            company_name: '',
            cac_number: '',
            contact_person_name: '',
            company_address: '',
        },
    });

    const mutation = useRegisterMutation<RegisterRealEstateCompanyInput>({
        mutationFn: authService.registerRealEstateCompany,
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
                label="Company name"
                autoComplete="organization"
                placeholder="Eze Properties"
                error={errors.company_name?.message}
                {...register('company_name')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="CAC registration number"
                    placeholder="RC123456"
                    description="As registered with the Corporate Affairs Commission."
                    error={errors.cac_number?.message}
                    {...register('cac_number')}
                />
                <Input
                    label="Contact person"
                    autoComplete="name"
                    error={errors.contact_person_name?.message}
                    {...register('contact_person_name')}
                />
            </div>

            <Textarea
                label="Company address"
                rows={3}
                placeholder="12 Ahmadu Bello Way, Garki, Abuja"
                error={errors.company_address?.message}
                {...register('company_address')}
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
