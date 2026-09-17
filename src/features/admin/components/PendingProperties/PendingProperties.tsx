'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCheckIcon, MapPinIcon } from 'lucide-react';
import Link from 'next/link';

import { Heading } from '@/components/shared/Heading';
import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS } from '@/constants/properties';
import { ROUTES } from '@/constants/routes';
import { PropertyThumbnail } from '@/features/properties';
import { getErrorMessage } from '@/lib/api-error';
import { adminService } from '@/services/admin';
import type { Property } from '@/types';
import { formatNaira } from '@/utils/format';

import { ReviewActions } from '../ReviewActions';

function PendingProperty({ property }: { property: Property }) {
    const queryClient = useQueryClient();
    const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });

    const approve = useMutation({
        mutationFn: () => adminService.approveProperty(property.id),
        onSuccess: refresh,
    });

    const reject = useMutation({
        mutationFn: (reason: string) => adminService.rejectProperty(property.id, reason),
        onSuccess: refresh,
    });

    return (
        <li className="border-border bg-card flex flex-col gap-4 rounded-xl border p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
                <div className="relative aspect-3/2 w-full shrink-0 overflow-hidden rounded-lg sm:w-48">
                    <PropertyThumbnail images={property.images} alt={property.title} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div>
                        <p className="text-body text-foreground font-semibold">{property.title}</p>
                        <p className="text-caption text-muted-foreground mt-1 inline-flex items-center gap-1.5">
                            <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
                            {property.address}
                        </p>
                    </div>

                    <p className="text-small text-foreground font-semibold tabular-nums">
                        {formatNaira(property.price)}
                        <span className="text-muted-foreground ml-2 font-medium">
                            {LISTING_TYPE_LABELS[property.listing_type]} ·{' '}
                            {PROPERTY_TYPE_LABELS[property.type]}
                        </span>
                    </p>

                    <Text size="small" muted className="line-clamp-3">
                        {property.description}
                    </Text>

                    <p className="text-caption text-muted-foreground mt-1">
                        Submitted by{' '}
                        <span className="text-foreground font-semibold">
                            {property.posted_by.name}
                        </span>
                        {property.posted_by.is_company ? '' : ' (private owner)'}
                        {' · '}
                        {property.images?.length ?? 0} photo
                        {(property.images?.length ?? 0) === 1 ? '' : 's'}
                    </p>
                </div>
            </div>

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

/** Listings waiting to go live. Nothing reaches the public feed without this. */
export function PendingProperties() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['admin', 'properties'],
        queryFn: () => adminService.pendingProperties(),
    });

    if (isPending) {
        return (
            <div className="flex justify-center py-16">
                <Spinner />
                <span className="sr-only">Loading pending listings</span>
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
                    Every submitted listing has been reviewed.{' '}
                    <Link
                        href={ROUTES.properties}
                        className="text-brand underline underline-offset-4"
                    >
                        See the public feed
                    </Link>
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
                {data.data.map((property) => (
                    <PendingProperty key={property.id} property={property} />
                ))}
            </ul>
        </div>
    );
}
