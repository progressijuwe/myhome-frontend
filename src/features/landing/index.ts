/**
 * Public surface of the landing feature. Import from here, never from the
 * internals — that barrier is what keeps the feature deletable.
 */
export { FreshListings } from './components/FreshListings';
export { JoinPaths } from './components/JoinPaths';
export { LandingHero } from './components/LandingHero';
export { PropertyCard } from './components/PropertyCard';
export { PropertyTypeRail } from './components/PropertyTypeRail';
export { ReviewPromise } from './components/ReviewPromise';
export { ServiceProviders } from './components/ServiceProviders';
export { ViewingNegotiation } from './components/ViewingNegotiation';

export type {
    BookingStage,
    FeaturedListing,
    FeaturedProvider,
    PropertyType,
    Tenure,
} from './types';
