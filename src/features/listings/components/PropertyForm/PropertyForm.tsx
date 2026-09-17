'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';

import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { LISTING_TYPE_LABELS, PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from '@/constants/properties';
import { ROUTES } from '@/constants/routes';
import { NIGERIAN_STATES, STATE_LABELS } from '@/constants/states';
import { ApiError, getErrorMessage } from '@/lib/api-error';
import { applyServerFieldErrors } from '@/lib/form-errors';
import { propertiesService } from '@/services/properties';
import type { Property } from '@/types';
import {
    MAX_IMAGES,
    createPropertySchema,
    updatePropertySchema,
    type CreatePropertyInput,
} from '@/validators/property';

/* `coordinates` is ours, not the API's — server errors on latitude or longitude
   are surfaced against it, since that is the field the reader can actually
   correct. */
const FIELDS = [
    'title',
    'description',
    'type',
    'listing_type',
    'price',
    'bedrooms',
    'bathrooms',
    'is_furnished',
    'is_distress_sale',
    'address',
    'state',
    'city',
    'images',
] as const;

export interface PropertyFormProps {
    /** Omit to publish a new listing; pass one to edit it. */
    property?: Property;
}

/**
 * Publish or edit a listing.
 *
 * One form for both, because the fields are identical and the only real
 * difference is whether photographs are required — on an edit, leaving the
 * picker empty keeps the existing ones.
 */
export function PropertyForm({ property }: PropertyFormProps) {
    const router = useRouter();
    const isEdit = Boolean(property);

    const {
        register,
        handleSubmit,
        setError,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreatePropertyInput>({
        resolver: zodResolver(isEdit ? updatePropertySchema : createPropertySchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: property
            ? {
                  title: property.title,
                  description: property.description,
                  type: property.type,
                  listing_type: property.listing_type,
                  price: property.price,
                  bedrooms: property.bedrooms ?? undefined,
                  bathrooms: property.bathrooms ?? undefined,
                  is_furnished: property.is_furnished ?? undefined,
                  is_distress_sale: property.is_distress_sale,
                  address: property.address,
                  state: property.state,
                  city: property.city,
                  /* Only a signed-in owner gets these back, which is exactly
                     who is looking at this form. */
                  coordinates:
                      property.latitude && property.longitude
                          ? `${property.latitude}, ${property.longitude}`
                          : '',
              }
            : {
                  title: '',
                  description: '',
                  type: undefined,
                  listing_type: undefined,
                  price: undefined as unknown as number,
                  address: '',
                  state: undefined,
                  city: '',
                  coordinates: '',
                  is_distress_sale: false,
              },
    });

    const selectedType = useWatch({ control, name: 'type' });
    const isLand = selectedType === 'land';

    const mutation = useMutation({
        mutationFn: (values: CreatePropertyInput) =>
            property
                ? propertiesService.update(property.id, values)
                : propertiesService.create(values),
        onError: (error) => applyServerFieldErrors<CreatePropertyInput>(error, setError, FIELDS),
        onSuccess: () => router.push(ROUTES.myListings),
    });

    const onSubmit = handleSubmit((values) => mutation.mutateAsync(values).catch(() => {}));

    const error = mutation.error instanceof ApiError ? mutation.error : null;
    const showBanner = mutation.isError && !error?.isValidationError;

    return (
        <form onSubmit={onSubmit} noValidate className="flex max-w-2xl flex-col gap-5">
            {showBanner ? (
                <Alert variant="destructive">
                    <AlertTitle>Couldn&apos;t save this listing</AlertTitle>
                    <AlertDescription>{getErrorMessage(mutation.error)}</AlertDescription>
                </Alert>
            ) : null}

            <Input
                label="Title"
                placeholder="3-bedroom flat in Lekki Phase 1"
                error={errors.title?.message}
                {...register('title')}
            />

            <Textarea
                label="Description"
                rows={6}
                maxLength={5000}
                placeholder="What makes it worth seeing: the layout, the finishing, the neighbourhood, what is included."
                error={errors.description?.message}
                {...register('description')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <Select
                    label="Property type"
                    defaultValue=""
                    error={errors.type?.message}
                    {...register('type')}
                >
                    <option value="" disabled>
                        Choose a type
                    </option>
                    {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                            {PROPERTY_TYPE_LABELS[type]}
                        </option>
                    ))}
                </Select>

                <Select
                    label="Sale or rent"
                    defaultValue=""
                    error={errors.listing_type?.message}
                    {...register('listing_type')}
                >
                    <option value="" disabled>
                        Choose one
                    </option>
                    {(['sale', 'rent'] as const).map((value) => (
                        <option key={value} value={value}>
                            {LISTING_TYPE_LABELS[value]}
                        </option>
                    ))}
                </Select>
            </div>

            {/* `valueAsNumber` matters: without it the input hands the schema a
                string and every value fails the number check. */}
            <Input
                label="Price (₦)"
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="59000000"
                description="Whole naira. For a rental, the yearly rent."
                error={errors.price?.message}
                {...register('price', { valueAsNumber: true })}
            />

            {/* Land has no rooms, and the API stores null for all three. */}
            {isLand ? null : (
                <div className="grid gap-4 sm:grid-cols-3">
                    <Input
                        label="Bedrooms"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={20}
                        error={errors.bedrooms?.message}
                        {...register('bedrooms', { valueAsNumber: true })}
                    />
                    <Input
                        label="Bathrooms"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={20}
                        error={errors.bathrooms?.message}
                        {...register('bathrooms', { valueAsNumber: true })}
                    />
                    <Select
                        label="Furnishing"
                        defaultValue=""
                        {...register('is_furnished', {
                            setValueAs: (value) => (value === '' ? undefined : value === 'true'),
                        })}
                    >
                        <option value="" disabled>
                            Choose
                        </option>
                        <option value="true">Furnished</option>
                        <option value="false">Unfurnished</option>
                    </Select>
                </div>
            )}

            <label className="flex items-center gap-2.5">
                <input
                    type="checkbox"
                    className="accent-brand size-4"
                    {...register('is_distress_sale')}
                />
                <span className="text-small">This is a distress sale</span>
            </label>

            <hr className="border-border my-1" />

            <Input
                label="Street address"
                placeholder="15 Ocean Parade, Lekki Phase 1"
                error={errors.address?.message}
                {...register('address')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <Select
                    label="State"
                    defaultValue=""
                    error={errors.state?.message}
                    {...register('state')}
                >
                    <option value="" disabled>
                        Choose a state
                    </option>
                    {NIGERIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                            {STATE_LABELS[state]}
                        </option>
                    ))}
                </Select>

                <Input
                    label="Town or city"
                    placeholder="Lagos"
                    error={errors.city?.message}
                    {...register('city')}
                />
            </div>

            <Input
                label="Coordinates"
                placeholder="6.4281, 3.4219"
                description="In Google Maps, right-click the exact spot and click the coordinates to copy them, then paste here."
                error={errors.coordinates?.message}
                {...register('coordinates')}
            />

            <hr className="border-border my-1" />

            <Input
                label="Photographs"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                description={
                    isEdit
                        ? `Choose up to ${MAX_IMAGES} to replace the current photographs. Leave empty to keep them.`
                        : `Up to ${MAX_IMAGES}, 5MB each. The first one leads the listing.`
                }
                error={errors.images?.message as string | undefined}
                {...register('images')}
            />

            <Alert variant="info">
                <AlertDescription>
                    {isEdit
                        ? 'Saving an approved listing sends it back for review, so it leaves the public feed until an admin approves it again.'
                        : 'New listings are reviewed by an admin before they appear publicly.'}
                </AlertDescription>
            </Alert>

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting || mutation.isPending}
                    loadingLabel={isEdit ? 'Saving' : 'Publishing'}
                    className="bg-brand text-brand-foreground hover:bg-brand-hover"
                >
                    {isEdit ? 'Save changes' : 'Publish listing'}
                </Button>

                <Text size="small" muted>
                    <a
                        href={ROUTES.myListings}
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Cancel
                    </a>
                </Text>
            </div>
        </form>
    );
}
