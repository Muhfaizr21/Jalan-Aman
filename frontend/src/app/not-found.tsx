"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowLeft, Home, Compass, ShieldCheck, MapPin } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/#rute`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-neutral-950 selection:text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN: 404 CONTENT ================= */}
          <div className="lg:col-span-6 relative z-10 flex flex-col items-start text-left">
            
            {/* Concentric Radar Circles behind the search icon */}
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] pointer-events-none -z-10 flex items-center justify-center opacity-60">
              <div className="absolute w-[140px] h-[140px] rounded-full border border-slate-200" />
              <div className="absolute w-[240px] h-[240px] rounded-full border border-slate-200/90" />
              <div className="absolute w-[360px] h-[360px] rounded-full border border-slate-200/70" />
              <div className="absolute w-[480px] h-[480px] rounded-full border border-slate-200/50" />
              <div className="absolute w-[620px] h-[620px] rounded-full border border-slate-100" />
            </div>

            {/* Search Icon Container */}
            <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] flex items-center justify-center text-slate-800 mb-6">
              <Search className="w-6 h-6 text-slate-700 stroke-[2.2]" />
            </div>

            {/* 404 Error Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-950 tracking-tight leading-none mb-4">
              404 error
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-lg mb-8 leading-relaxed">
              Sorry, the page you are looking for doesn't exist or has been moved. Try searching our site:
            </p>

            {/* Search Bar with Action Button */}
            <form onSubmit={handleSearch} className="w-full max-w-md mb-8">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search our site"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:border-transparent shadow-xs transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 shrink-0 border border-neutral-800"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Action Navigation Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 w-full max-w-md">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to home</span>
              </Link>
              <Link
                href="/#rute"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-neutral-900" />
                <span>Simulasi Rute</span>
              </Link>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: 3D ABSTRACT GLASS ARTWORK ================= */}
          <div className="lg:col-span-6 relative flex items-center justify-center w-full">
            <div className="w-full max-w-[540px] aspect-square relative rounded-3xl overflow-hidden border border-slate-200/80 bg-gradient-to-b from-slate-50/80 via-white to-slate-100/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-6 flex items-center justify-center">
              
              {/* Perspective Isometric Grid Floor */}
              <div 
                className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" 
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #cbd5e1 1px, transparent 1px),
                    linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px"
                }}
              />

              {/* Grid Node Crosses */}
              <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:40px_40px]" />

              {/* Ambient Glowing Caustics */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-neutral-300/30 blur-[90px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-slate-300/30 blur-[90px] rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neutral-200/40 blur-[100px] rounded-full pointer-events-none" />

              {/* Pure SVG Isometric 3D Translucent Glass Geometric Composition */}
              <svg
                viewBox="0 0 500 500"
                className="w-full h-full relative z-10 drop-shadow-2xl"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Glass Gradient 1 (Translucent Iridescent) */}
                  <linearGradient id="glassGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="40%" stopColor="#c084fc" stopOpacity="0.45" />
                    <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
                  </linearGradient>

                  {/* Glass Gradient 2 (Purple Violet Sheen) */}
                  <linearGradient id="glassPurple" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0.8" />
                  </linearGradient>

                  {/* Glass Gradient 3 (Cyan Blue Refraction) */}
                  <linearGradient id="glassCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Glass Top Bevel Highlight */}
                  <linearGradient id="bevelLight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                  </linearGradient>

                  {/* Metallic Cylindrical Sheen */}
                  <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="25%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
                  </linearGradient>

                  {/* Frosted Drop Shadow Filter */}
                  <filter id="glassShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="4" dy="12" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Ground Shadow Projections */}
                <ellipse cx="250" cy="390" rx="140" ry="40" fill="#0f172a" fillOpacity="0.08" />
                <ellipse cx="180" cy="350" rx="90" ry="28" fill="#7e22ce" fillOpacity="0.1" />

                {/* 3D Isometric Glass Cube (Back Upper) */}
                <g filter="url(#glassShadow)">
                  {/* Top Face */}
                  <polygon points="340,110 420,150 340,190 260,150" fill="url(#glassGrad1)" stroke="url(#bevelLight)" strokeWidth="1.5" />
                  {/* Left Face */}
                  <polygon points="260,150 340,190 340,280 260,240" fill="url(#glassCyan)" fillOpacity="0.4" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  {/* Right Face */}
                  <polygon points="340,190 420,150 420,240 340,280" fill="url(#glassPurple)" fillOpacity="0.3" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                </g>

                {/* 3D Curving Glass Capsule / Ring (Front Left) */}
                <g filter="url(#glassShadow)">
                  {/* Capsule Body */}
                  <rect x="120" y="240" width="80" height="150" rx="40" fill="url(#cylinderGrad)" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
                  {/* Interior Refraction Core */}
                  <rect x="135" y="260" width="50" height="110" rx="25" fill="#ffffff" fillOpacity="0.35" />
                  {/* Specular Glint Highlight */}
                  <path d="M 145 255 Q 160 250 175 255" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="140" y1="280" x2="140" y2="350" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.9" />
                </g>

                {/* 3D Glass Prism (Front Center / Right) */}
                <g filter="url(#glassShadow)">
                  {/* Top Hex / Diamond Face */}
                  <polygon points="250,180 350,230 250,280 150,230" fill="url(#glassGrad1)" stroke="url(#bevelLight)" strokeWidth="2" />
                  {/* Left Front Glass Wall */}
                  <polygon points="150,230 250,280 250,380 150,330" fill="url(#glassPurple)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                  {/* Right Front Glass Wall */}
                  <polygon points="250,280 350,230 350,330 250,380" fill="url(#glassCyan)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                  
                  {/* Inner Structural Refraction Lines */}
                  <line x1="250" y1="280" x2="250" y2="380" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.9" />
                  <line x1="150" y1="230" x2="250" y2="280" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
                  <line x1="350" y1="230" x2="250" y2="280" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
                </g>

                {/* Floating Micro Glass Shards / Prisms */}
                <polygon points="410,290 440,305 410,320 380,305" fill="url(#glassGrad1)" stroke="#ffffff" strokeWidth="1" opacity="0.85" />
                <polygon points="380,305 410,320 410,350 380,335" fill="url(#glassCyan)" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />
                <polygon points="410,320 440,305 440,335 410,350" fill="url(#glassPurple)" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />

                {/* Torus / Circular Glass Ring */}
                <circle cx="360" cy="380" r="45" stroke="url(#cylinderGrad)" strokeWidth="14" fill="none" opacity="0.8" />
                <circle cx="360" cy="380" r="45" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeOpacity="0.9" />

                {/* Sparkling Flare Stars */}
                <g transform="translate(180, 210)">
                  <path d="M 0 -12 Q 0 0 12 0 Q 0 0 0 12 Q 0 0 -12 0 Q 0 0 0 -12" fill="#ffffff" />
                </g>
                <g transform="translate(360, 160)">
                  <path d="M 0 -8 Q 0 0 8 0 Q 0 0 0 8 Q 0 0 -8 0 Q 0 0 0 -8" fill="#ffffff" />
                </g>
              </svg>

              {/* Floating Minimalist Status Tag */}
              <div className="absolute bottom-5 right-5 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-lg text-[11px] font-mono font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span>PAGE_NOT_FOUND (404)</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
