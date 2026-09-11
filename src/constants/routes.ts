/**
 * Every in-app path in one place. Import these instead of writing string
 * literals so a route rename is a single edit and a typo is a type error.
 *
 * Mirrors the API's public surface — see the API's routes/api.php.
 */
export const ROUTES = {
    home: '/',

    /* Browsing */
    properties: '/properties',
    property: (id: string | number) => `/properties/${id}`,
    serviceProviders: '/service-providers',
    serviceProvider: (id: string | number) => `/service-providers/${id}`,
    company: (id: string | number) => `/companies/${id}`,
    search: '/search',

    /* Auth */
    login: '/login',
    register: '/register',
    registerIndividual: '/register/individual',
    registerCompany: '/register/real-estate-company',
    registerProvider: '/register/service-provider',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    /* The API redirects here after a verification link is followed; the page
       reads ?status=verified|pending-approval|already-verified|invalid|expired. */
    emailVerified: '/email-verified',

    /* Signed in */
    dashboard: '/dashboard',
    savedProperties: '/saved',
    following: '/following',
    bookings: '/bookings',
    enquiries: '/enquiries',
    notifications: '/notifications',
    settings: '/settings',
} as const;
