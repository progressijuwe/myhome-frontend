import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { ROUTES } from '@/constants/routes';
import {
    PropertyCard,
    PropertyFiltersPanel,
    PropertyPagination,
    RESULTS_ANCHOR,
    buildPropertyQuery,
    parsePropertyFilters,
    type RawSearchParams,
} from '@/features/properties';
import { getErrorMessage } from '@/lib/api-error';
import { propertiesService } from '@/services/properties';
import type { CityOption, Paginated, Property } from '@/types';

export const metadata: Metadata = {
    title: 'Properties for sale and rent in Nigeria',
    description:
        'Browse reviewed property listings across Nigeria — duplexes, flats, terraces, bungalows and land, for sale or rent.',
};

/**
 * The public feed.
 *
 * A Server Component: the filters are a GET form and the pagination is plain
 * links, so the whole page works before any JavaScript loads and every result
 * set has its own shareable URL. `searchParams` is a promise in this version of
 * Next and has to be awaited.
 */
export default async function PropertiesPage({
    searchParams,
}: {
    searchParams: Promise<RawSearchParams>;
}) {
    const filters = parsePropertyFilters(await searchParams);

    let page: Paginated<Property> | null = null;
    let error: string | null = null;

    try {
        page = await propertiesService.list(filters);
    } catch (caught) {
        /* The API being down should degrade to a readable message, not a
           stack trace in the browser. */
        error = getErrorMessage(caught);
    }

    /* Every town, unscoped: the two selects narrow each other in the browser,
       so the full set has to be present before a state is picked. Fetched
       separately and allowed to fail on its own — losing it hides one select
       rather than taking down the feed. */
    const cities: CityOption[] = await propertiesService.cities().catch(() => [] as CityOption[]);

    return (
        <Section spacing="xl">
            <Container>
                <div className="mb-8 flex flex-col gap-2">
                    <Heading as="h1" size="h2">
                        Properties across Nigeria
                    </Heading>
                    <Text size="small" muted>
                        {page
                            ? `${page.meta.total} reviewed ${page.meta.total === 1 ? 'listing' : 'listings'}`
                            : 'Every listing is reviewed before it goes live.'}
                    </Text>
                </div>

                <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <PropertyFiltersPanel filters={filters} cities={cities} />
                    </aside>

                    {/* The pagination links target this id so that paging
                        lands on the results. `scroll-mt` clears the sticky
                        header, which would otherwise cover the first row. */}
                    <div id={RESULTS_ANCHOR} className="flex scroll-mt-20 flex-col gap-8">
                        {error ? (
                            <Alert variant="destructive">
                                <AlertTitle>Couldn&apos;t load listings</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : null}

                        {page && page.data.length > 0 ? (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {page.data.map((property, index) => (
                                        <PropertyCard
                                            key={property.id}
                                            property={property}
                                            priority={index === 0}
                                        />
                                    ))}
                                </div>

                                <PropertyPagination meta={page.meta} filters={filters} />
                            </>
                        ) : null}

                        {/* An empty page has two very different causes, and
                            conflating them tells the user something untrue:
                            asking for page 5 of a 2-page result is not the same
                            as nothing matching. */}
                        {page && page.data.length === 0 ? (
                            <div className="border-border flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
                                {page.meta.total > 0 ? (
                                    <>
                                        <Heading as="h2" size="h4">
                                            That page doesn&apos;t exist
                                        </Heading>
                                        <Text size="small" muted className="max-w-[44ch]">
                                            These filters have{' '}
                                            {page.meta.last_page === 1
                                                ? 'a single page'
                                                : `${page.meta.last_page} pages`}{' '}
                                            of results.
                                        </Text>
                                        <Link
                                            href={`${ROUTES.properties}${buildPropertyQuery({ ...filters, page: undefined })}`}
                                            className="text-small text-brand font-semibold underline underline-offset-4"
                                        >
                                            Back to the first page
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Heading as="h2" size="h4">
                                            No listings match those filters
                                        </Heading>
                                        <Text size="small" muted className="max-w-[44ch]">
                                            Try widening the price range, or clearing a filter or
                                            two.
                                        </Text>
                                        <Link
                                            href={ROUTES.properties}
                                            className="text-small text-brand font-semibold underline underline-offset-4"
                                        >
                                            Clear all filters
                                        </Link>
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            </Container>
        </Section>
    );
}
