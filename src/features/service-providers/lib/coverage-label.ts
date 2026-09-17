import type { ServiceProviderProfile } from '@/types';

/**
 * "Lekki and Ajah, Lagos", but just "Lagos" when the coverage area already
 * names the state — an artisan covering the whole of Lagos should not read
 * "Lagos, Lagos".
 */
export function coverageLabel(profile: ServiceProviderProfile): string {
    const { service_coverage_area: area, state_label: state } = profile;

    const a = area.toLowerCase();
    const b = state.toLowerCase();

    /* Redundant in either direction: "Lekki, Lagos" already contains its state,
       and an area of "Abuja" is already named by the state label "Abuja (FCT)".
       Checking only the first case produced "Abuja, Abuja (FCT)". */
    const redundant = a.includes(b) || b.startsWith(a);

    return redundant ? area : `${area}, ${state}`;
}
