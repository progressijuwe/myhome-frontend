import type { Metadata } from 'next';
import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { AuthShell, ForgotPasswordForm } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Reset your password',
    description: 'Request a link to set a new Myhome password.',
};

export default function ForgotPasswordPage() {
    return (
        <AuthShell
            title="Reset your password"
            description="Enter the email on your account and we'll send you a link to set a new password."
            footer={
                <>
                    Remembered it?{' '}
                    <Link
                        href={ROUTES.login}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        Back to log in
                    </Link>
                </>
            }
        >
            <ForgotPasswordForm />
        </AuthShell>
    );
}
