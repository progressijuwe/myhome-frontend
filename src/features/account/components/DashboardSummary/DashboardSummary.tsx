'use client';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { RequireAuth, useSession } from '@/features/auth';

const ROLE_LABELS: Record<string, string> = {
    individual: 'Individual',
    service_provider: 'Service provider',
    real_estate_company: 'Estate agency',
    admin: 'Administrator',
};

function Summary() {
    const { user } = useSession();

    if (!user) return null;

    return (
        <Section spacing="xl">
            <Container size="md" className="flex flex-col gap-6">
                <div>
                    <Heading as="h1" size="h2">
                        Welcome back, {user.first_name}
                    </Heading>
                    <Text size="small" muted className="mt-2">
                        Signed in as {user.email}
                    </Text>
                </div>

                <dl className="border-border grid gap-4 rounded-xl border p-6 sm:grid-cols-3">
                    <div>
                        <dt className="text-caption text-muted-foreground">Account type</dt>
                        <dd className="text-small text-foreground font-semibold">
                            {ROLE_LABELS[user.role] ?? user.role}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-caption text-muted-foreground">Email</dt>
                        <dd className="text-small text-foreground font-semibold">
                            {user.email_verified ? 'Verified' : 'Not verified'}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-caption text-muted-foreground">Status</dt>
                        <dd className="text-small text-foreground font-semibold capitalize">
                            {user.approval_status.replace('_', ' ')}
                        </dd>
                    </div>
                </dl>
            </Container>
        </Section>
    );
}

export function DashboardSummary() {
    return (
        <RequireAuth>
            <Summary />
        </RequireAuth>
    );
}
