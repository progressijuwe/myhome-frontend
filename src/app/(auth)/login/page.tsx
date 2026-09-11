import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { AuthShell, LoginForm } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Log in',
    description: 'Log in to your Myhome account.',
};

export default function LoginPage() {
    return (
        <AuthShell
            title="Welcome back"
            description="Log in to save properties, book viewings and manage your listings."
            footer={
                <>
                    New to Myhome?{' '}
                    <Link
                        href={ROUTES.register}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        Create an account
                    </Link>
                </>
            }
        >
            {/* LoginForm reads `?next=`, and `useSearchParams` has to sit behind
                a boundary or it opts the whole route into dynamic rendering. */}
            <Suspense fallback={<Spinner className="mx-auto" />}>
                <LoginForm />
            </Suspense>
        </AuthShell>
    );
}
