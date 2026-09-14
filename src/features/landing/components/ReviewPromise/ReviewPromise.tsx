import { Container } from '@/components/shared/Container';
import { Heading } from '@/components/shared/Heading';
import { Section } from '@/components/shared/Section';
import { Text } from '@/components/shared/Text';

/* A real sequence — each step gates the next — so the numbering carries
   information rather than decorating the list. */
const STEPS = [
    {
        title: 'The agency is verified',
        body: 'Company name, CAC registration number and address are checked before the account can post anything at all.',
    },
    {
        title: 'The listing is reviewed',
        body: 'Photos, price and location are approved by our team. Edits to a live listing send it back for review.',
    },
    {
        title: 'It reaches your feed',
        body: 'Follow an agency and choose whether to hear about their new listings. Sold properties leave the feed the same day.',
    },
];

export function ReviewPromise() {
    return (
        <Section spacing="2xl" surface="muted" aria-labelledby="review-promise">
            <Container>
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <p className="text-caption text-brand font-bold tracking-widest uppercase">
                            Why it is quieter here
                        </p>

                        <Heading as="h2" id="review-promise" size="h2" className="mt-2">
                            Nothing goes live until a person has looked at it.
                        </Heading>

                        <Text size="body" muted balance className="mt-4 max-w-[58ch]">
                            Agencies register with their CAC number and wait for approval. Their
                            listings then wait for a second review. It is slower for them, and far
                            calmer for you.
                        </Text>
                    </div>

                    <ol className="flex flex-col">
                        {STEPS.map((step, index) => (
                            <li
                                key={step.title}
                                className="relative grid grid-cols-[28px_1fr] gap-4"
                            >
                                <div className="flex flex-col items-center">
                                    <span
                                        aria-hidden="true"
                                        className="border-brand bg-brand text-brand-foreground text-caption grid size-7 shrink-0 place-items-center rounded-full border-2 font-bold"
                                    >
                                        {index + 1}
                                    </span>
                                    {index < STEPS.length - 1 ? (
                                        <span
                                            aria-hidden="true"
                                            className="bg-border w-0.5 flex-1"
                                        />
                                    ) : null}
                                </div>

                                <div className={index < STEPS.length - 1 ? 'pb-7' : ''}>
                                    <h3 className="text-body text-foreground font-bold">
                                        {step.title}
                                    </h3>
                                    <Text size="small" muted className="mt-1">
                                        {step.body}
                                    </Text>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </Container>
        </Section>
    );
}
