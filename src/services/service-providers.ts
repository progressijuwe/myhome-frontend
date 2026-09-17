import type { Paginated, ServiceProvider, ServiceProviderFilters } from '@/types';

import { api, apiClient } from './api';

/**
 * Artisan endpoints.
 *
 * The list goes through `apiClient` rather than the `api` helpers for the same
 * reason the property feed does: `api.get` unwraps a top-level `data` key,
 * which on a paginated collection would discard `meta` and leave the caller
 * with no total and no way to page.
 */
export const serviceProvidersService = {
    async list(filters: ServiceProviderFilters = {}): Promise<Paginated<ServiceProvider>> {
        /* Undefined entries would serialise as `?trade=undefined`, which the
           API treats as a real value and matches nothing. */
        const params = Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
        );

        const response = await apiClient.get<Paginated<ServiceProvider>>('/service-providers', {
            params,
        });

        return response.data;
    },

    /**
     * One artisan. 404s for anyone not an approved service provider, so an
     * unapproved account and a nonexistent one are indistinguishable.
     */
    async getById(id: number | string): Promise<ServiceProvider> {
        const response = await api.get<{ provider: ServiceProvider }>(`/service-providers/${id}`);

        return response.provider;
    },
};
