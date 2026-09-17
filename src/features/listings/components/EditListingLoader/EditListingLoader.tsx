'use client';

import { useQuery } from '@tanstack/react-query';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { getErrorMessage } from '@/lib/api-error';
import { propertiesService } from '@/services/properties';

import { PropertyForm } from '../PropertyForm';

export interface EditListingLoaderProps {
    propertyId: string;
}

/**
 * Fetches the listing being edited, then hands it to the form.
 *
 * Client-side because a pending listing is only readable by its owner, and the
 * owner is identified by a token the server never sees. A 404 here therefore
 * means "not yours" as often as "not there", which is what the message says.
 */
export function EditListingLoader({ propertyId }: EditListingLoaderProps) {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['property', propertyId],
        queryFn: () => propertiesService.getById(propertyId),
        /* A stale copy would overwrite fields the reader just changed
           elsewhere, so always refetch on mount. */
        staleTime: 0,
    });

    if (isPending) {
        return (
            <div className="flex justify-center py-20">
                <Spinner />
                <span className="sr-only">Loading the listing</span>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Couldn&apos;t open that listing</AlertTitle>
                <AlertDescription>
                    {getErrorMessage(error)} It may have been deleted, or it may belong to another
                    account.
                </AlertDescription>
            </Alert>
        );
    }

    return <PropertyForm property={data} />;
}
