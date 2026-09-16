"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Smartphone, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div className="w-full max-w-7xl rounded-2xl border border-white/[0.08] bg-neutral-950/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-4 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between pointer-events-auto transition-all duration-300 relative">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-white border border-white/20 text-neutral-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-4 h-4 text-neutral-950" />
          </div>
          <span className="font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-neutral-300 transition-colors">
            JalanAman
          </span>
        </Link>

        {/* Center Navigation Links (Pill Style) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-neutral-400 whitespace-nowrap">
          <Link
            href="#urgensi"
            className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            Data Krisis
          </Link>
          <Link
            href="#rute"
            className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            Simulasi Rute
          </Link>
          <Link
            href="#arsitektur"
            className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            Logika AI
          </Link>
          <Link
            href="#skenario"
            className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            Skenario
          </Link>
          <Link
            href="#fitur"
            className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            Fitur Proteksi
          </Link>
          <Link
            href="#protokol"
            className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            Protokol SOS
          </Link>
          <Link
            href="#roadmap"
            className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            Roadmap
          </Link>
          <Link
            href="#faq"
            className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors whitespace-nowrap"
          >
            FAQ
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Primary CTA Button */}
          <Link
            href="#mobile"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 active:scale-95 transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Unduh Aplikasi</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-neutral-300 hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-neutral-950/95 backdrop-blur-xl border border-white/[0.1] shadow-2xl flex flex-col gap-2.5 lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href="#urgensi"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Data Krisis</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="#rute"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Simulasi Rute</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="#arsitektur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Logika Keselamatan</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="#skenario"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Skenario Lapangan</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Fitur Proteksi</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="#protokol"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Protokol SOS</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="#roadmap"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Roadmap</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>
            <Link
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Tanya Jawab</span>
              <ArrowRight className="w-4 h-4 text-neutral-500" />
            </Link>

            <div className="pt-2 border-t border-white/[0.08]">
              <Link
                href="#mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 transition-all shadow-sm"
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
