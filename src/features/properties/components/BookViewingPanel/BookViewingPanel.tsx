'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { CalendarCheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { useSession } from '@/features/auth';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { applyServerFieldErrors } from '@/lib/form-errors';
import { bookingsService } from '@/services/bookings';
import {
    VIEWING_CLOSES_AT,
    VIEWING_OPENS_AT,
    bookViewingSchema,
    todayIso,
    type BookViewingInput,
} from '@/validators/booking';

const FIELDS = ['requested_date', 'requested_time'] as const;

export interface BookViewingPanelProps {
    propertyId: number;
}

/**
 * Request a viewing for this listing.
 *
 * Only individuals can book — an agency or a private owner has no use for it,
 * and the API refuses them — so the panel adapts rather than offering a button
 * that will fail. Signed-out visitors get a sign-in link that returns them
 * here afterwards.
 */
export function BookViewingPanel({ propertyId }: BookViewingPanelProps) {
    const { user, isLoading } = useSession();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<BookViewingInput>({
        resolver: zodResolver(bookViewingSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { requested_date: '', requested_time: '10:00' },
    });

    const mutation = useMutation({
        mutationFn: (values: BookViewingInput) =>
            bookingsService.requestViewing(propertyId, values),
        onError: (error) => applyServerFieldErrors<BookViewingInput>(error, setError, FIELDS),
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    if (isLoading) {
        return (
            <div className="border-border flex justify-center rounded-xl border p-6">
                <Spinner />
                <span className="sr-only">Checking your session</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="border-border flex flex-col gap-3 rounded-xl border p-6">
                <p className="text-body text-foreground font-semibold">Book a viewing</p>
                <Text size="small" muted>
                    Log in to arrange a time with the agent. You can propose another time if theirs
                    doesn&apos;t suit you.
                </Text>
                <Button
                    asChild
                    size="lg"
                    fullWidth
                    className="bg-brand text-brand-foreground hover:bg-brand-hover mt-1"
                >
                    <Link
                        href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.property(propertyId))}`}
                    >
                        Log in to book
                    </Link>
                </Button>
            </div>
        );
    }

    if (user.role !== 'individual') {
        return (
            <div className="border-border flex flex-col gap-2 rounded-xl border p-6">
                <p className="text-body text-foreground font-semibold">Book a viewing</p>
                <Text size="small" muted>
                    Viewings are booked by people looking for a property. Your account lists and
                    manages them instead.
                </Text>
            </div>
        );
    }

    if (mutation.isSuccess) {
        return (
            <Alert variant="success">
                <AlertTitle>Viewing requested</AlertTitle>
                <AlertDescription className="flex flex-col items-start gap-2">
                    {mutation.data.message}
                    <Link
                        href={ROUTES.bookings}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        See your bookings
                    </Link>
                </AlertDescription>
            </Alert>
        );
    }

    const error = mutation.error instanceof ApiError ? mutation.error : null;
    const showBanner = mutation.isError && !error?.isValidationError;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className="border-border flex flex-col gap-4 rounded-xl border p-6"
        >
            <div>
                <p className="text-body text-foreground font-semibold">Book a viewing</p>
                <Text size="small" muted className="mt-1">
                    Viewings run {VIEWING_OPENS_AT}–{VIEWING_CLOSES_AT}. The agent can propose
                    another time, and so can you.
                </Text>
            </div>

            {showBanner ? (
                <Alert variant="destructive">
                    <AlertTitle>Couldn&apos;t request that viewing</AlertTitle>
                    <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
            ) : null}

            <Input
                label="Date"
                type="date"
                /* The API rejects today and earlier, so don't offer them. */
                min={todayIso()}
                error={errors.requested_date?.message}
                {...register('requested_date')}
            />

            <Input
                label="Time"
                type="time"
                min={VIEWING_OPENS_AT}
                max={VIEWING_CLOSES_AT}
                step={900}
                error={errors.requested_time?.message}
                {...register('requested_time')}
            />

            <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isSubmitting || mutation.isPending}
                loadingLabel="Requesting your viewing"
                leftIcon={<CalendarCheckIcon />}
                className="bg-brand text-brand-foreground hover:bg-brand-hover"
            >
                Request viewing
            </Button>
        </form>
    );
}
