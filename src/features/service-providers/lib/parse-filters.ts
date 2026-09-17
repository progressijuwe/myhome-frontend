import { NIGERIAN_STATES } from '@/constants/states';
import { TRADES } from '@/constants/trades';
import type { NigerianState, ServiceProviderFilters, Trade } from '@/types';

/** What a Next page receives once `searchParams` resolves. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** The id on the results column, and the fragment the pagination links carry. */
export const RESULTS_ANCHOR = 'artisans';

/** Longer than this is a mistake rather than a search. */
const MAX_TEXT_LENGTH = 80;

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

function text(value: string | string[] | undefined): string | undefined {
    const trimmed = first(value)?.trim();
    if (!trimmed) return undefined;

    return trimmed.slice(0, MAX_TEXT_LENGTH);
}

function positiveInt(value: string | string[] | undefined): number | undefined {
    const raw = first(value);
    if (raw === undefined || raw.trim() === '') return undefined;

    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed < 1) return undefined;

    return parsed;
}

/** A checkbox posts `on`; a link might use `1` or `true`. Accept all three. */
function checkbox(value: string | string[] | undefined): boolean | undefined {
    const raw = first(value);
    return raw === 'on' || raw === '1' || raw === 'true' ? true : undefined;
}

/**
 * Turns the URL into the filter set the API accepts.
 *
 * `trade` and `area` are free text on purpose — the API matches them as
 * substrings, and there is no closed list of trades the way there is of states.
 */
export function parseProviderFilters(params: RawSearchParams): ServiceProviderFilters {
    const state = first(params.state);
    const trade = first(params.trade);

    return {
        q: text(params.q),
        /* A closed list, so an unrecognised value is dropped rather than
           passed to the API to match nothing. */
        trade: TRADES.includes(trade as Trade) ? (trade as Trade) : undefined,
        state: NIGERIAN_STATES.includes(state as NigerianState)
            ? (state as NigerianState)
            : undefined,
        area: text(params.area),
        available: checkbox(params.available),
        page: positiveInt(params.page),
    };
}

/** Build a `/service-providers` query string, dropping empties. */
export function buildProviderQuery(filters: ServiceProviderFilters): string {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === '') continue;
        query.set(key, value === true ? '1' : String(value));
    }

    const string = query.toString();
    return string ? `?${string}` : '';
}

/** True when anything narrows the list — drives the "Clear filters" affordance. */
export function hasActiveFilters(filters: ServiceProviderFilters): boolean {
    return Object.entries(filters).some(([key, value]) => key !== 'page' && value !== undefined);
}
