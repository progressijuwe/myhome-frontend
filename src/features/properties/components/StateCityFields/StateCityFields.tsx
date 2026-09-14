'use client';

import { useState } from 'react';

import { NIGERIAN_STATES, STATE_LABELS } from '@/constants/states';
import type { CityOption, NigerianState } from '@/types';

const SELECT =
    'border-border text-small text-foreground h-10 rounded-lg border bg-transparent px-3';

export interface StateCityFieldsProps {
    /** Every town that has listings, unscoped. Narrowed here as the state changes. */
    cities: CityOption[];
    state?: NigerianState;
    city?: string;
}

/**
 * The paired state and town selects.
 *
 * The only client component in the filter panel, and the reason is the pairing:
 * choosing Kano has to narrow the towns to Kano's before the form is submitted,
 * or the user can hand the API a combination that cannot exist. Everything else
 * on the panel stays a plain server-rendered control.
 *
 * Both keep their `name`, so the surrounding GET form submits them exactly as
 * it did when they were static selects — without JavaScript you get the full
 * town list rather than a broken control.
 */
/**
 * "Ibadan, Oyo (2)" when the list spans the country, "Ibadan (2)" once a state
 * is chosen — and never "Lagos, Lagos", since a town that shares its state's
 * name gains nothing from the suffix.
 */
function optionLabel(option: CityOption, withState: boolean): string {
    const stateLabel = STATE_LABELS[option.state];
    const redundant = stateLabel.startsWith(option.city);

    return withState && !redundant
        ? `${option.city}, ${stateLabel} (${option.total})`
        : `${option.city} (${option.total})`;
}

export function StateCityFields({
    cities,
    state: initialState,
    city: initialCity,
}: StateCityFieldsProps) {
    const [state, setState] = useState<NigerianState | ''>(initialState ?? '');
    const [city, setCity] = useState(initialCity ?? '');

    const available = state === '' ? cities : cities.filter((option) => option.state === state);

    function onStateChange(next: NigerianState | '') {
        setState(next);

        /* The chosen town may not be in the new state — Abeokuta is not in Kano
           — so it is cleared rather than left to contradict the state. */
        const stillValid = next === '' || cities.some((o) => o.state === next && o.city === city);

        if (!stillValid) setCity('');
    }

    function onCityChange(nextCity: string) {
        setCity(nextCity);

        /* Picking a town while "Anywhere" is selected fills the state in, so the
           two controls always agree and the town name can't be ambiguous
           between two states. */
        if (state === '' && nextCity !== '') {
            const match = cities.find((option) => option.city === nextCity);
            if (match) setState(match.state);
        }
    }

    return (
        <>
            <div className="flex flex-col gap-1.5">
                <label htmlFor="filter-state" className="text-small text-foreground font-semibold">
                    State
                </label>
                <select
                    id="filter-state"
                    name="state"
                    value={state}
                    onChange={(event) => onStateChange(event.target.value as NigerianState | '')}
                    className={SELECT}
                >
                    <option value="">Anywhere in Nigeria</option>
                    {NIGERIAN_STATES.map((option) => (
                        <option key={option} value={option}>
                            {STATE_LABELS[option]}
                        </option>
                    ))}
                </select>
            </div>

            {cities.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="filter-city"
                        className="text-small text-foreground font-semibold"
                    >
                        Town or city
                    </label>
                    <select
                        id="filter-city"
                        name="city"
                        value={city}
                        onChange={(event) => onCityChange(event.target.value)}
                        className={SELECT}
                    >
                        <option value="">Any town</option>
                        {available.map((option) => (
                            <option key={`${option.state}-${option.city}`} value={option.city}>
                                {optionLabel(option, state === '')}
                            </option>
                        ))}
                    </select>
                    <p className="text-caption text-muted-foreground">
                        {available.length === 0
                            ? 'No listings in that state yet.'
                            : 'Only towns that have listings.'}
                    </p>
                </div>
            ) : null}
        </>
    );
}
