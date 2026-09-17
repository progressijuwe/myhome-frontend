'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarClockIcon, MapPinIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_TONES } from '@/constants/bookings';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/api-error';
import { bookingsService, type TourBooking } from '@/services/bookings';
import { formatDate } from '@/utils/format';

import { CounterProposeForm } from '../CounterProposeForm';

export interface BookingCardProps {
    booking: TourBooking;
}

/** "Tue, 3 Mar 2026 at 10:00" — the slot, in one readable line. */
function slot(date: string, time: string): string {
    return `${formatDate(date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at ${time}`;
}

/**
 * One viewing request, with whatever the reader can do about it.
 *
 * The API decides what is allowed and will refuse anything else, so the buttons
 * here mirror its state machine rather than guessing: cancel while the
 * conversation is open, and accept or counter only when the agent has actually
 * proposed a time.
 */
export function BookingCard({ booking }: BookingCardProps) {
    const queryClient = useQueryClient();
    const [isCountering, setIsCountering] = useState(false);

    const refresh = () => queryClient.invalidateQueries({ queryKey: ['bookings'] });

    const cancel = useMutation({
        mutationFn: () => bookingsService.cancel(booking.id),
        onSuccess: refresh,
    });

    const accept = useMutation({
        mutationFn: () => bookingsService.acceptReschedule(booking.id),
        onSuccess: refresh,
    });

    const isOpen = ['pending', 'rescheduled', 'counter_proposed'].includes(booking.status);
    const needsResponse = booking.status === 'rescheduled';
    const busy = cancel.isPending || accept.isPending;
    const failure = cancel.error ?? accept.error;

    return (
        <li className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    {booking.property ? (
                        <>
                            <Link
                                href={ROUTES.property(booking.property.id)}
                                className="text-body text-foreground hover:text-brand font-semibold underline-offset-4 hover:underline"
                            >
                                {booking.property.title}
                            </Link>
                            <p className="text-caption text-muted-foreground mt-1 ml-1.5 inline-flex items-center gap-1.5">
                                <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
                                {booking.property.address}
                            </p>
                        </>
                    ) : (
                        <p className="text-body text-muted-foreground font-semibold">
                            This listing is no longer available
                        </p>
                    )}
                </div>

                <Badge variant={BOOKING_STATUS_TONES[booking.status]}>
                    {BOOKING_STATUS_LABELS[booking.status]}
                </Badge>
            </div>

            <div className="text-small text-foreground inline-flex items-center gap-2">
                <CalendarClockIcon aria-hidden="true" className="text-muted-foreground size-4" />
                {/* Once approved the API overwrites the requested slot with the
                    agreed one, so this line is always the time that stands. */}
                {slot(booking.requested_date, booking.requested_time)}
            </div>

            {/* The agent proposed something else — show both, so the reader can
                compare before choosing. */}
            {needsResponse && booking.rescheduled_date && booking.rescheduled_time ? (
                <Alert variant="warning">
                    <AlertDescription className="flex flex-col gap-1">
                        <span>
                            The agent suggested{' '}
                            <b className="font-semibold">
                                {slot(booking.rescheduled_date, booking.rescheduled_time)}
                            </b>{' '}
                            instead.
                        </span>
                        {booking.reschedule_note ? (
                            <span className="text-muted-foreground">
                                “{booking.reschedule_note}”
                            </span>
                        ) : null}
                    </AlertDescription>
                </Alert>
            ) : null}

            {booking.status === 'counter_proposed' &&
            booking.counter_proposed_date &&
            booking.counter_proposed_time ? (
                <Text size="small" muted>
                    You proposed{' '}
                    {slot(booking.counter_proposed_date, booking.counter_proposed_time)}. Waiting
                    for the agent to confirm.
                </Text>
            ) : null}

            {booking.status === 'rejected' && booking.rejection_reason ? (
                <Text size="small" muted>
                    Reason given: {booking.rejection_reason}
                </Text>
            ) : null}

            {failure ? (
                <Alert variant="destructive">
                    <AlertDescription>{getErrorMessage(failure)}</AlertDescription>
                </Alert>
            ) : null}

            {isCountering ? (
                <CounterProposeForm bookingId={booking.id} onClose={() => setIsCountering(false)} />
            ) : isOpen ? (
                <div className="flex flex-wrap gap-2 border-t pt-4">
                    {needsResponse ? (
                        <>
                            <Button
                                onClick={() => accept.mutate()}
                                isLoading={accept.isPending}
                                loadingLabel="Confirming"
                                disabled={busy}
                                className="bg-brand text-brand-foreground hover:bg-brand-hover"
                            >
                                Accept that time
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsCountering(true)}
                                disabled={busy}
                            >
                                Propose another
                            </Button>
                        </>
                    ) : null}

                    <Button
                        variant="ghost"
                        onClick={() => cancel.mutate()}
                        isLoading={cancel.isPending}
                        loadingLabel="Cancelling"
                        disabled={busy}
                        className="text-destructive hover:text-destructive"
                    >
                        Cancel booking
                    </Button>
                </div>
            ) : null}
        </li>
    );
}
