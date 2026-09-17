import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types';

export interface PaginationProps {
    meta: PaginationMeta;
    /**
     * Builds the href for a page number. Callers own the query string and the
     * results fragment, which is what keeps this component free of any
     * knowledge of what is being paged.
     */
    hrefFor: (page: number) => string;
    /** Distinguishes the landmark when a page has more than one of these. */
    label?: string;
}

/**
 * Previous/next links over a paginated collection.
 *
 * Plain links rather than buttons, so pages are crawlable, openable in a new
 * tab, and work with no JavaScript. The disabled ends are spans rather than
 * disabled links: there is nowhere to go, so there should be nothing to focus.
 */
export function Pagination({ meta, hrefFor, label = 'Pagination' }: PaginationProps) {
    if (meta.last_page <= 1) return null;

    const hasPrev = meta.current_page > 1;
    const hasNext = meta.current_page < meta.last_page;

    const linkClass =
        'border-border text-small focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 font-medium outline-none focus-visible:ring-[3px]';

    return (
        <nav aria-label={label} className="flex items-center justify-between gap-4">
            {hasPrev ? (
                <Link
                    href={hrefFor(meta.current_page - 1)}
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
                    href={hrefFor(meta.current_page + 1)}
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
