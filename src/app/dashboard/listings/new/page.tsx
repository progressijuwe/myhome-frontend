import type { Metadata } from 'next';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { RequireAuth } from '@/features/auth';
import { PropertyForm } from '@/features/listings';

export const metadata: Metadata = {
    title: 'Publish a listing',
    robots: { index: false, follow: false },
};

export default function NewListingPage() {
    return (
        <Section spacing="lg">
            <Container>
                <div className="mb-8 flex flex-col gap-2">
                    <Heading as="h1" size="h2">
                        Publish a listing
                    </Heading>
                    <Text size="small" muted className="max-w-[60ch]">
                        The more specific you are, the fewer wasted viewings you will sit through.
                    </Text>
                </div>

                <RequireAuth roles={['real_estate_company', 'property_owner']}>
                    <PropertyForm />
                </RequireAuth>
            </Container>
        </Section>
    );
}
