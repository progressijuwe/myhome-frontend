import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { PaginationMeta, PropertyFilters } from '@/types';

import { RESULTS_ANCHOR, buildPropertyQuery } from '../../lib/parse-filters';

export interface PropertyPaginationProps {
    meta: PaginationMeta;
    filters: PropertyFilters;
}

/**
 * Previous/next links that carry the active filters with them.
 *
 * Plain links rather than buttons, so pages are crawlable, openable in a new
 * tab, and work with no JavaScript.
 *
 * Each href carries the `#listings` fragment. Without it Next scrolls to the
 * top of the page, which on mobile is the top of the filter panel — the reader
 * lands on the controls they just finished using rather than on the results
 * they asked for. The fragment makes the browser (and Next, which uses
 * scrollIntoView for hashes) land on the grid instead.
 */
export function PropertyPagination({ meta, filters }: PropertyPaginationProps) {
    if (meta.last_page <= 1) return null;

    const href = (page: number) =>
        `${ROUTES.properties}${buildPropertyQuery({ ...filters, page })}#${RESULTS_ANCHOR}`;

    const hasPrev = meta.current_page > 1;
    const hasNext = meta.current_page < meta.last_page;

    const linkClass =
        'border-border text-small focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 font-medium outline-none focus-visible:ring-[3px]';

    return (
        <nav aria-label="Pagination" className="flex items-center justify-between gap-4">
            {hasPrev ? (
                <Link
                    href={href(meta.current_page - 1)}
                    className={cn(linkClass, 'hover:border-brand hover:text-brand')}
                    rel="prev"
                >
                    <ChevronLeftIcon aria-hidden="true" className="size-4" />
                    Previous
                </Link>
            ) : (
                <span
                    className={cn(linkClass, 'text-muted-foreground opacity-50')}
                    aria-hidden="true"
                >
                    <ChevronLeftIcon className="size-4" />
                    Previous
                </span>
            )}

            <p className="text-small text-muted-foreground tabular-nums" aria-live="polite">
                Page {meta.current_page} of {meta.last_page}
            </p>

            {hasNext ? (
                <Link
                    href={href(meta.current_page + 1)}
                    className={cn(linkClass, 'hover:border-brand hover:text-brand')}
                    rel="next"
                >
                    Next
                    <ChevronRightIcon aria-hidden="true" className="size-4" />
                </Link>
            ) : (
                <span
                    className={cn(linkClass, 'text-muted-foreground opacity-50')}
                    aria-hidden="true"
                >
                    Next
                    <ChevronRightIcon className="size-4" />
                </span>
            )}
        </nav>
    );
}
