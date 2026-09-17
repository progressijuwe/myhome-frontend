import type { BookingStatus } from '@/services/bookings';

/**
 * Booking statuses in the reader's language, not the database's.
 *
 * Written from the individual's point of view — "Waiting on the agent" says who
 * owes the next move, which `pending` does not.
 */
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
    pending: 'Waiting on the agent',
    approved: 'Confirmed',
    rescheduled: 'New time proposed',
    counter_proposed: 'Your time sent',
    cancelled: 'Cancelled',
    rejected: 'Declined',
};

/** Badge tone per status. `warning` marks the one that needs the reader to act. */
export const BOOKING_STATUS_TONES: Record<
    BookingStatus,
    'success' | 'warning' | 'destructive' | 'secondary' | 'info'
> = {
    pending: 'info',
    approved: 'success',
    rescheduled: 'warning',
    counter_proposed: 'info',
    cancelled: 'secondary',
    rejected: 'destructive',
};

/**
 * Statuses where nothing further will happen. Used to sort the list so live
 * bookings sit above closed ones.
 */
export const CLOSED_BOOKING_STATUSES: readonly BookingStatus[] = ['cancelled', 'rejected'];
