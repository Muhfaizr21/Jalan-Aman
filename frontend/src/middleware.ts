import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('jalanaman_token')?.value;

  // 1. Proteksi seluruh rute /dashboard dan sub-halamannya (/dashboard/analytics, dll)
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // Belum login, redirect ke halaman login dengan query parameter target
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Jika pengguna yang sudah login mencoba membuka halaman /login, redirect ke /dashboard
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Konfigurasi matcher rute yang dieksekusi oleh middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
};
