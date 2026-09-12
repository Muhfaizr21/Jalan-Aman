"use client";

import Link from "next/link";
import { ShieldCheck, Smartphone } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-4 backdrop-blur-md bg-zinc-950/70 border-b border-zinc-800/60">
      <div className="w-full max-w-7xl flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-zinc-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-lg text-white group-hover:text-emerald-400 transition-colors">
              JalanAman
            </span>
            <span className="text-[10px] text-zinc-400 -mt-1 tracking-wider uppercase font-medium">
              Rute Aman dari Kriminalitas
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="#rute" className="hover:text-white transition-colors">
            Rute Teraman
          </Link>
          <Link href="#fitur" className="hover:text-white transition-colors">
            Fitur Proteksi
          </Link>
          <Link href="#alur" className="hover:text-white transition-colors">
            Cara Kerja
          </Link>
          <Link href="#statistik" className="hover:text-white transition-colors">
            Data & Metrik
          </Link>
          <Link href="#mobile" className="hover:text-white transition-colors">
            Aplikasi
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="#mobile"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/25"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Unduh Aplikasi</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
