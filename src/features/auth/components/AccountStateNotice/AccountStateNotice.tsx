import Link from 'next/link';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/api-error';
import type { ApiError } from '@/lib/api-error';
import type { AccountAction } from '@/types';

export interface AccountStateNoticeProps {
    error: ApiError | null;
}

/**
 * Explains why an account with valid credentials still cannot be used.
 *
 * The API separates "wrong password" from four states where the login was
 * correct but the account is not usable yet, each needing a different next
 * step. This switches on the `action` code the API sends rather than parsing
 * the message, and is shared by the login form and the route guard so both
 * tell the same story.
 */
export function AccountStateNotice({ error }: AccountStateNoticeProps) {
    const message = getErrorMessage(error);
    const action = error?.body?.action as AccountAction | undefined;

    if (action === 'verify_email') {
        return (
            <Alert variant="warning">
                <AlertTitle>Verify your email first</AlertTitle>
                <AlertDescription className="flex flex-col items-start gap-2">
                    {message}
                    <Link
                        href={ROUTES.verifyEmail}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        Send the link again
                    </Link>
                </AlertDescription>
            </Alert>
        );
    }

    if (action === 'pending_approval') {
        return (
            <Alert variant="info">
                <AlertTitle>Your account is under review</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        );
    }

    if (action === 'application_rejected') {
        const reason = error?.body?.rejection_reason;

        return (
            <Alert variant="destructive">
                <AlertTitle>Application not approved</AlertTitle>
                <AlertDescription className="flex flex-col gap-1">
                    {message}
                    {reason ? (
                        <span className="text-muted-foreground">Reason: {reason}</span>
                    ) : null}
                </AlertDescription>
            </Alert>
        );
    }

    if (action === 'account_locked') {
        const minutes = error?.body?.retry_after_minutes;

        /* The API's own sentence already states the wait ("...in 14 minute(s)"),
           so echoing it and appending our own said the same thing twice. This
           owns the copy instead, which also gets the plural right. */
        return (
            <Alert variant="warning">
                <AlertTitle>Account temporarily locked</AlertTitle>
                <AlertDescription>
                    Too many failed attempts.{' '}
                    {minutes
                        ? `Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
                        : 'Please try again shortly.'}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Alert variant="destructive">
            <AlertTitle>
                {error?.status === 429 ? 'Too many attempts' : 'Couldn’t log you in'}
            </AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
