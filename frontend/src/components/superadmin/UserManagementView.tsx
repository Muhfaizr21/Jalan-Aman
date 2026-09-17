'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  UserX, 
  Search, 
  KeyRound, 
  UserCog, 
  Ban, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Compass, 
  Star, 
  AlertTriangle, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Lock,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { mockUserAccounts } from './mockData';
import { UserAccount, UserRole, UserAccountStatus } from '../../types/superadmin';

export function UserManagementView() {
  const [users, setUsers] = useState<UserAccount[]>(mockUserAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortField, setSortField] = useState<'trustScore' | 'name' | 'reportCount'>('trustScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'searches' | 'ratings'>('reports');
  
  const [suspendTarget, setSuspendTarget] = useState<UserAccount | null>(null);
  const [suspendDuration, setSuspendDuration] = useState<'7 Hari' | '30 Hari' | 'Permanen'>('7 Hari');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendError, setSuspendError] = useState('');

  const [roleTarget, setRoleTarget] = useState<UserAccount | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('User');

  const [resetTarget, setResetTarget] = useState<UserAccount | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.phone.includes(searchQuery) ||
                          u.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'Semua' || u.role === roleFilter;
      const matchStatus = statusFilter === 'Semua' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === 'trustScore') {
        return sortDirection === 'desc' ? b.trustScore - a.trustScore : a.trustScore - b.trustScore;
      }
      if (sortField === 'name') {
        return sortDirection === 'desc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortDirection === 'desc' ? b.reportCount - a.reportCount : a.reportCount - b.reportCount;
    });

  const handleSort = (field: 'trustScore' | 'name' | 'reportCount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Actions
  const handleSuspendSubmit = () => {
    if (!suspendReason.trim()) {
      setSuspendError('Alasan penindakan wajib diisi untuk kepatuhan audit log.');
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === suspendTarget?.id) {
          const nextStatus: UserAccountStatus = suspendDuration === 'Permanen' ? 'Banned' : 'Suspended';
          return {
            ...u,
            status: nextStatus,
            statusReason: suspendReason,
          };
        }
        return u;
      })
    );

    showToast(`Akun ${suspendTarget?.name} berhasil di-${suspendDuration === 'Permanen' ? 'ban permanen' : 'tangguhkan'}.`);
    setSuspendTarget(null);
    setSuspendReason('');
    setSuspendError('');
  };

  const handleUnsuspend = (u: UserAccount) => {
    setUsers((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: 'Active', statusReason: undefined } : item))
    );
    showToast(`Akun ${u.name} telah diaktifkan kembali.`);
  };

  const handleRoleSubmit = () => {
    if (!roleTarget) return;
    setUsers((prev) =>
      prev.map((item) => (item.id === roleTarget.id ? { ...item, role: newRole } : item))
    );
    showToast(`Peran ${roleTarget.name} diperbarui menjadi ${newRole}.`);
    setRoleTarget(null);
  };

  const handleResetPassword = () => {
    if (!resetTarget) return;
    showToast(`Tautan reset password telah dikirimkan ke ${resetTarget.email}.`);
    setResetTarget(null);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Superadmin':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Moderator':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-white/[0.08]';
    }
  };

  const getStatusBadge = (status: UserAccountStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Suspended':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Banned':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 max-w-[calc(100vw-2rem)] z-50 bg-neutral-900 border border-white/20 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium leading-tight">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white ml-2 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= HEADER & STATS ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">Manajemen Pengguna</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/10">
              {users.length} Akun Terdaftar
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Pengelolaan hak akses, skor kredibilitas pelapor (*Trust Score*), dan riwayat mobilitas keselamatan.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08]">
          <div className="flex justify-between items-start text-xs text-zinc-400">
            <span>Total Pengguna Aktif</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {users.filter(u => u.status === 'Active').length}
            </span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Siap melaporkan & bernavigasi</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08]">
          <div className="flex justify-between items-start text-xs text-zinc-400">
            <span>Staf Moderator / Polisi</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {users.filter(u => u.role === 'Moderator').length}
            </span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Petugas validasi lapangan</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08]">
          <div className="flex justify-between items-start text-xs text-zinc-400">
            <span>Rata-rata Kredibilitas</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">88.4%</span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Trust Score ekosistem terpercaya</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08]">
          <div className="flex justify-between items-start text-xs text-zinc-400">
            <span>Ditangguhkan / Ban</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-rose-400 font-mono">
              {users.filter(u => u.status !== 'Active').length}
            </span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Pelanggaran fake report / bot</p>
          </div>
        </div>
      </div>

      {/* ================= TABEL USER ================= */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Daftar Akun Pengguna & Otorisasi</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Semua pelapor terdaftar dengan metrik kredibilitas berbasis rasio laporan valid.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Cari nama, email, HP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 w-52 sm:w-64"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="Semua">Semua Role</option>
              <option value="Superadmin">Superadmin</option>
              <option value="Moderator">Moderator</option>
              <option value="User">User Biasa</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Banned">Banned</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-neutral-900/60 text-zinc-400 font-semibold uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('reportCount')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Laporan</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('trustScore')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Trust Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Aktivitas</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    Tidak ada pengguna yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">{u.id} • {u.dominantRegion}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="text-zinc-300 font-mono text-[11px]">{u.email}</div>
                        <div className="text-zinc-500 font-mono text-[11px]">{u.phone}</div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusBadge(u.status)}`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Reports count */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-white">{u.reportCount}</span>
                      <span className="text-zinc-500 text-[10px] block">
                        {u.verifiedReportCount}v / {u.rejectedReportCount}x
                      </span>
                    </td>

                    {/* Trust Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-xs ${
                          u.trustScore >= 80 ? 'text-emerald-400' :
                          u.trustScore >= 50 ? 'text-yellow-400' : 'text-rose-400'
                        }`}>
                          {u.trustScore}%
                        </span>
                        <div className="w-14 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              u.trustScore >= 80 ? 'bg-emerald-400' :
                              u.trustScore >= 50 ? 'bg-yellow-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${u.trustScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Last active */}
                    <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                      {u.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setActiveTab('reports');
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08] transition-colors"
                        >
                          Detail
                        </button>

                        <button
                          onClick={() => {
                            setRoleTarget(u);
                            setNewRole(u.role);
                          }}
                          title="Ubah Role"
                          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <UserCog className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setResetTarget(u)}
                          title="Reset Password"
                          className="p-1 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-white/[0.06] transition-colors"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        {u.status === 'Active' ? (
                          <button
                            onClick={() => {
                              setSuspendTarget(u);
                              setSuspendReason('');
                              setSuspendError('');
                            }}
                            title="Suspend/Ban User"
                            className="p-1 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnsuspend(u)}
                            title="Aktifkan Kembali"
                            className="p-1 rounded-lg text-amber-400 hover:text-emerald-400 hover:bg-white/[0.06] transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL DETAIL USER (3 RIWAYAT) ================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header Profile */}
            <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-white/20 flex items-center justify-center text-base font-bold text-white shadow-lg">
                  {selectedUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{selectedUser.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadge(selectedUser.role)}`}>
                      {selectedUser.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                    <span>{selectedUser.id}</span> • 
                    <span>{selectedUser.email}</span> • 
                    <span>{selectedUser.phone}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.06]">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Trust Score</span>
                <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{selectedUser.trustScore}%</p>
                <span className="text-[10px] text-zinc-400">Rasio Valid: {selectedUser.verifiedReportCount}/{selectedUser.reportCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.06]">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Wilayah Dominan</span>
                <p className="text-sm font-bold text-white mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {selectedUser.dominantRegion}
                </p>
                <span className="text-[10px] text-zinc-400">Paling sering aktif</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.06]">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Terdaftar Sejak</span>
                <p suppressHydrationWarning className="text-xs font-mono text-zinc-300 mt-1">
                  {new Date(selectedUser.joinedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                </p>
                <span className="text-[10px] text-zinc-500">Aktif {selectedUser.lastActive}</span>
              </div>
            </div>

            {/* Suspended Reason Banner if any */}
            {selectedUser.status !== 'Active' && selectedUser.statusReason && (
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Alasan Penindakan ({selectedUser.status}):</span>
                  <p className="text-zinc-300 mt-0.5">{selectedUser.statusReason}</p>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="border-b border-white/[0.08] flex items-center gap-2">
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'reports'
                    ? 'border-white text-white'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Riwayat Laporan ({selectedUser.incidentReports.length})
              </button>
              <button
                onClick={() => setActiveTab('searches')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'searches'
                    ? 'border-white text-white'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Riwayat Pencarian Rute ({selectedUser.routeSearches.length})
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'ratings'
                    ? 'border-white text-white'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                Ulasan & Rating Rute ({selectedUser.routeRatings.length})
              </button>
            </div>

            {/* Tab 1: Incident Reports */}
            {activeTab === 'reports' && (
              <div className="space-y-2.5">
                {selectedUser.incidentReports.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Pengguna belum pernah mengajukan laporan insiden.</p>
                ) : (
                  selectedUser.incidentReports.map((inc) => (
                    <div key={inc.id} className="p-3 rounded-xl bg-neutral-900/70 border border-white/[0.06] flex justify-between items-center text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{inc.category}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{inc.id}</span>
                        </div>
                        <p className="text-zinc-400 text-[11px] mt-0.5">{inc.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          inc.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          inc.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {inc.status}
                        </span>
                        <span suppressHydrationWarning className="text-[10px] text-zinc-500 font-mono block mt-1">
                          {new Date(inc.timestamp).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Route Searches */}
            {activeTab === 'searches' && (
              <div className="space-y-2.5">
                {selectedUser.routeSearches.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Belum ada data pencarian rute.</p>
                ) : (
                  selectedUser.routeSearches.map((src) => (
                    <div key={src.id} className="p-3 rounded-xl bg-neutral-900/70 border border-white/[0.06] flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                          <Compass className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {src.origin} &rarr; {src.destination}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            Estimasi {src.estimatedDurationMin} menit
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {src.chosenRoute === 'Aman' ? '🛡️ Rute Teraman' : '⚡ Tercepat'}
                        </span>
                        <span suppressHydrationWarning className="text-[10px] text-zinc-500 font-mono block mt-1">
                          {new Date(src.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Route Ratings */}
            {activeTab === 'ratings' && (
              <div className="space-y-2.5">
                {selectedUser.routeRatings.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Pengguna belum memberikan ulasan rating rute.</p>
                ) : (
                  selectedUser.routeRatings.map((rat) => (
                    <div key={rat.id} className="p-3.5 rounded-xl bg-neutral-900/70 border border-white/[0.06] space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{rat.routeName}</span>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rat.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      {rat.comment && (
                        <p className="text-zinc-300 italic text-[11px] bg-black/40 p-2 rounded-lg border border-white/[0.04]">
                          "{rat.comment}"
                        </p>
                      )}
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1">
                        <span>Konfirmasi Keamanan: {rat.safetyConfirmed ? '✅ Terkonfirmasi Aman' : '⚠️ Meragukan'}</span>
                        <span suppressHydrationWarning className="font-mono">{new Date(rat.timestamp).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUSPEND / BAN USER ================= */}
      {suspendTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400">
              <Ban className="w-6 h-6" />
              <h4 className="text-base font-bold text-white">Tangguhkan Akun Pengguna</h4>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Anda akan menangguhkan akun <span className="font-bold text-white">{suspendTarget.name}</span> ({suspendTarget.email}). Pengguna tidak akan dapat membuat laporan atau mencari rute selama masa penindakan.
            </p>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Durasi Penindakan</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['7 Hari', '30 Hari', 'Permanen'] as const).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSuspendDuration(dur)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        suspendDuration === dur
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          : 'bg-neutral-900 text-zinc-400 border-white/[0.08] hover:bg-white/[0.04]'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Alasan Penindakan <span className="text-rose-400">* (Wajib Diisi)</span>
                </label>
                <textarea
                  rows={3}
                  value={suspendReason}
                  onChange={(e) => {
                    setSuspendReason(e.target.value);
                    if (e.target.value.trim()) setSuspendError('');
                  }}
                  placeholder="Contoh: Terdeteksi mengirimkan 3 laporan palsu beruntun / penyalahgunaan koordinat..."
                  className="w-full p-2.5 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500/50"
                />
                {suspendError && (
                  <p className="text-[11px] text-rose-400 mt-1">{suspendError}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setSuspendTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSuspendSubmit}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-600/20"
              >
                Terapkan {suspendDuration === 'Permanen' ? 'Ban' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: UBAH ROLE ================= */}
      {roleTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-cyan-400">
              <UserCog className="w-6 h-6" />
              <h4 className="text-base font-bold text-white">Ubah Peran & Hak Akses</h4>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Pilih tingkat otorisasi sistem untuk <span className="font-bold text-white">{roleTarget.name}</span>.
            </p>

            <div className="space-y-2 pt-1">
              {(['User', 'Moderator', 'Superadmin'] as const).map((r) => (
                <label
                  key={r}
                  onClick={() => setNewRole(r)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    newRole === r
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-white'
                      : 'bg-neutral-900 border-white/[0.06] text-zinc-400 hover:bg-white/[0.02]'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-white block">{r}</span>
                    <span className="text-[11px] text-zinc-400">
                      {r === 'Superadmin' && 'Akses penuh ke seluruh model AI, retraining, dan database.'}
                      {r === 'Moderator' && 'Hak moderasi verifikasi laporan dan monitoring klaster.'}
                      {r === 'User' && 'Akses pengguna reguler (navigasi & pelaporan insiden).'}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="userRole"
                    checked={newRole === r}
                    onChange={() => setNewRole(r)}
                    className="accent-cyan-400"
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setRoleTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleRoleSubmit}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 transition-all shadow-md shadow-white/10"
              >
                Simpan Peran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET PASSWORD ================= */}
      {resetTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-400">
              <KeyRound className="w-6 h-6" />
              <h4 className="text-base font-bold text-white">Reset Kata Sandi Pengguna</h4>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Kirim tautan pemulihan kata sandi yang aman ke alamat email terdaftar: <span className="font-bold text-white font-mono">{resetTarget.email}</span>.
            </p>

            <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.06] text-xs text-zinc-400 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <span>
                Tautan berlaku selama 24 jam dan akan otomatis mencabut seluruh sesi login aktif perangkat pengguna.
              </span>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setResetTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-md shadow-amber-500/20"
              >
                Kirim Tautan Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
