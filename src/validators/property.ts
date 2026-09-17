import { z } from 'zod';

import { PROPERTY_TYPES } from '@/constants/properties';
import { NIGERIAN_STATES } from '@/constants/states';

/**
 * Publishing and editing a listing. Mirrors StorePropertyRequest on the API.
 *
 * Land is the awkward case: the API stores null for bedrooms, bathrooms and
 * furnishing, and rejects them as required for everything else. The schema
 * follows the same rule rather than asking for numbers it will throw away.
 */

export const MAX_IMAGES = 5;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Accepts what Google Maps puts on the clipboard — "6.4281, 3.4219" — and
 * splits it. Asking for two numeric boxes invites transposed values, and
 * nobody knows their coordinates by heart anyway.
 */
export function parseCoordinates(input: string): { lat: number; lng: number } | null {
    const match = input.trim().match(/^(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)$/);

    if (!match) return null;

    const lat = Number(match[1]);
    const lng = Number(match[2]);

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

    return { lat, lng };
}

const imageList = z
    .custom<FileList | undefined>()
    .refine((files) => !files || files.length <= MAX_IMAGES, `Choose at most ${MAX_IMAGES} images`)
    .refine(
        (files) => !files || Array.from(files).every((file) => file.size <= MAX_IMAGE_BYTES),
        'Each image must be 5MB or smaller',
    )
    .refine(
        (files) => !files || Array.from(files).every((f) => ACCEPTED_IMAGE_TYPES.includes(f.type)),
        'Images must be JPG, PNG or WebP',
    );

const base = {
    title: z.string().trim().min(1, 'Give the listing a title').max(200),
    description: z.string().trim().min(1, 'Describe the property').max(5000),
    type: z.enum(PROPERTY_TYPES, { error: 'Choose a property type' }),
    listing_type: z.enum(['sale', 'rent'], { error: 'Is it for sale or for rent?' }),
    price: z
        .number({ error: 'Enter a price' })
        .int('Whole naira only')
        .min(1, 'Enter a price above zero'),

    /* Sent only for non-land, and the refine below enforces that. */
    bedrooms: z.number().int().min(1).max(20).optional(),
    bathrooms: z.number().int().min(1).max(20).optional(),
    is_furnished: z.boolean().optional(),
    is_distress_sale: z.boolean().optional(),

    address: z.string().trim().min(1, 'Enter the street address').max(500),
    state: z.enum(NIGERIAN_STATES, { error: 'Choose the state' }),
    city: z.string().trim().min(1, 'Enter the town or city').max(100),
    coordinates: z
        .string()
        .trim()
        .min(1, 'Paste the coordinates')
        .refine((value) => parseCoordinates(value) !== null, 'Use "6.4281, 3.4219"'),
};

/** Land has no rooms, so demanding them would block a legitimate listing. */
function roomsRequiredUnlessLand(values: {
    type: string;
    bedrooms?: number;
    bathrooms?: number;
    is_furnished?: boolean;
}) {
    if (values.type === 'land') return true;

    return (
        values.bedrooms !== undefined &&
        values.bathrooms !== undefined &&
        values.is_furnished !== undefined
    );
}

const roomsError = {
    error: 'Bedrooms, bathrooms and furnishing are required unless the listing is land',
    path: ['bedrooms'] as string[],
};

export const createPropertySchema = z
    .object({
        ...base,
        images: imageList.refine(
            (files) => files && files.length >= 1,
            'Add at least one photograph',
        ),
    })
    .refine(roomsRequiredUnlessLand, roomsError);

/** Editing keeps every field optional-on-the-wire but images stay optional. */
export const updatePropertySchema = z
    .object({ ...base, images: imageList })
    .refine(roomsRequiredUnlessLand, roomsError);

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
