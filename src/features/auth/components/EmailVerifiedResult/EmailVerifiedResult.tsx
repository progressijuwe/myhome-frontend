'use client';

import { CheckCircle2Icon, ClockIcon, MailWarningIcon, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';

/** The five outcomes the API's verification redirect can produce. */
type VerifyStatus = 'verified' | 'pending-approval' | 'already-verified' | 'invalid' | 'expired';

interface Outcome {
    Icon: LucideIcon;
    tone: string;
    title: string;
    body: string;
    /** Whether a fresh link is worth offering. */
    offerResend: boolean;
}

const OUTCOMES: Record<VerifyStatus, Outcome> = {
    verified: {
        Icon: CheckCircle2Icon,
        tone: 'text-brand',
        title: 'Email confirmed',
        body: 'Your address is verified. You can log in now.',
        offerResend: false,
    },
    'already-verified': {
        Icon: CheckCircle2Icon,
        tone: 'text-brand',
        title: 'Already confirmed',
        body: 'This address was verified previously — just log in.',
        offerResend: false,
    },
    'pending-approval': {
        Icon: ClockIcon,
        tone: 'text-info',
        title: 'Email confirmed — account under review',
        body: 'Our team is checking your business details. We’ll email you as soon as that’s done.',
        offerResend: false,
    },
    expired: {
        Icon: ClockIcon,
        tone: 'text-warning',
        title: 'That link has expired',
        body: 'Verification links last 60 minutes. Ask for a fresh one and we’ll send it straight over.',
        offerResend: true,
    },
    invalid: {
        Icon: MailWarningIcon,
        tone: 'text-destructive',
        title: 'That link isn’t valid',
        body: 'It may have been used already, or the address on the account has since changed.',
        offerResend: true,
    },
};

function isStatus(value: string | null): value is VerifyStatus {
    return value !== null && value in OUTCOMES;
}

/**
 * Landing page for the API's verification redirect.
 *
 * The API sends `?status=` rather than a message, so the wording lives here and
 * the backend stays free of copy. An unrecognised value is treated as invalid —
 * the safe reading, since the only way to get one is a mangled link.
 */
export function EmailVerifiedResult() {
    const searchParams = useSearchParams();
    const raw = searchParams.get('status');
    const status: VerifyStatus = isStatus(raw) ? raw : 'invalid';
    const outcome = OUTCOMES[status];

    return (
        <div className="flex flex-col items-center gap-4 text-center">
            <outcome.Icon aria-hidden="true" className={`size-10 ${outcome.tone}`} />

            <div className="flex flex-col gap-2">
                <h1 className="font-heading text-h3 text-foreground">{outcome.title}</h1>
                <Text size="small" muted balance>
                    {outcome.body}
                </Text>
            </div>

            <div className="mt-2 flex w-full flex-col gap-2">
                {outcome.offerResend ? (
                    <Button size="lg" fullWidth asChild variant="outline">
                        <Link href={ROUTES.verifyEmail}>Send a new link</Link>
                    </Button>
                ) : null}

                <Button
                    size="lg"
                    fullWidth
                    asChild
                    className="bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                    <Link href={ROUTES.login}>Go to log in</Link>
                </Button>
            </div>
        </div>
    );
}
