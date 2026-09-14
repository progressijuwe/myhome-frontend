import { z } from 'zod';

/**
 * Viewing requests. Mirrors StoreTourBookingRequest on the API: a future date,
 * and a time inside working hours.
 */

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
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a 24-hour time, such as 09:00')
        .refine(
            (value) => value >= VIEWING_OPENS_AT && value <= VIEWING_CLOSES_AT,
            `Viewings run between ${VIEWING_OPENS_AT} and ${VIEWING_CLOSES_AT}`,
        ),
});

export type BookViewingInput = z.infer<typeof bookViewingSchema>;
