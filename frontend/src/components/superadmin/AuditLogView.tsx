'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  User, 
  ArrowUpRight,
  Download
} from 'lucide-react';
import { mockAuditLogs } from './mockData';
import { AuditLogEntry } from '../../types/superadmin';

export function AuditLogView() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.adminId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAction = actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
      return matchSearch && matchAction;
    });
  }, [logs, searchQuery, actionFilter]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Sistem Audit Log</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Immutable Audit Trail
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Rekam jejak seluruh aktivitas administratif, perubahan konfigurasi, moderasi konten, dan tindakan superadmin.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari ID log, admin, aksi, atau detail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none"
          >
            <option value="all">Semua Jenis Aksi</option>
            <option value="verify">Verifikasi Insiden</option>
            <option value="update">Update Konfigurasi</option>
            <option value="retrain">Retraining Model</option>
            <option value="export">Ekspor Data</option>
          </select>
        </div>

        <button 
          onClick={() => {
            setSearchQuery('');
            setActionFilter('all');
          }}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 self-end sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filter
        </button>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Log ID & Waktu</th>
                <th className="py-3 px-4">Admin Pelaksana</th>
                <th className="py-3 px-4">Tindakan / Aksi</th>
                <th className="py-3 px-4">Target ID</th>
                <th className="py-3 px-4">Keterangan & Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono">
                    <span className="font-semibold text-white block">{log.id}</span>
                    <span suppressHydrationWarning className="text-[11px] text-zinc-500">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID')} &bull; {new Date(log.timestamp).toLocaleDateString('id-ID')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                        SA
                      </div>
                      <span className="font-medium text-white font-mono">{log.adminId}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    {log.targetId || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300 max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500 text-xs">
                    Tidak ada catatan log audit yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
