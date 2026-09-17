'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, CheckCircle, XCircle, AlertTriangle, 
  MapPin, Clock, User, FileText, ChevronDown, Check, X, ShieldAlert,
  Map as MapIcon, Image as ImageIcon
} from 'lucide-react';
import { mockIncidents } from './mockData';

export function IncidentManagementView() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [detailModal, setDetailModal] = useState<any>(null);
  const [rejectModal, setRejectModal] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filtering
  const filtered = mockIncidents.filter(inc => {
    const matchesSearch = inc.id.toLowerCase().includes(search.toLowerCase()) || 
                          inc.locationName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(i => i.id));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Manajemen Laporan Insiden</h2>
          <p className="text-sm text-zinc-400">Verifikasi dan moderasi laporan sebelum masuk ke pipeline clustering.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg animate-in fade-in">
              <span className="text-sm font-medium text-blue-400">{selectedIds.length} terpilih</span>
              <div className="w-px h-4 bg-blue-500/20 mx-1"></div>
              <button className="text-emerald-400 hover:text-emerald-300 text-sm font-medium px-2 flex items-center gap-1 transition-colors">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button className="text-rose-400 hover:text-rose-300 text-sm font-medium px-2 flex items-center gap-1 transition-colors">
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Cari ID Laporan atau Lokasi..." 
            className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select 
              className="appearance-none bg-[#0a0a0a] border border-white/[0.08] rounded-lg pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Semua Status</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Resolved">Resolved</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[720px]">
            <thead className="bg-[#050505] text-zinc-400 border-b border-white/[0.05]">
              <tr>
                <th className="px-5 py-4 w-12">
                  <input type="checkbox" className="rounded border-white/[0.1] bg-black/50" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={selectAll} />
                </th>
                <th className="px-5 py-4 font-medium">ID Laporan</th>
                <th className="px-5 py-4 font-medium">Kategori & Lokasi</th>
                <th className="px-5 py-4 font-medium">Waktu Lapor</th>
                <th className="px-5 py-4 font-medium">Pelapor</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filtered.map((inc) => {
                const isSuspicious = inc.reporterId === 'USR-106'; 
                const isDuplicate = inc.id === 'INC-2023-006';

                return (
                  <tr key={inc.id} className={`hover:bg-white/[0.02] transition-colors ${isDuplicate ? 'bg-amber-500/[0.02]' : ''}`}>
                    <td className="px-5 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-white/[0.1] bg-black/50 cursor-pointer" 
                        checked={selectedIds.includes(inc.id)}
                        onChange={() => toggleSelect(inc.id)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-zinc-200 font-mono text-xs">{inc.id}</span>
                        {isDuplicate && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 mt-1 font-medium bg-amber-500/10 w-max px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3" /> Potensi Duplikat
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[11px] text-zinc-300">{inc.category}</span>
                          <span className="text-[11px] text-zinc-500 font-mono">Skor: {inc.dangerScore}</span>
                        </div>
                        <span className="text-zinc-400 text-xs flex items-center gap-1 mt-1 truncate max-w-[200px]">
                          <MapPin className="w-3 h-3 text-zinc-600" /> {inc.locationName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span suppressHydrationWarning className="text-zinc-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-600" /> 
                        {new Date(inc.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-3 h-3 text-zinc-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-zinc-300 font-mono">{inc.reporterId}</span>
                          {isSuspicious && (
                            <span className="text-[10px] text-rose-400 flex items-center gap-0.5 mt-0.5">
                              <ShieldAlert className="w-3 h-3" /> Rate Limit Warning
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full border ${
                        inc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        inc.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        inc.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button 
                        onClick={() => setDetailModal(inc)}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium px-3 py-1.5 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 transition-colors"
                      >
                        Detail & Moderasi
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center text-zinc-500 text-sm flex flex-col items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-zinc-700" />
              Tidak ada data laporan ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* Modal Detail */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/[0.1] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between bg-[#050505]">
              <div>
                <h3 className="text-lg font-bold text-white">Detail Laporan {detailModal.id}</h3>
                <p suppressHydrationWarning className="text-xs text-zinc-500 mt-1">Dilaporkan pada {new Date(detailModal.timestamp).toLocaleString('id-ID')}</p>
              </div>
              <button onClick={() => setDetailModal(null)} className="text-zinc-500 hover:text-white p-2 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Media & Map */}
              <div className="space-y-4">
                <div className="bg-[#050505] border border-white/[0.05] rounded-xl h-48 flex items-center justify-center flex-col text-zinc-600 gap-2 relative overflow-hidden">
                  <ImageIcon className="w-8 h-8" />
                  <span className="text-xs font-medium">Foto Bukti (Tidak ada lampiran)</span>
                </div>
                <div className="bg-[#050505] border border-white/[0.05] rounded-xl h-48 flex items-center justify-center flex-col text-zinc-600 gap-2 relative overflow-hidden">
                  <MapIcon className="w-8 h-8" />
                  <span className="text-xs font-medium">Mini-map statis dirender di sini</span>
                  <span className="text-[10px]">{detailModal.coordinates.lat}, {detailModal.coordinates.lng}</span>
                </div>
              </div>

              {/* Right Column: Details & Actions */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Informasi Kejadian</h4>
                  <div className="space-y-3 bg-[#050505] p-4 rounded-xl border border-white/[0.05]">
                    <div className="flex justify-between">
                      <span className="text-sm text-zinc-400">Kategori</span>
                      <span className="text-sm text-white font-medium">{detailModal.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-zinc-400">Lokasi</span>
                      <span className="text-sm text-white font-medium text-right max-w-[200px] truncate">{detailModal.locationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-zinc-400">Skor Bahaya</span>
                      <span className="text-sm text-rose-400 font-bold">{detailModal.dangerScore} / 10</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    Catatan Pelapor 
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono lowercase">{detailModal.reporterId}</span>
                  </h4>
                  <p className="text-sm text-zinc-300 bg-[#050505] p-4 rounded-xl border border-white/[0.05] italic">
                    "{detailModal.description}"
                  </p>
                </div>
                
                {detailModal.id === 'INC-2023-006' && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-amber-500">Peringatan Duplikat</h4>
                      <p className="text-xs text-amber-500/80 mt-1">Laporan ini memiliki kesamaan lokasi (radius 50m) dan waktu dengan <strong>INC-2023-001</strong>.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-white/[0.05] bg-[#050505] flex justify-end gap-3">
              <button 
                onClick={() => { setRejectModal(detailModal); setDetailModal(null); }}
                className="px-4 py-2 text-sm font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject Laporan
              </button>
              <button 
                onClick={() => setDetailModal(null)}
                className="px-4 py-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Approve (Masuk DBSCAN)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reject */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/[0.1] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                Tolak Laporan {rejectModal.id}
              </h3>
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-zinc-400 mb-2">Alasan Penolakan (Wajib)</label>
              <textarea 
                className="w-full bg-[#050505] border border-white/[0.1] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all min-h-[100px] resize-none"
                placeholder="Tulis alasan mengapa laporan ini tidak valid (misal: spam, lokasi tidak akurat)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              ></textarea>
              <p className="text-xs text-zinc-500 mt-3 flex items-center gap-1.5 bg-white/5 p-2 rounded-lg border border-white/5">
                <FileText className="w-3.5 h-3.5 text-zinc-400" /> 
                Alasan ini akan tersimpan permanen di Audit Log untuk akuntabilitas.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-white/[0.05] bg-[#050505] flex justify-end gap-3">
              <button 
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button 
                disabled={!rejectReason.trim()}
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                Konfirmasi Tolak <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
