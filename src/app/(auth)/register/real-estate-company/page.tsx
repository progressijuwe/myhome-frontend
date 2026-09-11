import type { Metadata } from 'next';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { AuthShell, RegisterCompanyForm } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Register your agency',
    description: 'List properties on Myhome and manage viewing requests in one place.',
};

export default function RegisterCompanyPage() {
    return (
        <AuthShell
            title="Register your agency"
            description="Verify your email, then our team checks your CAC registration before your listings can go live."
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
            <RegisterCompanyForm />
        </AuthShell>
    );
}
