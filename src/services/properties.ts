import type {
    CityOption,
    NigerianState,
    Paginated,
    Property,
    PropertyFilters,
    PropertyLocation,
} from '@/types';
import {
    parseCoordinates,
    type CreatePropertyInput,
    type UpdatePropertyInput,
} from '@/validators/property';

import { api, apiClient } from './api';

/**
 * Property endpoints.
 *
 * The list goes through `apiClient` rather than the `api` helpers on purpose:
 * `api.get` unwraps a top-level `data` key, which on a paginated collection
 * would hand back the array and silently throw away `meta` — leaving the
 * caller with no total and no way to page.
 */
/**
 * Turn a validated form into the multipart body the API expects.
 *
 * Two things the API forces here. Booleans must go as "1"/"0" — a JavaScript
 * `false` stringifies to "false", which PHP reads as truthy. And land must send
 * nothing at all for rooms rather than empty strings, which would fail the
 * integer rules.
 */
function toFormData(input: CreatePropertyInput | UpdatePropertyInput): FormData {
    const coordinates = parseCoordinates(input.coordinates);
    const body = new FormData();

    body.append('title', input.title);
    body.append('description', input.description);
    body.append('type', input.type);
    body.append('listing_type', input.listing_type);
    body.append('price', String(input.price));
    body.append('address', input.address);
    body.append('state', input.state);
    body.append('city', input.city);

    if (coordinates) {
        body.append('latitude', String(coordinates.lat));
        body.append('longitude', String(coordinates.lng));
    }

    body.append('is_distress_sale', input.is_distress_sale ? '1' : '0');

    if (input.type !== 'land') {
        body.append('bedrooms', String(input.bedrooms));
        body.append('bathrooms', String(input.bathrooms));
        body.append('is_furnished', input.is_furnished ? '1' : '0');
    }

    if (input.images) {
        Array.from(input.images).forEach((file) => body.append('images[]', file));
    }

    return body;
}

/**
 * Let axios set the multipart boundary itself.
 *
 * The client sets a default `Content-Type: application/json`, which would
 * otherwise survive and leave the body unparseable. Undefined is the documented
 * way to clear a default per request.
 */
const MULTIPART = { headers: { 'Content-Type': undefined } } as const;

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

    /** The signed-in lister's own listings — every status, including sold. */
    async myListings(page?: number): Promise<Paginated<Property>> {
        const response = await apiClient.get<Paginated<Property>>('/user/properties', {
            params: page ? { page } : {},
        });

        return response.data;
    },

    /** Publish a listing. It starts as `pending` and needs admin approval. */
    async create(input: CreatePropertyInput): Promise<{ message: string; property: Property }> {
        return api.post('/properties', toFormData(input), MULTIPART);
    },

    /**
     * Edit a listing. An approved listing drops back to `pending`.
     *
     * Sent as POST with `_method=PUT`: PHP does not parse a multipart body on a
     * real PUT, so the images would silently arrive empty.
     */
    async update(
        id: number,
        input: UpdatePropertyInput,
    ): Promise<{ message: string; property: Property }> {
        const body = toFormData(input);
        body.append('_method', 'PUT');

        return api.post(`/properties/${id}`, body, MULTIPART);
    },

    /** Mark as sold. Only valid on an approved listing; it leaves the feed. */
    markSold(id: number): Promise<{ message: string }> {
        return api.patch(`/properties/${id}/sold`, {});
    },

    /** Soft delete. The listing disappears from every list, including yours. */
    remove(id: number): Promise<{ message: string }> {
        return api.delete(`/properties/${id}`);
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
