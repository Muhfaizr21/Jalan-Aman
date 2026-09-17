'use client';

import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Share2, 
  Key, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  Plus, 
  ShieldCheck, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  SlidersHorizontal, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Lock, 
  ExternalLink, 
  FileCode, 
  Layers, 
  AlertCircle,
  Terminal,
  Activity,
  Calendar,
  X,
  Radio,
  Server
} from 'lucide-react';
import { 
  mockPoliceIntegrations, 
  mockSyncLogs, 
  mockPartnerApiKeys, 
  mockFieldMappings 
} from './mockData';
import { 
  PoliceIntegrationConfig, 
  SyncLogEntry, 
  ExternalPartnerApiKey, 
  FieldMappingRule,
  SyncExecutionStatus
} from '../../types/superadmin';
import { formatNumber } from '../../lib/utils';

export function IntegrationsView() {
  const [activeTab, setActiveTab] = useState<'police' | 'logs' | 'partners' | 'mapping'>('police');
  
  // Police Integrations State
  const [policeConfigs, setPoliceConfigs] = useState<PoliceIntegrationConfig[]>(mockPoliceIntegrations);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Sync Logs State
  const [logs, setLogs] = useState<SyncLogEntry[]>(mockSyncLogs);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState<string>('all');
  const [selectedLogDetail, setSelectedLogDetail] = useState<SyncLogEntry | null>(null);

  // Partner API Keys State
  const [partners, setPartners] = useState<ExternalPartnerApiKey[]>(mockPartnerApiKeys);
  const [partnerSearch, setPartnerSearch] = useState('');
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isCreatePartnerModalOpen, setIsCreatePartnerModalOpen] = useState(false);
  
  // New Partner Form
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerType, setNewPartnerType] = useState<ExternalPartnerApiKey['partnerType']>('Ride Hailing');
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerRateLimit, setNewPartnerRateLimit] = useState<number>(120);
  const [newPartnerScopes, setNewPartnerScopes] = useState<string[]>(['routes:read_risk', 'clusters:read']);

  // Field Mapping State
  const [mappings, setMappings] = useState<FieldMappingRule[]>(mockFieldMappings);
  const [mappingSource, setMappingSource] = useState('Polda Metro Jaya - Bareskrim Pusiknas Feed');
  const [isTestTransformRunning, setIsTestTransformRunning] = useState(false);
  const [transformSuccessMessage, setTransformSuccessMessage] = useState(false);

  // Helper notification
  const showNotice = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Police Sync Trigger
  const handleTriggerSync = (configId: string) => {
    const target = policeConfigs.find(c => c.id === configId);
    if (!target) return;

    setSyncingId(configId);
    setTimeout(() => {
      setSyncingId(null);
      const newImported = Math.floor(Math.random() * 15) + 5;
      const newDuplicates = Math.floor(Math.random() * 3);
      
      // Update config
      setPoliceConfigs(prev => prev.map(c => {
        if (c.id === configId) {
          return {
            ...c,
            lastSyncAt: new Date().toISOString(),
            lastSyncStatus: 'Success',
            totalImportedAllTime: c.totalImportedAllTime + newImported,
          };
        }
        return c;
      }));

      // Add to log
      const newLog: SyncLogEntry = {
        id: `SYNC-${Date.now().toString().slice(-6)}`,
        sourceId: target.id,
        sourceName: target.name,
        startedAt: new Date(Date.now() - 2100).toISOString(),
        completedAt: new Date().toISOString(),
        durationMs: 2100,
        recordsFetched: newImported + newDuplicates,
        recordsImported: newImported,
        recordsDuplicate: newDuplicates,
        recordsFailed: 0,
        status: 'Success',
        triggeredBy: 'Manual Superadmin',
      };
      setLogs(prev => [newLog, ...prev]);

      showNotice('success', `Sinkronisasi data "${target.name}" berhasil! ${newImported} insiden baru ditambahkan.`);
    }, 1800);
  };

  // Test Ping Connection
  const handleTestPing = (configId: string) => {
    const target = policeConfigs.find(c => c.id === configId);
    if (!target) return;

    setTestingId(configId);
    setTimeout(() => {
      setTestingId(null);
      if (target.status === 'Error') {
        showNotice('error', `Gagal terhubung ke endpoint ${target.endpointUrl}. Response 504 Gateway Timeout.`);
      } else {
        showNotice('success', `Koneksi ke ${target.agency} Terverifikasi! Latency: 114ms (HTTP 200 OK).`);
      }
    }, 1200);
  };

  // Toggle Reveal Key
  const toggleKeyReveal = (id: string) => {
    setRevealedKeyIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy Key
  const handleCopyKey = (key: ExternalPartnerApiKey) => {
    const keyToCopy = key.apiKeyRawFull || key.apiKeyMasked;
    navigator.clipboard.writeText(keyToCopy);
    setCopiedKeyId(key.id);
    setTimeout(() => setCopiedKeyId(null), 2000);
    showNotice('info', `API Key untuk "${key.partnerName}" disalin ke clipboard.`);
  };

  // Toggle Partner Status
  const handleTogglePartnerStatus = (partnerId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        const nextStatus = p.status === 'Active' ? 'Suspended' : 'Active';
        showNotice('info', `Status akses API "${p.partnerName}" diubah menjadi: ${nextStatus}.`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Regenerate API Key
  const handleRegenerateKey = (partnerId: string) => {
    const randStr = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 10);
    const newFull = `ja_live_${randStr}`;
    const newMask = `ja_live_${randStr.substring(0, 6)}••••••••••••••••${randStr.slice(-4)}`;

    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        return {
          ...p,
          apiKeyMasked: newMask,
          apiKeyRawFull: newFull,
          createdAt: new Date().toISOString()
        };
      }
      return p;
    }));
    showNotice('success', 'API Key berhasil diregenerasi. Key lama telah di-revoke secara permanen.');
  };

  // Create Partner Submit
  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newPartnerEmail.trim()) {
      showNotice('error', 'Mohon lengkapi nama partner dan email kontak.');
      return;
    }

    const randStr = Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 8);
    const newPartner: ExternalPartnerApiKey = {
      id: `KEY-PARTNER-${Date.now().toString().slice(-4)}`,
      partnerName: newPartnerName,
      partnerType: newPartnerType,
      apiKeyMasked: `ja_live_${newPartnerName.toLowerCase().replace(/\s+/g, '_').slice(0, 6)}_${randStr.slice(0, 4)}••••••••••••••••${randStr.slice(-4)}`,
      apiKeyRawFull: `ja_live_${newPartnerName.toLowerCase().replace(/\s+/g, '_').slice(0, 6)}_${randStr}`,
      status: 'Active',
      rateLimit: {
        requestsPerMinute: newPartnerRateLimit,
        requestsPerHour: newPartnerRateLimit * 40,
        requestsPerDay: newPartnerRateLimit * 400,
      },
      usageToday: {
        totalRequests: 0,
        quotaPercentage: 0,
        lastActiveAt: 'Belum aktif',
      },
      scopes: newPartnerScopes,
      contactEmail: newPartnerEmail,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setPartners(prev => [newPartner, ...prev]);
    setIsCreatePartnerModalOpen(false);
    setNewPartnerName('');
    setNewPartnerEmail('');
    showNotice('success', `Partner baru "${newPartner.partnerName}" berhasil didaftarkan.`);
  };

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = log.sourceName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                          log.id.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                          log.triggeredBy.toLowerCase().includes(logSearchQuery.toLowerCase());
      const matchStatus = logStatusFilter === 'all' || log.status.toLowerCase() === logStatusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [logs, logSearchQuery, logStatusFilter]);

  // Filtered Partners
  const filteredPartners = useMemo(() => {
    return partners.filter(p => 
      p.partnerName.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.partnerType.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      p.contactEmail.toLowerCase().includes(partnerSearch.toLowerCase())
    );
  }, [partners, partnerSearch]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalPoliceImported = policeConfigs.reduce((acc, c) => acc + c.totalImportedAllTime, 0);
    const activePartnersCount = partners.filter(p => p.status === 'Active').length;
    const totalApiRequestsToday = partners.reduce((acc, p) => acc + p.usageToday.totalRequests, 0);
    const successLogsCount = logs.filter(l => l.status === 'Success').length;
    const syncSuccessRate = logs.length ? Math.round((successLogsCount / logs.length) * 100) : 100;

    return {
      totalPoliceImported,
      activePartnersCount,
      totalApiRequestsToday,
      syncSuccessRate
    };
  }, [policeConfigs, partners, logs]);

  // Run Test Transformation
  const handleRunTestTransform = () => {
    setIsTestTransformRunning(true);
    setTransformSuccessMessage(false);
    setTimeout(() => {
      setIsTestTransformRunning(false);
      setTransformSuccessMessage(true);
      showNotice('success', 'Simulasi mapping berhasil! 100% field eksternal tervalidasi ke skema insiden JalanAman.');
    }, 900);
  };

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
          {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {notification.type === 'info' && <Radio className="w-5 h-5 text-blue-400 shrink-0" />}
          <span className="text-xs sm:text-sm font-medium leading-tight">{notification.message}</span>
        </div>
      )}

      {/* Header & Page Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen Integrasi Eksternal</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Bridge Online
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Koneksi data resmi Kepolisian (Polda/Korlantas/Dishub), riwayat audit sinkronisasi, manajemen API partner ojol, dan mapping skema ingest data.
          </p>
        </div>
      </div>

      {/* Top High-level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Total Insiden Impor Polisi</p>
            <p className="text-2xl font-bold text-white mt-1">{formatNumber(stats.totalPoliceImported)}</p>
            <p className="text-[11px] text-emerald-400 mt-0.5">Polda Metro & IRSMS Polri</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Partner Terhubung (API Key)</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.activePartnersCount} <span className="text-xs text-zinc-500 font-normal">/ {partners.length} Mitra</span></p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Gojek, Grab, ShopeeFood, Dishub</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Traffic API Mitra Hari Ini</p>
            <p className="text-2xl font-bold text-white mt-1">{formatNumber(stats.totalApiRequestsToday)}</p>
            <p className="text-[11px] text-purple-400 mt-0.5">Avg Response: 48ms</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Tingkat Keberhasilan Sync</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.syncSuccessRate}%</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Automated Cron Pipeline</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('police')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'police'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Database className="w-4 h-4" />
          Koneksi Data Kepolisian
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/10 text-zinc-300">
            {policeConfigs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'logs'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Clock className="w-4 h-4" />
          Log Sinkronisasi Data
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/10 text-zinc-300">
            {logs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'partners'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Key className="w-4 h-4" />
          Manajemen API Key Partner
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/10 text-zinc-300">
            {partners.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mapping')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'mapping'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Field Mapping & Schema Sandbox
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
            7 Aturan
          </span>
        </button>
      </div>

      {/* TAB 1: KONEKSI DATA KEPOLISIAN */}
      {activeTab === 'police' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Sumber Data Resmi Penegak Hukum & Dinas Terkait</h2>
              <p className="text-xs text-zinc-400">Konfigurasi endpoint API, kredensial auth, format data ingest, dan jadwal sinkronisasi otomatis.</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  policeConfigs.forEach(c => {
                    if (c.status === 'Connected') handleTriggerSync(c.id);
                  });
                }}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync Semua Endpoint
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policeConfigs.map((config) => {
              const isSyncing = syncingId === config.id;
              const isTesting = testingId === config.id;

              return (
                <div 
                  key={config.id}
                  className={`p-5 rounded-xl border transition-all ${
                    config.status === 'Connected'
                      ? 'border-white/[0.08] bg-[#0a0a0a]'
                      : config.status === 'Error'
                      ? 'border-rose-500/30 bg-rose-950/10'
                      : 'border-white/[0.08] bg-[#0a0a0a] opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-lg border ${
                        config.status === 'Connected' 
                          ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">{config.name}</h3>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">{config.agency}</p>
                      </div>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      config.status === 'Connected'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : config.status === 'Error'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        config.status === 'Connected' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}></span>
                      {config.status === 'Connected' ? 'Terkoneksi' : 'Koneksi Terputus'}
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/[0.05] space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-zinc-500">Endpoint:</span>
                      <span className="truncate max-w-[280px] text-zinc-300 select-all" title={config.endpointUrl}>
                        {config.endpointUrl}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-zinc-500">Format & Auth:</span>
                      <span className="text-zinc-300">
                        <span className="text-purple-400 font-semibold">{config.dataFormat}</span> &bull; {config.authType.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-zinc-500">Token Credential:</span>
                      <span className="text-zinc-400 tracking-wider">{config.authCredentialMasked}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-zinc-500">Jadwal Sync (Cron):</span>
                      <span className="text-blue-400 font-semibold">{config.syncScheduleLabel} ({config.cronExpression})</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 border-t border-white/[0.05] pt-3">
                    <div>
                      <span>Terakhir Sync: </span>
                      <span suppressHydrationWarning className="text-white font-medium">
                        {new Date(config.lastSyncAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </span>
                      <span className="text-zinc-500 ml-1">({formatNumber(config.totalImportedAllTime)} total)</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-zinc-500">Auto-Verified:</span>
                      <span className={`px-1.5 py-0.2 text-[10px] rounded font-medium ${
                        config.autoImportVerified 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {config.autoImportVerified ? 'Aktif' : 'Review Manual'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleTriggerSync(config.id)}
                      disabled={isSyncing || config.status === 'Disabled'}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
                      {isSyncing ? 'Menyinkronkan...' : 'Sync Sekarang'}
                    </button>

                    <button
                      onClick={() => handleTestPing(config.id)}
                      disabled={isTesting}
                      className="px-3 py-2 rounded-lg text-xs font-medium border border-white/10 hover:bg-white/[0.04] text-zinc-300 transition-colors"
                    >
                      {isTesting ? 'Testing...' : 'Uji Ping'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LOG SINKRONISASI DATA */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Cari ID log, nama instansi, atau pemicu..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
                />
              </div>

              <select
                value={logStatusFilter}
                onChange={(e) => setLogStatusFilter(e.target.value)}
                className="bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-white/20"
              >
                <option value="all">Semua Status Sync</option>
                <option value="success">Berhasil (Success)</option>
                <option value="partial">Sebagian (Partial)</option>
                <option value="failed">Gagal (Failed)</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setLogSearchQuery('');
                setLogStatusFilter('all');
                showNotice('info', 'Filter log sinkronisasi direset.');
              }}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 self-end sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filter
            </button>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ID & Waktu</th>
                    <th className="py-3 px-4">Sumber Integrasi</th>
                    <th className="py-3 px-4">Pemicu</th>
                    <th className="py-3 px-4 text-center">Fetched</th>
                    <th className="py-3 px-4 text-center">Imported</th>
                    <th className="py-3 px-4 text-center">Duplikat</th>
                    <th className="py-3 px-4 text-center">Durasi</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredLogs.map((entry) => {
                    return (
                      <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-semibold text-white block">{entry.id}</span>
                          <span suppressHydrationWarning className="text-[11px] text-zinc-500">
                            {new Date(entry.startedAt).toLocaleTimeString('id-ID')} &bull; {new Date(entry.startedAt).toLocaleDateString('id-ID')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-zinc-200 block">{entry.sourceName}</span>
                          <span className="text-[11px] text-zinc-500 font-mono">{entry.sourceId}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            entry.triggeredBy === 'Automated Cron'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-purple-500/10 text-purple-400'
                          }`}>
                            <Clock className="w-3 h-3" />
                            {entry.triggeredBy}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-medium text-white">
                          {entry.recordsFetched}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-medium text-emerald-400">
                          +{entry.recordsImported}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-zinc-400">
                          {entry.recordsDuplicate}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-zinc-400">
                          {(entry.durationMs / 1000).toFixed(2)}s
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                            entry.status === 'Success'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : entry.status === 'Partial'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              entry.status === 'Success' ? 'bg-emerald-400' : entry.status === 'Partial' ? 'bg-amber-400' : 'bg-rose-400'
                            }`}></span>
                            {entry.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedLogDetail(entry)}
                            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-[11px]"
                          >
                            Buka
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-zinc-500 text-xs">
                        Tidak ada catatan log sinkronisasi yang sesuai kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MANAJEMEN API KEY PARTNER */}
      {activeTab === 'partners' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Cari partner ojol, armada logistik, atau email..."
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
              />
            </div>

            <button
              onClick={() => setIsCreatePartnerModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Daftarkan Partner Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPartners.map((partner) => {
              const isRevealed = revealedKeyIds[partner.id];
              const isCopied = copiedKeyId === partner.id;

              return (
                <div 
                  key={partner.id}
                  className={`p-5 rounded-xl border bg-[#0a0a0a] transition-all ${
                    partner.status === 'Active' 
                      ? 'border-white/[0.08]' 
                      : 'border-amber-500/20 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{partner.partnerName}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-zinc-300">
                          {partner.partnerType}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{partner.contactEmail}</p>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      partner.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        partner.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}></span>
                      {partner.status}
                    </span>
                  </div>

                  {/* API Key Box */}
                  <div className="mt-4 p-3 rounded-lg bg-black/60 border border-white/[0.06] flex items-center justify-between gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Key className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="text-zinc-300 select-all truncate">
                        {isRevealed && partner.apiKeyRawFull ? partner.apiKeyRawFull : partner.apiKeyMasked}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleKeyReveal(partner.id)}
                        className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                        title={isRevealed ? "Sembunyikan Key" : "Tampilkan Key Asli"}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopyKey(partner)}
                        className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white"
                        title="Salin API Key"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Rate Limits & Usage Quota */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Pemakaian Kuota Harian:</span>
                      <span className="text-white font-medium">
                        {formatNumber(partner.usageToday.totalRequests)} / {formatNumber(partner.rateLimit.requestsPerDay)} reqs ({partner.usageToday.quotaPercentage}%)
                      </span>
                    </div>

                    <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full ${
                          partner.usageToday.quotaPercentage > 80 
                            ? 'bg-rose-500' 
                            : partner.usageToday.quotaPercentage > 60 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                        }`} 
                        style={{ width: `${Math.min(partner.usageToday.quotaPercentage, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 font-mono">
                      <span>Rate Limit: {partner.rateLimit.requestsPerMinute} req/min</span>
                      <span suppressHydrationWarning>Aktif Terakhir: {new Date(partner.usageToday.lastActiveAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) || 'Baru'}</span>
                    </div>
                  </div>

                  {/* Scopes & Actions */}
                  <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {partner.scopes.map((scope: string) => (
                        <span key={scope} className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-zinc-400 font-mono">
                          {scope}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleTogglePartnerStatus(partner.id)}
                        className={`px-2.5 py-1 text-xs rounded font-medium border transition-colors ${
                          partner.status === 'Active'
                            ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {partner.status === 'Active' ? 'Suspend' : 'Aktifkan'}
                      </button>

                      <button
                        onClick={() => handleRegenerateKey(partner.id)}
                        className="px-2.5 py-1 text-xs rounded font-medium border border-white/10 hover:bg-white/10 text-zinc-300 transition-colors"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: FIELD MAPPING & SCHEMA SANDBOX */}
      {activeTab === 'mapping' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">Mapping Skema Data Eksternal ke Internal JalanAman</h2>
              <p className="text-xs text-zinc-400">Aturan transformasi field sebelum data kepolisian dimasukkan ke klaster DBSCAN dan database insiden.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Sumber:</span>
              <select
                value={mappingSource}
                onChange={(e) => setMappingSource(e.target.value)}
                className="bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="Polda Metro Jaya - Bareskrim Pusiknas Feed">Polda Metro Jaya (JSON Feed)</option>
                <option value="Korlantas Polri IRSMS Laka Lantas">Korlantas Polri IRSMS (GeoJSON)</option>
                <option value="Command Center Dishub DKI Jakarta">Dishub DKI Traffic API</option>
              </select>
            </div>
          </div>

          {/* Mapping Table */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[750px]">
                <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Field Eksternal (Source)</th>
                    <th className="py-3 px-4">Tipe Data</th>
                    <th className="py-3 px-4">Aturan Transformasi</th>
                    <th className="py-3 px-4">Target Skema JalanAman</th>
                    <th className="py-3 px-4">Contoh Input & Output</th>
                    <th className="py-3 px-4 text-center">Wajib</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {mappings.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-medium text-amber-300">
                        {m.sourceFieldName}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 font-mono">
                          {m.sourceFieldType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                          {m.transformationRule}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-emerald-400 font-semibold block">{m.targetInternalField}</span>
                        <span className="text-[11px] text-zinc-500">{m.targetFieldLabel}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <span className="text-zinc-500">{m.sampleSourceValue}</span>
                          <ArrowRight className="w-3 h-3 text-zinc-600 shrink-0" />
                          <span className="text-emerald-400">{m.sampleTransformedValue}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {m.isRequired ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                            Wajib
                          </span>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">Opsional</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Live Transformation Sandbox */}
          <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Live Ingest & Transformer Sandbox</h3>
              </div>
              <button
                onClick={handleRunTestTransform}
                disabled={isTestTransformRunning}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${isTestTransformRunning ? 'animate-spin' : ''}`} />
                {isTestTransformRunning ? 'Memproses Mapping...' : 'Uji Transformasi Skema'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Raw Police JSON */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Input: Raw Payload Eksternal (Polri Pusiknas)</span>
                  <span className="text-[10px] text-zinc-500 font-mono">application/json</span>
                </div>
                <div className="p-3.5 rounded-lg bg-black/80 border border-white/[0.08] font-mono text-xs text-amber-200/90 overflow-x-auto h-64 leading-relaxed">
{`{
  "kd_kejahatan_polri": "365",
  "waktu_lapor_wib": "2026-09-17 21:05:00",
  "titik_gps_lat": -6.225014,
  "titik_gps_lon": 106.842119,
  "kronologis_singkat": "Terjadi penjambretan tas oleh 2 pelaku bermotor di dekat halte Tebet.",
  "nomor_laporan_polisi": "LP/B/8812/IX/2026/SPKT/POLDA METRO",
  "derajat_kerawanan_ops": 4,
  "wilayah_polres": "Polres Metro Jakarta Selatan"
}`}
                </div>
              </div>

              {/* Right: Transformed Internal JSON */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Output: Skema Insiden Internal JalanAman</span>
                  {transformSuccessMessage && (
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Validated Ready to DBSCAN
                    </span>
                  )}
                </div>
                <div className="p-3.5 rounded-lg bg-black/80 border border-white/[0.08] font-mono text-xs text-emerald-300/90 overflow-x-auto h-64 leading-relaxed">
{`{
  "id": "INC-EXT-2026-8812",
  "category": "Begal",
  "occurred_at": "2026-09-17T14:05:00.000Z",
  "coordinates": {
    "latitude": -6.225014,
    "longitude": 106.842119
  },
  "description": "Terjadi penjambretan tas oleh 2 pelaku bermotor di dekat halte Tebet.",
  "source_reference": "POLRI-LP/B/8812/IX/2026/SPKT/POLDA METRO",
  "severity_level": 8,
  "is_police_verified": true,
  "dbscan_clustered": false
}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Daftarkan Partner Baru */}
      {isCreatePartnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Daftarkan Mitra / Platform Baru</h3>
              </div>
              <button
                onClick={() => setIsCreatePartnerModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Nama Partner / Institusi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Maxim Rider Safety Network"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/[0.08] text-white focus:outline-none focus:border-white/20 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Tipe Industri</label>
                  <select
                    value={newPartnerType}
                    onChange={(e) => setNewPartnerType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-white/[0.08] text-white focus:outline-none text-sm"
                  >
                    <option value="Ride Hailing">Ride Hailing (Ojol)</option>
                    <option value="Logistics">Logistics & Kurir</option>
                    <option value="Government">Pemerintah / Dishub</option>
                    <option value="Emergency Services">Layanan Darurat / Medis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Email Penanggung Jawab</label>
                  <input
                    type="email"
                    required
                    placeholder="tech@partner.com"
                    value={newPartnerEmail}
                    onChange={(e) => setNewPartnerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/[0.08] text-white focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Preset Rate Limit (Request / Menit)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Standar (60/m)', val: 60 },
                    { label: 'Tinggi (120/m)', val: 120 },
                    { label: 'Enterprise (300/m)', val: 300 },
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setNewPartnerRateLimit(item.val)}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                        newPartnerRateLimit === item.val
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/[0.08] bg-black/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Hak Akses Scope</label>
                <div className="space-y-2 p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                  {[
                    { id: 'routes:read_risk', label: 'Baca Skor Risiko Rute (Routing API)' },
                    { id: 'clusters:read', label: 'Akses Peta Klaster Bahaya DBSCAN' },
                    { id: 'incidents:report', label: 'Kirim Laporan Insiden Mitra (Webhook)' },
                    { id: 'telemetry:write', label: 'Kirim Telemetri Kondisi Jalan (Crowdsourced)' },
                  ].map(scope => {
                    const checked = newPartnerScopes.includes(scope.id);
                    return (
                      <label key={scope.id} className="flex items-center gap-2 cursor-pointer text-zinc-300">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewPartnerScopes(prev => [...prev, scope.id]);
                            } else {
                              setNewPartnerScopes(prev => prev.filter(s => s !== scope.id));
                            }
                          }}
                          className="rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-0"
                        />
                        <span className="text-xs">{scope.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCreatePartnerModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Generate API Key & Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Detail Log Sinkronisasi */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Detail Eksekusi Sync {selectedLogDetail.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1.5 font-mono">
                <div className="flex justify-between"><span className="text-zinc-500">Sumber:</span> <span className="text-white">{selectedLogDetail.sourceName}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Status:</span> <span className="text-emerald-400 font-semibold">{selectedLogDetail.status}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Waktu Mulai:</span> <span className="text-zinc-300">{selectedLogDetail.startedAt}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Durasi:</span> <span className="text-zinc-300">{(selectedLogDetail.durationMs / 1000).toFixed(2)} detik</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Pemicu:</span> <span className="text-blue-400">{selectedLogDetail.triggeredBy}</span></div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 block">Ditarik</span>
                  <span className="text-sm font-bold text-white">{selectedLogDetail.recordsFetched}</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 block">Diimpor</span>
                  <span className="text-sm font-bold text-emerald-400">+{selectedLogDetail.recordsImported}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-[10px] text-zinc-500 block">Duplikat</span>
                  <span className="text-sm font-bold text-zinc-400">{selectedLogDetail.recordsDuplicate}</span>
                </div>
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <span className="text-[10px] text-rose-400 block">Gagal</span>
                  <span className="text-sm font-bold text-rose-400">{selectedLogDetail.recordsFailed}</span>
                </div>
              </div>

              {selectedLogDetail.errorDetails && selectedLogDetail.errorDetails.length > 0 && (
                <div className="space-y-1">
                  <span className="text-zinc-400 font-medium">Log Kesalahan (Error Trace):</span>
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 font-mono text-[11px] text-rose-300 space-y-1">
                    {selectedLogDetail.errorDetails.map((err, idx) => (
                      <p key={idx}>&bull; {err}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors"
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
