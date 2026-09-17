'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  KeyRound,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { setAuthSession, isAuthenticated } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Jika sudah terautentikasi, langsung arahkan ke dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(redirectTarget);
    }
  }, [router, redirectTarget]);

  const handleQuickFill = () => {
    setEmail('admin@gmail.com');
    setPassword('admin123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email dan password wajib diisi.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    try {
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Email atau password tidak sesuai.');
      }

      // Simpan session (Cookie + LocalStorage)
      const { token, user } = data.data;
      setAuthSession(token, user);

      setIsSuccess(true);

      // Redirect ke target rute (misal /dashboard/analytics atau /dashboard)
      setTimeout(() => {
        router.push(redirectTarget);
        router.refresh();
      }, 500);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Gagal menghubungi server API Gateway. Pastikan backend aktif.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="text-xl font-bold tracking-tight text-white block leading-none">
              Jalan<span className="text-blue-400">Aman</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Command Center</span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-white mt-6 tracking-tight">Login Superadmin</h1>
        <p className="text-xs text-zinc-400 mt-1.5">
          Masuk untuk mengelola analitik, klaster DBSCAN, dan parameter sistem.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Quick Fill Helper Card */}
        <div className="mb-6 p-3 rounded-xl bg-blue-950/30 border border-blue-500/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <KeyRound className="w-3.5 h-3.5" />
            </div>
            <div className="text-left truncate">
              <span className="text-[11px] font-semibold text-blue-300 block">Kredensial Superadmin</span>
              <span className="text-[10px] text-zinc-400 font-mono">admin@gmail.com / admin123</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm shrink-0 flex items-center gap-1"
          >
            <Zap className="w-3 h-3" /> Isi Cepat
          </button>
        </div>

        {/* Alert Error */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Gagal Masuk</span>
              <span className="text-zinc-300 text-[11px]">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Alert Success */}
        {isSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Autentikasi berhasil! Mengalihkan ke dashboard...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-white/[0.1] rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Kata Sandi
              </label>
              <span className="text-[11px] text-zinc-500">Default: admin123</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-black/50 border border-white/[0.1] rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Lihat kata sandi"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : isSuccess ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Mengalihkan...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Command Center</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
          <p className="text-[11px] text-zinc-500">
            Sistem terintegrasi dengan <strong className="text-zinc-400">PostgreSQL</strong> & verifikasi token <strong className="text-zinc-400">JWT 24 Jam</strong>.
          </p>
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-6 text-center text-xs text-zinc-600 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-zinc-500" />
        <span>Koneksi aman terenkripsi SSL/TLS 256-bit</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-blue-500/30">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Ambient background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="text-xs text-zinc-500">Memuat halaman login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
