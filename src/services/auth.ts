import { clearToken, setToken } from '@/lib/token-store';
import type { User } from '@/types';
import type {
    ForgotPasswordInput,
    LoginInput,
    RegisterIndividualInput,
    RegisterRealEstateCompanyInput,
    RegisterServiceProviderInput,
    ResetPasswordInput,
} from '@/validators/auth';

import { api } from './api';

/** `POST /auth/login` on success. Note the key is `token`, not `accessToken`. */
export interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

/**
 * Every registration endpoint answers with this. There is deliberately no
 * token: the account cannot be used until the email is verified, and business
 * roles additionally wait for an administrator.
 */
export interface RegisterResponse {
    message: string;
    user: User;
}

export interface MessageResponse {
    message: string;
}

/**
 * Auth endpoints, matching routes/api.php on the backend.
 *
 * Login owns the token side effect deliberately — if callers had to remember
 * `setToken` afterwards, one of them eventually won't.
 */
export const authService = {
    async login(input: LoginInput): Promise<LoginResponse> {
        const session = await api.post<LoginResponse>('/auth/login', input);
        setToken(session.token);
        return session;
    },

    registerIndividual(input: RegisterIndividualInput): Promise<RegisterResponse> {
        return api.post<RegisterResponse>('/auth/register/individual', input);
    },

    registerServiceProvider(input: RegisterServiceProviderInput): Promise<RegisterResponse> {
        return api.post<RegisterResponse>('/auth/register/service-provider', input);
    },

    registerRealEstateCompany(input: RegisterRealEstateCompanyInput): Promise<RegisterResponse> {
        return api.post<RegisterResponse>('/auth/register/real-estate-company', input);
    },

    async logout(): Promise<void> {
        try {
            await api.post<MessageResponse>('/auth/logout');
        } finally {
            /* Clear locally even if the server call fails — the user asked to
               sign out, and a failed request shouldn't leave them signed in. */
            clearToken();
        }
    },

    /** The signed-in user. There is no `/auth/session`; the profile is it. */
    async profile(): Promise<User> {
        const response = await api.get<{ user: User }>('/user/profile');
        return response.user;
    },

    forgotPassword(input: ForgotPasswordInput): Promise<MessageResponse> {
        return api.post<MessageResponse>('/auth/forgot-password', input);
    },

    resetPassword(input: ResetPasswordInput): Promise<MessageResponse> {
        return api.post<MessageResponse>('/auth/reset-password', input);
    },

    /**
     * Always resolves with the same message whether or not the address exists —
     * the endpoint is deliberately non-committal to avoid confirming which
     * emails are registered.
     */
    resendVerification(email: string): Promise<MessageResponse> {
        return api.post<MessageResponse>('/auth/email/resend', { email });
    },
};
