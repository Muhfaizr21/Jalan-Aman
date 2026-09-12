"use client";

import Link from "next/link";
import {
  ShieldCheck,
  PhoneCall,
  Compass,
  Heart,
  Radio,
  Lock,
  Smartphone,
} from "lucide-react";
import ShinyText from "@/components/reactbits/ShinyText";

export default function Footer() {
  return (
    <footer className="relative border-t border-zinc-800/80 bg-zinc-950 pt-16 pb-12 px-4 sm:px-6 overflow-hidden">
      {/* Top Ambient Glow & Glowing Border Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-zinc-800/60">
          {/* Col 1 & 2: Brand & Public Mission Statement */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              {/* Brand Logo */}
              <Link href="/" className="inline-flex items-center gap-2.5 group mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-zinc-950" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold tracking-tight text-lg text-white group-hover:text-emerald-400 transition-colors">
                    JalanAman
                  </span>
                  <span className="text-[10px] text-zinc-400 -mt-1 tracking-wider uppercase font-medium">
                    Sistem Penentuan Rute Teraman
                  </span>
                </div>
              </Link>

              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mb-6">
                Platform navigasi publik yang mengutamakan keselamatan jiwa di malam hari. Memilihkan jalur berpenerangan terbaik, ramai kendaraan, dan bebas dari zona rawan tindak kejahatan jalanan.
              </p>

              {/* React Bits ShinyText: Live System Status */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-emerald-500/30 text-xs text-zinc-300 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <ShinyText
                  text="Sistem Radar & Pemetaan Navigasi Aktif 24 Jam"
                  speed={3.5}
                  className="text-xs font-mono text-zinc-300"
                />
              </div>
            </div>

            {/* Emergency Hotlines Badge */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 flex items-center gap-3 text-xs max-w-md">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-zinc-200 font-semibold">Saluran Darurat Terintegrasi</div>
                <div className="text-zinc-400 text-[11px]">
                  Polri: <span className="text-white font-mono font-bold">110</span> • Layanan Darurat Nasional: <span className="text-white font-mono font-bold">112</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Navigasi & Proteksi */}
          <div className="flex flex-col text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Fitur & Rute</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="#rute" className="hover:text-emerald-400 transition-colors">
                  Simulasi Rute Teraman
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-emerald-400 transition-colors">
                  Peringatan Dini Zona Rawan
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-emerald-400 transition-colors">
                  Deteksi Lampu Jalan (PJU)
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-emerald-400 transition-colors">
                  Tombol SOS & Live GPS
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-emerald-400 transition-colors">
                  Shelter & Pos Jaga 24 Jam
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Misi & Komunitas */}
          <div className="flex flex-col text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              <span>Misi Perlindungan</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400">
              <li>
                <Link href="#alur" className="hover:text-emerald-400 transition-colors">
                  4 Pilar Keselamatan Warga
                </Link>
              </li>
              <li>
                <Link href="#statistik" className="hover:text-emerald-400 transition-colors">
                  Pekerja Shift & Lembur
                </Link>
              </li>
              <li>
                <Link href="#statistik" className="hover:text-emerald-400 transition-colors">
                  Perlindungan Wanita
                </Link>
              </li>
              <li>
                <Link href="#statistik" className="hover:text-emerald-400 transition-colors">
                  Mitra Driver Ojek Online
                </Link>
              </li>
              <li>
                <Link href="#alur" className="hover:text-emerald-400 transition-colors">
                  Sinergi Jalur Patroli
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Unduh & Keamanan Data */}
          <div className="flex flex-col text-left">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Aplikasi & Privasi</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 mb-5">
              <li>
                <Link href="#mobile" className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:underline">
                  <span>Unduh APK Android</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">v1.2</span>
                </Link>
              </li>
              <li>
                <span className="text-zinc-500">Versi iOS (Dalam Pengembangan)</span>
              </li>
            </ul>

            {/* Privacy & Encryption Guarantee */}
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
              <div className="flex items-center gap-1.5 text-zinc-200 font-medium mb-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Privasi Terlindungi</span>
              </div>
              Data lokasi bersifat lokal saat navigasi dan tidak diperjualbelikan kepada pihak ketiga.
            </div>
          </div>
        </div>

        {/* Large Aesthetic Watermark Brand Typography (React Bits Style) */}
        <div className="py-6 select-none pointer-events-none text-center opacity-[0.06] hover:opacity-10 transition-opacity">
          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white font-mono">
            JALANAMAN
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span>© 2026 JalanAman Platform.</span>
            <span>•</span>
            <span>Inisiatif Rute Teraman dari Tindak Kriminalitas.</span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <span>Didedikasikan untuk</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>keselamatan setiap pengendara di Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
