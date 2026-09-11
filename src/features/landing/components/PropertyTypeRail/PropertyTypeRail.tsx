import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Section } from '@/components/shared/Section';
import { ROUTES } from '@/constants/routes';

import { PROPERTY_TYPES } from '../../data';

/**
 * Quick entry into the feed, one link per value of the API's property `type`
 * enum. Each goes straight to a filtered /properties URL.
 */
export function PropertyTypeRail() {
    return (
        <Section spacing="md" aria-labelledby="browse-by-type">
            <Container>
                <h2 id="browse-by-type" className="sr-only">
                    Browse by property type
                </h2>

                <ul className="flex flex-wrap gap-2.5">
                    {PROPERTY_TYPES.map((type) => (
                        <li key={type.value}>
                            <Link
                                href={`${ROUTES.properties}?type=${type.value}`}
                                className="border-border text-small text-foreground hover:border-brand hover:text-brand focus-visible:ring-ring inline-flex rounded-full border px-4 py-2.5 font-medium transition-colors outline-none focus-visible:ring-[3px]"
                            >
                                {type.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Container>
        </Section>
    );
}
