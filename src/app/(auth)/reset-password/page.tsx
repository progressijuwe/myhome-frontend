import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { AuthShell, ResetPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Set a new password',
    robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
    return (
        <AuthShell
            title="Set a new password"
            footer={
                <>
                    Changed your mind?{' '}
                    <Link
                        href={ROUTES.login}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        Back to log in
                    </Link>
                </>
            }
        >
            {/* Reads the token and email from the query, so it needs a boundary. */}
            <Suspense fallback={<Spinner className="mx-auto" />}>
                <ResetPasswordForm />
            </Suspense>
        </AuthShell>
    );
}
