import type { NigerianState } from './property';
import type { ServiceProviderProfile } from './user';

/**
 * Artisan shapes as the API returns them (see ServiceProviderResource and
 * ServiceListingResource). Field names stay snake_case to mirror the wire
 * format.
 */

/** One photograph of an artisan's finished work. */
export interface PortfolioPhoto {
    id: number;
    url: string;
    caption: string | null;
    order: number;
}

/** A review left for an artisan by someone who hired them. */
export interface ProviderReview {
    id: number;
    /** 1 to 5. */
    rating: number;
    comment: string | null;
    reviewer?: {
        id: number;
        name: string;
        photo: string | null;
    };
    created_at: string;
}

export interface ServiceListing {
    id: number;
    title: string;
    description: string;
    /** Whole naira. An indicative price for the job, not a binding quote. */
    price: number;
    coverage_area: string;
    is_available: boolean;
    created_at: string;
}

export interface ServiceProvider {
    id: number;
    name: string;
    profile_photo: string | null;
    /**
     * Null until someone has reviewed them — a new artisan is unrated, which is
     * not the same as rated zero.
     */
    average_rating: number | null;
    reviews_count: number;
    /** Passed admin review. Always true through the public endpoints. */
    is_verified: boolean;
    /** The date they joined, as `YYYY-MM-DD`. */
    member_since: string;
    /**
     * Only present when the relation was eager loaded. Every field inside is
     * required by the API, so the optionality stops here.
     */
    profile?: ServiceProviderProfile;
    /** The detail endpoint returns only the available ones. */
    listings?: ServiceListing[];
    /** Only present on the detail endpoint. */
    portfolio?: PortfolioPhoto[];
    reviews?: ProviderReview[];
}

/** Query parameters `GET /api/service-providers` actually honours. */
export interface ServiceProviderFilters {
    /** Free text across the artisan's name, business and trade details. */
    q?: string;
    /** An exact match on the canonical trade key. */
    trade?: Trade;
    /** An exact match on the artisan's state. */
    state?: NigerianState;
    /** Substring of the coverage area, narrowing within the state. */
    area?: string;
    /** Only artisans with at least one available listing. */
    available?: boolean;
    page?: number;
}

/**
 * The trades an artisan can register under. Mirrors App\Support\Trades.
 *
 * Not authoritative — `other` is the escape hatch for a trade the list misses,
 * and carries the artisan's own words alongside it.
 */
export type Trade =
    | 'plumbing'
    | 'electrical'
    | 'carpentry'
    | 'masonry'
    | 'tiling'
    | 'painting'
    | 'pop_ceiling'
    | 'roofing'
    | 'welding'
    | 'aluminium_glazing'
    | 'air_conditioning'
    | 'solar_inverter'
    | 'borehole'
    | 'generator_repair'
    | 'flooring'
    | 'furniture'
    | 'interior_design'
    | 'landscaping'
    | 'cleaning'
    | 'pest_control'
    | 'security_systems'
    | 'other';
