"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Smartphone, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="w-full max-w-6xl rounded-2xl border border-slate-200/90 bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between pointer-events-auto transition-all duration-300 relative">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold tracking-tight text-base sm:text-lg text-neutral-950 group-hover:text-neutral-600 transition-colors">
            JalanAman
          </span>
        </Link>

        {/* Center Navigation Links (Pill Style) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-neutral-600">
          <Link
            href="#rute"
            className="px-3 py-1.5 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
          >
            Simulasi Rute
          </Link>
          <Link
            href="#arsitektur"
            className="px-3 py-1.5 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
          >
            Logika Keselamatan
          </Link>
          <Link
            href="#fitur"
            className="px-3 py-1.5 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
          >
            Fitur Proteksi
          </Link>
          <Link
            href="#protokol"
            className="px-3 py-1.5 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
          >
            Protokol SOS
          </Link>
          <Link
            href="#faq"
            className="px-3 py-1.5 rounded-lg hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
          >
            Tanya Jawab
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Primary CTA Button */}
          <Link
            href="#mobile"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 active:scale-95 transition-all shadow-sm border border-neutral-800"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Unduh Aplikasi</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl flex flex-col gap-2.5 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="#rute"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Simulasi Rute</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="#arsitektur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Logika Keselamatan</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Fitur Proteksi</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="#protokol"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Protokol SOS</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Tanya Jawab</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <div className="pt-2 border-t border-slate-200">
              <Link
                href="#mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 transition-all shadow-sm border border-neutral-800"
              >
                <Smartphone className="w-4 h-4" />
                <span>Unduh Aplikasi Mobile</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
