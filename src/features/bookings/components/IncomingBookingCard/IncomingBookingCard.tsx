'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarClockIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { BOOKING_STATUS_TONES } from '@/constants/bookings';
import { getErrorMessage } from '@/lib/api-error';
import { bookingsService, type TourBooking } from '@/services/bookings';
import { formatDate } from '@/utils/format';
import {
    VIEWING_CLOSES_AT,
    VIEWING_OPENS_AT,
    rescheduleSchema,
    todayIso,
    type RescheduleInput,
} from '@/validators/booking';

/**
 * The same statuses read differently from this side: "pending" is the lister's
 * to answer, and "counter_proposed" means the individual has come back.
 */
const INCOMING_STATUS_LABELS: Record<string, string> = {
    pending: 'Needs your answer',
    approved: 'Confirmed',
    rescheduled: 'Waiting on them',
    counter_proposed: 'They proposed a time',
    cancelled: 'Cancelled',
    rejected: 'You declined',
};

function slot(date: string, time: string): string {
    return `${formatDate(date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at ${time}`;
}

export interface IncomingBookingCardProps {
    booking: TourBooking;
}

/**
 * One viewing request as the lister sees it.
 *
 * Mirrors the API's guards: approve and reject while it is pending or the
 * individual has countered; reschedule in those states and while they are still
 * considering a time already offered.
 */
export function IncomingBookingCard({ booking }: IncomingBookingCardProps) {
    const queryClient = useQueryClient();
    const [panel, setPanel] = useState<'none' | 'reschedule' | 'reject'>('none');
    const [reason, setReason] = useState('');

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['company-bookings'] });
        setPanel('none');
    };

    const approve = useMutation({
        mutationFn: () => bookingsService.approve(booking.id),
        onSuccess: refresh,
    });

    const reject = useMutation({
        mutationFn: () => bookingsService.reject(booking.id, reason.trim()),
        onSuccess: refresh,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RescheduleInput>({
        resolver: zodResolver(rescheduleSchema),
        defaultValues: { rescheduled_date: '', rescheduled_time: '10:00', reschedule_note: '' },
    });

    const propose = useMutation({
        mutationFn: (values: RescheduleInput) => bookingsService.reschedule(booking.id, values),
        onSuccess: refresh,
    });

    const canAnswer = ['pending', 'counter_proposed'].includes(booking.status);
    const canReschedule = ['pending', 'rescheduled', 'counter_proposed'].includes(booking.status);
    const busy = approve.isPending || reject.isPending || propose.isPending;
    const failure = approve.error ?? reject.error ?? propose.error;

    return (
        <li className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-body text-foreground font-semibold">
                        {booking.property?.title ?? 'A listing that no longer exists'}
                    </p>
                    {booking.property ? (
                        <p className="text-caption text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                            <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
                            {booking.property.address}
                        </p>
                    ) : null}
                </div>

                <Badge variant={BOOKING_STATUS_TONES[booking.status]}>
                    {INCOMING_STATUS_LABELS[booking.status] ?? booking.status}
                </Badge>
            </div>

            {booking.individual ? (
                <p className="text-small text-foreground inline-flex items-center gap-2">
                    <UserIcon aria-hidden="true" className="text-muted-foreground size-4" />
                    {booking.individual.name}
                    <span className="text-muted-foreground">· {booking.individual.email}</span>
                </p>
            ) : null}

            <div className="text-small text-foreground inline-flex items-center gap-2">
                <CalendarClockIcon aria-hidden="true" className="text-muted-foreground size-4" />
                {slot(booking.requested_date, booking.requested_time)}
            </div>

            {/* What this lister last offered. Without it the card says "Waiting
                on them" while showing only the time they were moving away
                from, which reads as though the offer never sent. */}
            {booking.status === 'rescheduled' &&
            booking.rescheduled_date &&
            booking.rescheduled_time ? (
                <Text size="small" muted>
                    You offered {slot(booking.rescheduled_date, booking.rescheduled_time)}. Waiting
                    for them to accept or propose another.
                </Text>
            ) : null}

            {/* They came back with a time of their own — that is the one to
                act on, not the original request. */}
            {booking.status === 'counter_proposed' &&
            booking.counter_proposed_date &&
            booking.counter_proposed_time ? (
                <Alert variant="warning">
                    <AlertDescription className="flex flex-col gap-1">
                        <span>
                            They proposed{' '}
                            <b className="font-semibold">
                                {slot(booking.counter_proposed_date, booking.counter_proposed_time)}
                            </b>{' '}
                            instead.
                        </span>
                        {booking.counter_proposed_note ? (
                            <span className="text-muted-foreground">
                                “{booking.counter_proposed_note}”
                            </span>
                        ) : null}
                    </AlertDescription>
                </Alert>
            ) : null}

            {failure ? (
                <Alert variant="destructive">
                    <AlertDescription>{getErrorMessage(failure)}</AlertDescription>
                </Alert>
            ) : null}

            {panel === 'reschedule' ? (
                <form
                    onSubmit={handleSubmit((values) => propose.mutateAsync(values).catch(() => {}))}
                    noValidate
                    className="border-border flex flex-col gap-4 border-t pt-4"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                            label="New date"
                            type="date"
                            min={todayIso()}
                            error={errors.rescheduled_date?.message}
                            {...register('rescheduled_date')}
                        />
                        <Input
                            label="New time"
                            type="time"
                            min={VIEWING_OPENS_AT}
                            max={VIEWING_CLOSES_AT}
                            step={900}
                            error={errors.rescheduled_time?.message}
                            {...register('rescheduled_time')}
                        />
                    </div>

                    <Textarea
                        label="Note (optional)"
                        rows={3}
                        maxLength={500}
                        placeholder="Why this time suits better."
                        error={errors.reschedule_note?.message}
                        {...register('reschedule_note')}
                    />

                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="submit"
                            isLoading={propose.isPending}
                            loadingLabel="Sending"
                            className="bg-brand text-brand-foreground hover:bg-brand-hover"
                        >
                            Offer this time
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setPanel('none')}>
                            Never mind
                        </Button>
                    </div>
                </form>
            ) : panel === 'reject' ? (
                <div className="border-border flex flex-col gap-3 border-t pt-4">
                    <Textarea
                        label="Why are you declining?"
                        rows={3}
                        maxLength={500}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Already let, the owner is unavailable, and so on."
                        description="This is sent to them."
                    />
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="destructive"
                            onClick={() => reject.mutate()}
                            isLoading={reject.isPending}
                            loadingLabel="Declining"
                            disabled={reason.trim().length === 0 || busy}
                        >
                            Confirm decline
                        </Button>
                        <Button variant="ghost" onClick={() => setPanel('none')} disabled={busy}>
                            Never mind
                        </Button>
                    </div>
                </div>
            ) : canAnswer || canReschedule ? (
                <div className="flex flex-wrap gap-2 border-t pt-4">
                    {canAnswer ? (
                        <Button
                            onClick={() => approve.mutate()}
                            isLoading={approve.isPending}
                            loadingLabel="Confirming"
                            disabled={busy}
                            className="bg-brand text-brand-foreground hover:bg-brand-hover"
                        >
                            Confirm viewing
                        </Button>
                    ) : null}

                    {canReschedule ? (
                        <Button
                            variant="outline"
                            onClick={() => setPanel('reschedule')}
                            disabled={busy}
                        >
                            Offer another time
                        </Button>
                    ) : null}

                    {canAnswer ? (
                        <Button
                            variant="ghost"
                            onClick={() => setPanel('reject')}
                            disabled={busy}
                            className="text-destructive hover:text-destructive ml-auto"
                        >
                            Decline
                        </Button>
                    ) : null}
                </div>
            ) : (
                <Text size="small" muted className="border-t pt-4">
                    Nothing to do — this one is settled.
                </Text>
            )}
        </li>
    );
}
