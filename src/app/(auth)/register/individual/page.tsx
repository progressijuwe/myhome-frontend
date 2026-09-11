import type { Metadata } from 'next';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { AuthShell, RegisterIndividualForm } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Create your account',
    description: 'Create a Myhome account to save properties and book viewings.',
};

export default function RegisterIndividualPage() {
    return (
        <AuthShell
            title="Create your account"
            description="You'll be able to log in as soon as you verify your email."
            footer={
                <>
                    Registering a business instead?{' '}
                    <Link
                        href={ROUTES.register}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        Choose a different account type
                    </Link>
                </>
            }
        >
            <RegisterIndividualForm />
        </AuthShell>
    );
}
