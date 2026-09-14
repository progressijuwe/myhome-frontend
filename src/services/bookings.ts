import type { BookViewingInput } from '@/validators/booking';

import { api } from './api';

/** A viewing request, as the API's TourBookingResource returns it. */
export interface TourBooking {
    id: number;
    status: 'pending' | 'approved' | 'rescheduled' | 'counter_proposed' | 'cancelled' | 'rejected';
    requested_date: string;
    requested_time: string;
}

export interface BookViewingResponse {
    message: string;
    booking: TourBooking;
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
};
