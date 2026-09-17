'use client';

import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Zap, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Play, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  TrendingUp, 
  Server, 
  Database, 
  Terminal, 
  RefreshCw,
  X,
  Radio,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { mockSystemJobs, mockAStarMetrics } from './mockData';
import { SystemJob, AStarPerformanceMetrics, JobStatus } from '../../types/superadmin';
import { formatNumber } from '../../lib/utils';

export function MonitoringView() {
  const [jobs, setJobs] = useState<SystemJob[]>(mockSystemJobs);
  const [metrics, setMetrics] = useState<AStarPerformanceMetrics>(mockAStarMetrics);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [triggerFilter, setTriggerFilter] = useState<string>('all');
  const [selectedFailedJob, setSelectedFailedJob] = useState<SystemJob | null>(null);
  const [activeRunningJobId, setActiveRunningJobId] = useState<string | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const showNotice = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Failed jobs alert count
  const failedJobs = useMemo(() => jobs.filter(j => j.status === 'failed'), [jobs]);
  const runningJobs = useMemo(() => jobs.filter(j => j.status === 'running'), [jobs]);

  // Trigger manual job
  const handleTriggerManualJob = (jobType: SystemJob['type'], title: string) => {
    const newJobId = `JOB-MANUAL-${Date.now().toString().slice(-4)}`;
    setActiveRunningJobId(newJobId);

    const newJob: SystemJob = {
      id: newJobId,
      type: jobType,
      title,
      status: 'running',
      progressPct: 15,
      startedAt: new Date().toISOString(),
      triggeredBy: 'Manual Superadmin',
      recordsProcessed: 1250,
      memoryPeakMb: 680,
    };

    setJobs(prev => [newJob, ...prev]);
    showNotice('info', `Job "${title}" berhasil diluncurkan secara manual.`);

    // Progress simulation
    const interval = setInterval(() => {
      setJobs(prev => prev.map(j => {
        if (j.id === newJobId) {
          const nextProg = j.progressPct + 25;
          if (nextProg >= 100) {
            clearInterval(interval);
            setActiveRunningJobId(null);
            showNotice('success', `Job "${title}" selesai dieksekusi dengan sukses!`);
            return {
              ...j,
              status: 'success',
              progressPct: 100,
              completedAt: new Date().toISOString(),
              durationSeconds: 12,
            };
          }
          return { ...j, progressPct: nextProg };
        }
        return j;
      }));
    }, 1000);
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchTrigger = triggerFilter === 'all' || job.triggeredBy === triggerFilter;
      return matchSearch && matchStatus && matchTrigger;
    });
  }, [jobs, searchQuery, statusFilter, triggerFilter]);

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
            <h1 className="text-2xl font-bold tracking-tight text-white">Sistem Monitoring & Job Queue</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Orchestrator Healthy
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Status antrian background job (DBSCAN, Random Forest, Sync Polisi), peringatan kegagalan otomatis, dan telemetri performa A* Routing Engine.
          </p>
        </div>

        {/* Quick Trigger Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleTriggerManualJob('dbscan_clustering', 'Manual DBSCAN Clustering Jabodetabek')}
            disabled={activeRunningJobId !== null}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            Jalankan DBSCAN
          </button>
          <button
            onClick={() => handleTriggerManualJob('route_cache_purge', 'Purge A* Routing Cache')}
            disabled={activeRunningJobId !== null}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            Purge Cache Rute
          </button>
        </div>
      </div>

      {/* Automated Alert Banner when Job Fails */}
      {failedJobs.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-rose-300">
                  {failedJobs.length} Job Mengalami Kegagalan Eksekusi!
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-400 font-semibold">
                  Critical Alert
                </span>
              </div>
              <p className="text-xs text-rose-200/80 mt-1">
                Job &quot;{failedJobs[0].title}&quot; gagal: {failedJobs[0].errorMessage || 'Internal runtime error'}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedFailedJob(failedJobs[0])}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors shrink-0 self-start sm:self-auto"
          >
            Investigasi Crash Log
          </button>
        </div>
      )}

      {/* A* Performance Telemetry Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Telemetri Performa A* Dynamic Routing Engine
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Live Sampling 10s</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
            <span className="text-xs text-zinc-400 block">Rata-rata Response Time</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{metrics.avgResponseTimeMs}</span>
              <span className="text-xs font-mono text-zinc-500">ms (P95: {metrics.p95ResponseTimeMs}ms)</span>
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">&bull; Target SLA &lt;300ms terpenuhi</span>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
            <span className="text-xs text-zinc-400 block">Throughput Request Rute</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{metrics.requestsPerMinute}</span>
              <span className="text-xs font-mono text-zinc-500">req/menit</span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Peak Hari Ini: {metrics.peakRpmToday} RPM</span>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
            <span className="text-xs text-zinc-400 block">Error Rate Rute</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-400">{metrics.errorRatePct}%</span>
              <span className="text-xs font-mono text-zinc-500">(Normal)</span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Total Rute: {formatNumber(metrics.totalRoutesCalculatedToday)} rute</span>
          </div>

          <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
            <span className="text-xs text-zinc-400 block">Cache Hit Ratio & Nodes</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-purple-400">{metrics.cacheHitRatioPct}%</span>
              <span className="text-xs font-mono text-zinc-500">Hit Rate</span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">{formatNumber(metrics.activeGraphNodes)} Simpul Jalan Aktif</span>
          </div>
        </div>
      </div>

      {/* Job Queue Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Cari nama job atau ID antrian..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="running">Sedang Berjalan (Running)</option>
              <option value="success">Berhasil (Success)</option>
              <option value="failed">Gagal (Failed)</option>
              <option value="queued">Menunggu (Queued)</option>
            </select>

            <select
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value)}
              className="bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none"
            >
              <option value="all">Semua Pemicu</option>
              <option value="Scheduled Cron">Scheduled Cron</option>
              <option value="Manual Superadmin">Manual Superadmin</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setTriggerFilter('all');
            }}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 self-end sm:self-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Jobs Table */}
        <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">ID & Deskripsi Job</th>
                  <th className="py-3 px-4">Tipe Engine</th>
                  <th className="py-3 px-4">Pemicu</th>
                  <th className="py-3 px-4">Progres & Memori</th>
                  <th className="py-3 px-4">Durasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredJobs.map((job) => {
                  return (
                    <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-white block">{job.title}</span>
                        <span suppressHydrationWarning className="text-[11px] text-zinc-500 font-mono">{job.id} &bull; {new Date(job.startedAt).toLocaleTimeString('id-ID')} WIB</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-zinc-300">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          job.triggeredBy === 'Scheduled Cron'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-purple-500/10 text-purple-400'
                        }`}>
                          <Clock className="w-3 h-3" />
                          {job.triggeredBy}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 w-48">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-400">{job.progressPct}%</span>
                            {job.memoryPeakMb && (
                              <span className="text-zinc-500 font-mono">{job.memoryPeakMb} MB</span>
                            )}
                          </div>
                          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full ${
                                job.status === 'failed' ? 'bg-rose-500' : job.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${job.progressPct}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {job.durationSeconds ? `${job.durationSeconds}s` : job.status === 'running' ? 'Berjalan...' : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          job.status === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : job.status === 'running'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse'
                            : job.status === 'failed'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            job.status === 'success' ? 'bg-emerald-400' : job.status === 'running' ? 'bg-blue-400' : job.status === 'failed' ? 'bg-rose-400' : 'bg-zinc-500'
                          }`}></span>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {job.status === 'failed' ? (
                          <button
                            onClick={() => setSelectedFailedJob(job)}
                            className="px-2.5 py-1 text-xs rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-medium transition-colors"
                          >
                            Lihat Error
                          </button>
                        ) : (
                          <button
                            onClick={() => handleTriggerManualJob(job.type, job.title)}
                            disabled={activeRunningJobId !== null}
                            className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                            title="Jalankan Ulang Job"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Crash / Error Detail */}
      {selectedFailedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-rose-500/30 bg-[#0c0c0c] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Detail Kegagalan Job {selectedFailedJob.id}</h3>
              </div>
              <button
                onClick={() => setSelectedFailedJob(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06] space-y-1 font-mono">
                <div className="flex justify-between"><span className="text-zinc-500">Job:</span> <span className="text-white">{selectedFailedJob.title}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Pemicu:</span> <span className="text-purple-400">{selectedFailedJob.triggeredBy}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Memori Peak:</span> <span className="text-rose-400 font-semibold">{selectedFailedJob.memoryPeakMb} MB</span></div>
              </div>

              <div>
                <span className="text-zinc-400 font-medium block mb-1">Pesan Kesalahan (Stack Trace):</span>
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 font-mono text-[11px] text-rose-300 leading-relaxed overflow-x-auto">
                  {selectedFailedJob.errorMessage}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-300 text-[11px]">
                <p className="font-semibold text-white mb-0.5">Rekomendasi Tindakan:</p>
                <p>Naikkan alokasi memori container worker ke minimal 8GB atau tingkatkan nilai parameter <code className="text-purple-300">eps</code> pada Konten Master untuk mengurangi kalkulasi matriks jarak berlebih.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedFailedJob(null)}
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
