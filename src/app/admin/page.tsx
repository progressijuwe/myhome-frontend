import type { Metadata } from 'next';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { RequireAuth } from '@/features/auth';
import { PendingAccounts, PendingProperties } from '@/features/admin';

export const metadata: Metadata = {
    title: 'Review queue',
    robots: { index: false, follow: false },
};

export default function AdminPage() {
    return (
        <Section spacing="lg">
            <Container>
                <div className="mb-8 flex flex-col gap-2">
                    <Heading as="h1" size="h2">
                        Review queue
                    </Heading>
                    <Text size="small" muted className="max-w-[60ch]">
                        Nothing reaches the public site until it passes through here.
                    </Text>
                </div>

                <RequireAuth roles={['admin']}>
                    <Tabs defaultValue="properties">
                        <TabsList className="mb-6">
                            <TabsTrigger value="properties">Listings</TabsTrigger>
                            <TabsTrigger value="accounts">Accounts</TabsTrigger>
                        </TabsList>

                        <TabsContent value="properties">
                            <PendingProperties />
                        </TabsContent>

                        <TabsContent value="accounts">
                            <PendingAccounts />
                        </TabsContent>
                    </Tabs>
                </RequireAuth>
            </Container>
        </Section>
    );
}
