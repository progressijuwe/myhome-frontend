/**
 * Property shapes as the API returns them (see PropertyResource on the
 * backend). Field names stay snake_case to mirror the wire format.
 */

export type PropertyType =
    'flat_apartment' | 'duplex' | 'bungalow' | 'semi_detached_duplex' | 'terrace' | 'land';

export type ListingType = 'sale' | 'rent';

/** The 36 states and the FCT. Mirrors App\Support\NigerianStates. */
export type NigerianState =
    | 'abia'
    | 'adamawa'
    | 'akwa_ibom'
    | 'anambra'
    | 'bauchi'
    | 'bayelsa'
    | 'benue'
    | 'borno'
    | 'cross_river'
    | 'delta'
    | 'ebonyi'
    | 'edo'
    | 'ekiti'
    | 'enugu'
    | 'fct'
    | 'gombe'
    | 'imo'
    | 'jigawa'
    | 'kaduna'
    | 'kano'
    | 'katsina'
    | 'kebbi'
    | 'kogi'
    | 'kwara'
    | 'lagos'
    | 'nasarawa'
    | 'niger'
    | 'ogun'
    | 'ondo'
    | 'osun'
    | 'oyo'
    | 'plateau'
    | 'rivers'
    | 'sokoto'
    | 'taraba'
    | 'yobe'
    | 'zamfara';

/** `sold` listings leave the public feed but remain on the company's own list. */
export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'sold';

/** A town that has at least one public listing, as the city filter offers it. */
export interface CityOption {
    state: NigerianState;
    city: string;
    total: number;
}

/** What `GET /properties/{id}/location` returns. Signed-in callers only. */
export interface PropertyLocation {
    latitude: string | number;
    longitude: string | number;
    maps_url: string;
}

export interface PropertyImage {
    id: number;
    url: string;
    order: number;
}

export interface PropertyOwner {
    id: number;
    /** Null for a private owner — there is no company behind the listing. */
    company_name: string | null;
    /** Company name, or the person's name. Always safe to display. */
    name: string;
    is_company: boolean;
}

export interface Property {
    id: number;
    title: string;
    description: string;
    type: PropertyType;
    listing_type: ListingType;
    /** Whole naira. */
    price: number;
    /** Null for land, which has no rooms. */
    bedrooms: number | null;
    bathrooms: number | null;
    is_furnished: boolean | null;
    is_distress_sale: boolean;
    address: string;
    state: NigerianState;
    /** Display form of `state`, built by the API. */
    state_label: string;
    /** Free text, normalised by the API — "Port Harcourt". */
    city: string;
    /**
     * Exact co-ordinates are a signed-in benefit, so the API omits these three
     * for guests. They are absent, not null — a guest response must not read
     * as a listing that has no location.
     */
    latitude?: string | number;
    longitude?: string | number;
    /** Ready-made "Open in Maps" link, built by the API. */
    maps_url?: string;
    status: PropertyStatus;
    posted_by: PropertyOwner;
    /** Only present when the relation was eager loaded; empty array otherwise. */
    images?: PropertyImage[];
    created_at: string;
}

/** Query parameters `GET /api/properties` actually honours. */
export interface PropertyFilters {
    type?: PropertyType;
    /** An exact match on the listing's state. */
    state?: NigerianState;
    /** An exact match on the listing's city. */
    city?: string;
    /** Matched as a substring of the address — "Lekki", "Port Harcourt". */
    location?: string;
    listing_type?: ListingType;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
    is_furnished?: boolean;
    is_distress_sale?: boolean;
    page?: number;
}
