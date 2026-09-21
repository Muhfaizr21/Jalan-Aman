/**
 * useAuth.ts
 * Adapter hook re-exporting the single source of truth from AuthContext.
 * Guarantees backward compatibility and SOLID Dependency Inversion.
 */

export { useAuth, AuthProvider, type AuthContextValue as UseAuthReturn } from '@/context/AuthContext';
