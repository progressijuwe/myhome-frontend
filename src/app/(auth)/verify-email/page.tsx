import { MailCheckIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { Text } from '@/components/shared/Text';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { AuthShell, ResendVerificationForm } from '@/features/auth';

export const metadata: Metadata = {
    title: 'Verify your email',
    description: 'Confirm your email address to finish setting up your Myhome account.',
    robots: { index: false, follow: false },
};

/**
 * Where registration lands. The API issues no token until the address is
 * verified, so this is the end of the signup flow rather than the app.
 */
export default function VerifyEmailPage() {
    return (
        <AuthShell
            title="Check your inbox"
            description="We've sent you a link to confirm your email address. It expires in 60 minutes."
            footer={
                <>
                    Already verified?{' '}
                    <Link
                        href={ROUTES.login}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        Log in
                    </Link>
                </>
            }
        >
            <div className="flex flex-col gap-6">
                <div className="bg-muted/60 flex items-start gap-3 rounded-xl p-4">
                    <MailCheckIcon
                        aria-hidden="true"
                        className="text-brand mt-0.5 size-5 shrink-0"
                    />
                    <Text size="small" muted>
                        Business accounts are reviewed by our team after verification — we&apos;ll
                        email you once that&apos;s done.
                    </Text>
                </div>

                <div className="flex flex-col gap-3">
                    <Text size="small" muted>
                        Didn&apos;t get it? Check your spam folder, or ask for another link.
                    </Text>

                    <Suspense fallback={<Spinner className="mx-auto" />}>
                        <ResendVerificationForm />
                    </Suspense>
                </div>
            </div>
        </AuthShell>
    );
}
