import type { EnquiryPayload } from '@/validators/enquiry';

import { api } from './api';

/** An enquiry, as the API's ServiceEnquiryResource returns it. */
export interface ServiceEnquiry {
    id: number;
    message: string;
    status: 'unread' | 'read' | 'replied';
    created_at: string;
}

export interface SendEnquiryResponse {
    message: string;
    enquiry: ServiceEnquiry;
}

export const enquiriesService = {
    /**
     * Send an enquiry to an artisan. Individuals only — the API rejects anyone
     * else, and refuses an enquiry addressed to yourself.
     */
    send(providerId: number, input: EnquiryPayload): Promise<SendEnquiryResponse> {
        return api.post<SendEnquiryResponse>(`/service-providers/${providerId}/enquiries`, input);
    },
};
