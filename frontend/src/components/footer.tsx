"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white pt-16 pb-12 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-slate-200/80">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-950 border border-neutral-800 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold tracking-tight text-lg text-neutral-950">
                JalanAman
              </span>
            </Link>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm mt-2">
              Navigasi keselamatan malam hari. Memandu pengendara memilih rute terang, menghindari zona rawan kejahatan, dan memastikan Anda tiba di rumah dengan selamat.
            </p>

            {/* Operational System Indicator */}
            <div className="flex items-center gap-2 mt-5 text-xs text-neutral-600 font-mono">
              <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
              <span>Sistem Proteksi Rute Aktif 24 Jam</span>
            </div>
          </div>

          {/* Navigasi Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="#rute" className="hover:text-slate-950 transition-colors">
                  Simulasi Rute Teraman
                </Link>
              </li>
              <li>
                <Link href="#arsitektur" className="hover:text-slate-950 transition-colors">
                  Logika Keselamatan
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-slate-950 transition-colors">
                  Fitur Proteksi
                </Link>
              </li>
              <li>
                <Link href="#protokol" className="hover:text-slate-950 transition-colors">
                  Protokol SOS
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-slate-950 transition-colors">
                  Tanya Jawab
                </Link>
              </li>
            </ul>
          </div>

          {/* Aplikasi Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Aplikasi
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="#mobile" className="hover:text-slate-950 transition-colors">
                  Unduh APK Android
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Versi iOS (Segera Hadir)</span>
              </li>
              <li>
                <Link href="#rute" className="hover:text-slate-950 transition-colors">
                  Algoritma Routing Aman
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-slate-950 transition-colors">
                  Integrasi Tombol SOS
                </Link>
              </li>
            </ul>
          </div>

          {/* Inisiatif Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 mb-3.5">
              Inisiatif
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="#alur" className="hover:text-slate-950 transition-colors">
                  Misi Keamanan Publik
                </Link>
              </li>
              <li>
                <Link href="#alur" className="hover:text-slate-950 transition-colors">
                  Sinergi Pos Patroli
                </Link>
              </li>
              <li>
                <Link href="#mobile" className="hover:text-slate-950 transition-colors">
                  Panduan Pengguna
                </Link>
              </li>
              <li>
                <a href="mailto:kontak@jalanaman.id" className="hover:text-slate-950 transition-colors">
                  Hubungi Pengembang
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Clean & Minimalist */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 JalanAman. Inisiatif Keselamatan Publik Berbasis Komunitas.
          </div>

          <div className="flex items-center gap-6">
            <Link href="#mobile" className="hover:text-slate-800 transition-colors">
              Privasi
            </Link>
            <Link href="#mobile" className="hover:text-slate-800 transition-colors">
              Ketentuan
            </Link>
            <a href="mailto:kontak@jalanaman.id" className="hover:text-slate-800 transition-colors">
              Kontak
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
