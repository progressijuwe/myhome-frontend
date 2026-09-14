import type { NigerianState } from '@/types';

/**
 * The 36 states and the FCT, mirroring App\Support\NigerianStates on the API.
 *
 * Duplicated rather than fetched: the list is closed and effectively immutable,
 * so an endpoint would add a round trip to every page that renders the filter
 * in exchange for nothing. `NigerianState` keeps the two halves in step — a key
 * that drifts from the API's is a type error here.
 */
export const STATE_LABELS: Record<NigerianState, string> = {
    abia: 'Abia',
    adamawa: 'Adamawa',
    akwa_ibom: 'Akwa Ibom',
    anambra: 'Anambra',
    bauchi: 'Bauchi',
    bayelsa: 'Bayelsa',
    benue: 'Benue',
    borno: 'Borno',
    cross_river: 'Cross River',
    delta: 'Delta',
    ebonyi: 'Ebonyi',
    edo: 'Edo',
    ekiti: 'Ekiti',
    enugu: 'Enugu',
    fct: 'Abuja (FCT)',
    gombe: 'Gombe',
    imo: 'Imo',
    jigawa: 'Jigawa',
    kaduna: 'Kaduna',
    kano: 'Kano',
    katsina: 'Katsina',
    kebbi: 'Kebbi',
    kogi: 'Kogi',
    kwara: 'Kwara',
    lagos: 'Lagos',
    nasarawa: 'Nasarawa',
    niger: 'Niger',
    ogun: 'Ogun',
    ondo: 'Ondo',
    osun: 'Osun',
    oyo: 'Oyo',
    plateau: 'Plateau',
    rivers: 'Rivers',
    sokoto: 'Sokoto',
    taraba: 'Taraba',
    yobe: 'Yobe',
    zamfara: 'Zamfara',
};

/**
 * Alphabetical by label, so the dropdown reads the way a Nigerian would scan
 * it. `fct` sorts under "Abuja", which is what people call it.
 */
export const NIGERIAN_STATES: readonly NigerianState[] = (
    Object.keys(STATE_LABELS) as NigerianState[]
).sort((a, b) => STATE_LABELS[a].localeCompare(STATE_LABELS[b]));
