import type { Metadata } from 'next';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { AuthShell, RoleChooser } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Create an account',
    description: 'Join Myhome as a buyer, an estate agency or a service provider.',
};

export default function RegisterPage() {
    return (
        <AuthShell
            title="Create an account"
            description="Tell us how you'll use Myhome and we'll ask for the right details."
            footer={
                <>
                    Already have an account?{' '}
                    <Link
                        href={ROUTES.login}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        Log in
                    </Link>
                </>
            }
        >
            <RoleChooser />
        </AuthShell>
    );
}
