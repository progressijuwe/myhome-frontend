import type { AccountAction } from './user';

/**
 * Wire formats for the API layer. These describe what the backend sends;
 * adjust them to match your actual contract rather than reshaping responses
 * in components.
 */

/** Standard envelope. `services/api.ts` unwraps this so callers get `T`. */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

/**
 * Laravel's pagination block, verbatim.
 *
 * Deliberately snake_case and shaped like the framework's output — an earlier
 * camelCase guess (`page`, `perPage`, `totalPages`) matched nothing the API
 * sends, so every field read as undefined.
 */
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    /** Null on an empty page. */
    from: number | null;
    to: number | null;
    path: string;
}

/**
 * A paginated resource collection: `{ data, links, meta }`.
 *
 * These must be read through `apiClient` rather than the `api` helpers — the
 * helpers unwrap a top-level `data` key, which would discard `meta` and leave
 * the caller unable to page.
 */
export interface Paginated<T> {
    data: T[];
    meta: PaginationMeta;
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
}

/** Query params accepted by list endpoints. */
export interface ListParams {
    page?: number;
    perPage?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

/**
 * Error body as returned by the server. `fieldErrors` maps directly onto React
 * Hook Form's `setError`, so server-side validation can be replayed in the UI.
 */
export interface ApiErrorBody {
    message?: string;
    code?: string;
    errors?: Record<string, string[]>;

    /**
     * Why an otherwise-valid request was refused. The API sends this with a
     * 403 (unverified email, pending or rejected approval) and a 423 (lockout)
     * so the client can route to the right screen instead of parsing prose.
     */
    action?: AccountAction;
    /** Sent with `application_rejected`. */
    rejection_reason?: string | null;
    /** Sent with `account_locked`. */
    retry_after_minutes?: number;
}
