import type { PropertyStatus } from '@/types';

/**
 * Listing statuses in the lister's language.
 *
 * `pending` says who is waiting on whom, which the database word does not.
 */
export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
    pending: 'Awaiting review',
    approved: 'Live',
    rejected: 'Not approved',
    sold: 'Sold or let',
};

export const PROPERTY_STATUS_TONES: Record<
    PropertyStatus,
    'success' | 'warning' | 'destructive' | 'secondary' | 'info'
> = {
    pending: 'info',
    approved: 'success',
    rejected: 'destructive',
    sold: 'secondary',
};
