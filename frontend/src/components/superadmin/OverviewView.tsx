'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { 
  chartDataCategory, 
  chartDataTime, 
  chartDataRegion, 
  chartDataResolution,
  mockIncidents,
  topHotspots,
  systemHealth,
  chartDataModel,
  chartDataWeekly
} from './mockData';
import { AlertTriangle, Map, BrainCircuit, Users, ShieldAlert, Activity, RefreshCw, Download, Server, ChevronRight } from 'lucide-react';

const DemographicMap = dynamic(() => import('./DemographicMap'), { ssr: false, loading: () => <div className="w-full h-full bg-[#0a0a0a] animate-pulse rounded-lg border border-white/[0.05]" /> });

const PIE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

function MetricCard({ title, value, icon: Icon, trend, trendUp }: any) {
  return (
    <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-3.5 sm:p-5 flex flex-col gap-2 sm:gap-3 relative overflow-hidden group hover:border-white/[0.15] transition-colors">
      <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-12 h-12 sm:w-16 sm:h-16" />
      </div>
      <div className="flex items-center justify-between text-zinc-400 relative z-10">
        <span className="text-xs sm:text-sm font-medium truncate">{title}</span>
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-500 shrink-0" />
      </div>
      <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2 relative z-10">
        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-md ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#050505]/95 border border-white/[0.1] rounded-lg p-3 shadow-xl backdrop-blur-md">
        <p className="text-sm font-medium text-zinc-300 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-white font-medium">{entry.value}</span>
            <span className="text-zinc-500">{entry.name}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function OverviewView() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Dashboard Command Center</h2>
          <p className="text-sm text-zinc-400">Ringkasan operasional, telemetri sistem, dan analitik crowdsourcing 5W1H.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-zinc-300 bg-[#0a0a0a] border border-white/[0.08] rounded-lg hover:bg-white/[0.04] transition-colors">
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Retrain Model
          </button>
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors border border-blue-500/50">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Export Harian
          </button>
        </div>
      </div>

      {/* 5 Cards - 2 cols on mobile, 3 on tablet, 5 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <MetricCard title="Total Insiden" value="1,240" icon={AlertTriangle} trend="12%" trendUp={false} />
        <MetricCard title="Klaster Aktif" value="14" icon={Map} trend="2" trendUp={false} />
        <MetricCard title="Akurasi Model" value="89.7%" icon={BrainCircuit} trend="1.2%" trendUp={true} />
        <MetricCard title="Pengguna Aktif" value="2,500" icon={Users} trend="18%" trendUp={true} />
        <div className="col-span-2 sm:col-span-1">
          <MetricCard title="Peringatan Kritis" value="3" icon={ShieldAlert} trend="1" trendUp={false} />
        </div>
      </div>

      {/* Bento Grid - Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ROW 1: Demographic Map & Live Feed */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-2 flex flex-col relative h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-zinc-300">Peta Demografi & Wilayah (Where & Who)</h3>
              <p className="text-xs text-zinc-500">Sebaran tingkat kepercayaan (Trust Score) pelapor berbasis wilayah.</p>
            </div>
            <button className="text-xs text-blue-400 hover:text-blue-300">Lihat Penuh &rarr;</button>
          </div>
          <div className="flex-1 w-full relative rounded-lg overflow-hidden border border-white/[0.05]">
             <DemographicMap />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-0 lg:col-span-2 flex flex-col overflow-hidden h-[400px]">
          <div className="p-5 border-b border-white/[0.05] flex items-center justify-between bg-black/20">
            <div>
              <h3 className="text-sm font-medium text-zinc-300">Live Incident Feed (What & When)</h3>
              <p className="text-xs text-zinc-500">Laporan terbaru yang membutuhkan verifikasi.</p>
            </div>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#050505] text-zinc-400 sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-3 font-medium">ID Laporan</th>
                  <th className="px-5 py-3 font-medium">Kategori</th>
                  <th className="px-5 py-3 font-medium">Lokasi</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {mockIncidents.filter(i => i.status === 'Pending').map((inc) => (
                  <tr key={inc.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4 text-zinc-300 font-mono text-xs">{inc.id}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-zinc-300">{inc.category}</span>
                    </td>
                    <td className="px-5 py-4 text-zinc-400 max-w-[150px] truncate">{inc.locationName}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-blue-400 hover:text-blue-300 text-xs font-medium opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 2: Time Trend, Categories, System Health */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-2 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-medium text-zinc-300 mb-1">Aktivitas Jam Rawan (When)</h3>
          <p className="text-xs text-zinc-500 mb-6">Volume laporan dalam siklus 24 jam</p>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartDataTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="incidents" name="Insiden" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0a0a0a', stroke: '#3b82f6', strokeWidth: 2 }} filter="url(#glow)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-1 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-medium text-zinc-300 mb-1">Kategori (What)</h3>
          <p className="text-xs text-zinc-500 mb-6">Distribusi kasus terbanyak</p>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataCategory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCategory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff03' }} />
                <Bar dataKey="value" name="Laporan" fill="url(#colorCategory)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Widget */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-1 flex flex-col">
          <h3 className="text-sm font-medium text-zinc-300 mb-1 flex items-center gap-2"><Server className="w-4 h-4 text-zinc-500" /> AI System Health</h3>
          <p className="text-xs text-zinc-500 mb-4">Telemetri mesin di balik layar.</p>
          <div className="flex-1 flex flex-col gap-3 justify-center">
            {systemHealth.map(sys => (
              <div key={sys.id} className="p-3 rounded-lg border border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-300">{sys.name}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Last sync: {sys.lastSync}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${sys.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {sys.status}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1">{sys.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: Verification Rate, Region Pie, Top 3 Hotspots */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-2 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-medium text-zinc-300 mb-1">Rasio Verifikasi (Why/How)</h3>
          <p className="text-xs text-zinc-500 mb-6">Efektivitas sistem moderasi per bulan</p>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartDataResolution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="month" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="verified" name="Terverifikasi" stroke="#10b981" fillOpacity={1} fill="url(#colorVerified)" strokeWidth={2} activeDot={{ r: 6, fill: '#0a0a0a', stroke: '#10b981', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-1 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-medium text-zinc-300 mb-1">Konsentrasi (Where)</h3>
          <p className="text-xs text-zinc-500 mb-6">Insiden per kota administratif</p>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartDataRegion} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none" cornerRadius={4}>
                  {chartDataRegion.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-xl font-bold text-white">400+</span>
            </div>
          </div>
        </div>

        {/* Top 3 Hotspots Widget */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-1 flex flex-col">
          <h3 className="text-sm font-medium text-zinc-300 mb-1 flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500" /> Top 3 Zona Merah</h3>
          <p className="text-xs text-zinc-500 mb-4">Titik paling rawan hari ini.</p>
          <div className="flex-1 flex flex-col gap-3 justify-center">
            {topHotspots.map((hotspot, i) => (
              <div key={hotspot.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05] transition-colors cursor-pointer group">
                <div className="w-6 h-6 rounded bg-rose-500/10 text-rose-500 flex items-center justify-center text-xs font-bold border border-rose-500/20">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-white transition-colors">{hotspot.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{hotspot.area}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-zinc-300">{hotspot.newIncidents}</span>
                  <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: Model Evaluation & Weekly Stacked */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-1 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-medium text-zinc-300 mb-1">Evaluasi Model AI</h3>
          <p className="text-xs text-zinc-500 mb-6">Metrik klasifikasi Random Forest</p>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartDataModel}>
                <PolarGrid stroke="#ffffff15" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skor Saat Ini" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-5 lg:col-span-3 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-medium text-zinc-300 mb-1">Tren Status Laporan (4 Minggu)</h3>
          <p className="text-xs text-zinc-500 mb-6">Distribusi penyelesaian dan moderasi laporan</p>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataWeekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="week" stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff03' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }} />
                <Bar dataKey="verified" name="Terverifikasi" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} maxBarSize={40} />
                <Bar dataKey="pending" name="Menunggu" stackId="a" fill="#f59e0b" maxBarSize={40} />
                <Bar dataKey="rejected" name="Ditolak" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
