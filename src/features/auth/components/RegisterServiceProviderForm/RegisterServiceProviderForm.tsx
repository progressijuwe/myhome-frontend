'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { NIGERIAN_STATES, STATE_LABELS } from '@/constants/states';
import { OTHER_TRADE, TRADES, TRADE_LABELS } from '@/constants/trades';
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
    'password',
    'password_confirmation',
    'business_name',
    'trade',
    'trade_other',
    'years_of_experience',
    'state',
    'service_coverage_area',
] as const;

export function RegisterServiceProviderForm() {
    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterServiceProviderInput>({
        resolver: zodResolver(registerServiceProviderSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            business_name: '',
            /* Undefined so the placeholder shows and a trade is chosen
               deliberately rather than defaulting to whatever sorts first. */
            trade: undefined,
            trade_other: '',
            /* Empty rather than 0 so the field starts blank; the schema coerces. */
            years_of_experience: undefined as unknown as number,
            /* Undefined rather than a state, so the placeholder shows and the
               applicant has to choose one deliberately. */
            state: undefined,
            service_coverage_area: '',
        },
    });

    const mutation = useRegisterMutation<RegisterServiceProviderInput>({
        mutationFn: authService.registerServiceProvider,
        setError,
        fields: FIELDS,
    });

    /* Naming the chosen state makes the guidance concrete, which is what
       stops an artisan in Lagos writing "Lagos" here and losing the whole
       point of having two fields.

       `useWatch` rather than `watch()`: the latter returns a function the React
       Compiler cannot memoize, so it bails out of optimising the whole form. */
    const selectedState = useWatch({ control, name: 'state' });
    const selectedTrade = useWatch({ control, name: 'trade' });

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
                <Select
                    label="Trade"
                    defaultValue=""
                    error={errors.trade?.message}
                    {...register('trade')}
                >
                    <option value="" disabled>
                        Choose a trade
                    </option>
                    {TRADES.map((trade) => (
                        <option key={trade} value={trade}>
                            {TRADE_LABELS[trade]}
                        </option>
                    ))}
                </Select>
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

            {/* The list is not authoritative, so "Other" keeps the door open
                for a trade it misses — and those words become the trade a
                reader sees on the profile. */}
            {selectedTrade === OTHER_TRADE ? (
                <Input
                    label="What trade is it?"
                    placeholder="Borehole drilling"
                    maxLength={100}
                    error={errors.trade_other?.message}
                    {...register('trade_other')}
                />
            ) : null}

            <Select
                label="State you work in"
                defaultValue=""
                error={errors.state?.message}
                {...register('state')}
            >
                <option value="" disabled>
                    Choose a state
                </option>
                {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                        {STATE_LABELS[state]}
                    </option>
                ))}
            </Select>

            <Input
                label="Towns or areas you cover"
                placeholder="Lekki, Ajah, Victoria Island"
                description={
                    selectedState
                        ? `Towns or neighbourhoods inside ${STATE_LABELS[selectedState]}, separated by commas. No need to repeat the state.`
                        : 'Towns or neighbourhoods, separated by commas. Pick your state above first.'
                }
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
