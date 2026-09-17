import type { Trade } from '@/types';

/**
 * Labels for the API's trade keys, mirroring App\Support\Trades.
 *
 * Duplicated rather than fetched: the list changes rarely and an endpoint would
 * add a round trip to every page that renders the filter. `Trade` keeps the two
 * halves in step — a key that drifts from the API's is a type error here.
 */
export const TRADE_LABELS: Record<Trade, string> = {
    plumbing: 'Plumbing',
    electrical: 'Electrical',
    carpentry: 'Carpentry',
    masonry: 'Bricklaying and masonry',
    tiling: 'Tiling',
    painting: 'Painting',
    pop_ceiling: 'POP and ceilings',
    roofing: 'Roofing',
    welding: 'Welding and fabrication',
    aluminium_glazing: 'Aluminium and glazing',
    air_conditioning: 'Air conditioning',
    solar_inverter: 'Solar and inverters',
    borehole: 'Borehole and water systems',
    generator_repair: 'Generator repair',
    flooring: 'Flooring',
    furniture: 'Furniture making',
    interior_design: 'Interior design',
    landscaping: 'Landscaping and gardening',
    cleaning: 'Cleaning',
    pest_control: 'Pest control',
    security_systems: 'CCTV and security systems',
    other: 'Other',
};

/** The escape hatch. Selecting it requires saying what the trade actually is. */
export const OTHER_TRADE: Trade = 'other';

/**
 * Alphabetical by label, with "Other" pinned last — it is an escape hatch, not
 * a trade, and sorting it under O would bury it mid-list.
 */
const sorted: Trade[] = (Object.keys(TRADE_LABELS) as Trade[])
    .filter((trade) => trade !== OTHER_TRADE)
    .sort((a, b) => TRADE_LABELS[a].localeCompare(TRADE_LABELS[b]));

export const TRADES: readonly Trade[] = [...sorted, OTHER_TRADE];
