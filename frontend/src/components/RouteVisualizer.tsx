"use client";

import { useState } from "react";
import { ShieldCheck, AlertOctagon, Navigation, MapPin, Eye, CheckCircle2, ShieldAlert } from "lucide-react";
import DecryptedText from "./reactbits/DecryptedText";

export default function RouteVisualizer() {
  const [activeTab, setActiveTab] = useState<"safe" | "fast">("safe");

  return (
    <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <DecryptedText text="SIMULASI ALGORITMA RUTE TERAMAN" speed={30} />
          </div>
          <h3 className="text-xl font-bold text-white">Komparasi Rute Perjalanan Malam Hari</h3>
        </div>

        {/* Tab switch */}
        <div className="inline-flex p-1 rounded-xl bg-zinc-950 border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("safe")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "safe"
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Rute JalanAman (Aman)
          </button>
          <button
            onClick={() => setActiveTab("fast")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "fast"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Rute Biasa (Beresiko)
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Mockup */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map visualization area */}
        <div className="lg:col-span-2 relative h-72 sm:h-80 rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden flex items-center justify-center p-6">
          {/* Subtle Map Grid */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Road Network SVG */}
          <svg className="w-full h-full" viewBox="0 0 600 300" fill="none">
            {/* Background street lines */}
            <path d="M 50 150 Q 200 80 350 150 T 550 150" stroke="#27272a" strokeWidth="18" strokeLinecap="round" />
            <path d="M 120 40 L 120 260" stroke="#27272a" strokeWidth="12" strokeLinecap="round" />
            <path d="M 460 40 L 460 260" stroke="#27272a" strokeWidth="12" strokeLinecap="round" />
            <path d="M 50 220 Q 300 240 550 200" stroke="#27272a" strokeWidth="16" strokeLinecap="round" />

            {/* Red Danger Zone (Zone Rawan Kejahatan) */}
            <circle cx="280" cy="120" r="55" fill="rgba(244, 63, 94, 0.12)" stroke="rgba(244, 63, 94, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
            <text x="240" y="125" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="bold">
              ZONA RAWAN
            </text>

            {/* Active Route Path */}
            {activeTab === "safe" ? (
              // Safe Route (detour through lit, safe corridor)
              <path
                d="M 60 220 Q 250 240 380 210 Q 460 200 540 180"
                stroke="#10b981"
                strokeWidth="5"
                strokeLinecap="round"
                className="animate-pulse"
              />
            ) : (
              // Fast but dangerous route through dark zone
              <path
                d="M 60 150 Q 200 80 350 150 T 540 180"
                stroke="#f43f5e"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="6 6"
              />
            )}

            {/* Start Pin */}
            <circle cx="60" cy={activeTab === "safe" ? 220 : 150} r="9" fill="#38bdf8" />
            <text x="40" y={activeTab === "safe" ? 245 : 175} fill="#94a3b8" fontSize="11" fontWeight="600">
              Titik Awal
            </text>

            {/* End Pin */}
            <circle cx="540" cy="180" r="9" fill="#10b981" />
            <text x="505" y="205" fill="#94a3b8" fontSize="11" fontWeight="600">
              Tujuan (Rumah)
            </text>

            {/* Police Station checkpoint on Safe route */}
            {activeTab === "safe" && (
              <g transform="translate(360, 200)">
                <circle cx="0" cy="0" r="14" fill="#065f46" stroke="#34d399" strokeWidth="2" />
                <text x="-6" y="4" fill="#a7f3d0" fontSize="10" fontWeight="bold">POL</text>
              </g>
            )}
          </svg>

          {/* Floating Safety Alert Badge */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs">
            {activeTab === "safe" ? (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Indeks Keamanan: 96/100 (Sangat Aman)</span>
                  <span className="text-zinc-400 text-[11px]">Melewati koridor jalan protokol, lampu jalan aktif, & Pos Polisi.</span>
                </div>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-bold text-rose-300 block">Indeks Keamanan: 38/100 (Beresiko Tinggi)</span>
                  <span className="text-zinc-400 text-[11px]">Rute melintasi area minim lampu & 3 rekam jejak kriminalitas jam malam.</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Route Details Card */}
        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Analisis Navigasi</span>
            <h4 className="text-base font-bold text-white mt-1">
              {activeTab === "safe" ? "Rekomendasi JalanAman" : "Navigasi Standar Aplikasi Lain"}
            </h4>

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/80">
                <span className="text-zinc-400">Estimasi Waktu</span>
                <span className="font-semibold text-white">
                  {activeTab === "safe" ? "18 Menit (+3 mnt memutar)" : "15 Menit (Tercepat)"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/80">
                <span className="text-zinc-400">Penerangan Jalan</span>
                <span className={activeTab === "safe" ? "font-semibold text-emerald-400" : "font-semibold text-rose-400"}>
                  {activeTab === "safe" ? "92% Terang Benderang" : "40% Gelap / Minim Lampu"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/80">
                <span className="text-zinc-400">Titik Rawan / Begal</span>
                <span className={activeTab === "safe" ? "font-semibold text-emerald-400" : "font-semibold text-rose-400"}>
                  {activeTab === "safe" ? "0 Titik Dihindari" : "2 Titik Rawan Terlintasi"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-400">Pos Pengamanan</span>
                <span className="font-semibold text-white">
                  {activeTab === "safe" ? "1 Pos Polisi & 2 Titik Ramai" : "Tidak Ada"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Prioritas utama: <strong>Pulang selamat sampai tujuan</strong>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
