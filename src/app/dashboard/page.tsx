import type { Metadata } from 'next';

import { DashboardSummary } from '@/features/account';

export const metadata: Metadata = {
    title: 'Dashboard',
    robots: { index: false, follow: false },
};

/**
 * A placeholder home for signed-in users — enough to prove the guard and give
 * `?next=` somewhere to return to. The role-specific dashboards replace it.
 */
export default function DashboardPage() {
    return <DashboardSummary />;
}
