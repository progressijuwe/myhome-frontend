import { MAX_BEDROOMS, PROPERTY_TYPES } from '@/constants/properties';
import { NIGERIAN_STATES } from '@/constants/states';
import type { ListingType, NigerianState, PropertyFilters, PropertyType } from '@/types';

/** What a Next page receives once `searchParams` resolves. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

function positiveInt(value: string | string[] | undefined, max?: number): number | undefined {
    const raw = first(value);
    if (raw === undefined || raw.trim() === '') return undefined;

    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed < 1) return undefined;

    return max !== undefined ? Math.min(parsed, max) : parsed;
}

/** The longest address substring worth sending — beyond this it is a mistake. */
const MAX_LOCATION_LENGTH = 80;

function text(value: string | string[] | undefined): string | undefined {
    const trimmed = first(value)?.trim();
    if (!trimmed) return undefined;

    return trimmed.slice(0, MAX_LOCATION_LENGTH);
}

/** A checkbox posts `on`; a link might use `1` or `true`. Accept all three. */
function checkbox(value: string | string[] | undefined): boolean | undefined {
    const raw = first(value);
    return raw === 'on' || raw === '1' || raw === 'true' ? true : undefined;
}

/**
 * Turns the URL into the filter set the API accepts.
 *
 * Anything unrecognised is dropped rather than passed along: the API treats an
 * unknown value as a real one and would return an empty list, which reads as
 * "no properties match" instead of "that link was malformed".
 */
export function parsePropertyFilters(params: RawSearchParams): PropertyFilters {
    const type = first(params.type);
    const listingType = first(params.listing_type);
    const state = first(params.state);

    const minPrice = positiveInt(params.min_price);
    const maxPrice = positiveInt(params.max_price);

    const filters: PropertyFilters = {
        type: PROPERTY_TYPES.includes(type as PropertyType) ? (type as PropertyType) : undefined,
        listing_type:
            listingType === 'sale' || listingType === 'rent'
                ? (listingType as ListingType)
                : undefined,
        state: NIGERIAN_STATES.includes(state as NigerianState)
            ? (state as NigerianState)
            : undefined,
        city: text(params.city),
        location: text(params.location),
        min_price: minPrice,
        max_price: maxPrice,
        bedrooms: positiveInt(params.bedrooms, MAX_BEDROOMS),
        is_furnished: checkbox(params.is_furnished),
        is_distress_sale: checkbox(params.is_distress_sale),
        page: positiveInt(params.page),
    };

    /* A reversed range returns nothing at all, which looks like a broken page.
       Dropping the upper bound at least shows the cheaper matches. */
    if (filters.min_price && filters.max_price && filters.max_price < filters.min_price) {
        filters.max_price = undefined;
    }

    return filters;
}

/**
 * The id on the results column, and the fragment the pagination links carry.
 *
 * Shared so the target and the links that point at it cannot drift apart.
 */
export const RESULTS_ANCHOR = 'listings';

/** Build a `/properties` query string, dropping empties. */
export function buildPropertyQuery(filters: PropertyFilters): string {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === '') continue;
        query.set(key, value === true ? '1' : String(value));
    }

    const string = query.toString();
    return string ? `?${string}` : '';
}

/** True when anything narrows the feed — drives the "Clear filters" affordance. */
export function hasActiveFilters(filters: PropertyFilters): boolean {
    return Object.entries(filters).some(([key, value]) => key !== 'page' && value !== undefined);
}
