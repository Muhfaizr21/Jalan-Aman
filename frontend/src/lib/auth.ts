export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  trust_score: number;
}

export const TOKEN_COOKIE_NAME = 'jalanaman_token';
export const USER_STORAGE_KEY = 'jalanaman_user';

// Mengambil token dari cookie di browser (client-side)
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|; )' + TOKEN_COOKIE_NAME + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Menyimpan token ke Cookie dan data profil ke LocalStorage
export function setAuthSession(token: string, user: AuthUser): void {
  if (typeof document !== 'undefined') {
    // 24 jam expiry
    const maxAge = 60 * 60 * 24;
    document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

// Menghapus sesi autentikasi
export function clearAuthSession(): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

// Mengambil profil pengguna yang tersimpan di LocalStorage
export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

// Mengecek apakah ada sesi aktif di browser
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
