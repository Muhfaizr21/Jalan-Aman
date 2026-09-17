'use client';

import React, { useState, useMemo } from 'react';
import { 
  EyeOff, 
  Eye, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Camera, 
  FileText, 
  UserCheck, 
  Clock, 
  MapPin, 
  Scan, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  Check, 
  RotateCcw, 
  ExternalLink,
  MessageSquare,
  Lock,
  Maximize2,
  Info
} from 'lucide-react';
import { mockModerationQueue } from './mockData';
import { 
  ModeratedContentItem, 
  ContentModerationStatus, 
  ContentFlagType 
} from '../../types/superadmin';

export function ModerationView() {
  const [queue, setQueue] = useState<ModeratedContentItem[]>(mockModerationQueue);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('Semua');
  const [selectedFlagFilter, setSelectedFlagFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Item for Detail / Redaction Modal
  const [activeItem, setActiveItem] = useState<ModeratedContentItem | null>(null);
  const [editableRedactedText, setEditableRedactedText] = useState<string>('');
  const [currentBlurTarget, setCurrentBlurTarget] = useState<'None' | 'Face' | 'Plate' | 'Full'>('None');
  const [moderationNoteInput, setModerationNoteInput] = useState<string>('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open item in moderation modal
  const handleOpenModerationModal = (item: ModeratedContentItem) => {
    setActiveItem(item);
    setEditableRedactedText(item.redactedText || item.originalText);
    setCurrentBlurTarget(item.blurTarget || (item.isImageBlurred ? 'Face' : 'None'));
    setModerationNoteInput(item.moderationNote || '');
  };

  // Quick Action: Approve Unmodified
  const handleApproveClean = (id: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              moderationStatus: 'Approved',
              isImageBlurred: false,
              blurTarget: 'None',
              moderatedBy: 'Superadmin (Active)',
              moderatedAt: new Date().toISOString(),
              moderationNote: 'Konten disetujui tampil publik tanpa sensor.',
            }
          : item
      )
    );
    showToast(`Konten ${id} disetujui publik (Approved)`);
    if (activeItem?.id === id) setActiveItem(null);
  };

  // Quick Action: Approve with Redaction / Sensor
  const handleApproveWithRedaction = (id: string, customText?: string, blurTarget?: 'None' | 'Face' | 'Plate' | 'Full', note?: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              moderationStatus: 'Redacted',
              redactedText: customText || item.redactedText,
              isImageBlurred: blurTarget ? blurTarget !== 'None' : true,
              blurTarget: blurTarget || 'Face',
              moderatedBy: 'Superadmin (Active)',
              moderatedAt: new Date().toISOString(),
              moderationNote: note || 'Sensor wajah/plat nomor dan penyamaran identitas diterapkan.',
            }
          : item
      )
    );
    showToast(`Sensor & redaksi diterapkan untuk ${id} (Redacted)`);
    if (activeItem?.id === id) setActiveItem(null);
  };

  // Quick Action: Reject Content (Hide Media from Public)
  const handleRejectContent = (id: string, note?: string) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              moderationStatus: 'Rejected',
              moderatedBy: 'Superadmin (Active)',
              moderatedAt: new Date().toISOString(),
              moderationNote: note || 'Konten melanggar pedoman publik / foto tidak layak.',
            }
          : item
      )
    );
    showToast(`Konten ${id} disembunyikan dari publik (Rejected)`);
    if (activeItem?.id === id) setActiveItem(null);
  };

  // Auto sanitize text button
  const handleAutoSanitizeText = () => {
    if (!activeItem) return;
    let sanitized = activeItem.originalText;
    // Mask phones
    sanitized = sanitized.replace(/(\+?62|08)[0-9]{8,12}/g, '$1****-****');
    // Mask profanity
    sanitized = sanitized.replace(/(anjing|bangsat|babi|gila|asu|bajingan)/gi, '[KATA KASAR DIREDAKSI]');
    // Mask plates
    sanitized = sanitized.replace(/[A-Z]{1,2}\s?[0-9]{1,4}\s?[A-Z]{1,3}/g, '[PLAT DIREDAKSI]');
    setEditableRedactedText(sanitized);
    showToast('Teks berhasil disanitasi otomatis oleh AI');
  };

  // Filtered queue
  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const matchStatus = selectedStatusFilter === 'Semua' || item.moderationStatus === selectedStatusFilter;
      const matchFlag = selectedFlagFilter === 'Semua' || item.autoFlags.some((f) => f.type === selectedFlagFilter);
      const matchSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.originalText.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchFlag && matchSearch;
    });
  }, [queue, selectedStatusFilter, selectedFlagFilter, searchQuery]);

  // Summary counts
  const pendingCount = queue.filter((q) => q.moderationStatus === 'Pending').length;
  const redactedCount = queue.filter((q) => q.moderationStatus === 'Redacted').length;
  const approvedCount = queue.filter((q) => q.moderationStatus === 'Approved').length;
  const rejectedCount = queue.filter((q) => q.moderationStatus === 'Rejected').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 max-w-[calc(100vw-2rem)] z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="leading-tight">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Antrian Tinjauan Publik
            </span>
            <span className="text-xs text-zinc-500">Sensor Privasi & Redaksi Media</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Moderasi Konten Laporan & Redaksi Publik
          </h2>
          <p className="text-sm text-zinc-400">
            Tinjau foto barang bukti dan deskripsi teks crowdsourcing sebelum dipublikasikan ke peta umum demi perlindungan privasi korban dan kepatuhan hukum.
          </p>
        </div>

        {/* Independence Disclaimer Banner */}
        <div className="p-3 rounded-xl bg-blue-500/[0.06] border border-blue-500/20 text-xs text-zinc-300 max-w-md flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Status moderasi konten bersifat <strong className="text-white">independen</strong> dari verifikasi validitas kepolisian. Laporan valid tetap tersimpan meski fotonya disensor untuk konsumsi publik.
          </p>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Menunggu Review</span>
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{pendingCount}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              Perlu Tindakan
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Menunggu sensor atau persetujuan publik</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Disensor / Diredaksi</span>
            <EyeOff className="w-4 h-4 text-purple-400 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{redactedCount}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
              Privasi Aman
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Wajah / plat nomor disamarkan di peta</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Disetujui Penuh</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{approvedCount}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Tanpa Sensor
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Foto & teks bersih tanpa PII</p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Ditolak / Spam</span>
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{rejectedCount}</span>
            <span className="text-[10px] sm:text-xs font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
              Disembunyikan
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Foto buram atau teks melanggar etika</p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID, lokasi, pelapor, atau teks..."
              className="bg-black/50 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 w-full md:w-64"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
          >
            <option value="Semua">Semua Status Moderasi</option>
            <option value="Pending">Pending (Menunggu Review)</option>
            <option value="Redacted">Redacted (Telah Disensor)</option>
            <option value="Approved">Approved (Disetujui Publik)</option>
            <option value="Rejected">Rejected (Disembunyikan)</option>
          </select>

          {/* AI Auto-Flag Filter */}
          <select
            value={selectedFlagFilter}
            onChange={(e) => setSelectedFlagFilter(e.target.value)}
            className="bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
          >
            <option value="Semua">Semua Deteksi AI</option>
            <option value="face_pii">Wajah Korban / Orang (PII)</option>
            <option value="plate_pii">Plat Nomor Kendaraan</option>
            <option value="phone_pii">Nomor Kontak Pribadi</option>
            <option value="graphic_violence">Luka / Konten Sensitif</option>
            <option value="offensive_text">Kata Kasar / Ujaran Kebencian</option>
          </select>
        </div>

        <div className="text-xs text-zinc-400 self-end md:self-center">
          Menampilkan <strong className="text-white">{filteredQueue.length}</strong> dari {queue.length} antrian konten
        </div>
      </div>

      {/* Moderation Queue Cards List */}
      <div className="space-y-4">
        {filteredQueue.map((item) => {
          const isPending = item.moderationStatus === 'Pending';
          const isRedacted = item.moderationStatus === 'Redacted';
          const isApproved = item.moderationStatus === 'Approved';
          const isRejected = item.moderationStatus === 'Rejected';

          return (
            <div
              key={item.id}
              className={`bg-[#0a0a0a] border rounded-2xl p-6 transition-all group ${
                isPending ? 'border-amber-500/30 shadow-lg shadow-amber-950/10' :
                isRedacted ? 'border-purple-500/20' :
                isApproved ? 'border-emerald-500/20' :
                'border-rose-500/20 opacity-75'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Side: Report Meta, Flags & Text Comparison */}
                <div className="flex-1 space-y-4">
                  {/* Metadata Header Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white px-2 py-0.5 rounded bg-zinc-800 border border-white/[0.08]">
                      {item.id}
                    </span>
                    <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                      Ref: <strong className="text-zinc-200">{item.incidentId}</strong>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {item.category}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {item.locationName}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span suppressHydrationWarning className="text-xs text-zinc-500">
                      {new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>

                    {/* Dual Badges: Incident Validation vs Moderation Status */}
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20" title="Status validitas kepolisian">
                        Validitas: {item.incidentVerificationStatus}
                      </span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                        isPending ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse' :
                        isRedacted ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                        isApproved ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                        'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      }`}>
                        Konten: {item.moderationStatus}
                      </span>
                    </div>
                  </div>

                  {/* AI Auto-Flag Alerts */}
                  {item.autoFlags.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                        <Scan className="w-3 h-3 text-amber-400" />
                        AI Auto-Flags:
                      </span>
                      {item.autoFlags.map((flag, idx) => (
                        <span
                          key={idx}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1.5 ${
                            flag.severity === 'High'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                          title={flag.snippet}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>{flag.label}</span>
                          <span className="text-[10px] font-mono opacity-80">({flag.confidence}%)</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tidak terdeteksi pelanggaran otomatis (Clean Content)</span>
                    </div>
                  )}

                  {/* Text Comparison Box (Original vs Redacted) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Raw Text */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="font-semibold text-zinc-300">Teks Asli Pelapor</span>
                        <span className="text-zinc-500 font-mono text-[10px]">Raw Text</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {item.originalText}
                      </p>
                    </div>

                    {/* Redacted Text */}
                    <div className="p-3.5 rounded-xl bg-purple-950/10 border border-purple-500/20 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-purple-300">
                        <span className="font-semibold text-purple-300 flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Teks Tampil ke Publik (Sanitized)
                        </span>
                        <span className="text-purple-400 font-mono text-[10px]">Public View</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed font-sans">
                        {item.redactedText || item.originalText}
                      </p>
                    </div>
                  </div>

                  {/* Moderation Notes & Audit Trail */}
                  {item.moderatedBy && (
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-1">
                      <span>Ditinjau oleh: <strong className="text-zinc-300">{item.moderatedBy}</strong></span>
                      <span>•</span>
                      <span>Catatan: <em className="text-zinc-400">{item.moderationNote}</em></span>
                    </div>
                  )}
                </div>

                {/* Right Side: Media Evidence Visual & Sensor Overlay */}
                <div className="w-full lg:w-72 shrink-0 flex flex-col items-center">
                  <div className="w-full h-44 rounded-xl overflow-hidden relative border border-white/[0.1] bg-black group/img">
                    {/* Simulated Scene Canvas with SVG */}
                    <svg className="w-full h-full object-cover" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id={`bgGrad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#08080c" />
                          <stop offset="100%" stopColor="#12131a" />
                        </linearGradient>
                        <filter id={`blurFace-${item.id}`}>
                          <feGaussianBlur stdDeviation="8" />
                        </filter>
                      </defs>

                      {/* Background Scene */}
                      <rect width="300" height="180" fill={`url(#bgGrad-${item.id})`} />
                      {/* Road Perspective */}
                      <polygon points="100,180 200,180 160,80 140,80" fill="#1e2029" opacity="0.8" />
                      {/* Streetlight glow */}
                      <circle cx="230" cy="50" r="30" fill="#f59e0b" opacity="0.15" />
                      <line x1="230" y1="50" x2="230" y2="140" stroke="#71717a" strokeWidth="2" />

                      {/* Motor Vehicle / Subject Outline */}
                      <rect x="110" y="105" width="70" height="40" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
                      <circle cx="120" cy="145" r="10" fill="#18181b" stroke="#71717a" strokeWidth="2" />
                      <circle cx="170" cy="145" r="10" fill="#18181b" stroke="#71717a" strokeWidth="2" />

                      {/* Target 1: Face Box */}
                      <g className="transition-all duration-300">
                        {item.isImageBlurred && (item.blurTarget === 'Face' || item.blurTarget === 'Full') ? (
                          <circle cx="145" cy="75" r="18" fill="#a855f7" opacity="0.9" filter={`url(#blurFace-${item.id})`} />
                        ) : (
                          <>
                            <circle cx="145" cy="75" r="14" fill="#d4d4d8" opacity="0.85" />
                            <rect x="127" y="57" width="36" height="36" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
                          </>
                        )}
                      </g>

                      {/* Target 2: License Plate Box */}
                      <g className="transition-all duration-300">
                        {item.isImageBlurred && (item.blurTarget === 'Plate' || item.blurTarget === 'Full') ? (
                          <rect x="125" y="132" width="40" height="12" rx="2" fill="#000000" stroke="#9333ea" strokeWidth="1" />
                        ) : (
                          <>
                            <rect x="125" y="132" width="40" height="12" rx="2" fill="#facc15" opacity="0.9" />
                            <text x="145" y="141" fill="#000" fontSize="7" fontWeight="bold" textAnchor="middle">B 4821</text>
                            <rect x="123" y="130" width="44" height="16" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2 2" />
                          </>
                        )}
                      </g>

                      {/* Full Blur Overlay if active */}
                      {item.isImageBlurred && item.blurTarget === 'Full' && (
                        <rect width="300" height="180" fill="#000000" opacity="0.8" />
                      )}
                    </svg>

                    {/* Sensor / Blur Badges Overlay on Media */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 text-zinc-300 border border-white/10 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-blue-400" />
                        Foto Bukti
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.isImageBlurred
                          ? 'bg-purple-500/80 text-white border-purple-400'
                          : 'bg-black/80 text-zinc-400 border-white/10'
                      }`}>
                        {item.isImageBlurred ? `Sensor: ${item.blurTarget}` : 'Tanpa Sensor'}
                      </span>
                    </div>

                    {/* Hover Button to open Modal */}
                    <button
                      onClick={() => handleOpenModerationModal(item)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>Buka Editor Sensor & Redaksi</span>
                    </button>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="w-full grid grid-cols-3 gap-2 mt-3">
                    <button
                      onClick={() => handleOpenModerationModal(item)}
                      className="py-1.5 px-2 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 border border-purple-500/20 text-xs font-medium text-center transition-colors"
                      title="Terapkan Sensor Blur & Redaksi Teks"
                    >
                      Sensor
                    </button>
                    <button
                      onClick={() => handleApproveClean(item.id)}
                      className="py-1.5 px-2 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium text-center transition-colors"
                      title="Setujui Bersih untuk Publik"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() => handleRejectContent(item.id)}
                      className="py-1.5 px-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs font-medium text-center transition-colors"
                      title="Sembunyikan dari Publik"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* DETAILED MODERATION & REDACTION MODAL */}
      {/* ========================================================================= */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0c0c0e] border border-white/[0.12] rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Editor Sensor & Redaksi Publik
                    </h3>
                    <span className="font-mono text-xs text-zinc-400">({activeItem.id})</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Samarkan identitas korban (wajah & plat nomor) dan lakukan sanitasi teks sebelum dipublikasikan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two Columns (Media on Left, Text on Right) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column: Visual Image Sensor Controls (5 Cols) */}
                <div className="md:col-span-5 space-y-4">
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    1. Sensor Media Bukti Lapangan
                  </span>

                  {/* Visual Canvas Display with dynamic blur */}
                  <div className="w-full h-52 rounded-xl overflow-hidden relative border border-white/[0.1] bg-black">
                    <svg className="w-full h-full object-cover" viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="modalBgGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#08080c" />
                          <stop offset="100%" stopColor="#12131a" />
                        </linearGradient>
                        <filter id="modalBlurFace">
                          <feGaussianBlur stdDeviation="8" />
                        </filter>
                      </defs>

                      <rect width="300" height="180" fill="url(#modalBgGrad)" />
                      <polygon points="100,180 200,180 160,80 140,80" fill="#1e2029" opacity="0.8" />
                      <circle cx="230" cy="50" r="30" fill="#f59e0b" opacity="0.15" />
                      <line x1="230" y1="50" x2="230" y2="140" stroke="#71717a" strokeWidth="2" />

                      <rect x="110" y="105" width="70" height="40" rx="6" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
                      <circle cx="120" cy="145" r="10" fill="#18181b" stroke="#71717a" strokeWidth="2" />
                      <circle cx="170" cy="145" r="10" fill="#18181b" stroke="#71717a" strokeWidth="2" />

                      {/* Face Target */}
                      {currentBlurTarget === 'Face' || currentBlurTarget === 'Full' ? (
                        <g>
                          <circle cx="145" cy="75" r="18" fill="#a855f7" opacity="0.9" filter="url(#modalBlurFace)" />
                          <text x="145" y="78" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">BLUR</text>
                        </g>
                      ) : (
                        <g>
                          <circle cx="145" cy="75" r="14" fill="#d4d4d8" opacity="0.85" />
                          <rect x="127" y="57" width="36" height="36" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
                          <text x="145" y="52" fill="#f43f5e" fontSize="8" fontWeight="bold" textAnchor="middle">Wajah</text>
                        </g>
                      )}

                      {/* Plate Target */}
                      {currentBlurTarget === 'Plate' || currentBlurTarget === 'Full' ? (
                        <g>
                          <rect x="125" y="132" width="40" height="12" rx="2" fill="#000000" stroke="#a855f7" strokeWidth="1.5" />
                          <text x="145" y="141" fill="#a855f7" fontSize="7" fontWeight="bold" textAnchor="middle">[REDACTED]</text>
                        </g>
                      ) : (
                        <g>
                          <rect x="125" y="132" width="40" height="12" rx="2" fill="#facc15" opacity="0.9" />
                          <text x="145" y="141" fill="#000" fontSize="7" fontWeight="bold" textAnchor="middle">B 4821</text>
                          <rect x="123" y="130" width="44" height="16" fill="none" stroke="#eab308" strokeWidth="1.5" strokeDasharray="2 2" />
                        </g>
                      )}

                      {currentBlurTarget === 'Full' && (
                        <g>
                          <rect width="300" height="180" fill="#000000" opacity="0.85" />
                          <text x="150" y="95" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle">KONTEN SENSITIF (18+)</text>
                        </g>
                      )}
                    </svg>
                  </div>

                  {/* Target Blur Buttons */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-zinc-400 block font-medium">Pilih Mode Sensor Gambar:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentBlurTarget('Face')}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          currentBlurTarget === 'Face'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                            : 'bg-black/40 border-white/[0.08] text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Sensor Wajah</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentBlurTarget('Plate')}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          currentBlurTarget === 'Plate'
                            ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                            : 'bg-black/40 border-white/[0.08] text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sensor Plat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentBlurTarget('Full')}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          currentBlurTarget === 'Full'
                            ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                            : 'bg-black/40 border-white/[0.08] text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Blur Sensitif (18+)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentBlurTarget('None')}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          currentBlurTarget === 'None'
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                            : 'bg-black/40 border-white/[0.08] text-zinc-300 hover:border-white/20'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Tanpa Sensor</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Text Redaction & Notes (7 Cols) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      2. Redaksi Teks Publik
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoSanitizeText}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-medium transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-Sanitize AI</span>
                    </button>
                  </div>

                  {/* Raw Text for comparison */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">Teks Asli Pelapor (Referensi):</span>
                    <p className="text-xs text-zinc-400 font-mono select-all">
                      {activeItem.originalText}
                    </p>
                  </div>

                  {/* Editable Redacted Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white block">
                      Teks Hasil Redaksi (Yang Akan Tampil ke Pengguna Publik):
                    </label>
                    <textarea
                      rows={4}
                      value={editableRedactedText}
                      onChange={(e) => setEditableRedactedText(e.target.value)}
                      className="w-full bg-black/50 border border-purple-500/40 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
                      placeholder="Tuliskan teks hasil sanitasi..."
                    />
                  </div>

                  {/* Moderation Reason / Audit Note */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      Catatan Tindakan Moderasi (Audit Log):
                    </label>
                    <input
                      type="text"
                      value={moderationNoteInput}
                      onChange={(e) => setModerationNoteInput(e.target.value)}
                      placeholder="Contoh: Sensor wajah korban & samarkan kontak sesuai UU ITE"
                      className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer: 3 Distinct Decisions */}
            <div className="p-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 bg-black/40 shrink-0">
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl transition-colors"
              >
                Batal
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRejectContent(activeItem.id, moderationNoteInput)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Tolak Konten (Sembunyikan)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApproveClean(activeItem.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Setujui Bersih (Tanpa Sensor)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApproveWithRedaction(activeItem.id, editableRedactedText, currentBlurTarget, moderationNoteInput)}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-600/30 border border-purple-400/50"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Terapkan Sensor & Rilis Publik</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
