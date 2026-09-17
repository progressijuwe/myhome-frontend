/**
 * Public surface of the service-providers feature. Import from here, never from
 * the internals — that barrier is what keeps the feature deletable.
 */
export { EnquiryPanel } from './components/EnquiryPanel';
export { ProviderAvatar } from './components/ProviderAvatar';
export { ProviderCard } from './components/ProviderCard';
export { ProviderFiltersPanel } from './components/ProviderFiltersPanel';
export { ProviderPagination } from './components/ProviderPagination';
export { ProviderPortfolio } from './components/ProviderPortfolio';
export { ProviderReviews } from './components/ProviderReviews';
export { ProviderSearchBar } from './components/ProviderSearchBar';
export { ProviderRating } from './components/ProviderRating';

export { coverageLabel } from './lib/coverage-label';

export {
    RESULTS_ANCHOR,
    buildProviderQuery,
    hasActiveFilters,
    parseProviderFilters,
    type RawSearchParams,
} from './lib/parse-filters';
