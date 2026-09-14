/**
 * Public surface of the auth feature. Import from here, never from the
 * internals — that barrier is what keeps the feature deletable.
 */
export { AccountFields } from './components/AccountFields';
export { AccountStateNotice } from './components/AccountStateNotice';
export { AuthNav } from './components/AuthNav';
export { AuthShell } from './components/AuthShell';
export { EmailVerifiedResult } from './components/EmailVerifiedResult';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { LoginForm } from './components/LoginForm';
export { RegisterCompanyForm } from './components/RegisterCompanyForm';
export { RegisterIndividualForm } from './components/RegisterIndividualForm';
export { RegisterPropertyOwnerForm } from './components/RegisterPropertyOwnerForm';
export { RegisterServiceProviderForm } from './components/RegisterServiceProviderForm';
export { RequireAuth } from './components/RequireAuth';
export { ResendVerificationForm } from './components/ResendVerificationForm';
export { ResetPasswordForm } from './components/ResetPasswordForm';
export { RoleChooser } from './components/RoleChooser';

export { useLogout, useRegisterMutation, useSession, type Session } from './hooks';
