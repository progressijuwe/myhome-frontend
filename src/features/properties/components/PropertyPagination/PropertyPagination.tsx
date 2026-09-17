import { Pagination } from '@/components/shared/Pagination';
import { ROUTES } from '@/constants/routes';
import type { PaginationMeta, PropertyFilters } from '@/types';

import { RESULTS_ANCHOR, buildPropertyQuery } from '../../lib/parse-filters';

export interface PropertyPaginationProps {
    meta: PaginationMeta;
    filters: PropertyFilters;
}

/**
 * Feed pagination that carries the active filters with it.
 *
 * The markup lives in the shared Pagination; this supplies the only part that
 * is domain-specific — the href.
 *
 * Each href carries the `#listings` fragment. Without it Next scrolls to the
 * top of the page, which on mobile is the top of the filter panel: the reader
 * lands on the controls they just finished using rather than on the results
 * they asked for.
 */
export function PropertyPagination({ meta, filters }: PropertyPaginationProps) {
    return (
        <Pagination
            meta={meta}
            label="Property pagination"
            hrefFor={(page) =>
                `${ROUTES.properties}${buildPropertyQuery({ ...filters, page })}#${RESULTS_ANCHOR}`
            }
        />
    );
}
