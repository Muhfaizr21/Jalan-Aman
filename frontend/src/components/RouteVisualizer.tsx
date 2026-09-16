"use client";

import { useState } from "react";
import { ShieldCheck, AlertOctagon, Navigation, MapPin, Eye, CheckCircle2, ShieldAlert } from "lucide-react";

export default function RouteVisualizer() {
  const [activeTab, setActiveTab] = useState<"safe" | "fast">("safe");

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-neutral-900/80 shadow-2xl backdrop-blur-xl p-4 sm:p-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-white/[0.08]">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">Komparasi Rute Perjalanan Malam Hari</h3>
        </div>

        {/* Tab switch */}
        <div className="flex w-full sm:w-auto p-1 rounded-xl bg-neutral-950/90 border border-white/[0.08]">
          <button
            onClick={() => setActiveTab("safe")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
              activeTab === "safe"
                ? "bg-white text-neutral-950 shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Rute JalanAman</span>
          </button>
          <button
            onClick={() => setActiveTab("fast")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
              activeTab === "fast"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Rute Peta Biasa</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Mockup */}
      <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Map visualization area */}
        <div className="lg:col-span-2 relative h-56 sm:h-80 rounded-xl sm:rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center p-4 sm:p-6 shadow-inner">
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
            <text x="242" y="124" fill="#fb7185" fontSize="11" fontWeight="bold">
              ZONA RAWAN
            </text>

            {/* Active Route Path */}
            {activeTab === "safe" ? (
              // Safe Route (detour through lit, safe corridor)
              <path
                d="M 60 220 Q 250 240 380 210 Q 460 200 540 180"
                stroke="#38bdf8"
                strokeWidth="5"
                strokeLinecap="round"
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
              Titik Berangkat
            </text>

            {/* End Pin */}
            <circle cx="540" cy="180" r="9" fill="#ffffff" />
            <text x="505" y="205" fill="#94a3b8" fontSize="11" fontWeight="600">
              Tujuan (Rumah)
            </text>

            {/* Police Station checkpoint on Safe route */}
            {activeTab === "safe" && (
              <g transform="translate(360, 200)">
                <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="-6" y="4" fill="#ffffff" fontSize="10" fontWeight="bold">POL</text>
              </g>
            )}
          </svg>

          {/* Floating Safety Alert Badge */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-neutral-950/95 backdrop-blur-md border border-white/[0.1] rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs shadow-xl">
            {activeTab === "safe" ? (
              <>
                <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Skor Aman: 96/100 (Jalur Terang & Terlindungi)</span>
                  <span className="text-neutral-400 text-[11px]">Melewati koridor lampu jalan aktif, jalan protokol ramai, & Pos Polisi.</span>
                </div>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <span className="font-bold text-rose-300 block">Skor Keamanan: 38/100 (Tinggi Risiko Ambush)</span>
                  <span className="text-neutral-400 text-[11px]">Jalan pintas gelap minim lampu & 3 riwayat kasus begal larut malam.</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Route Details Card */}
        <div className="rounded-2xl bg-neutral-950/80 border border-white/[0.08] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-xs font-semibold text-neutral-400">Perbandingan Logika Rute</span>
            <h4 className="text-base font-bold text-white mt-1">
              {activeTab === "safe" ? "Rekomendasi JalanAman" : "Navigasi Standar Aplikasi Lain"}
            </h4>

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                <span className="text-neutral-400">Estimasi Waktu</span>
                <span className="font-semibold text-white">
                  {activeTab === "safe" ? "18 Menit (+3 mnt demi keselamatan)" : "15 Menit (Hanya mengejar cepat)"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                <span className="text-neutral-400">Penerangan Jalan</span>
                <span className={activeTab === "safe" ? "font-semibold text-sky-400" : "font-semibold text-rose-400"}>
                  {activeTab === "safe" ? "92% Lampu PJU Menyala" : "40% Gelap Gulita"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/[0.06]">
                <span className="text-neutral-400">Titik Rawan Begal</span>
                <span className={activeTab === "safe" ? "font-semibold text-emerald-400" : "font-semibold text-rose-400"}>
                  {activeTab === "safe" ? "0 Titik (Dihindari Penuh)" : "2 Titik Rawan Dilalui"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-neutral-400">Pos Pengamanan</span>
                <span className="font-semibold text-white">
                  {activeTab === "safe" ? "1 Pos Polisi & 2 Titik Ramai" : "Tidak Ada"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Prioritas mutlak: <strong className="text-white">Sampai di rumah dengan selamat</strong>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
