import type { StaticImageData } from 'next/image';

/** Mirrors the API's `listing_type` enum. */
export type Tenure = 'sale' | 'rent';

/** Mirrors the API's property `type` enum. */
export type PropertyType =
    'flat_apartment' | 'duplex' | 'bungalow' | 'semi_detached_duplex' | 'terrace' | 'land';

/**
 * The subset of a property the landing page renders. The full shape lives with
 * the properties feature once that exists — this is deliberately narrow so the
 * marketing page does not depend on the whole model.
 */
export interface FeaturedListing {
    id: string;
    title: string;
    address: string;
    /** Whole naira. Formatted at render with `formatNaira`. */
    price: number;
    /** Rentals are quoted per year in this market. */
    period?: string;
    bedrooms: number | null;
    bathrooms: number | null;
    /** "Furnished", "C of O" — the one spec worth showing beside bed/bath. */
    detail: string;
    tenure: Tenure;
    isDistressSale: boolean;
    /**
     * Statically imported so Next knows the intrinsic size at build time and
     * can generate a blur placeholder. Becomes a plain URL string once these
     * come from the API's `images[].url`.
     */
    image: StaticImageData;
    /** What the photo shows, for anyone who cannot see it. */
    imageAlt: string;
}

export interface FeaturedProvider {
    id: string;
    businessName: string;
    trade: string;
    coverage: string;
    yearsOfExperience: number;
    averageRating: number;
    reviewsCount: number;
    initials: string;
}

/** One step of the tour-booking negotiation. */
export interface BookingStage {
    /** Tab label. */
    label: string;
    /** Who moved, e.g. "You asked for". */
    actor: string;
    slot: string;
    note: string;
    /** Booking status after this step, shown in the panel header. */
    state: string;
}
