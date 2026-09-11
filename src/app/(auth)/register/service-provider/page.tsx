import type { Metadata } from 'next';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { AuthShell, RegisterServiceProviderForm } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Register as a service provider',
    description: 'List your trade on Myhome and answer enquiries from homeowners.',
};

export default function RegisterServiceProviderPage() {
    return (
        <AuthShell
            title="Register as a service provider"
            description="Verify your email, then our team reviews your details before your profile goes live."
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
            <RegisterServiceProviderForm />
        </AuthShell>
    );
}
