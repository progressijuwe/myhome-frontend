import type { Paginated } from '@/types';
import type { BookViewingInput, CounterProposeInput, RescheduleInput } from '@/validators/booking';

import { api, apiClient } from './api';

/**
 * Where a booking is in the conversation between an individual and the lister.
 *
 * `rescheduled` is the only status that puts the ball in the individual's
 * court; `counter_proposed` hands it back to the lister.
 */
export type BookingStatus =
    'pending' | 'approved' | 'rescheduled' | 'counter_proposed' | 'cancelled' | 'rejected';

/** A viewing request, as the API's TourBookingResource returns it. */
export interface TourBooking {
    id: number;
    status: BookingStatus;

    property?: {
        id: number;
        title: string;
        address: string;
    };

    /** Loaded on the lister's own list — who asked to see the property. */
    individual?: {
        id: number;
        name: string;
        email: string;
        /** Nullable: phone was removed from registration. */
        phone: string | null;
    };

    company?: {
        id: number;
        /** Null when the lister is a private owner rather than an agency. */
        company_name: string | null;
    };

    /** The agreed slot once approved; the asked-for slot before that. */
    requested_date: string;
    requested_time: string;

    /** Set when the lister proposed a different time. */
    rescheduled_date: string | null;
    rescheduled_time: string | null;
    reschedule_note: string | null;

    /** Set when the individual proposed a time back. */
    counter_proposed_date: string | null;
    counter_proposed_time: string | null;
    counter_proposed_note: string | null;

    rejection_reason: string | null;
    created_at: string;
}

export interface BookViewingResponse {
    message: string;
    booking: TourBooking;
}

export interface BookingActionResponse {
    message: string;
    booking?: TourBooking;
}

export const bookingsService = {
    /**
     * Request a viewing. Individuals only — the API rejects anyone else.
     *
     * A 422 here usually means an active booking already exists for this
     * property, which the caller should surface rather than treat as a failure
     * of the form's own fields.
     */
    requestViewing(propertyId: number, input: BookViewingInput): Promise<BookViewingResponse> {
        return api.post<BookViewingResponse>(`/properties/${propertyId}/bookings`, input);
    },

    /**
     * The signed-in individual's own bookings, newest first.
     *
     * Through `apiClient` rather than the `api` helpers so `meta` survives —
     * `api.get` unwraps the top-level `data` key and would leave the caller
     * with no total and no way to page.
     */
    async list(page?: number): Promise<Paginated<TourBooking>> {
        const response = await apiClient.get<Paginated<TourBooking>>('/user/bookings', {
            params: page ? { page } : {},
        });

        return response.data;
    },

    /**
     * The lister's own incoming requests, newest first.
     *
     * Agencies and private owners only — the API refuses everyone else.
     */
    async companyList(page?: number): Promise<Paginated<TourBooking>> {
        const response = await apiClient.get<Paginated<TourBooking>>('/company/bookings', {
            params: page ? { page } : {},
        });

        return response.data;
    },

    /** Confirm the requested slot. Valid while pending or counter-proposed. */
    approve(bookingId: number): Promise<BookingActionResponse> {
        return api.post<BookingActionResponse>(`/bookings/${bookingId}/approve`, {});
    },

    /** Offer a different time. Valid while pending, rescheduled or countered. */
    reschedule(bookingId: number, input: RescheduleInput): Promise<BookingActionResponse> {
        return api.post<BookingActionResponse>(`/bookings/${bookingId}/reschedule`, input);
    },

    /** Turn it down. The reason reaches the individual. */
    reject(bookingId: number, reason: string): Promise<BookingActionResponse> {
        return api.post<BookingActionResponse>(`/bookings/${bookingId}/reject`, { reason });
    },

    /** Allowed while pending, rescheduled or counter-proposed. */
    cancel(bookingId: number): Promise<BookingActionResponse> {
        return api.post<BookingActionResponse>(`/bookings/${bookingId}/cancel`, {});
    },

    /** Take the lister's proposed time. Only valid on a `rescheduled` booking. */
    acceptReschedule(bookingId: number): Promise<BookingActionResponse> {
        return api.post<BookingActionResponse>(`/bookings/${bookingId}/accept-reschedule`, {});
    },

    /** Propose a different time back. Only valid on a `rescheduled` booking. */
    counterPropose(bookingId: number, input: CounterProposeInput): Promise<BookingActionResponse> {
        return api.post<BookingActionResponse>(`/bookings/${bookingId}/counter-propose`, input);
    },
};
