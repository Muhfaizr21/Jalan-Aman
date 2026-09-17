'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';
import { 
  Download, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Compass, 
  Navigation, 
  MapPin, 
  CheckCircle2, 
  ChevronDown, 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Layers, 
  Building2, 
  Info, 
  X,
  Crosshair,
  Users,
  Lightbulb,
  Route,
  Zap
} from 'lucide-react';
import { 
  mockHourlyDistribution, 
  mockRouteComparisonData, 
  mockHazardousZones, 
  mockTrendDatasets,
  mockIncidents,
  mockContributingFactors,
  mockReporterDemographics
} from './mockData';
import { 
  AnalyticsTimeRange, 
  HazardousZoneItem, 
  HourlyIncidentStat,
  IncidentCategory
} from '../../types/superadmin';
import { formatNumber } from '../../lib/utils';

// Dynamically import Leaflet Map to avoid SSR errors
const AnalyticsLiveMap = dynamic(() => import('./AnalyticsLiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] bg-[#0a0a0a] rounded-xl border border-white/[0.08] flex flex-col items-center justify-center text-zinc-500 animate-pulse">
      <Compass className="w-8 h-8 mb-2 animate-spin text-zinc-600" />
      <span className="text-xs">Memuat peta spatiotemporal...</span>
    </div>
  ),
});

// Palette constants matching JalanAman dark aesthetics
const CATEGORY_COLORS: Record<string, string> = {
  Begal: '#f43f5e',         // Rose red
  Pelecehan: '#d946ef',     // Fuchsia
  Kecelakaan: '#f59e0b',    // Amber
  Infrastruktur: '#06b6d4', // Cyan
  Lainnya: '#8b5cf6',       // Purple
};

const REGION_COLORS: Record<string, string> = {
  JakartaSelatan: '#3b82f6',
  JakartaPusat: '#6366f1',
  JakartaBarat: '#10b981',
  JakartaTimur: '#f97316',
  JakartaUtara: '#ec4899',
  Bodetabek: '#14b8a6',
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0c0c0e]/95 border border-white/[0.12] rounded-xl p-3 shadow-2xl backdrop-blur-md min-w-[180px]">
        <p className="text-xs font-semibold text-zinc-300 mb-2 border-b border-white/[0.08] pb-1.5">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-zinc-400 capitalize">{entry.name}</span>
              </div>
              <span className="text-white font-semibold tabular-nums">{formatNumber(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function AnalyticsView() {
  // Time Range & Filter State
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('30d');
  const [trendViewType, setTrendViewType] = useState<'category' | 'region'>('category');
  const [chartVisualType, setChartVisualType] = useState<'area' | 'bar'>('area');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Semua');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('Semua');

  // Interactive Live Map State
  const [selectedZoneOnMap, setSelectedZoneOnMap] = useState<HazardousZoneItem | null>(mockHazardousZones[0]);
  const [mapCategoryFilter, setMapCategoryFilter] = useState<string>('Semua');

  // Top Zones Table State
  const [zoneLimit, setZoneLimit] = useState<5 | 10>(10);
  const [zoneRegionFilter, setZoneRegionFilter] = useState<string>('Semua');
  const [zoneSearchQuery, setZoneSearchQuery] = useState<string>('');
  const [selectedZoneDetail, setSelectedZoneDetail] = useState<HazardousZoneItem | null>(null);

  // Export State & Toast
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportTargetType, setExportTargetType] = useState<'police' | 'government' | 'top_zones' | 'route_telemetry'>('police');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel_csv'>('excel_csv');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Trend Data for current selected timeRange
  const rawTrendData = mockTrendDatasets[timeRange] || mockTrendDatasets['30d'];

  // Filtered Trend Data
  const currentTrendData = useMemo(() => {
    return rawTrendData.map((item) => {
      let filteredTotal = item.total;
      if (selectedCategoryFilter !== 'Semua') {
        const catKey = selectedCategoryFilter.toLowerCase() as keyof typeof item;
        filteredTotal = Number(item[catKey] ?? 0);
      }
      return {
        ...item,
        displayTotal: filteredTotal,
      };
    });
  }, [rawTrendData, selectedCategoryFilter]);

  // Filtered Top Hazardous Zones
  const filteredZones = useMemo(() => {
    return mockHazardousZones
      .filter((zone) => {
        const matchRegion = zoneRegionFilter === 'Semua' || zone.region.toLowerCase().includes(zoneRegionFilter.toLowerCase());
        const matchSearch = zone.name.toLowerCase().includes(zoneSearchQuery.toLowerCase()) ||
                            zone.region.toLowerCase().includes(zoneSearchQuery.toLowerCase()) ||
                            zone.dominantCategory.toLowerCase().includes(zoneSearchQuery.toLowerCase());
        return matchRegion && matchSearch;
      })
      .slice(0, zoneLimit);
  }, [zoneRegionFilter, zoneSearchQuery, zoneLimit]);

  // Hourly stats aggregation
  const nightDangerTotal = useMemo(() => {
    return mockHourlyDistribution
      .filter((h) => h.isPeakDanger)
      .reduce((acc, curr) => acc + curr.total, 0);
  }, []);

  const total24HourIncidents = useMemo(() => {
    return mockHourlyDistribution.reduce((acc, curr) => acc + curr.total, 0);
  }, []);

  const nightDangerPercentage = ((nightDangerTotal / total24HourIncidents) * 100).toFixed(1);

  // Focus a specific corridor on the live map
  const handleFocusCorridorOnMap = (zone: HazardousZoneItem) => {
    setSelectedZoneOnMap(zone);
    const mapElement = document.getElementById('live-spatiotemporal-map');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    showToast(`Peta dipusatkan ke: ${zone.name}`);
  };

  // Export File Generator (CSV / Excel formatted with BOM)
  const handleExportData = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility
    let fileName = `JalanAman_Export_${timestamp}.csv`;

    if (exportTargetType === 'police') {
      fileName = `Laporan_Kepolisian_Polda_Metro_${timestamp}.csv`;
      csvContent += 'No,ID Insiden,Kategori,Tingkat Bahaya (1-10),Wilayah / Lokasi,Koordinat Lat,Koordinat Lng,Waktu Kejadian,Status Verifikasi,Deskripsi Lapangan,Pelapor ID\n';
      mockIncidents.forEach((inc, idx) => {
        const row = [
          idx + 1,
          `"${inc.id}"`,
          `"${inc.category}"`,
          inc.dangerScore,
          `"${inc.locationName.replace(/"/g, '""')}"`,
          inc.coordinates.lat,
          inc.coordinates.lng,
          `"${inc.timestamp}"`,
          `"${inc.status}"`,
          `"${inc.description.replace(/"/g, '""')}"`,
          `"${inc.reporterId}"`
        ];
        csvContent += row.join(',') + '\n';
      });
    } else if (exportTargetType === 'government') {
      fileName = `Laporan_Dishub_Pemkot_Infrastruktur_${timestamp}.csv`;
      csvContent += 'Peringkat,Nama Segmen / Koridor,Kota / Wilayah,Kategori Dominan,Total Laporan,Skor Bahaya (0-100),Kondisi Lampu PJU,Jarak Pos Polisi Terdekat (m),Jam Paling Rawan,Rekomendasi Intervensi Teknis\n';
      mockHazardousZones.forEach((z) => {
        const row = [
          z.rank,
          `"${z.name.replace(/"/g, '""')}"`,
          `"${z.region} (${z.city})"`,
          `"${z.dominantCategory}"`,
          z.incidentCount,
          z.riskScore,
          `"${z.lightingStatus}"`,
          z.policeDistanceMeters,
          `"${z.peakHours}"`,
          `"${z.recommendedIntervention.replace(/"/g, '""')}"`
        ];
        csvContent += row.join(',') + '\n';
      });
    } else if (exportTargetType === 'top_zones') {
      fileName = `Top_Wilayah_Rawan_Jabodetabek_${timestamp}.csv`;
      csvContent += 'Peringkat,ID Zona,Nama Koridor,Wilayah,Tingkat Risiko,Skor Risiko,Total Insiden,Kategori Dominan,Jam Rawan,Tren,Jarak Pos Polisi (m),Tindakan Rekomendasi\n';
      mockHazardousZones.forEach((z) => {
        const row = [
          z.rank,
          `"${z.id}"`,
          `"${z.name.replace(/"/g, '""')}"`,
          `"${z.region}"`,
          `"${z.dangerLevel}"`,
          z.riskScore,
          z.incidentCount,
          `"${z.dominantCategory}"`,
          `"${z.peakHours}"`,
          `"${z.trend === 'up' ? '+' : z.trend === 'down' ? '-' : ''}${z.trendPercent}%"`,
          z.policeDistanceMeters,
          `"${z.recommendedIntervention.replace(/"/g, '""')}"`
        ];
        csvContent += row.join(',') + '\n';
      });
    } else {
      fileName = `Telemetri_Komparasi_Rute_Warga_${timestamp}.csv`;
      csvContent += 'Bulan,Total Pencarian Rute,Pilihan Rute Aman (%),Pilihan Rute Tercepat (%),Selisih Rerata Waktu (Menit)\n';
      mockRouteComparisonData.monthlyTrends.forEach((m) => {
        const row = [
          `"${m.month}"`,
          m.totalSearches,
          m.safePct,
          m.fastestPct,
          m.avgTimeDiffMin
        ];
        csvContent += row.join(',') + '\n';
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportModal(false);
    showToast(`Berhasil mengekspor: ${fileName}`);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 max-w-[calc(100vw-2rem)] z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="leading-tight">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Telemetri & Analisis Ruas
            </span>
            <span className="text-xs text-zinc-500">Peta & Data Terkini</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Panel Statistik & Analisis Spatiotemporal</h2>
          <p className="text-sm text-zinc-400">
            Dinamika ancaman kejahatan, kronologi jam rawan malam, peta sebaran koridor, profil komunitas penglaju, dan telemetri preferensi rute aman.
          </p>
        </div>

        {/* Global Controls: Time Range & Export Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-1 overflow-x-auto">
            {(['7d', '30d', '90d', '1y'] as AnalyticsTimeRange[]).map((range) => {
              const labels: Record<AnalyticsTimeRange, string> = {
                '7d': '7 Hari',
                '30d': '30 Hari',
                '90d': '90 Hari',
                '1y': '1 Tahun',
              };
              const active = timeRange === range;
              return (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                    active 
                      ? 'bg-white/10 text-white shadow-sm border border-white/[0.1]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {labels[range]}
                </button>
              );
            })}
          </div>

          {/* Export Action Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all border border-blue-500/50 shadow-lg shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Insiden */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-white/[0.15] transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2 sm:mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Laporan Masuk</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {timeRange === '7d' ? '248' : timeRange === '30d' ? '718' : timeRange === '90d' ? '1,892' : '8,465'}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Tersebar di 6 wilayah Jabodetabek
          </p>
        </div>

        {/* Card 2: Preferensi Rute Warga */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-white/[0.15] transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2 sm:mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Rute Aman</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {mockRouteComparisonData.safeRoutePct}%
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
              Pilihan Utama
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            {formatNumber(mockRouteComparisonData.safeRouteCount)} dari {formatNumber(mockRouteComparisonData.totalSearches)} query
          </p>
        </div>

        {/* Card 3: Selisih Waktu Tempuh */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-white/[0.15] transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2 sm:mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Deviasi Durasi</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              +{mockRouteComparisonData.avgTimeDifferenceMinutes}
            </span>
            <span className="text-xs font-medium text-zinc-400">Menit / Trip</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            Hindari <span className="text-amber-400 font-semibold">{mockRouteComparisonData.avgHazardsAvoidedCount} titik</span> klaster
          </p>
        </div>

        {/* Card 4: Titik Paling Rawan */}
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-white/[0.15] transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2 sm:mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Koridor Kritis</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
              Casablanca
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded-md border border-rose-500/20">
              Skor 88
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 truncate">
            {mockHazardousZones[0].incidentCount} insiden • {mockHazardousZones[0].peakHours}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEKSI 1: PETA LIVE SPATIOTEMPORAL & SEBARAN KORIDOR GEOGRAFIS */}
      {/* ========================================================================= */}
      <div id="live-spatiotemporal-map" className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Peta Spatiotemporal & Sebaran Koridor Geografis
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                Live Feed
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Visualisasi langsung klaster kerawanan jalan, titik laporan masyarakat terkini, dan jangkauan pos pengamanan.
            </p>
          </div>

          {/* Map Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Filter Kategori di Peta:</span>
              <select
                value={mapCategoryFilter}
                onChange={(e) => setMapCategoryFilter(e.target.value)}
                className="bg-black/50 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Begal">Begal</option>
                <option value="Pelecehan">Pelecehan</option>
                <option value="Kecelakaan">Kecelakaan</option>
                <option value="Infrastruktur">Infrastruktur</option>
              </select>
            </div>

            {selectedZoneOnMap && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300">
                <Crosshair className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-white truncate max-w-[140px]">{selectedZoneOnMap.name}</span>
                <span className="text-rose-400 font-mono">({selectedZoneOnMap.riskScore}/100)</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Map Canvas */}
        <div className="mt-4 h-[440px] w-full rounded-xl overflow-hidden border border-white/[0.08]">
          <AnalyticsLiveMap
            selectedZone={selectedZoneOnMap}
            onSelectZone={(zone) => setSelectedZoneDetail(zone)}
            categoryFilter={mapCategoryFilter}
          />
        </div>

        {/* Map Context Bar */}
        <div className="mt-4 pt-3 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-zinc-500" />
            <span>Klik lingkaran klaster atau pin insiden untuk rincian taktis koordinat lapangan</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Total 10 Koridor Rawan Terpantau</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">14 Pos Siaga Terintegrasi</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEKSI 2: KOMPOSISI & KLASIFIKASI JENIS ANCAMAN */}
      {/* ========================================================================= */}
      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Komposisi & Klasifikasi Jenis Ancaman
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                Rentang: {timeRange.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Dinamika volume laporan masyarakat berdasarkan klasifikasi jenis kejahatan dan wilayah aglomerasi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode */}
            <div className="flex items-center bg-black/40 border border-white/[0.08] rounded-xl p-1">
              <button
                onClick={() => setTrendViewType('category')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  trendViewType === 'category'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Per Kategori
              </button>
              <button
                onClick={() => setTrendViewType('region')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  trendViewType === 'region'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Per Wilayah
              </button>
            </div>

            {/* Visual Type */}
            <div className="flex items-center bg-black/40 border border-white/[0.08] rounded-xl p-1">
              <button
                onClick={() => setChartVisualType('area')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chartVisualType === 'area'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartVisualType('bar')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  chartVisualType === 'bar'
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Batang
              </button>
            </div>

            {trendViewType === 'category' ? (
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-black/50 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Begal">Begal</option>
                <option value="Pelecehan">Pelecehan</option>
                <option value="Kecelakaan">Kecelakaan</option>
                <option value="Infrastruktur">Infrastruktur</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            ) : (
              <select
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                className="bg-black/50 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
              >
                <option value="Semua">Semua Wilayah</option>
                <option value="Jaksel">Jakarta Selatan</option>
                <option value="Jakpus">Jakarta Pusat</option>
                <option value="Jakbar">Jakarta Barat</option>
                <option value="Jaktim">Jakarta Timur</option>
                <option value="Jakut">Jakarta Utara</option>
                <option value="Bodetabek">Bodetabek</option>
              </select>
            )}
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="mt-6 h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartVisualType === 'area' ? (
              <AreaChart data={currentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBegal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_COLORS.Begal} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CATEGORY_COLORS.Begal} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradPelecehan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_COLORS.Pelecehan} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CATEGORY_COLORS.Pelecehan} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradKecelakaan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_COLORS.Kecelakaan} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CATEGORY_COLORS.Kecelakaan} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="gradInfrastruktur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CATEGORY_COLORS.Infrastruktur} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CATEGORY_COLORS.Infrastruktur} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                />

                {trendViewType === 'category' ? (
                  <>
                    {(selectedCategoryFilter === 'Semua' || selectedCategoryFilter === 'Begal') && (
                      <Area type="monotone" dataKey="begal" name="Begal" stroke={CATEGORY_COLORS.Begal} fill="url(#gradBegal)" strokeWidth={2} />
                    )}
                    {(selectedCategoryFilter === 'Semua' || selectedCategoryFilter === 'Pelecehan') && (
                      <Area type="monotone" dataKey="pelecehan" name="Pelecehan" stroke={CATEGORY_COLORS.Pelecehan} fill="url(#gradPelecehan)" strokeWidth={2} />
                    )}
                    {(selectedCategoryFilter === 'Semua' || selectedCategoryFilter === 'Kecelakaan') && (
                      <Area type="monotone" dataKey="kecelakaan" name="Kecelakaan" stroke={CATEGORY_COLORS.Kecelakaan} fill="url(#gradKecelakaan)" strokeWidth={2} />
                    )}
                    {(selectedCategoryFilter === 'Semua' || selectedCategoryFilter === 'Infrastruktur') && (
                      <Area type="monotone" dataKey="infrastruktur" name="Infrastruktur" stroke={CATEGORY_COLORS.Infrastruktur} fill="url(#gradInfrastruktur)" strokeWidth={2} />
                    )}
                    {selectedCategoryFilter === 'Semua' && (
                      <Area type="monotone" dataKey="lainnya" name="Lainnya" stroke={CATEGORY_COLORS.Lainnya} fill="#8b5cf615" strokeWidth={2} />
                    )}
                  </>
                ) : (
                  <>
                    <Area type="monotone" dataKey="regionJaksel" name="Jakarta Selatan" stroke={REGION_COLORS.JakartaSelatan} fill="#3b82f620" strokeWidth={2} />
                    <Area type="monotone" dataKey="regionJakpus" name="Jakarta Pusat" stroke={REGION_COLORS.JakartaPusat} fill="#6366f120" strokeWidth={2} />
                    <Area type="monotone" dataKey="regionJakbar" name="Jakarta Barat" stroke={REGION_COLORS.JakartaBarat} fill="#10b98120" strokeWidth={2} />
                    <Area type="monotone" dataKey="regionJaktim" name="Jakarta Timur" stroke={REGION_COLORS.JakartaTimur} fill="#f9731620" strokeWidth={2} />
                    <Area type="monotone" dataKey="regionJakut" name="Jakarta Utara" stroke={REGION_COLORS.JakartaUtara} fill="#ec489920" strokeWidth={2} />
                    <Area type="monotone" dataKey="regionBodetabek" name="Bodetabek" stroke={REGION_COLORS.Bodetabek} fill="#14b8a620" strokeWidth={2} />
                  </>
                )}
              </AreaChart>
            ) : (
              <BarChart data={currentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '16px', fontSize: '12px' }}
                />

                {trendViewType === 'category' ? (
                  <>
                    <Bar dataKey="begal" name="Begal" fill={CATEGORY_COLORS.Begal} radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="pelecehan" name="Pelecehan" fill={CATEGORY_COLORS.Pelecehan} radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="kecelakaan" name="Kecelakaan" fill={CATEGORY_COLORS.Kecelakaan} radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="infrastruktur" name="Infrastruktur" fill={CATEGORY_COLORS.Infrastruktur} radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="lainnya" name="Lainnya" fill={CATEGORY_COLORS.Lainnya} radius={[4, 4, 0, 0]} stackId="a" />
                  </>
                ) : (
                  <>
                    <Bar dataKey="regionJaksel" name="Jakarta Selatan" fill={REGION_COLORS.JakartaSelatan} radius={[4, 4, 0, 0]} stackId="b" />
                    <Bar dataKey="regionJakpus" name="Jakarta Pusat" fill={REGION_COLORS.JakartaPusat} radius={[4, 4, 0, 0]} stackId="b" />
                    <Bar dataKey="regionJakbar" name="Jakarta Barat" fill={REGION_COLORS.JakartaBarat} radius={[4, 4, 0, 0]} stackId="b" />
                    <Bar dataKey="regionJaktim" name="Jakarta Timur" fill={REGION_COLORS.JakartaTimur} radius={[4, 4, 0, 0]} stackId="b" />
                    <Bar dataKey="regionJakut" name="Jakarta Utara" fill={REGION_COLORS.JakartaUtara} radius={[4, 4, 0, 0]} stackId="b" />
                    <Bar dataKey="regionBodetabek" name="Bodetabek" fill={REGION_COLORS.Bodetabek} radius={[4, 4, 0, 0]} stackId="b" />
                  </>
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Category breakdown summaries */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/[0.08]">
          <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.Begal }} />
              Begal / Curas
            </div>
            <p className="text-lg font-bold text-white mt-1">43.5%</p>
            <span className="text-[11px] text-rose-400">Kriminalitas Dini Hari</span>
          </div>

          <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.Pelecehan }} />
              Pelecehan
            </div>
            <p className="text-lg font-bold text-white mt-1">23.2%</p>
            <span className="text-[11px] text-fuchsia-400">Titik Transit & Stasiun</span>
          </div>

          <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.Kecelakaan }} />
              Kecelakaan
            </div>
            <p className="text-lg font-bold text-white mt-1">18.1%</p>
            <span className="text-[11px] text-amber-400">Persimpangan Cepat</span>
          </div>

          <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.Infrastruktur }} />
              Infrastruktur
            </div>
            <p className="text-lg font-bold text-white mt-1">10.8%</p>
            <span className="text-[11px] text-cyan-400">PJU Padam & Lubang</span>
          </div>

          <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS.Lainnya }} />
              Lainnya
            </div>
            <p className="text-lg font-bold text-white mt-1">4.4%</p>
            <span className="text-[11px] text-zinc-400">Laporan Non-Spesifik</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEKSI 3: KRONOLOGI WAKTU & RITME JAM RAWAN DINI HARI */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 24-Hour Distribution */}
        <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" />
                  Kronologi Waktu & Ritme Jam Rawan Dini Hari
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Distribusi kejadian sepanjang 24 jam dengan lonjakan bahaya pada jam biologis dini hari.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                  Puncak: 01:00 - 04:00 WIB
                </span>
              </div>
            </div>

            {/* 24-Hour Bar Chart */}
            <div className="mt-6 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockHourlyDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" vertical={false} />
                  <XAxis dataKey="hour" stroke="#71717a" fontSize={10} tickLine={false} interval={2} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Total Insiden" radius={[4, 4, 0, 0]}>
                    {mockHourlyDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.isPeakDanger 
                            ? '#f43f5e'
                            : entry.hourNumber >= 21 || entry.hourNumber === 5
                            ? '#f59e0b'
                            : '#3b82f6'
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-3 border-t border-white/[0.05] text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                <span>Jam Rawan Kritis (00:00 - 04:59 WIB)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                <span>Waspada Transisi (21:00 - 23:59 & 05:00)</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span>Aktivitas Normal Siang (06:00 - 20:59)</span>
              </div>
            </div>
          </div>

          {/* Validation Callout */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-rose-950/20 via-black/40 to-transparent border border-rose-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-white">
                  Validasi Ritme Dini Hari: <span className="text-rose-400">{nightDangerPercentage}% Kriminalitas Terkonsentrasi Pukul 00.00 - 05.00 WIB</span>
                </p>
                <p className="text-zinc-400 leading-relaxed">
                  Data crowdsourcing memverifikasi bahwa insiden begal meningkat hingga <strong className="text-zinc-200">3.8x lipat</strong> pada dini hari saat intensitas penerangan menurun dan volume kendaraan umum menipis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Preference & Telemetry */}
        <div className="lg:col-span-5 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  Telemetri Preferensi Rute Warga
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Rasio pilihan rute aman vs tercepat & kompensasi durasi.
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                76.8% Aman
              </span>
            </div>

            {/* Donut Chart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-6">
              <div className="h-[180px] relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Rute Aman', value: mockRouteComparisonData.safeRouteCount },
                        { name: 'Rute Tercepat', value: mockRouteComparisonData.fastestRouteCount },
                      ]}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#475569" />
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white tracking-tight">76.8%</span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Pilih Aman</span>
                </div>
              </div>

              {/* Legend & Count */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Rute Aman
                    </span>
                    <span className="text-white font-bold">{mockRouteComparisonData.safeRoutePct}%</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {formatNumber(mockRouteComparisonData.safeRouteCount)} perjalanan berhasil dialihkan dari zona bahaya.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.08]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-zinc-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500" /> Rute Tercepat
                    </span>
                    <span className="text-white font-bold">{mockRouteComparisonData.fastestRoutePct}%</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {formatNumber(mockRouteComparisonData.fastestRouteCount)} perjalanan murni mengutamakan durasi tempuh minimal.
                  </p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.08]">
              <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
                <span className="text-[11px] text-zinc-400 block mb-0.5">Selisih Waktu Tempuh</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">+{mockRouteComparisonData.avgTimeDifferenceMinutes}</span>
                  <span className="text-xs text-zinc-400">menit</span>
                </div>
                <span className="text-[10px] text-emerald-400 mt-1 block">Rerata deviasi durasi</span>
              </div>

              <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
                <span className="text-[11px] text-zinc-400 block mb-0.5">Klaster Terhindar</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">{mockRouteComparisonData.avgHazardsAvoidedCount}</span>
                  <span className="text-xs text-zinc-400">klaster</span>
                </div>
                <span className="text-[10px] text-blue-400 mt-1 block">Per perjalanan rute aman</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08]">
            <span className="text-xs font-medium text-zinc-400 block mb-2">
              Tren Peningkatan Adopsi Rute Aman (6 Bulan)
            </span>
            <div className="h-20 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRouteComparisonData.monthlyTrends} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar dataKey="safePct" name="Rute Aman (%)" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="fastestPct" name="Rute Tercepat (%)" fill="#475569" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEKSI 4: PROFIL KOMUNITAS PENGLAJU & DEKOMPOSISI FAKTOR AKAR PENYEBAB */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dimensi Profil Komunitas Pelapor */}
        <div className="lg:col-span-6 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                Profil Komunitas Penglaju & Kredibilitas Pelapor
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Sebaran demografi pelapor crowdsourcing dan tingkat kepercayaan komunitas pengguna jalan.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {mockReporterDemographics.map((demo, idx) => (
              <div key={idx} className="bg-black/30 border border-white/[0.05] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{demo.group}</span>
                  <span className="text-xs font-bold text-blue-400">{demo.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${demo.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <span>Kontributor Aktif: <strong className="text-zinc-200">{formatNumber(demo.activeCount)}</strong></span>
                  <span>Rerata Kredibilitas: <strong className="text-emerald-400">{demo.avgTrustScore}/100</strong></span>
                  <span>Verifikasi: <strong className="text-zinc-200">{demo.verificationRate}%</strong></span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-blue-500/[0.05] border border-blue-500/20 text-xs text-zinc-400">
            Kemitraan komunitas pengemudi online berperan sebagai jaringan sensor bergerak alami dalam melaporkan lampu padam dan jalan berlubang secara real-time.
          </div>
        </div>

        {/* Dimensi Dekomposisi Faktor Akar Masalah Kerawanan */}
        <div className="lg:col-span-6 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Dekomposisi Faktor Akar Masalah Kerawanan Ruas Jalan
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Analisis variabel lingkungan fisik yang berkontribusi paling dominan memicu kerawanan koridor.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {mockContributingFactors.map((item, idx) => (
              <div key={idx} className="bg-black/30 border border-white/[0.05] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{item.factor}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      item.impactLevel === 'Kritis'
                        ? 'bg-rose-500/20 text-rose-400'
                        : item.impactLevel === 'Tinggi'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {item.impactLevel}
                    </span>
                    <span className="text-xs font-bold text-white">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      item.impactLevel === 'Kritis' ? 'bg-rose-500' : item.impactLevel === 'Tinggi' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed pt-0.5">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-amber-500/[0.05] border border-amber-500/20 text-xs text-zinc-400">
            Korelasi utama: 82% insiden begal terjadi pada ruas jalan dengan intensitas penerangan minim (&lt;5 lux) dan jarak pos polisi lebih dari 800 meter.
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SEKSI 5: TOP 5–10 WILAYAH PALING RAWAN (DATA TERKINI) */}
      {/* ========================================================================= */}
      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white tracking-tight">
                Top {zoneLimit} Wilayah & Koridor Paling Rawan (Data Terkini)
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                Peringkat Bahaya Terkini
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Agregasi titik rawan hasil pengelompokan spasial DBSCAN dan perhitungan skor risiko Random Forest terkini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Limit Toggle */}
            <div className="flex items-center bg-black/40 border border-white/[0.08] rounded-xl p-1">
              <button
                onClick={() => setZoneLimit(5)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  zoneLimit === 5
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Top 5
              </button>
              <button
                onClick={() => setZoneLimit(10)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  zoneLimit === 10
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Top 10
              </button>
            </div>

            {/* Region Filter */}
            <select
              value={zoneRegionFilter}
              onChange={(e) => setZoneRegionFilter(e.target.value)}
              className="bg-black/50 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
            >
              <option value="Semua">Semua Wilayah</option>
              <option value="Jakarta Selatan">Jakarta Selatan</option>
              <option value="Jakarta Timur">Jakarta Timur</option>
              <option value="Jakarta Barat">Jakarta Barat</option>
              <option value="Jakarta Utara">Jakarta Utara</option>
              <option value="Depok">Depok</option>
              <option value="Bekasi">Bekasi</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={zoneSearchQuery}
                onChange={(e) => setZoneSearchQuery(e.target.value)}
                placeholder="Cari jalan / koridor..."
                className="bg-black/50 border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 w-44"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-white/[0.02] text-zinc-400 border-b border-white/[0.08]">
              <tr>
                <th className="px-4 py-3 font-semibold w-12 text-center">Rank</th>
                <th className="px-4 py-3 font-semibold">Koridor & Wilayah</th>
                <th className="px-4 py-3 font-semibold text-center">Skor Risiko</th>
                <th className="px-4 py-3 font-semibold text-center">Insiden Terkini</th>
                <th className="px-4 py-3 font-semibold">Kategori Dominan</th>
                <th className="px-4 py-3 font-semibold">Jam Paling Rawan</th>
                <th className="px-4 py-3 font-semibold text-center">Tren</th>
                <th className="px-4 py-3 font-semibold">PJU & Pos Polisi</th>
                <th className="px-4 py-3 font-semibold">Aksi Taktis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredZones.map((zone) => {
                const isCritical = zone.dangerLevel === 'Kritis';
                const isWarning = zone.dangerLevel === 'Rawan';

                return (
                  <tr 
                    key={zone.id}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                        zone.rank === 1
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : zone.rank === 2
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : zone.rank === 3
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}>
                        #{zone.rank}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {zone.name}
                      </div>
                      <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        <span>{zone.region}, {zone.city}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`font-bold tabular-nums text-sm ${
                          isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-blue-400'
                        }`}>
                          {zone.riskScore}
                          <span className="text-[10px] text-zinc-500 font-normal">/100</span>
                        </span>
                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${zone.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center font-semibold text-white tabular-nums">
                      {zone.incidentCount} lap
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                        zone.dominantCategory === 'Begal'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : zone.dominantCategory === 'Pelecehan'
                          ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
                          : zone.dominantCategory === 'Kecelakaan'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}>
                        {zone.dominantCategory}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-zinc-300 font-mono text-[11px]">
                      {zone.peakHours}
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        zone.trend === 'up'
                          ? 'text-rose-400'
                          : zone.trend === 'down'
                          ? 'text-emerald-400'
                          : 'text-zinc-400'
                      }`}>
                        {zone.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                        {zone.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                        {zone.trend === 'up' ? `+${zone.trendPercent}%` : zone.trend === 'down' ? `${zone.trendPercent}%` : 'Stabil'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          zone.lightingStatus === 'Minim' ? 'bg-rose-400' : zone.lightingStatus === 'Sedang' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <span>PJU {zone.lightingStatus}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        Pos: {(zone.policeDistanceMeters / 1000).toFixed(1)} km
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFocusCorridorOnMap(zone)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[11px] font-medium transition-colors"
                          title="Pusatkan di Peta"
                        >
                          <Crosshair className="w-3 h-3" />
                          <span>Peta</span>
                        </button>
                        <button
                          onClick={() => setSelectedZoneDetail(zone)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-[11px] font-medium transition-colors"
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL EKSPOR RESMI (CSV / EXCEL) */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0c0c0e] border border-white/[0.12] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Ekspor Laporan Resmi (CSV / Excel)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Format data resmi untuk evaluasi kepolisian (Polda/Polres) & pemkot (Dishub).
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-3">
                  Pilih Paket Data Laporan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setExportTargetType('police')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      exportTargetType === 'police'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-black/30 border-white/[0.08] text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-white">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      Laporan Kepolisian (Polda)
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Detail koordinat GPS insiden, klasifikasi kriminal, waktu kejadian & status verifikasi laporan.
                    </p>
                  </div>

                  <div
                    onClick={() => setExportTargetType('government')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      exportTargetType === 'government'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-black/30 border-white/[0.08] text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-white">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      Laporan Dishub & Pemkot
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Fokus pada audit penerangan jalan (PJU padam), jalan berlubang, dan rekomendasi pos keamanan terpadu.
                    </p>
                  </div>

                  <div
                    onClick={() => setExportTargetType('top_zones')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      exportTargetType === 'top_zones'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-black/30 border-white/[0.08] text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-white">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Ringkasan Top Koridor Rawan
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Daftar 10 koridor paling berbahaya beserta skor risiko dan rekomendasi intervensi patroli.
                    </p>
                  </div>

                  <div
                    onClick={() => setExportTargetType('route_telemetry')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      exportTargetType === 'route_telemetry'
                        ? 'bg-blue-600/10 border-blue-500 text-white'
                        : 'bg-black/30 border-white/[0.08] text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-sm font-semibold text-white">
                      <Navigation className="w-4 h-4 text-emerald-400" />
                      Telemetri Rute Warga
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Statistik agregasi perbandingan pilihan rute aman vs rute tercepat dan selisih durasi bulanan.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                  Format Kompatibilitas
                </label>
                <div className="flex items-center gap-4 text-xs text-zinc-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      checked={exportFormat === 'excel_csv'}
                      onChange={() => setExportFormat('excel_csv')}
                      className="accent-blue-600"
                    />
                    <span>CSV Excel-Optimized (UTF-8 with BOM)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="accent-blue-600"
                    />
                    <span>Standard RFC 4180 CSV</span>
                  </label>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/[0.06] border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <span>
                  File akan langsung diunduh secara instan ke perangkat lokal Anda. Data siap dibuka di Microsoft Excel, Google Sheets, atau diimpor ke sistem GIS kepolisian.
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-white/[0.08] flex items-center justify-end gap-3 bg-black/40">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 border border-blue-500/50"
              >
                <Download className="w-4 h-4" />
                <span>Unduh File CSV Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP DETAIL KORIDOR */}
      {/* ========================================================================= */}
      {selectedZoneDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0c0c0e] border border-white/[0.12] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                  Peringkat #{selectedZoneDetail.rank} Koridor Rawan
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedZoneDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedZoneDetail(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3">
                  <span className="text-zinc-500 block">Tingkat Bahaya</span>
                  <span className="text-base font-bold text-rose-400">{selectedZoneDetail.dangerLevel} ({selectedZoneDetail.riskScore}/100)</span>
                </div>
                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3">
                  <span className="text-zinc-500 block">Insiden Tercatat</span>
                  <span className="text-base font-bold text-white">{selectedZoneDetail.incidentCount} Kasus</span>
                </div>
                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3">
                  <span className="text-zinc-500 block">Jam Rawan Puncak</span>
                  <span className="text-base font-bold text-amber-400 font-mono">{selectedZoneDetail.peakHours}</span>
                </div>
                <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3">
                  <span className="text-zinc-500 block">Kualitas Penerangan</span>
                  <span className="text-base font-bold text-zinc-200">PJU {selectedZoneDetail.lightingStatus}</span>
                </div>
              </div>

              <div className="bg-black/30 border border-white/[0.06] rounded-xl p-3.5 space-y-2">
                <span className="text-zinc-400 font-semibold block">Rekomendasi Tindakan Lapangan:</span>
                <p className="text-zinc-200 leading-relaxed font-medium">
                  {selectedZoneDetail.recommendedIntervention}
                </p>
                <div className="text-[11px] text-zinc-500 pt-1 border-t border-white/[0.05] flex justify-between">
                  <span>Pos Polisi / Patroli Terdekat: <strong className="text-zinc-300">{selectedZoneDetail.policeDistanceMeters} meter</strong></span>
                  <span>GPS: {selectedZoneDetail.coordinates.lat.toFixed(4)}, {selectedZoneDetail.coordinates.lng.toFixed(4)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/[0.08] flex items-center justify-between bg-black/40">
              <button
                onClick={() => {
                  handleFocusCorridorOnMap(selectedZoneDetail);
                  setSelectedZoneDetail(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl transition-all"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Pusatkan Pada Peta</span>
              </button>
              <button
                onClick={() => setSelectedZoneDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
