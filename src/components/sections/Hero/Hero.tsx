import { ArrowRightIcon, BookOpenIcon } from 'lucide-react';
import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { ROUTES } from '@/constants/routes';

export function Hero() {
    return (
        <Section spacing="2xl">
            <Container size="md" className="flex flex-col items-center gap-6 text-center">
                {/* The page's only h1. Everything below steps down from here. */}
                <Heading as="h1" size="display" align="center">
                    {siteConfig.name}
                </Heading>

                <Text size="body" muted align="center" balance className="max-w-2xl">
                    {siteConfig.description}
                </Text>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" rightIcon={<ArrowRightIcon />}>
                        <Link href="#components">Browse components</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" leftIcon={<BookOpenIcon />}>
                        <Link href={ROUTES.home}>Back to the site</Link>
                    </Button>
                </div>
            </Container>
        </Section>
    );
}
