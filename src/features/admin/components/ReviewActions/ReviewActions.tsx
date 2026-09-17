'use client';

import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { getErrorMessage } from '@/lib/api-error';

export interface ReviewActionsProps {
    onApprove: () => void;
    onReject: (reason: string) => void;
    isApproving: boolean;
    isRejecting: boolean;
    error: unknown;
}

const MAX_REASON = 1000;

/**
 * Approve, or reject with a reason.
 *
 * The reason is mandatory on the API and is the only thing the submitter will
 * see, so rejecting is deliberately two steps: the button reveals the box
 * rather than firing straight away. An admin working through a queue should not
 * be able to refuse someone's livelihood with a single misplaced click.
 */
export function ReviewActions({
    onApprove,
    onReject,
    isApproving,
    isRejecting,
    error,
}: ReviewActionsProps) {
    const [isRejectingOpen, setIsRejectingOpen] = useState(false);
    const [reason, setReason] = useState('');

    const trimmed = reason.trim();
    const busy = isApproving || isRejecting;

    if (isRejectingOpen) {
        return (
            <div className="border-border flex flex-col gap-3 border-t pt-4">
                <Textarea
                    label="Why is it being rejected?"
                    rows={3}
                    maxLength={MAX_REASON}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Be specific enough that they can fix it and resubmit."
                    description="This is sent to them, so write it for them to read."
                />

                {error ? (
                    <Alert variant="destructive">
                        <AlertDescription>{getErrorMessage(error)}</AlertDescription>
                    </Alert>
                ) : null}

                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="destructive"
                        onClick={() => onReject(trimmed)}
                        isLoading={isRejecting}
                        loadingLabel="Rejecting"
                        disabled={trimmed.length === 0 || busy}
                    >
                        Confirm rejection
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setIsRejectingOpen(false)}
                        disabled={busy}
                    >
                        Never mind
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 border-t pt-4">
            {error ? (
                <Alert variant="destructive">
                    <AlertDescription>{getErrorMessage(error)}</AlertDescription>
                </Alert>
            ) : null}

            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={onApprove}
                    isLoading={isApproving}
                    loadingLabel="Approving"
                    disabled={busy}
                    className="bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                    Approve
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => setIsRejectingOpen(true)}
                    disabled={busy}
                    className="text-destructive hover:text-destructive"
                >
                    Reject
                </Button>
            </div>
        </div>
    );
}
