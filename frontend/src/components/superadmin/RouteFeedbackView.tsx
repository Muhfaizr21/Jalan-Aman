'use client';

import React, { useState, useMemo } from 'react';
import { 
  Star, 
  MessageSquare, 
  AlertTriangle, 
  BrainCircuit, 
  Search, 
  Filter, 
  CheckCircle2, 
  ArrowRight, 
  TrendingDown, 
  ShieldAlert, 
  RotateCcw, 
  SlidersHorizontal,
  Check,
  X,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from 'lucide-react';
import { mockRouteFeedbacks } from './mockData';
import { RouteFeedbackItem, FeedbackStatus, TrainingInclusionStatus } from '../../types/superadmin';

export function RouteFeedbackView() {
  const [feedbacks, setFeedbacks] = useState<RouteFeedbackItem[]>(mockRouteFeedbacks);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all'); // all, low (1-2), high (4-5)
  const [discrepancyFilter, setDiscrepancyFilter] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const showNotice = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Toggle inclusion in Random Forest retraining
  const handleToggleTrainingInclusion = (id: string) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === id) {
        const nextStatus: TrainingInclusionStatus = 
          f.trainingInclusionStatus === 'Queued for Next Retrain' 
            ? 'Not Included' 
            : 'Queued for Next Retrain';
        showNotice('success', `Feedback ${f.id} diubah menjadi: "${nextStatus}".`);
        return { ...f, trainingInclusionStatus: nextStatus };
      }
      return f;
    }));
  };

  // Update status (Investigated / Flagged)
  const handleUpdateStatus = (id: string, newStatus: FeedbackStatus) => {
    setFeedbacks(prev => prev.map(f => {
      if (f.id === id) {
        showNotice('info', `Status feedback ${f.id} diperbarui ke "${newStatus}".`);
        return { ...f, status: newStatus };
      }
      return f;
    }));
  };

  // Enqueue all flagged discrepancies for retrain
  const handleEnqueueAllDiscrepancies = () => {
    let count = 0;
    setFeedbacks(prev => prev.map(f => {
      if (f.hasDiscrepancy && f.trainingInclusionStatus !== 'Queued for Next Retrain') {
        count++;
        return { ...f, trainingInclusionStatus: 'Queued for Next Retrain', status: 'Flagged for Retrain' };
      }
      return f;
    }));
    showNotice('success', `${count} feedback anomali berhasil dimasukkan ke dataset retraining Random Forest!`);
  };

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(item => {
      const matchSearch = item.originName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.destinationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.comment && item.comment.toLowerCase().includes(searchQuery.toLowerCase()));
      
      let matchRating = true;
      if (ratingFilter === 'low') matchRating = item.userRating <= 2;
      if (ratingFilter === 'high') matchRating = item.userRating >= 4;

      const matchDiscrepancy = !discrepancyFilter || item.hasDiscrepancy;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchSearch && matchRating && matchDiscrepancy && matchStatus;
    });
  }, [feedbacks, searchQuery, ratingFilter, discrepancyFilter, statusFilter]);

  // KPIs
  const stats = useMemo(() => {
    const totalCount = feedbacks.length;
    const avgRating = (feedbacks.reduce((acc, f) => acc + f.userRating, 0) / totalCount).toFixed(1);
    const discrepancyCount = feedbacks.filter(f => f.hasDiscrepancy).length;
    const queuedRetrainCount = feedbacks.filter(f => f.trainingInclusionStatus === 'Queued for Next Retrain').length;

    return {
      totalCount,
      avgRating,
      discrepancyCount,
      queuedRetrainCount,
    };
  }, [feedbacks]);

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
          {notification.type === 'info' && <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />}
          <span className="text-xs sm:text-sm font-medium leading-tight">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Feedback Loop Rating Rute</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <BrainCircuit className="w-3.5 h-3.5" />
              Active Learning Pipeline
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Ulasan pasca-perjalanan (&quot;apakah rute ini beneran aman?&quot;), deteksi diskrepansi model AI vs realitas jalanan, dan feed retraining Random Forest.
          </p>
        </div>

        <button
          onClick={handleEnqueueAllDiscrepancies}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/30 transition-all self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          Enqueue Semua Anomali ke Retraining AI
        </button>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
          <span className="text-xs text-zinc-400 block">Total Rating Pasca-Perjalanan</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-white">{stats.totalCount}</span>
            <span className="text-xs font-mono text-zinc-500">Ulasan Pengguna</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Rata-rata Rating: ⭐ {stats.avgRating} / 5.0</span>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <span className="text-xs text-rose-300 block">Diskrepansi Model AI vs Realitas</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rose-400">{stats.discrepancyCount}</span>
            <span className="text-xs font-mono text-rose-300/70">Anomali</span>
          </div>
          <span className="text-[11px] text-rose-400 mt-1 block">Prediksi Aman tapi Rating &le; 2 ⭐</span>
        </div>

        <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-950/10">
          <span className="text-xs text-purple-300 block">Antrian Retraining AI</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-purple-400">{stats.queuedRetrainCount}</span>
            <span className="text-xs font-mono text-purple-300/70">Feedback Masuk</span>
          </div>
          <span className="text-[11px] text-purple-400 mt-1 block">Siap dieksekusi di Batch RF berikutnya</span>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]">
          <span className="text-xs text-zinc-400 block">Tingkat Validitas Laporan Warga</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-400">92.4%</span>
            <span className="text-xs font-mono text-zinc-500">Trust Score High</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Verifikasi via Polisi & GPS Telemetri</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Cari rute asal/tujuan, nama pengguna, atau komentar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-white/[0.08] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none"
          >
            <option value="all">Semua Rating Bintang</option>
            <option value="low">Rating Rendah (1-2 ⭐ Berisiko)</option>
            <option value="high">Rating Tinggi (4-5 ⭐ Aman)</option>
          </select>

          <button
            onClick={() => setDiscrepancyFilter(!discrepancyFilter)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              discrepancyFilter 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                : 'bg-[#0a0a0a] border-white/[0.08] text-zinc-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Hanya Diskrepansi AI
          </button>
        </div>

        <button 
          onClick={() => {
            setSearchQuery('');
            setRatingFilter('all');
            setDiscrepancyFilter(false);
            setStatusFilter('all');
          }}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 self-end sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filter
        </button>
      </div>

      {/* Feedbacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeedbacks.map((item) => {
          const isQueued = item.trainingInclusionStatus === 'Queued for Next Retrain';

          return (
            <div 
              key={item.id}
              className={`p-5 rounded-xl border bg-[#0a0a0a] space-y-4 transition-all ${
                item.hasDiscrepancy 
                  ? 'border-rose-500/30 shadow-lg shadow-rose-950/10' 
                  : 'border-white/[0.08]'
              }`}
            >
              {/* Header card */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-400">{item.routeSearchId}</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-semibold ${
                      item.chosenRouteType === 'safe' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      Rute {item.chosenRouteType === 'safe' ? 'Pilihan Aman' : 'Tercepat'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-white">
                    <span>{item.originName}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span>{item.destinationName}</span>
                  </div>
                </div>

                {/* Rating stars badge */}
                <div className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg border border-white/[0.08]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3.5 h-3.5 ${
                        star <= item.userRating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-zinc-700'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              {/* Discrepancy Alert Box */}
              {item.hasDiscrepancy && (
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-300">Diskrepansi Model Terdeteksi: </span>
                    Model memprediksi skor risiko rendah (<code className="text-emerald-300">{item.predictedRiskScore}/100</code>), namun pengguna memberikan rating {item.userRating} ⭐ dengan persepsi &quot;{item.safetyPerception}&quot;.
                  </div>
                </div>
              )}

              {/* User Comment */}
              {item.comment && (
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] text-xs text-zinc-300 leading-relaxed italic">
                  &quot;{item.comment}&quot;
                </div>
              )}

              {/* User info & Time */}
              <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-white/[0.05] pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-300 font-medium">{item.userName}</span>
                  <span>&bull; Trust Score: <strong className="text-emerald-400">{item.userTrustScore}</strong></span>
                </div>
                <span suppressHydrationWarning>{new Date(item.reportedAt).toLocaleTimeString('id-ID')} WIB</span>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  item.status === 'Flagged for Retrain'
                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    : item.status === 'Investigated'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                  {item.status}
                </span>

                <button
                  onClick={() => handleToggleTrainingInclusion(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isQueued
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  {isQueued ? 'Terdaftar di Antrian Retrain' : '+ Masukkan ke Retraining AI'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
