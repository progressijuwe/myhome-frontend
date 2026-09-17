import { z } from 'zod';

/**
 * Enquiries to an artisan. Mirrors StoreServiceEnquiryRequest on the API: a
 * message, and optionally the job it is about.
 */

export const MAX_ENQUIRY_LENGTH = 1000;

export const enquirySchema = z.object({
    message: z
        .string()
        .trim()
        .min(10, 'Say a little more about what you need')
        .max(MAX_ENQUIRY_LENGTH, `Keep it under ${MAX_ENQUIRY_LENGTH} characters`),
    /* The API takes `listing_id` or nothing at all. An empty string is what a
       select posts for "no choice", so it is normalised away here rather than
       sent as a value the API would reject. */
    listing_id: z
        .union([z.coerce.number().int().positive(), z.literal('')])
        .optional()
        .transform((value) => (value === '' || value === undefined ? undefined : value)),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryPayload = z.output<typeof enquirySchema>;
