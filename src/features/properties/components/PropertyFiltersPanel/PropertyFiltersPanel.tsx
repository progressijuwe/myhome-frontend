import Form from 'next/form';
import Link from 'next/link';

import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LISTING_TYPE_LABELS, PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from '@/constants/properties';
import { ROUTES } from '@/constants/routes';
import type { CityOption, PropertyFilters } from '@/types';

import { StateCityFields } from '../StateCityFields';

import { RESULTS_ANCHOR, hasActiveFilters } from '../../lib/parse-filters';

export interface PropertyFiltersPanelProps {
    filters: PropertyFilters;
    /**
     * Every town with listings, unscoped — StateCityFields narrows it against
     * the chosen state. Empty when the lookup failed, which hides the select
     * rather than showing an empty one.
     */
    cities: CityOption[];
}

/**
 * The browse filters.
 *
 * An ordinary GET form pointed at /properties, which is why this can stay a
 * Server Component: submitting produces a shareable, bookmarkable URL, the
 * back button works, and none of it needs JavaScript. `page` is deliberately
 * not carried over — changing a filter should return you to page one.
 */
export function PropertyFiltersPanel({ filters, cities }: PropertyFiltersPanelProps) {
    return (
        <Form
            /* next/form, not a bare <form>: it submits as a client-side
               navigation, which is the only kind Next honours a fragment on —
               a native GET submit is a full document load and lands at the top
               of the page, which on mobile is the top of this panel. Without
               JavaScript it degrades to exactly that native submit. `method` is
               not supported here; a string action is always GET. */
            action={`${ROUTES.properties}#${RESULTS_ANCHOR}`}
            className="border-border bg-card flex flex-col gap-5 rounded-xl border p-5"
        >
            <fieldset className="flex flex-col gap-2">
                <legend className="text-small text-foreground mb-2 font-semibold">
                    Buying or renting
                </legend>

                <div className="flex flex-col gap-1.5">
                    {(['sale', 'rent'] as const).map((value) => (
                        <label key={value} className="flex items-center gap-2.5">
                            <input
                                type="radio"
                                name="listing_type"
                                value={value}
                                defaultChecked={filters.listing_type === value}
                                className="accent-brand size-4"
                            />
                            <span className="text-small">{LISTING_TYPE_LABELS[value]}</span>
                        </label>
                    ))}
                    <label className="flex items-center gap-2.5">
                        <input
                            type="radio"
                            name="listing_type"
                            value=""
                            defaultChecked={!filters.listing_type}
                            className="accent-brand size-4"
                        />
                        <span className="text-small">Either</span>
                    </label>
                </div>
            </fieldset>

            <StateCityFields cities={cities} state={filters.state} city={filters.city} />

            <Input
                label="Area or landmark"
                type="search"
                name="location"
                placeholder="Lekki, Bodija, Wuse II…"
                defaultValue={filters.location ?? ''}
                maxLength={80}
                description="Matches anywhere in the address."
            />

            <div className="flex flex-col gap-1.5">
                <label htmlFor="filter-type" className="text-small text-foreground font-semibold">
                    Property type
                </label>
                <select
                    id="filter-type"
                    name="type"
                    defaultValue={filters.type ?? ''}
                    className="border-border text-small text-foreground h-10 rounded-lg border bg-transparent px-3"
                >
                    <option value="">Any type</option>
                    {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {PROPERTY_TYPE_LABELS[type]}
                        </option>
                    ))}
                </select>
            </div>

            <fieldset className="flex flex-col gap-2">
                <legend className="text-small text-foreground mb-2 font-semibold">
                    Price range (₦)
                </legend>
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Min"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        name="min_price"
                        placeholder="0"
                        defaultValue={filters.min_price ?? ''}
                    />
                    <Input
                        label="Max"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        name="max_price"
                        placeholder="Any"
                        defaultValue={filters.max_price ?? ''}
                    />
                </div>
            </fieldset>

            <Input
                label="Bedrooms (minimum)"
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
                name="bedrooms"
                placeholder="Any"
                defaultValue={filters.bedrooms ?? ''}
                description="Land has no bedrooms and is excluded when set."
            />

            <fieldset className="flex flex-col gap-2">
                <legend className="text-small text-foreground mb-2 font-semibold">Only show</legend>

                <label className="flex items-center gap-2.5">
                    <input
                        type="checkbox"
                        name="is_furnished"
                        defaultChecked={filters.is_furnished === true}
                        className="accent-brand size-4"
                    />
                    <span className="text-small">Furnished</span>
                </label>

                <label className="flex items-center gap-2.5">
                    <input
                        type="checkbox"
                        name="is_distress_sale"
                        defaultChecked={filters.is_distress_sale === true}
                        className="accent-brand size-4"
                    />
                    <span className="text-small">Distress sales</span>
                </label>
            </fieldset>

            <div className="flex flex-col gap-2 border-t pt-4">
                <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    className="bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                    Apply filters
                </Button>

                {hasActiveFilters(filters) ? (
                    <Text size="small" align="center">
                        <Link
                            href={ROUTES.properties}
                            className="text-muted-foreground hover:text-brand underline underline-offset-4"
                        >
                            Clear all filters
                        </Link>
                    </Text>
                ) : null}
            </div>
        </Form>
    );
}
