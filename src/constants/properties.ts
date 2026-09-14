import type { ListingType, PropertyType } from '@/types';

/**
 * Labels for the API's property enums. Kept in `constants/` rather than inside
 * a feature because the landing page, the browse page and the company's own
 * listings all need the same words for the same values.
 */
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    flat_apartment: 'Flat / Apartment',
    duplex: 'Duplex',
    semi_detached_duplex: 'Semi-detached duplex',
    terrace: 'Terrace',
    bungalow: 'Bungalow',
    land: 'Land',
};

/** Browse order, which is not the enum's declaration order. */
export const PROPERTY_TYPES: readonly PropertyType[] = [
    'flat_apartment',
    'duplex',
    'semi_detached_duplex',
    'terrace',
    'bungalow',
    'land',
];

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
    sale: 'For sale',
    rent: 'For rent',
};

export const MAX_BEDROOMS = 20;
