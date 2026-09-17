import { Pagination } from '@/components/shared/Pagination';
import { ROUTES } from '@/constants/routes';
import type { PaginationMeta, ServiceProviderFilters } from '@/types';

import { RESULTS_ANCHOR, buildProviderQuery } from '../../lib/parse-filters';

export interface ProviderPaginationProps {
    meta: PaginationMeta;
    filters: ServiceProviderFilters;
}

/** Artisan pagination, carrying the active filters and the results fragment. */
export function ProviderPagination({ meta, filters }: ProviderPaginationProps) {
    return (
        <Pagination
            meta={meta}
            label="Artisan pagination"
            hrefFor={(page) =>
                `${ROUTES.serviceProviders}${buildProviderQuery({ ...filters, page })}#${RESULTS_ANCHOR}`
            }
        />
    );
}
