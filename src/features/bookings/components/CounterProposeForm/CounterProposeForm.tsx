'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { applyServerFieldErrors } from '@/lib/form-errors';
import { bookingsService } from '@/services/bookings';
import {
    VIEWING_CLOSES_AT,
    VIEWING_OPENS_AT,
    counterProposeSchema,
    todayIso,
    type CounterProposeInput,
} from '@/validators/booking';

const FIELDS = ['counter_proposed_date', 'counter_proposed_time', 'counter_proposed_note'] as const;

export interface CounterProposeFormProps {
    bookingId: number;
    /** Called when the form should go away — dismissed, or sent successfully. */
    onClose: () => void;
}

/**
 * Propose a different time than the one the agent suggested.
 *
 * Only reachable from a `rescheduled` booking — the API refuses it in any other
 * state, so the parent decides whether to offer this at all.
 */
export function CounterProposeForm({ bookingId, onClose }: CounterProposeFormProps) {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CounterProposeInput>({
        resolver: zodResolver(counterProposeSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            counter_proposed_date: '',
            counter_proposed_time: '10:00',
            counter_proposed_note: '',
        },
    });

    const mutation = useMutation({
        mutationFn: (values: CounterProposeInput) =>
            bookingsService.counterPropose(bookingId, values),
        onError: (error) => applyServerFieldErrors<CounterProposeInput>(error, setError, FIELDS),
        onSuccess: () => {
            /* The booking changes status, so the list is stale the moment this
               succeeds. */
            queryClient.invalidateQueries({ queryKey: ['bookings'] });

            /* And close: leaving the form up invites a second submission, which
               the API would refuse — the booking is no longer `rescheduled`, so
               there is nothing left to counter. */
            onClose();
        },
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    const error = mutation.error instanceof ApiError ? mutation.error : null;
    const showBanner = mutation.isError && !error?.isValidationError;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className="border-border flex flex-col gap-4 border-t pt-4"
        >
            {showBanner ? (
                <Alert variant="destructive">
                    <AlertTitle>Couldn&apos;t send that time</AlertTitle>
                    <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Your date"
                    type="date"
                    min={todayIso()}
                    error={errors.counter_proposed_date?.message}
                    {...register('counter_proposed_date')}
                />
                <Input
                    label="Your time"
                    type="time"
                    min={VIEWING_OPENS_AT}
                    max={VIEWING_CLOSES_AT}
                    step={900}
                    error={errors.counter_proposed_time?.message}
                    {...register('counter_proposed_time')}
                />
            </div>

            <Textarea
                label="Note (optional)"
                rows={3}
                maxLength={500}
                placeholder="Anything the agent should know about the time you picked."
                error={errors.counter_proposed_note?.message}
                {...register('counter_proposed_note')}
            />

            <div className="flex flex-wrap gap-2">
                <Button
                    type="submit"
                    isLoading={isSubmitting || mutation.isPending}
                    loadingLabel="Sending your time"
                    className="bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                    Send this time
                </Button>
                <Button type="button" variant="ghost" onClick={onClose}>
                    Never mind
                </Button>
            </div>
        </form>
    );
}
