'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Layers, Map, Filter, RefreshCw, Settings2, Play, CheckCircle2, History, Info, Search
} from 'lucide-react';
import { mockClusters } from './mockData';

// Dynamically import the map to avoid SSR issues with leaflet
const ClusterMap = dynamic(() => import('./ClusterMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl flex items-center justify-center flex-col gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
      <p className="text-sm text-zinc-500 font-medium">Memuat mesin pemetaan...</p>
    </div>
  ),
});

export function ClusterManagementView() {
  const [showRaw, setShowRaw] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const [showPolice, setShowPolice] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: -6.2088, lng: 106.8456 });

  const [eps, setEps] = useState(200);
  const [minSamples, setMinSamples] = useState(3);
  const [isRetraining, setIsRetraining] = useState(false);
  const [lastRun, setLastRun] = useState('2 Menit yang lalu');

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      setLastRun('Baru saja');
    }, 2500); // mock loading
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] pb-6 gap-6">
      {/* Header */}
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Dashboard Peta Klaster (DBSCAN)</h2>
          <p className="text-sm text-zinc-400">Visualisasi hasil pengelompokan titik rawan berbasis kepadatan (Density-Based Spatial Clustering).</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-zinc-300">DBSCAN Engine <span className="text-emerald-400 font-mono">Online</span></span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Panel: Map */}
        <div className="flex-1 rounded-xl relative overflow-hidden bg-[#0a0a0a] border border-white/[0.08] flex flex-col">
          {/* Map Controls Overlay - Left (Search) */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 w-56">
            <div className="bg-[#050505]/90 backdrop-blur-sm border border-white/[0.1] rounded-lg p-2 shadow-2xl flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <Search className="w-3 h-3 text-zinc-400" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Pencarian Area</h4>
              </div>
              <select 
                className="bg-black/50 border border-white/[0.1] text-xs text-white rounded p-1.5 focus:outline-none focus:border-blue-500/50 hover:bg-white/5 transition-colors appearance-none cursor-pointer"
                onChange={(e) => {
                  const [lat, lng] = e.target.value.split(',');
                  setMapCenter({ lat: parseFloat(lat), lng: parseFloat(lng) });
                }}
              >
                <option value="-6.2088,106.8456">Jakarta Pusat</option>
                <option value="-6.2615,106.8163">Jakarta Selatan</option>
                <option value="-6.2250,106.9004">Jakarta Timur</option>
                <option value="-6.1500,106.9000">Jakarta Utara</option>
                <option value="-6.1600,106.7500">Jakarta Barat</option>
                <option value="-6.4025,106.8227">Depok</option>
                <option value="-6.2415,106.9924">Bekasi</option>
                <option value="-6.1783,106.6319">Tangerang</option>
              </select>
            </div>
          </div>

          {/* Map Controls Overlay - Right */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <div className="bg-[#050505]/90 backdrop-blur-sm border border-white/[0.1] rounded-lg p-2 shadow-2xl flex flex-col gap-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 px-1">Toggle Layers</h4>
              <label className="flex items-center gap-2 text-xs text-white hover:bg-white/5 p-1 rounded cursor-pointer transition-colors">
                <input type="checkbox" checked={showRaw} onChange={(e) => setShowRaw(e.target.checked)} className="rounded border-white/[0.2] bg-transparent" />
                Laporan Mentah
              </label>
              <label className="flex items-center gap-2 text-xs text-white hover:bg-white/5 p-1 rounded cursor-pointer transition-colors">
                <input type="checkbox" checked={showClusters} onChange={(e) => setShowClusters(e.target.checked)} className="rounded border-white/[0.2] bg-transparent" />
                Hasil Klaster (DBSCAN)
              </label>
              <label className="flex items-center gap-2 text-xs text-white hover:bg-white/5 p-1 rounded cursor-pointer transition-colors">
                <input type="checkbox" checked={showPolice} onChange={(e) => setShowPolice(e.target.checked)} className="rounded border-white/[0.2] bg-transparent" />
                Historis Kepolisian
              </label>
            </div>
            
            <div className="bg-[#050505]/90 backdrop-blur-sm border border-white/[0.1] rounded-lg p-3 shadow-2xl flex flex-col gap-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Legenda Bahaya</h4>
              <div className="flex items-center gap-2 text-[11px] text-zinc-300"><span className="w-3 h-3 rounded-full bg-rose-500 opacity-60"></span> Kritis</div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-300"><span className="w-3 h-3 rounded-full bg-orange-500 opacity-60"></span> Tinggi</div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-300"><span className="w-3 h-3 rounded-full bg-yellow-500 opacity-60"></span> Sedang</div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-300"><span className="w-3 h-3 rounded-full bg-blue-500 opacity-60"></span> Rendah</div>
              <div className="flex items-center gap-2 text-[11px] text-zinc-300 mt-1 border-t border-white/[0.1] pt-1"><span className="w-3 h-3 rounded-full border border-red-800 border-dashed bg-red-900/30"></span> Zona Polisi</div>
            </div>
          </div>

          <div className="flex-1 relative z-0">
            <ClusterMap showRaw={showRaw} showClusters={showClusters} showPolice={showPolice} center={mapCenter} />
          </div>
          
          {/* Map Footer Bar */}
          <div className="h-10 bg-[#050505] border-t border-white/[0.08] shrink-0 flex items-center justify-between px-4 text-[11px] text-zinc-500 z-10">
            <div className="flex items-center gap-4">
              <span>Center: -6.2088, 106.8456 (Jakarta)</span>
              <span>Zoom: 12</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Layer tersinkronisasi
            </div>
          </div>
        </div>

        {/* Right Panel: Controls & Details */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-1">
          
          {/* Action Box: Tuning */}
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition-all duration-500 group-hover:bg-blue-500/10"></div>
            
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Settings2 className="w-4 h-4 text-blue-400" /> Tuning DBSCAN
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="text-xs font-medium text-zinc-400">Radius (Epsilon / meter)</label>
                  <span className="text-xs font-mono text-white bg-white/5 px-1.5 rounded">{eps}m</span>
                </div>
                <input 
                  type="range" min="50" max="1000" step="50"
                  value={eps} onChange={(e) => setEps(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <label className="text-xs font-medium text-zinc-400">Min. Samples (Insiden)</label>
                  <span className="text-xs font-mono text-white bg-white/5 px-1.5 rounded">{minSamples}</span>
                </div>
                <input 
                  type="range" min="2" max="20" step="1"
                  value={minSamples} onChange={(e) => setMinSamples(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleRetrain}
                  disabled={isRetraining}
                  className="w-full bg-white text-black font-semibold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRetraining ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Re-run Clustering
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-zinc-500 mt-2 flex justify-center items-center gap-1">
                  <Info className="w-3 h-3" /> Memproses dataset verified terakhir
                </p>
              </div>
            </div>
          </div>

          {/* History Run */}
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col flex-1 min-h-[250px]">
            <div className="p-4 border-b border-white/[0.05] bg-[#050505]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-400" /> Riwayat Eksekusi
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="relative pl-4 border-l border-white/10 space-y-4">
                
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#0a0a0a]"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-white font-medium">{lastRun}</span>
                    <span className="text-[11px] text-zinc-400 font-mono">eps: {eps}, min: {minSamples}</span>
                    <span className="text-[11px] text-zinc-500">Hasil: {mockClusters.length} klaster ditemukan. Durasi: 1.2s</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-600 ring-4 ring-[#0a0a0a]"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-300 font-medium">Kemarin, 14:00</span>
                    <span className="text-[11px] text-zinc-500 font-mono">eps: 250, min: 4</span>
                    <span className="text-[11px] text-zinc-600">Hasil: 5 klaster ditemukan. Durasi: 1.5s</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-600 ring-4 ring-[#0a0a0a]"></div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-zinc-300 font-medium">25 Okt 2023, 08:30</span>
                    <span className="text-[11px] text-zinc-500 font-mono">eps: 200, min: 3</span>
                    <span className="text-[11px] text-zinc-600">Hasil: 8 klaster ditemukan. Durasi: 2.1s</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
