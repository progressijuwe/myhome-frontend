'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { SendIcon } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/Textarea';
import { ROUTES } from '@/constants/routes';
import { useSession } from '@/features/auth';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { applyServerFieldErrors } from '@/lib/form-errors';
import { enquiriesService } from '@/services/enquiries';
import type { ServiceListing } from '@/types';
import {
    MAX_ENQUIRY_LENGTH,
    enquirySchema,
    type EnquiryInput,
    type EnquiryPayload,
} from '@/validators/enquiry';

const FIELDS = ['message', 'listing_id'] as const;

export interface EnquiryPanelProps {
    providerId: number;
    /** The artisan's available jobs, so an enquiry can name one. */
    listings: ServiceListing[];
}

/**
 * Send an artisan an enquiry.
 *
 * Only individuals can — an artisan or an agency has no use for it and the API
 * refuses them — so the panel adapts rather than offering a button that will
 * fail. Signed-out visitors get a sign-in link that returns them here.
 */
export function EnquiryPanel({ providerId, listings }: EnquiryPanelProps) {
    const { user, isLoading } = useSession();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<EnquiryInput, unknown, EnquiryPayload>({
        resolver: zodResolver(enquirySchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: { message: '', listing_id: '' },
    });

    const mutation = useMutation({
        mutationFn: (values: EnquiryPayload) => enquiriesService.send(providerId, values),
        onError: (error) => applyServerFieldErrors<EnquiryPayload>(error, setError, FIELDS),
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    if (isLoading) {
        return (
            <div className="border-border flex justify-center rounded-xl border p-6">
                <Spinner />
                <span className="sr-only">Checking your session</span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="border-border flex flex-col gap-3 rounded-xl border p-6">
                <p className="text-body text-foreground font-semibold">Get in touch</p>
                <Text size="small" muted>
                    Log in to describe the job and get a reply from this artisan.
                </Text>
                <Button
                    asChild
                    size="lg"
                    fullWidth
                    className="bg-brand text-brand-foreground hover:bg-brand-hover mt-1"
                >
                    <Link
                        href={`${ROUTES.login}?next=${encodeURIComponent(ROUTES.serviceProvider(providerId))}`}
                    >
                        Log in to enquire
                    </Link>
                </Button>
            </div>
        );
    }

    if (user.role !== 'individual') {
        return (
            <div className="border-border flex flex-col gap-2 rounded-xl border p-6">
                <p className="text-body text-foreground font-semibold">Get in touch</p>
                <Text size="small" muted>
                    Enquiries come from people looking to hire. Your account receives them rather
                    than sends them.
                </Text>
            </div>
        );
    }

    if (mutation.isSuccess) {
        return (
            <Alert variant="success">
                <AlertTitle>Enquiry sent</AlertTitle>
                <AlertDescription className="flex flex-col items-start gap-2">
                    {mutation.data.message}
                    <Link
                        href={ROUTES.enquiries}
                        className="text-brand font-semibold underline underline-offset-4"
                    >
                        See your enquiries
                    </Link>
                </AlertDescription>
            </Alert>
        );
    }

    const error = mutation.error instanceof ApiError ? mutation.error : null;
    const showBanner = mutation.isError && !error?.isValidationError;

    return (
        <form
            onSubmit={onSubmit}
            noValidate
            className="border-border flex flex-col gap-4 rounded-xl border p-6"
        >
            <div>
                <p className="text-body text-foreground font-semibold">Get in touch</p>
                <Text size="small" muted className="mt-1">
                    Describe the job. The artisan replies to you directly.
                </Text>
            </div>

            {showBanner ? (
                <Alert variant="destructive">
                    <AlertTitle>Couldn&apos;t send that enquiry</AlertTitle>
                    <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
            ) : null}

            {listings.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                    <label
                        htmlFor="enquiry-listing"
                        className="text-small text-foreground font-semibold"
                    >
                        About which job?
                    </label>
                    <select
                        id="enquiry-listing"
                        className="border-border text-small text-foreground h-10 rounded-lg border bg-transparent px-3"
                        {...register('listing_id')}
                    >
                        <option value="">Something else</option>
                        {listings.map((listing) => (
                            <option key={listing.id} value={listing.id}>
                                {listing.title}
                            </option>
                        ))}
                    </select>
                </div>
            ) : null}

            <Textarea
                label="Your message"
                rows={5}
                maxLength={MAX_ENQUIRY_LENGTH}
                placeholder="What needs doing, where, and roughly when."
                error={errors.message?.message}
                {...register('message')}
            />

            <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isSubmitting || mutation.isPending}
                loadingLabel="Sending your enquiry"
                leftIcon={<SendIcon />}
                className="bg-brand text-brand-foreground hover:bg-brand-hover"
            >
                Send enquiry
            </Button>
        </form>
    );
}
