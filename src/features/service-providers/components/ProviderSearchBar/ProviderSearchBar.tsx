import { SearchIcon } from 'lucide-react';
import Form from 'next/form';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import type { ServiceProviderFilters } from '@/types';

import { RESULTS_ANCHOR } from '../../lib/parse-filters';

export interface ProviderSearchBarProps {
    filters: ServiceProviderFilters;
}

/**
 * Search artisans by name, business or trade.
 *
 * It sits above the results rather than inside the filter panel because it is a
 * different gesture: the panel narrows a list you are browsing, this finds
 * someone you already have in mind.
 *
 * The other filters ride along as hidden inputs. Without them a search would
 * silently clear the state and trade the reader had chosen, which reads as the
 * filters being broken rather than as the search replacing them. `page` is
 * deliberately not carried — a new search belongs on page one.
 */
export function ProviderSearchBar({ filters }: ProviderSearchBarProps) {
    return (
        <Form
            action={`${ROUTES.serviceProviders}#${RESULTS_ANCHOR}`}
            role="search"
            className="border-border bg-card grid gap-2 rounded-xl border p-2 sm:grid-cols-[1fr_auto]"
        >
            {filters.trade ? <input type="hidden" name="trade" value={filters.trade} /> : null}
            {filters.state ? <input type="hidden" name="state" value={filters.state} /> : null}
            {filters.area ? <input type="hidden" name="area" value={filters.area} /> : null}
            {filters.available ? <input type="hidden" name="available" value="1" /> : null}

            <div className="flex items-center gap-2 px-3">
                <SearchIcon aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
                <input
                    type="search"
                    name="q"
                    defaultValue={filters.q ?? ''}
                    maxLength={80}
                    aria-label="Search artisans by name, business or trade"
                    placeholder="Search by name, business or trade…"
                    className="text-small placeholder:text-muted-foreground h-11 w-full min-w-0 bg-transparent outline-none"
                />
            </div>

            <Button
                type="submit"
                size="lg"
                className="bg-brand text-brand-foreground hover:bg-brand-hover"
            >
                Search
            </Button>
        </Form>
    );
}
