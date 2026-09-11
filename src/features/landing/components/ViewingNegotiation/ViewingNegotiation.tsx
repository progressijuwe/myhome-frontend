import Link from 'next/link';

import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ROUTES } from '@/constants/routes';

import { BOOKING_STAGES } from '../../data';

/**
 * The tour-booking negotiation, walked one step at a time.
 *
 * This is the part of the product no competitor has, so it gets the page's one
 * interactive moment. Radix Tabs supplies arrow-key navigation and the ARIA
 * wiring; everything inside stays server-rendered.
 */
export function ViewingNegotiation() {
    return (
        <Section spacing="2xl" id="how-it-works" aria-labelledby="how-it-works-heading">
            <Container>
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <p className="text-caption text-brand font-bold tracking-[0.1em] uppercase">
                            Booking a viewing
                        </p>

                        <Heading as="h2" id="how-it-works-heading" size="h2" className="mt-2">
                            Agree on a time without a single phone call.
                        </Heading>

                        <Text size="body" muted balance className="mt-4 max-w-[58ch]">
                            Ask for the slot that suits you. If the agent is busy they will propose
                            another, and you can push back with a third. Every step is recorded
                            against the booking, so nobody turns up at an address on the wrong
                            afternoon.
                        </Text>

                        <Button
                            size="lg"
                            asChild
                            className="bg-brand text-brand-foreground hover:bg-brand-hover mt-7"
                        >
                            <Link href={ROUTES.register}>Book your first viewing</Link>
                        </Button>
                    </div>

                    <Tabs
                        defaultValue={BOOKING_STAGES[0].label}
                        className="border-border bg-card overflow-hidden rounded-2xl border shadow-md"
                    >
                        <div className="bg-muted/50 flex items-center justify-between gap-4 border-b px-5 py-4">
                            <div>
                                <p className="text-small text-foreground font-semibold">
                                    4-Bedroom Terrace Duplex
                                </p>
                                <p className="text-caption text-muted-foreground">
                                    Lekki Phase 1 · Adeyemi Homes
                                </p>
                            </div>
                        </div>

                        {/* Overrides the pill treatment: this is a progress track,
                            so the triggers read as an underlined sequence. */}
                        <TabsList
                            aria-label="Booking stages"
                            className="h-auto w-full justify-start gap-0 rounded-none border-b bg-transparent p-0"
                        >
                            {BOOKING_STAGES.map((stage) => (
                                <TabsTrigger
                                    key={stage.label}
                                    value={stage.label}
                                    className="text-caption data-[state=active]:text-brand data-[state=active]:border-b-brand flex-1 rounded-none border-b-2 border-transparent px-2 py-3.5 font-bold tracking-[0.05em] uppercase data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                                >
                                    {stage.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {BOOKING_STAGES.map((stage) => (
                            <TabsContent
                                key={stage.label}
                                value={stage.label}
                                className="flex min-h-52 flex-col gap-3 p-6"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-caption text-muted-foreground font-bold tracking-[0.08em] uppercase">
                                        {stage.actor}
                                    </p>
                                    <p className="text-caption text-brand font-semibold">
                                        {stage.state}
                                    </p>
                                </div>

                                <p className="font-heading text-h3 text-foreground">{stage.slot}</p>

                                <Text size="small" muted balance>
                                    {stage.note}
                                </Text>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </Container>
        </Section>
    );
}
