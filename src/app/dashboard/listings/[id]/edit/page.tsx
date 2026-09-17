import type { Metadata } from 'next';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { RequireAuth } from '@/features/auth';
import { EditListingLoader } from '@/features/listings';

export const metadata: Metadata = {
    title: 'Edit listing',
    robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
    const { id } = await params;

    return (
        <Section spacing="lg">
            <Container>
                <div className="mb-8 flex flex-col gap-2">
                    <Heading as="h1" size="h2">
                        Edit listing
                    </Heading>
                    <Text size="small" muted className="max-w-[60ch]">
                        Changes go back through review before they appear publicly.
                    </Text>
                </div>

                <RequireAuth roles={['real_estate_company', 'property_owner']}>
                    <EditListingLoader propertyId={id} />
                </RequireAuth>
            </Container>
        </Section>
    );
}
