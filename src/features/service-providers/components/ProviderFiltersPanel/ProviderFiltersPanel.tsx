import Form from 'next/form';
import Link from 'next/link';

import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ROUTES } from '@/constants/routes';
import { NIGERIAN_STATES, STATE_LABELS } from '@/constants/states';
import { TRADES, TRADE_LABELS } from '@/constants/trades';
import type { ServiceProviderFilters } from '@/types';

import { RESULTS_ANCHOR, hasActiveFilters } from '../../lib/parse-filters';

export interface ProviderFiltersPanelProps {
    filters: ServiceProviderFilters;
}

/**
 * The artisan filters.
 *
 * Both fields are free text because the API matches them as substrings, and
 * there is no closed list of trades the way there is of states — a new trade
 * should not need a code change to become searchable.
 *
 * next/form, not a bare <form>: it submits as a client-side navigation, which
 * is the only kind Next honours a fragment on, so applying lands on the results
 * rather than at the top of this panel. Without JavaScript it degrades to a
 * native GET submit.
 */
export function ProviderFiltersPanel({ filters }: ProviderFiltersPanelProps) {
    return (
        <Form
            action={`${ROUTES.serviceProviders}#${RESULTS_ANCHOR}`}
            className="border-border bg-card flex flex-col gap-5 rounded-xl border p-5"
        >
            <Select label="Trade" name="trade" defaultValue={filters.trade ?? ''}>
                <option value="">Any trade</option>
                {TRADES.map((trade) => (
                    <option key={trade} value={trade}>
                        {TRADE_LABELS[trade]}
                    </option>
                ))}
            </Select>

            <div className="flex flex-col gap-1.5">
                <label
                    htmlFor="filter-provider-state"
                    className="text-small text-foreground font-semibold"
                >
                    State
                </label>
                <select
                    id="filter-provider-state"
                    name="state"
                    defaultValue={filters.state ?? ''}
                    className="border-border text-small text-foreground h-10 rounded-lg border bg-transparent px-3"
                >
                    <option value="">Anywhere in Nigeria</option>
                    {NIGERIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                            {STATE_LABELS[state]}
                        </option>
                    ))}
                </select>
            </div>

            <Input
                label="Area or town"
                type="search"
                name="area"
                placeholder="Lekki, Bodija, Wuse II…"
                defaultValue={filters.area ?? ''}
                maxLength={80}
                description="Narrows within the state. Try a town or neighbourhood rather than the state itself."
            />

            <label className="flex items-center gap-2.5">
                <input
                    type="checkbox"
                    name="available"
                    defaultChecked={filters.available === true}
                    className="accent-brand size-4"
                />
                <span className="text-small">Available for work now</span>
            </label>

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
                            href={ROUTES.serviceProviders}
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
