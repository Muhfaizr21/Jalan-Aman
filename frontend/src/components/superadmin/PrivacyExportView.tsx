'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Download, 
  FileSpreadsheet, 
  Lock, 
  Eye, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  SlidersHorizontal, 
  Save, 
  RefreshCw, 
  FileText, 
  Building2, 
  Radio, 
  X,
  FileCheck,
  Shield,
  History
} from 'lucide-react';
import { 
  mockDataRetentionPolicy, 
  mockSensitiveDataLogs, 
  mockUserConsentMetrics 
} from './mockData';
import { 
  DataRetentionPolicy, 
  SensitiveDataAccessLog, 
  UserConsentMetrics 
} from '../../types/superadmin';
import { formatNumber } from '../../lib/utils';

export function PrivacyExportView() {
  const [activeTab, setActiveTab] = useState<'export' | 'retention' | 'audit' | 'consent'>('export');
  
  // Data States
  const [policy, setPolicy] = useState<DataRetentionPolicy>(mockDataRetentionPolicy);
  const [accessLogs, setAccessLogs] = useState<SensitiveDataAccessLog[]>(mockSensitiveDataLogs);
  const [consentMetrics, setConsentMetrics] = useState<UserConsentMetrics>(mockUserConsentMetrics);

  // Export State
  const [selectedDataset, setSelectedDataset] = useState<'police_hotspots' | 'pju_infrastructure' | 'dbscan_clusters'>('police_hotspots');
  const [exportFormat, setExportFormat] = useState<'csv' | 'geojson' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportJustification, setExportJustification] = useState('');
  const [recipientAgency, setRecipientAgency] = useState('Kepolisian Daerah Metropolitan Jakarta Raya (Polda Metro)');

  // Search & Filters
  const [logSearch, setLogSearch] = useState('');

  // Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const showNotice = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Trigger export download
  const handleTriggerExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exportJustification.trim()) {
      showNotice('error', 'Wajib mengisi dasar justifikasi / nomor surat dinas ekspor data.');
      return;
    }

    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const newLog: SensitiveDataAccessLog = {
        id: `LOG-EXP-${Date.now().toString().slice(-3)}`,
        adminName: 'Superadmin',
        adminEmail: 'superadmin@jalananman.id',
        role: 'Superadmin',
        actionType: 'Export Agregat Kepolisian',
        targetScope: `Ekspor ${selectedDataset} format .${exportFormat} untuk ${recipientAgency}`,
        justification: exportJustification,
        ipAddress: '103.247.12.88',
        timestamp: new Date().toISOString(),
        recordsCount: 1420,
        status: 'Approved',
      };

      setAccessLogs(prev => [newLog, ...prev]);
      setExportJustification('');
      showNotice('success', `File agregat ${selectedDataset}.${exportFormat} berhasil diunduh tanpa data pribadi (100% PII Sanitize).`);
    }, 1500);
  };

  // Save policy
  const handleSavePolicy = () => {
    showNotice('success', 'Kebijakan retensi dan anonimisasi data berhasil diperbarui.');
  };

  // Filtered access logs
  const filteredLogs = useMemo(() => {
    return accessLogs.filter(log => 
      log.adminName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.targetScope.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.justification.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.id.toLowerCase().includes(logSearch.toLowerCase())
    );
  }, [accessLogs, logSearch]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-16 sm:top-20 right-4 sm:right-8 max-w-[calc(100vw-2rem)] z-50 px-4 py-3 rounded-lg border shadow-xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4 ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' 
            : notification.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/30 text-rose-300'
            : 'bg-zinc-900/90 border-white/10 text-zinc-200'
        }`}>
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
          {notification.type === 'info' && <Radio className="w-5 h-5 text-blue-400 shrink-0" />}
          <span className="text-xs sm:text-sm font-medium leading-tight">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Data Export & Kepatuhan Privasi</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              UU PDP & GDPR Compliant
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Ekspor data agregat tanpa PII untuk Kepolisian/Pemkot, kebijakan retensi & anonimisasi identitas, audit log data sensitif, dan consent tracking.
          </p>
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
          <span className="text-xs text-zinc-400 block">Status Anonimisasi Pelapor</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white">{policy.anonymizeReporterAfterMonths}</span>
            <span className="text-xs font-mono text-zinc-500">Bulan</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">&bull; PII Masking Otomatis Aktif</span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
          <span className="text-xs text-zinc-400 block">Consent Opt-In Pelatihan AI</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-purple-400">{consentMetrics.aiTrainingOptInPct}%</span>
            <span className="text-xs font-mono text-zinc-500">Pengguna</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Dari {formatNumber(consentMetrics.totalUsers)} User Terdaftar</span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
          <span className="text-xs text-zinc-400 block">Consent Klaster DBSCAN</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-400">{consentMetrics.clusteringOptInPct}%</span>
            <span className="text-xs font-mono text-zinc-500">Opt-In</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Pemanfaatan Koordinat Agregat</span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
          <span className="text-xs text-zinc-400 block">Audit Log Akses Sensitif</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-400">{accessLogs.length}</span>
            <span className="text-xs font-mono text-zinc-500">Aktivitas</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Terakhir: Hari ini 16:20 WIB</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'export'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Download className="w-4 h-4" />
          Ekspor Data Agregat Instansi
        </button>

        <button
          onClick={() => setActiveTab('retention')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'retention'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Clock className="w-4 h-4" />
          Kebijakan Retensi & Anonimisasi
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'audit'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <History className="w-4 h-4" />
          Log Akses Data Sensitif
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/10 text-zinc-300">
            {accessLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('consent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'consent'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Users className="w-4 h-4" />
          Consent Tracking (UU PDP)
        </button>
      </div>

      {/* TAB 1: EKSPOR DATA AGREGAT INSTANSI */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-4">
              <div>
                <h3 className="text-base font-semibold text-white">Formulir Permintaan Ekspor Data Resmi</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Semua data personal (nama lengkap, kontak telepon, identitas foto korban) akan di-strip secara otomatis demi perlindungan privasi.
                </p>
              </div>

              <form onSubmit={handleTriggerExport} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1.5">Pilih Dataset Agregat</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'police_hotspots', label: 'Titik Rawan Begal & Curas (Polri)', count: '1.420 Rekaman' },
                      { id: 'pju_infrastructure', label: 'Infrastruktur PJU & Jalan Rusak', count: '384 Rekaman' },
                      { id: 'dbscan_clusters', label: 'Poligon Klaster Spasial DBSCAN', count: '48 Klaster' },
                    ].map(ds => (
                      <button
                        key={ds.id}
                        type="button"
                        onClick={() => setSelectedDataset(ds.id as any)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedDataset === ds.id
                            ? 'border-emerald-500 bg-emerald-500/10 text-white'
                            : 'border-white/[0.08] bg-black/40 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="font-semibold block text-xs">{ds.label}</span>
                        <span className="text-[10px] text-zinc-500 mt-1 block">{ds.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1.5">Instansi Penerima Data</label>
                    <select
                      value={recipientAgency}
                      onChange={(e) => setRecipientAgency(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-white text-xs focus:outline-none"
                    >
                      <option value="Kepolisian Daerah Metropolitan Jakarta Raya (Polda Metro)">Polda Metro Jaya (Ditreskrimum)</option>
                      <option value="Dinas Bina Marga Provinsi DKI Jakarta">Dinas Bina Marga DKI Jakarta</option>
                      <option value="Dinas Perhubungan Provinsi DKI Jakarta">Dinas Perhubungan DKI Jakarta</option>
                      <option value="Bappeda Provinsi DKI Jakarta">Bappeda DKI Jakarta (Perencanaan Kota)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1.5">Format Berkas Ekspor</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'csv', label: 'CSV (Tabel)' },
                        { id: 'geojson', label: 'GeoJSON (Peta)' },
                        { id: 'xlsx', label: 'Excel (XLSX)' },
                      ].map(fmt => (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setExportFormat(fmt.id as any)}
                          className={`py-2 px-2 rounded-lg border text-center font-medium transition-all ${
                            exportFormat === fmt.id
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                              : 'border-white/[0.08] bg-black/40 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1.5">
                    Dasar Permintaan / Nomor Surat Dinas <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Surat Permintaan Resmi Ditreskrimum No. B/114/IX/2026"
                    value={exportJustification}
                    onChange={(e) => setExportJustification(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/[0.08] text-white focus:outline-none focus:border-white/20"
                  />
                  <span className="text-[11px] text-zinc-500 mt-1 block">Wajib dicatat untuk memenuhi audit trail kepatuhan privasi (UU No. 27/2022).</span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isExporting}
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-spin' : ''}`} />
                    {isExporting ? 'Menghapus PII & Memproses Berkas...' : 'Unduh Berkas Agregat Resmi'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Protokol Keamanan Ekspor</h4>
              </div>
              
              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] space-y-1">
                  <p className="font-semibold text-white">1. Stripping Identitas PII</p>
                  <p className="text-[11px] text-zinc-400">Nama pelapor diubah menjadi hash acak (contoh: <code className="text-purple-300">USR-ANON-901</code>) dan nomor handphone dihapus permanen.</p>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] space-y-1">
                  <p className="font-semibold text-white">2. Koordinat Geospasial Dibulatkan</p>
                  <p className="text-[11px] text-zinc-400">Presisi GPS dibatasi 3 desimal (~100 meter) agar tidak menunjuk ke alamat rumah spesifik korban.</p>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] space-y-1">
                  <p className="font-semibold text-white">3. Watermark Kriptografi</p>
                  <p className="text-[11px] text-zinc-400">Setiap berkas CSV/GeoJSON disematkan signature digital pengunduh untuk mencegah kebocoran data sekunder.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KEBIJAKAN RETENSI & ANONIMISASI */}
      {activeTab === 'retention' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-5">
            <div>
              <h3 className="text-base font-semibold text-white">Konfigurasi Periode Retensi Data</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pengaturan siklus hidup data pelapor dan telemetri rute untuk kepatuhan regulasi privasi perlindungan data pribadi.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-black/40 border border-white/[0.05] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Anonimisasi Identitas Pelapor</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">{policy.anonymizeReporterAfterMonths} Bulan</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  step={1}
                  value={policy.anonymizeReporterAfterMonths}
                  onChange={(e) => setPolicy(prev => ({ ...prev, anonymizeReporterAfterMonths: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[11px] text-zinc-500">
                  Setelah periode ini tercapai, nama dan kontak pelapor diubah menjadi anonim permanen tanpa merusak validitas titik insiden.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-black/40 border border-white/[0.05] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Purge Data Telemetri Mentah (GPS Logs)</span>
                  <span className="text-blue-400 font-bold font-mono text-sm">{policy.purgeRawTelemetryDays} Hari</span>
                </div>
                <input
                  type="range"
                  min={14}
                  max={365}
                  step={7}
                  value={policy.purgeRawTelemetryDays}
                  onChange={(e) => setPolicy(prev => ({ ...prev, purgeRawTelemetryDays: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[11px] text-zinc-500">
                  Log jejak pergerakan GPS pengguna otomatis dihapus dari basis data untuk mencegah profiling lokasi personal.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoAnon"
                    checked={policy.autoAnonymizeEnabled}
                    onChange={(e) => setPolicy(prev => ({ ...prev, autoAnonymizeEnabled: e.target.checked }))}
                    className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                  />
                  <label htmlFor="autoAnon" className="text-zinc-300 font-medium cursor-pointer">
                    Jalankan job pembersihan otomatis setiap malam (Cron 02:00 WIB)
                  </label>
                </div>

                <button
                  onClick={handleSavePolicy}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Simpan Kebijakan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOG AKSES DATA SENSITIF */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Cari nama admin, IP address, atau alasan ekspor..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
              />
            </div>
            <span className="text-xs text-zinc-400 font-mono">Total {filteredLogs.length} Entri Audit</span>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ID & Waktu</th>
                    <th className="py-3 px-4">Admin / Operator</th>
                    <th className="py-3 px-4">Tipe Aksi</th>
                    <th className="py-3 px-4">Target Scope Data</th>
                    <th className="py-3 px-4">Dasar Justifikasi</th>
                    <th className="py-3 px-4 font-mono">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono">
                        <span className="font-semibold text-white block">{log.id}</span>
                        <span suppressHydrationWarning className="text-[11px] text-zinc-500">{new Date(log.timestamp).toLocaleTimeString('id-ID')} WIB</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-white block">{log.adminName}</span>
                        <span className="text-[11px] text-zinc-500">{log.role}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          log.actionType.includes('Export')
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {log.actionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-300 max-w-xs truncate" title={log.targetScope}>
                        {log.targetScope}
                      </td>
                      <td className="py-3 px-4 text-zinc-400 max-w-xs truncate" title={log.justification}>
                        {log.justification}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-400">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONSENT TRACKING (UU PDP) */}
      {activeTab === 'consent' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-2">
              <span className="text-xs text-zinc-400 font-medium">Persetujuan Hotspot Klaster Spasial</span>
              <p className="text-3xl font-bold text-emerald-400">{consentMetrics.clusteringOptInPct}%</p>
              <p className="text-[11px] text-zinc-500">Pengguna menyetujui laporan digunakan untuk algoritma DBSCAN demi keselamatan bersama.</p>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-2">
              <span className="text-xs text-zinc-400 font-medium">Persetujuan Pelatihan AI & Random Forest</span>
              <p className="text-3xl font-bold text-purple-400">{consentMetrics.aiTrainingOptInPct}%</p>
              <p className="text-[11px] text-zinc-500">Pengguna menyetujui fitur insiden diolah sebagai dataset model prediksi risiko.</p>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-2">
              <span className="text-xs text-zinc-400 font-medium">Permintaan Penghapusan Data (Right to Erase)</span>
              <p className="text-3xl font-bold text-amber-400">{consentMetrics.gdprErasureRequestsPending} <span className="text-xs text-zinc-500 font-normal">Antrian</span></p>
              <p className="text-[11px] text-zinc-500">Permintaan penghapusan data akun/laporan dalam batas waktu 3x24 jam.</p>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Pernyataan Kepatuhan Regulasi Privasi</h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Sistem JalanAman mematuhi ketentuan <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> serta prinsip <strong>General Data Protection Regulation (GDPR)</strong>. Pengguna memiliki hak penuh untuk mencabut izin (*consent withdrawal*) kapan saja melalui menu privasi di aplikasi mobile JalanAman.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
