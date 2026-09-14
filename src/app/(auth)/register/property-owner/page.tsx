import type { Metadata } from 'next';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { AuthShell, RegisterPropertyOwnerForm } from '@/features/auth';

export const metadata: Metadata = {
    title: 'List your own property',
    description: 'Let or sell your own property on Myhome — no agency required.',
};

export default function RegisterPropertyOwnerPage() {
    return (
        <AuthShell
            title="List your own property"
            description="For letting or selling a place you own yourself. Verify your email, then our team reviews your account before your first listing goes live."
            footer={
                <>
                    Not what you&apos;re looking for?{' '}
                    <Link
                        href={ROUTES.register}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        Choose a different account type
                    </Link>
                </>
            }
        >
            <RegisterPropertyOwnerForm />
        </AuthShell>
    );
}
