import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { ROUTES } from '@/constants/routes';
import {
    ProviderCard,
    ProviderFiltersPanel,
    ProviderPagination,
    ProviderSearchBar,
    RESULTS_ANCHOR,
    buildProviderQuery,
    parseProviderFilters,
    type RawSearchParams,
} from '@/features/service-providers';
import { getErrorMessage } from '@/lib/api-error';
import { serviceProvidersService } from '@/services/service-providers';
import type { Paginated, ServiceProvider } from '@/types';

export const metadata: Metadata = {
    title: 'Artisans and tradespeople across Nigeria',
    description:
        'Find plumbers, electricians, carpenters, painters, tilers and more across Nigeria. Book one for a small repair today or a full refit next year.',
};

/**
 * The artisan directory.
 *
 * A Server Component for the same reasons as the property feed: the filters are
 * a GET form and the pagination is plain links, so the page works before any
 * JavaScript loads and every result set has its own shareable URL.
 */
export default async function ServiceProvidersPage({
    searchParams,
}: {
    searchParams: Promise<RawSearchParams>;
}) {
    const filters = parseProviderFilters(await searchParams);

    let page: Paginated<ServiceProvider> | null = null;
    let error: string | null = null;

    try {
        page = await serviceProvidersService.list(filters);
    } catch (caught) {
        error = getErrorMessage(caught);
    }

    return (
        <Section spacing="xl">
            <Container>
                <div className="mb-8 flex flex-col gap-2">
                    <Heading as="h1" size="h2">
                        Artisans, whenever you need them
                    </Heading>
                    <Text size="small" muted className="max-w-[60ch]">
                        {/* With no matches the count reads as a boast about
                            nothing — "0 reviewed artisans... Hire one" — so the
                            generic line stands in. */}
                        {page && page.meta.total > 0
                            ? `${page.meta.total} reviewed ${page.meta.total === 1 ? 'artisan' : 'artisans'} across Nigeria. Hire one for a leaking tap today or a full refit next year.`
                            : 'Plumbers, electricians, carpenters, painters and more, across Nigeria.'}
                    </Text>
                </div>

                <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <ProviderFiltersPanel filters={filters} />
                    </aside>

                    {/* The pagination links target this id so paging lands on
                        the results. `scroll-mt` clears the sticky header. */}
                    <div id={RESULTS_ANCHOR} className="flex scroll-mt-20 flex-col gap-8">
                        <ProviderSearchBar filters={filters} />

                        {error ? (
                            <Alert variant="destructive">
                                <AlertTitle>Couldn&apos;t load artisans</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ) : null}

                        {page && page.data.length > 0 ? (
                            <>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {page.data.map((provider) => (
                                        <ProviderCard key={provider.id} provider={provider} />
                                    ))}
                                </div>

                                <ProviderPagination meta={page.meta} filters={filters} />
                            </>
                        ) : null}

                        {/* An empty page has two very different causes, and
                            conflating them tells the reader something untrue. */}
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
                                            href={`${ROUTES.serviceProviders}${buildProviderQuery({ ...filters, page: undefined })}`}
                                            className="text-small text-brand font-semibold underline underline-offset-4"
                                        >
                                            Back to the first page
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Heading as="h2" size="h4">
                                            {filters.q
                                                ? `Nothing found for “${filters.q}”`
                                                : 'No artisans match those filters'}
                                        </Heading>
                                        <Text size="small" muted className="max-w-[44ch]">
                                            {filters.q
                                                ? 'Try fewer words, or clear the other filters.'
                                                : 'Try a broader trade, or a wider area.'}
                                        </Text>
                                        <Link
                                            href={ROUTES.serviceProviders}
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
