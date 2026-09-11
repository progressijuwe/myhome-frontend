import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner';
import { AuthShell, EmailVerifiedResult } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Email verification',
    robots: { index: false, follow: false },
};

/**
 * Where the API redirects after a verification link is followed. The outcome
 * arrives as `?status=`; see EmailVerifiedResult for the five it handles.
 */
export default function EmailVerifiedPage() {
    return (
        <AuthShell title="">
            <Suspense fallback={<Spinner className="mx-auto" />}>
                <EmailVerifiedResult />
            </Suspense>
        </AuthShell>
    );
}
