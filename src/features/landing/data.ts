import heroIkoyiDuplex from '@/assets/property/hero-ikoyi-duplex.jpg';
import ikejaApartment from '@/assets/property/ikeja-apartment.jpg';
import lekkiTerraceDuplex from '@/assets/property/lekki-terrace-duplex.jpg';
import magodoDuplex from '@/assets/property/magodo-duplex.jpg';
import sangotedoLand from '@/assets/property/sangotedo-land.jpg';
import viBungalow from '@/assets/property/vi-bungalow.jpg';
import yabaFlat from '@/assets/property/yaba-flat.jpg';

import type {
    BookingStage,
    FeaturedListing,
    FeaturedProvider,
    PropertyType,
    Tenure,
} from './types';

/**
 * Placeholder content for the marketing page.
 *
 * This is EXAMPLE data, not live figures — swap each export for a fetch against
 * the API (`GET /properties?status=approved`, `GET /service-providers`) when the
 * endpoints are wired up. The shapes already match what those endpoints return.
 */

export const HERO_LISTING: FeaturedListing = {
    id: 'hero',
    title: '5-Bedroom Detached Duplex',
    address: 'Bourdillon Road, Ikoyi, Lagos',
    price: 420_000_000,
    bedrooms: 5,
    bathrooms: 6,
    detail: 'Furnished',
    tenure: 'sale',
    isDistressSale: false,
    image: heroIkoyiDuplex,
    imageAlt: 'A white contemporary villa with a pool in the foreground',
};

export const FEATURED_LISTINGS: Record<Tenure, readonly FeaturedListing[]> = {
    sale: [
        {
            id: 'sale-1',
            title: '4-Bedroom Terrace Duplex',
            address: 'Lekki Phase 1, Lagos',
            price: 145_000_000,
            bedrooms: 4,
            bathrooms: 5,
            detail: 'Furnished',
            tenure: 'sale',
            isDistressSale: false,
            image: lekkiTerraceDuplex,
            imageAlt: 'A modern white duplex beside a swimming pool',
        },
        {
            id: 'sale-2',
            title: '850sqm Residential Land',
            address: 'Sangotedo, Ajah, Lagos',
            price: 32_000_000,
            bedrooms: null,
            bathrooms: null,
            detail: 'C of O',
            tenure: 'sale',
            isDistressSale: true,
            image: sangotedoLand,
            imageAlt: 'An open plot of cleared land at sunset',
        },
        {
            id: 'sale-3',
            title: '3-Bedroom Semi-detached Duplex',
            address: 'Magodo GRA Phase 2, Lagos',
            price: 98_500_000,
            bedrooms: 3,
            bathrooms: 4,
            detail: 'Unfurnished',
            tenure: 'sale',
            isDistressSale: false,
            image: magodoDuplex,
            imageAlt: 'A two-storey duplex with a brick and render facade',
        },
    ],
    rent: [
        {
            id: 'rent-1',
            title: '3-Bedroom Flat',
            address: 'Ikeja GRA, Lagos',
            price: 4_200_000,
            period: 'per year',
            bedrooms: 3,
            bathrooms: 3,
            detail: 'Furnished',
            tenure: 'rent',
            isDistressSale: false,
            image: ikejaApartment,
            imageAlt: 'A low-rise apartment block with balconies',
        },
        {
            id: 'rent-2',
            title: '2-Bedroom Flat',
            address: 'Yaba, Lagos',
            price: 2_750_000,
            period: 'per year',
            bedrooms: 2,
            bathrooms: 2,
            detail: 'Unfurnished',
            tenure: 'rent',
            isDistressSale: false,
            image: yabaFlat,
            imageAlt: 'A bright open-plan living and dining room',
        },
        {
            id: 'rent-3',
            title: '4-Bedroom Detached Bungalow',
            address: 'Victoria Island, Lagos',
            price: 9_800_000,
            period: 'per year',
            bedrooms: 4,
            bathrooms: 4,
            detail: 'Furnished',
            tenure: 'rent',
            isDistressSale: false,
            image: viBungalow,
            imageAlt: 'A single-storey flat-roofed house with a terrace',
        },
    ],
};

/** Labels for the API's property `type` enum, in the order they are browsed. */
export const PROPERTY_TYPES: readonly { value: PropertyType; label: string }[] = [
    { value: 'flat_apartment', label: 'Flats & apartments' },
    { value: 'duplex', label: 'Duplexes' },
    { value: 'semi_detached_duplex', label: 'Semi-detached duplexes' },
    { value: 'terrace', label: 'Terraces' },
    { value: 'bungalow', label: 'Bungalows' },
    { value: 'land', label: 'Land' },
];

export const FEATURED_PROVIDERS: readonly FeaturedProvider[] = [
    {
        id: 'p1',
        businessName: 'Bello Plumbing Works',
        trade: 'Plumbing',
        coverage: 'Lekki, Ajah, Victoria Island',
        yearsOfExperience: 7,
        averageRating: 4.8,
        reviewsCount: 64,
        initials: 'BP',
    },
    {
        id: 'p2',
        businessName: 'Adeyemi Electricals',
        trade: 'Electrical',
        coverage: 'Ikeja, Magodo, Yaba',
        yearsOfExperience: 12,
        averageRating: 4.6,
        reviewsCount: 41,
        initials: 'AE',
    },
    {
        id: 'p3',
        businessName: 'Okafor Carpentry',
        trade: 'Carpentry',
        coverage: 'Yaba, Surulere',
        yearsOfExperience: 9,
        averageRating: 4.9,
        reviewsCount: 88,
        initials: 'OC',
    },
];

/**
 * The four states a tour booking moves through, matching the API's status
 * machine: pending → rescheduled → counter_proposed → approved.
 */
export const BOOKING_STAGES: readonly BookingStage[] = [
    {
        label: 'Requested',
        actor: 'You asked for',
        slot: 'Saturday 14 March · 10:00 AM',
        note: 'Sent to Adeyemi Homes the moment you tapped request. Viewings run between 8:00 AM and 5:00 PM.',
        state: 'Awaiting agent',
    },
    {
        label: 'Rescheduled',
        actor: 'The agent proposed',
        slot: 'Monday 16 March · 2:00 PM',
        note: '“That Saturday is fully booked — would Monday afternoon work instead?”',
        state: 'Needs your reply',
    },
    {
        label: 'Your reply',
        actor: 'You countered with',
        slot: 'Tuesday 17 March · 9:00 AM',
        note: '“Monday is difficult. Could we do first thing Tuesday?” Back to the agent, with your note attached.',
        state: 'Awaiting agent',
    },
    {
        label: 'Confirmed',
        actor: 'Agreed for',
        slot: 'Tuesday 17 March · 9:00 AM',
        note: 'Both of you keep a copy. Cancel any time before the day and the agency is told straight away.',
        state: 'Confirmed',
    },
];
