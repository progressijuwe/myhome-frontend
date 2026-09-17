import { z } from 'zod';

/**
 * Viewing requests. Mirrors StoreTourBookingRequest on the API: a future date,
 * and a time inside working hours.
 */

/** A 24-hour clock time, which every slot in this file must match. */
const TWENTY_FOUR_HOUR = /^([01]\d|2[0-3]):[0-5]\d$/;

/** The window the API accepts, inclusive at both ends. */
export const VIEWING_OPENS_AT = '08:00';
export const VIEWING_CLOSES_AT = '17:00';

/** Today in the browser's timezone, as the API's `after:today` understands it. */
export function todayIso(): string {
    const now = new Date();
    const offsetMinutes = now.getTimezoneOffset();

    return new Date(now.getTime() - offsetMinutes * 60_000).toISOString().slice(0, 10);
}

export const bookViewingSchema = z.object({
    requested_date: z
        .string()
        .min(1, 'Pick a date')
        .refine((value) => value > todayIso(), 'Pick a date after today'),
    requested_time: z
        .string()
        .min(1, 'Pick a time')
        .regex(TWENTY_FOUR_HOUR, 'Use a 24-hour time, such as 09:00')
        .refine(
            (value) => value >= VIEWING_OPENS_AT && value <= VIEWING_CLOSES_AT,
            `Viewings run between ${VIEWING_OPENS_AT} and ${VIEWING_CLOSES_AT}`,
        ),
});

export type BookViewingInput = z.infer<typeof bookViewingSchema>;

/**
 * Proposing a different time back to the lister. Mirrors
 * CounterProposeTourBookingRequest: the same window as the original request,
 * plus an optional note explaining why.
 */
export const counterProposeSchema = z.object({
    counter_proposed_date: z
        .string()
        .min(1, 'Pick a date')
        .refine((value) => value > todayIso(), 'Pick a date after today'),
    counter_proposed_time: z
        .string()
        .min(1, 'Pick a time')
        .regex(TWENTY_FOUR_HOUR, 'Use a 24-hour time, such as 09:00')
        .refine(
            (value) => value >= VIEWING_OPENS_AT && value <= VIEWING_CLOSES_AT,
            `Viewings run between ${VIEWING_OPENS_AT} and ${VIEWING_CLOSES_AT}`,
        ),
    counter_proposed_note: z.string().trim().max(500, 'Keep it under 500 characters').optional(),
});

export type CounterProposeInput = z.infer<typeof counterProposeSchema>;

/**
 * The lister offering a different time. Mirrors RescheduleTourBookingRequest —
 * the same window as a request, plus an optional note explaining why.
 */
export const rescheduleSchema = z.object({
    rescheduled_date: z
        .string()
        .min(1, 'Pick a date')
        .refine((value) => value > todayIso(), 'Pick a date after today'),
    rescheduled_time: z
        .string()
        .min(1, 'Pick a time')
        .regex(TWENTY_FOUR_HOUR, 'Use a 24-hour time, such as 09:00')
        .refine(
            (value) => value >= VIEWING_OPENS_AT && value <= VIEWING_CLOSES_AT,
            `Viewings run between ${VIEWING_OPENS_AT} and ${VIEWING_CLOSES_AT}`,
        ),
    reschedule_note: z.string().trim().max(500, 'Keep it under 500 characters').optional(),
});

export type RescheduleInput = z.infer<typeof rescheduleSchema>;
