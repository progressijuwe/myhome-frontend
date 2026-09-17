'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCheckIcon } from 'lucide-react';

import { Heading } from '@/components/shared/Heading';
import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { STATE_LABELS } from '@/constants/states';
import { getErrorMessage } from '@/lib/api-error';
import { adminService } from '@/services/admin';
import type { User } from '@/types';

import { ReviewActions } from '../ReviewActions';

const ROLE_LABELS: Record<string, string> = {
    property_owner: 'Private property owner',
    real_estate_company: 'Real estate company',
    service_provider: 'Artisan',
};

function PendingAccount({ user }: { user: User }) {
    const queryClient = useQueryClient();
    const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });

    const approve = useMutation({
        mutationFn: () => adminService.approveUser(user.id),
        onSuccess: refresh,
    });

    const reject = useMutation({
        mutationFn: (reason: string) => adminService.rejectUser(user.id, reason),
        onSuccess: refresh,
    });

    const artisan = user.service_provider_profile;
    const company = user.real_estate_company_profile;

    return (
        <li className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-body text-foreground font-semibold">
                        {company?.company_name ?? artisan?.business_name ?? user.full_name}
                    </p>
                    <p className="text-caption text-muted-foreground mt-1">
                        {user.full_name} · {user.email}
                    </p>
                </div>

                <Badge variant="info">{ROLE_LABELS[user.role] ?? user.role}</Badge>
            </div>

            {/* Whatever they submitted is the only basis for the decision, so
                show all of it rather than making the admin go hunting. */}
            {artisan ? (
                <dl className="text-caption grid gap-2 sm:grid-cols-2">
                    <div>
                        <dt className="text-muted-foreground">Trade</dt>
                        <dd className="text-foreground font-semibold">{artisan.trade_specialty}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Covers</dt>
                        <dd className="text-foreground font-semibold">
                            {artisan.service_coverage_area}, {STATE_LABELS[artisan.state]}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Experience</dt>
                        <dd className="text-foreground font-semibold tabular-nums">
                            {artisan.years_of_experience} years
                        </dd>
                    </div>
                </dl>
            ) : null}

            {company ? (
                <dl className="text-caption grid gap-2 sm:grid-cols-2">
                    <div>
                        <dt className="text-muted-foreground">CAC number</dt>
                        <dd className="text-foreground font-semibold">{company.cac_number}</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Contact</dt>
                        <dd className="text-foreground font-semibold">
                            {company.contact_person_name}
                        </dd>
                    </div>
                </dl>
            ) : null}

            <ReviewActions
                onApprove={() => approve.mutate()}
                onReject={(reason) => reject.mutate(reason)}
                isApproving={approve.isPending}
                isRejecting={reject.isPending}
                error={approve.error ?? reject.error}
            />
        </li>
    );
}

/**
 * Accounts waiting to be let in.
 *
 * Agencies, private owners and artisans all sit here until reviewed — they can
 * sign in but cannot list or be listed, so this queue is what turns a
 * registration into a usable account.
 */
export function PendingAccounts() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['admin', 'accounts'],
        queryFn: () => adminService.pendingUsers(),
    });

    if (isPending) {
        return (
            <div className="flex justify-center py-16">
                <Spinner />
                <span className="sr-only">Loading pending accounts</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Couldn&apos;t load the queue</AlertTitle>
                <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
        );
    }

    if (data.data.length === 0) {
        return (
            <div className="border-border flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center">
                <CheckCheckIcon aria-hidden="true" className="text-success size-8" />
                <Heading as="h3" size="h4">
                    Nothing waiting
                </Heading>
                <Text size="small" muted>
                    Every account has been reviewed.
                </Text>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <Text size="small" muted>
                {data.meta.total} waiting for review
            </Text>

            <ul className="flex flex-col gap-4">
                {data.data.map((user) => (
                    <PendingAccount key={user.id} user={user} />
                ))}
            </ul>
        </div>
    );
}
