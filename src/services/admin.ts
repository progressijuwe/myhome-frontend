import type { Paginated, Property, User } from '@/types';

import { api, apiClient } from './api';

/** Headline counts for the admin dashboard. */
export interface AdminStats {
    [key: string]: number;
}

/**
 * Admin review endpoints.
 *
 * Nothing a lister or an artisan submits is visible until it passes through
 * here, so these are the only things standing between "submitted" and "live".
 */
export const adminService = {
    async pendingProperties(page?: number): Promise<Paginated<Property>> {
        const response = await apiClient.get<Paginated<Property>>('/admin/properties/pending', {
            params: page ? { page } : {},
        });

        return response.data;
    },

    approveProperty(id: number): Promise<{ message: string }> {
        return api.post(`/admin/properties/${id}/approve`, {});
    },

    /** The reason is required, and reaches the lister on their own listing. */
    rejectProperty(id: number, reason: string): Promise<{ message: string }> {
        return api.post(`/admin/properties/${id}/reject`, { reason });
    },

    async pendingUsers(page?: number): Promise<Paginated<User>> {
        const response = await apiClient.get<Paginated<User>>('/admin/approvals/pending', {
            params: page ? { page } : {},
        });

        return response.data;
    },

    approveUser(id: number): Promise<{ message: string }> {
        return api.post(`/admin/approvals/${id}/approve`, {});
    },

    rejectUser(id: number, reason: string): Promise<{ message: string }> {
        return api.post(`/admin/approvals/${id}/reject`, { reason });
    },

    stats(): Promise<AdminStats> {
        return api.get<AdminStats>('/admin/stats');
    },
};
