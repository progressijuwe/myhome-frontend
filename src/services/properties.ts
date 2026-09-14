import type {
    CityOption,
    NigerianState,
    Paginated,
    Property,
    PropertyFilters,
    PropertyLocation,
} from '@/types';

import { api, apiClient } from './api';

/**
 * Property endpoints.
 *
 * The list goes through `apiClient` rather than the `api` helpers on purpose:
 * `api.get` unwraps a top-level `data` key, which on a paginated collection
 * would hand back the array and silently throw away `meta` — leaving the
 * caller with no total and no way to page.
 */
export const propertiesService = {
    async list(filters: PropertyFilters = {}): Promise<Paginated<Property>> {
        /* Undefined entries would serialise as `?type=undefined`, which the API
           treats as a real value and matches nothing. */
        const params = Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
        );

        const response = await apiClient.get<Paginated<Property>>('/properties', { params });

        return response.data;
    },

    /**
     * The towns that actually have listings, for the browse filter.
     *
     * Comes from the data rather than a fixed list of Nigerian towns, so the
     * filter cannot offer a city that returns nothing.
     */
    async cities(state?: NigerianState): Promise<CityOption[]> {
        const response = await apiClient.get<{ data: CityOption[] }>('/properties/cities', {
            params: state ? { state } : {},
        });

        return response.data.data;
    },

    /** A single approved listing. 404s for anything not publicly visible. */
    async getById(id: number | string): Promise<Property> {
        const response = await api.get<{ property: Property }>(`/properties/${id}`);

        return response.property;
    },

    /**
     * Exact co-ordinates for a listing. Requires a token, so this can only be
     * called from the client — the server render has no session.
     */
    getLocation(id: number | string): Promise<PropertyLocation> {
        return api.get<PropertyLocation>(`/properties/${id}/location`);
    },
};
