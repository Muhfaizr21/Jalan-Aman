'use client';

import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Activity, 
  TrendingUp, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  Shield, 
  ShieldAlert, 
  Clock, 
  ArrowUpDown, 
  Check, 
  X, 
  Info, 
  Sparkles, 
  RefreshCw, 
  FileText, 
  Database,
  Compass,
  Zap,
  MapPin
} from 'lucide-react';
import { 
  mockRoadSegments, 
  mockFeatureImportance, 
  mockConfusionMatrix, 
  mockModelHistory 
} from './mockData';
import { RoadSegmentRisk, ModelVersionHistory } from '../../types/superadmin';
import { formatNumber } from '../../lib/utils';

export function ModelManagementView() {
  // Road segments table states
  const [segments, setSegments] = useState<RoadSegmentRisk[]>(mockRoadSegments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua');
  const [selectedDanger, setSelectedDanger] = useState('Semua');
  const [sortField, setSortField] = useState<'riskScore' | 'name' | 'region'>('riskScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSegment, setSelectedSegment] = useState<RoadSegmentRisk | null>(null);

  // Model history and version states
  const [history, setHistory] = useState<ModelVersionHistory[]>(mockModelHistory);
  const [activeVersion, setActiveVersion] = useState<string>('v2.4.2');
  const [rollbackCandidate, setRollbackCandidate] = useState<ModelVersionHistory | null>(null);

  // Retrain modal states
  const [isRetrainModalOpen, setIsRetrainModalOpen] = useState(false);
  const [retrainDataset, setRetrainDataset] = useState('Semua Data (12 Bulan)');
  const [retrainEstimators, setRetrainEstimators] = useState(250);
  const [retrainMaxDepth, setRetrainMaxDepth] = useState('16');
  const [retrainProgress, setRetrainProgress] = useState<number | null>(null);
  const [retrainStage, setRetrainStage] = useState<string>('');

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sorting & Filtering logic
  const filteredSegments = segments
    .filter((seg) => {
      const matchSearch = seg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          seg.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          seg.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion = selectedRegion === 'Semua' || seg.region === selectedRegion;
      const matchDanger = selectedDanger === 'Semua' || seg.dangerLevel === selectedDanger;
      return matchSearch && matchRegion && matchDanger;
    })
    .sort((a, b) => {
      if (sortField === 'riskScore') {
        return sortDirection === 'desc' ? b.riskScore - a.riskScore : a.riskScore - b.riskScore;
      }
      if (sortField === 'name') {
        return sortDirection === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      }
      return sortDirection === 'desc' ? b.region.localeCompare(a.region) : a.region.localeCompare(b.region);
    });

  const handleSort = (field: 'riskScore' | 'name' | 'region') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Rollback Action
  const confirmRollback = (target: ModelVersionHistory) => {
    setHistory((prev) =>
      prev.map((v) => {
        if (v.version === target.version) {
          return { ...v, status: 'Active' };
        }
        if (v.version === activeVersion) {
          return { ...v, status: 'Deprecated' };
        }
        return v;
      })
    );
    setActiveVersion(target.version);
    setRollbackCandidate(null);
    showToast(`Model berhasil di-rollback ke versi ${target.version}`);
  };

  // Retrain Simulation
  const executeRetrain = () => {
    setRetrainProgress(10);
    setRetrainStage('Inisialisasi pipeline data & pembersihan outlier...');

    setTimeout(() => {
      setRetrainProgress(35);
      setRetrainStage('Ekstraksi fitur spatiotemporal & bobot klaster DBSCAN...');
    }, 1200);

    setTimeout(() => {
      setRetrainProgress(70);
      setRetrainStage(`Fitting Random Forest (${retrainEstimators} decision trees, max_depth=${retrainMaxDepth})...`);
    }, 2500);

    setTimeout(() => {
      setRetrainProgress(95);
      setRetrainStage('K-Fold Cross Validation & kalkulasi matriks evaluasi...');
    }, 3800);

    setTimeout(() => {
      setRetrainProgress(100);
      const newVersionName = `v2.4.${history.length}`;
      const newHistoryItem: ModelVersionHistory = {
        version: newVersionName,
        trainedAt: new Date().toISOString(),
        durationSeconds: 48,
        datasetScope: retrainDataset,
        sampleCount: 26400,
        accuracy: 92.1,
        f1Score: 88.3,
        aucRoc: 0.948,
        status: 'Active',
        trainedBy: 'Superadmin Manual Trigger',
        notes: `Retraining manual via dataset ${retrainDataset} (${retrainEstimators} trees).`,
      };

      setHistory((prev) => [
        newHistoryItem,
        ...prev.map((v) => (v.status === 'Active' ? { ...v, status: 'Deprecated' as const } : v)),
      ]);
      setActiveVersion(newVersionName);

      // Randomly adjust scores to reflect retraining freshness
      setSegments((prev) =>
        prev.map((s) => ({
          ...s,
          lastEvaluated: 'Baru saja',
          riskScore: Math.min(99, Math.max(10, s.riskScore + (Math.floor(Math.random() * 5) - 2))),
        }))
      );

      setTimeout(() => {
        setIsRetrainModalOpen(false);
        setRetrainProgress(null);
        setRetrainStage('');
        showToast(`Model ${newVersionName} berhasil ditraining dan di-deploy ke produksi!`);
      }, 800);
    }, 4800);
  };

  const getDangerBadge = (level: string) => {
    switch (level) {
      case 'Kritis':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Rawan':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Waspada':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
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

      {/* ================= HEADER & STATUS ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-white">Panel Model & Risk Scoring</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {activeVersion} LIVE
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Pengawasan dan kalibrasi algoritma Random Forest Spatiotemporal untuk penentuan tingkat bahaya segmen jalan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRetrainModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 active:scale-95 transition-all shadow-md shadow-white/10"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Retrain Model</span>
          </button>
        </div>
      </div>

      {/* ================= KPI METRIC CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 font-medium">Akurasi Model</span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">+1.7%</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">91.4%</span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Benchmarked vs 24.8k sampel</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 font-medium">Precision Score</span>
            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.5 rounded">Tinggi</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">88.7%</span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Rasio alarm valid vs palsu</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 font-medium">Recall (Sensitivitas)</span>
            <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/40 border border-indigo-800/40 px-1.5 py-0.5 rounded">Aman</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">86.2%</span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Minimasi insiden terlewat</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 font-medium">F1-Score Harmonik</span>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.5 rounded">Seimbang</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">87.4%</span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Presisi & sensitivitas gabungan</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-xs text-zinc-400 font-medium">AUC-ROC Metric</span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">0.94</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">0.942</span>
            <p className="text-[11px] text-zinc-500 mt-0.5">Daya pembeda risiko sangat prima</p>
          </div>
        </div>
      </div>

      {/* ================= OPERATIONAL INTEL PANEL (IMPLICIT 5W1H) ================= */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-950 via-[#0a0a0a] to-neutral-950 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Arsitektur & Konfigurasi Inti</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Random Forest Spatiotemporal Classifier (250 estimators, max_depth=16). Dilatih dengan spatial kernel density estimation dari klaster DBSCAN.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Cakupan Wilayah & Segmentasi</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              425 segmen jalan arteri dan sekunder di Jabodetabek terkalibrasi. Update bobot risiko dinamis setiap terjadi eskalasi laporan crowdsourcing.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Siklus Pelatihan & Mitigasi Jam Rawan</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Penekanan pengali bobot risiko pada jam dini hari (00.00–05.00 WIB) demi memitigasi celah kejahatan jalanan dan memandu ke koridor terang.
            </p>
          </div>
        </div>
      </div>

      {/* ================= SECTION 2: FEATURE IMPORTANCE & CONFUSION MATRIX ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Feature Importance Breakdown */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Feature Importance Distribusi</h3>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">Normalized Gini Importance</span>
            </div>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Bobot kontribusi masing-masing variabel prediktor dalam menentukan skor bahaya segmen jalan di algoritma Random Forest.
            </p>

            <div className="space-y-5">
              {mockFeatureImportance.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-neutral-200">{item.feature}</span>
                    <span className="font-mono font-bold text-white">{item.importance}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/[0.06]">
                    <div 
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-gradient-to-r from-rose-500 to-amber-500' :
                        idx === 1 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                        idx === 2 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                        'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${item.importance}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500">
            <span>Model Explainability: SHAP Summary Validated</span>
            <span className="font-mono">Drift Index: 0.04 (Aman)</span>
          </div>
        </div>

        {/* Right Column: Confusion Matrix Interactive Visualizer */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Matriks Evaluasi (Confusion Matrix)</h3>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">6,192 Sampel Uji</span>
            </div>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Validasi ketepatan klasifikasi risiko antara prediksi model vs kejadian faktual di lapangan.
            </p>

            {/* 2x2 Matrix Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* True Positive */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">True Positive</span>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="my-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatNumber(mockConfusionMatrix.truePositive)}
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Bahaya Terdeteksi Tepat</p>
                </div>
                <span className="text-[10px] text-emerald-300/80 font-mono">Akurasi Rute Aman</span>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-yellow-950/20 border border-yellow-500/30 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">False Positive</span>
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="my-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatNumber(mockConfusionMatrix.falsePositive)}
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Peringatan Berlebih (False Alarm)</p>
                </div>
                <span className="text-[10px] text-yellow-300/80 font-mono">Rerouting Konservatif</span>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">False Negative</span>
                  <X className="w-4 h-4 text-rose-400" />
                </div>
                <div className="my-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatNumber(mockConfusionMatrix.falseNegative)}
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Bahaya Terlewat (Kritis)</p>
                </div>
                <span className="text-[10px] text-rose-300/80 font-mono">Target Eliminasi Utama</span>
              </div>

              {/* True Negative */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">True Negative</span>
                  <Shield className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="my-2">
                  <span className="text-2xl font-bold font-mono text-white">
                    {formatNumber(mockConfusionMatrix.trueNegative)}
                  </span>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Jalan Aman Teridentifikasi</p>
                </div>
                <span className="text-[10px] text-cyan-300/80 font-mono">Koridor Bebas Hambatan</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-zinc-500 flex justify-between items-center">
            <span>Tingkat Keselamatan Penumpang:</span>
            <span className="font-bold text-emerald-400 font-mono">99.38% Aman</span>
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: TABEL SKOR RISIKO PER RUAS JALAN ================= */}
      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Skor Risiko per Ruas Jalan / Segmen</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daftar segmen jaringan jalan yang dievaluasi secara dinamis oleh model Random Forest.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Cari jalan atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 w-48 sm:w-60"
              />
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="Semua">Semua Wilayah</option>
              <option value="Jakarta Selatan">Jakarta Selatan</option>
              <option value="Jakarta Pusat">Jakarta Pusat</option>
              <option value="Jakarta Timur">Jakarta Timur</option>
              <option value="Jakarta Barat">Jakarta Barat</option>
              <option value="Jakarta Utara">Jakarta Utara</option>
              <option value="Depok">Depok</option>
              <option value="Bekasi">Bekasi</option>
            </select>

            <select
              value={selectedDanger}
              onChange={(e) => setSelectedDanger(e.target.value)}
              className="px-3 py-1.5 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Kritis">Kritis (80-100)</option>
              <option value="Rawan">Rawan (65-79)</option>
              <option value="Waspada">Waspada (50-64)</option>
              <option value="Aman">Aman (&lt;50)</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-neutral-900/60 text-zinc-400 font-semibold uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">ID Segmen</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Ruas Jalan</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('region')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Wilayah</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('riskScore')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Skor Risiko (0-100)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Jam Paling Rawan</th>
                <th className="py-3 px-4">Penerangan</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {filteredSegments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    Tidak ada data ruas jalan yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredSegments.map((seg) => (
                  <tr key={seg.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-500 font-medium">{seg.id}</td>
                    <td className="py-3 px-4 font-semibold text-white">{seg.name}</td>
                    <td className="py-3 px-4 text-zinc-400">{seg.region}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{seg.riskScore}</span>
                        <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              seg.riskScore >= 80 ? 'bg-rose-500' :
                              seg.riskScore >= 65 ? 'bg-orange-500' :
                              seg.riskScore >= 50 ? 'bg-yellow-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${seg.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getDangerBadge(seg.dangerLevel)}`}>
                        {seg.dangerLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{seg.peakDangerHours}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-medium ${
                        seg.lightingQuality === 'Terang' ? 'text-emerald-400' :
                        seg.lightingQuality === 'Sedang' ? 'text-yellow-400' : 'text-rose-400'
                      }`}>
                        {seg.lightingQuality}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedSegment(seg)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08] transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= SECTION 4: RIWAYAT TRAINING & VERSIONING ================= */}
      <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <h3 className="text-base font-bold text-white">Riwayat Versi Model & Rollback Engine</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daftar iterasi pelatihan model sebelumnya. Jika terjadi anomali atau penurunan akurasi, sistem dapat di-rollback seketika.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-neutral-900/60 text-zinc-400 font-semibold uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Versi</th>
                <th className="py-3 px-4">Tanggal Pelatihan</th>
                <th className="py-3 px-4">Cakupan Data</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Akurasi</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-zinc-300">
              {history.map((ver) => {
                const isActive = ver.version === activeVersion;
                return (
                  <tr key={ver.version} className={isActive ? 'bg-emerald-950/10' : 'hover:bg-white/[0.02]'}>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-white">{ver.version}</span>
                    </td>
                    <td suppressHydrationWarning className="py-3 px-4 text-zinc-400">
                      {new Date(ver.trainedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })} WIB
                    </td>
                    <td className="py-3 px-4 text-zinc-300 font-medium">{ver.datasetScope}</td>
                    <td className="py-3 px-4 font-mono text-zinc-400">{ver.durationSeconds}s</td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{ver.accuracy}%</td>
                    <td className="py-3 px-4 font-mono text-white">{ver.f1Score}%</td>
                    <td className="py-3 px-4">
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active Model
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-800 text-zinc-400 border border-white/[0.08]">
                          {ver.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isActive ? (
                        <span className="text-[11px] text-zinc-500 italic">Sedang Berjalan</span>
                      ) : (
                        <button
                          onClick={() => setRollbackCandidate(ver)}
                          className="px-3 py-1 text-[11px] font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                        >
                          Rollback ke Versi Ini
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

      {/* ================= MODAL: DETAIL RUAS JALAN ================= */}
      {selectedSegment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d0d0d] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-zinc-500">{selectedSegment.id}</span>
                <h4 className="text-lg font-bold text-white mt-0.5">{selectedSegment.name}</h4>
                <p className="text-xs text-zinc-400">{selectedSegment.region}</p>
              </div>
              <button
                onClick={() => setSelectedSegment(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.06]">
                <span className="text-[10px] text-zinc-400">Skor Risiko Terhitung</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold font-mono text-white">{selectedSegment.riskScore}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDangerBadge(selectedSegment.dangerLevel)}`}>
                    {selectedSegment.dangerLevel}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.06]">
                <span className="text-[10px] text-zinc-400">Jam Paling Rawan</span>
                <p className="text-sm font-mono font-bold text-rose-400 mt-1">{selectedSegment.peakDangerHours}</p>
              </div>
            </div>

            {/* Feature contributions breakdown */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-zinc-300">Dekomposisi Kontribusi Fitur Prediksi</h5>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Kepadatan Insiden Kriminalitas</span>
                    <span className="font-mono text-white">{selectedSegment.featureContributions.crimeHistory}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${selectedSegment.featureContributions.crimeHistory}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Defisit Penerangan Lampu Jalan</span>
                    <span className="font-mono text-white">{selectedSegment.featureContributions.lighting}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedSegment.featureContributions.lighting}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Faktor Jam Sepi / Dini Hari</span>
                    <span className="font-mono text-white">{selectedSegment.featureContributions.nightTime}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedSegment.featureContributions.nightTime}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>Jarak Pos Polisi ({selectedSegment.policePostDistance}m)</span>
                    <span className="font-mono text-white">{selectedSegment.featureContributions.securityProximity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedSegment.featureContributions.securityProximity}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
              <span>
                Algoritma A* Pathfinding otomatis menambahkan penalti bobot pada segmen ini ketika rute diminta pengguna antara jam {selectedSegment.peakDangerHours}.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSegment(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KONFIRMASI ROLLBACK ================= */}
      {rollbackCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="text-base font-bold text-white">Konfirmasi Rollback Model</h4>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Anda akan mengembalikan model inferensi produksi dari <span className="font-mono font-bold text-white">{activeVersion}</span> ke versi sebelumnya: <span className="font-mono font-bold text-amber-400">{rollbackCandidate.version}</span>.
            </p>

            <div className="p-3 rounded-xl bg-neutral-900 border border-white/[0.08] text-xs space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Tanggal Pelatihan:</span>
                <span suppressHydrationWarning className="text-white font-mono">{new Date(rollbackCandidate.trainedAt).toLocaleDateString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Akurasi:</span>
                <span className="text-emerald-400 font-mono font-bold">{rollbackCandidate.accuracy}%</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Cakupan Dataset:</span>
                <span className="text-white">{rollbackCandidate.datasetScope}</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 italic">
              *Tindakan ini akan langsung merubah kalkulasi rute pada aplikasi mobile pengguna tanpa downtime.
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setRollbackCandidate(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => confirmRollback(rollbackCandidate)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shadow-md shadow-amber-500/20"
              >
                Ya, Rollback Versi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RETRAIN MODEL DIALOG ================= */}
      {isRetrainModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d0d0d] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Retrain Random Forest Model</h4>
                  <p className="text-xs text-zinc-400">Pelatihan ulang ensemble pohon keputusan berbasis data terbaru</p>
                </div>
              </div>
              {retrainProgress === null && (
                <button
                  onClick={() => setIsRetrainModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {retrainProgress === null ? (
              <div className="space-y-4">
                {/* Dataset selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Cakupan Data Pelatihan</label>
                  <select
                    value={retrainDataset}
                    onChange={(e) => setRetrainDataset(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="Semua Data (12 Bulan)">Semua Data (12 Bulan Terakhir - Rekomendasi)</option>
                    <option value="6 Bulan Terakhir">6 Bulan Terakhir (Fokus Tren Terkini)</option>
                    <option value="3 Bulan Terakhir">3 Bulan Terakhir (Eksperimen Cepat)</option>
                  </select>
                </div>

                {/* Hyperparameters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">
                      n_estimators: <span className="font-mono text-cyan-400">{retrainEstimators}</span>
                    </label>
                    <input
                      type="range"
                      min={100}
                      max={300}
                      step={25}
                      value={retrainEstimators}
                      onChange={(e) => setRetrainEstimators(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>100</span>
                      <span>200</span>
                      <span>300</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-300">Max Tree Depth</label>
                    <select
                      value={retrainMaxDepth}
                      onChange={(e) => setRetrainMaxDepth(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                    >
                      <option value="12">12 (Cepat, Anti-Overfit)</option>
                      <option value="16">16 (Optimal Produksi)</option>
                      <option value="20">20 (Presisi Tinggi)</option>
                      <option value="None">None (Unrestricted)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-900/60 border border-white/[0.06] space-y-1 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Estimasi Waktu Training:</span>
                    <span className="font-mono text-white">~45 Detik</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dataset Terverifikasi:</span>
                    <span className="font-mono text-white">26,400 Records</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    onClick={() => setIsRetrainModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={executeRetrain}
                    className="px-5 py-2 text-xs font-bold rounded-xl bg-white text-neutral-950 hover:bg-neutral-200 transition-all shadow-md shadow-white/10"
                  >
                    Mulai Training
                  </button>
                </div>
              </div>
            ) : (
              /* Ongoing retraining progress view */
              <div className="py-6 space-y-5 text-center">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                    <BrainCircuit className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <span className="text-2xl font-bold font-mono text-white">{retrainProgress}%</span>
                  <p className="text-xs text-zinc-400 mt-1">{retrainStage}</p>
                </div>

                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${retrainProgress}%` }}
                  />
                </div>

                <p className="text-[11px] text-zinc-500 italic">
                  Proses berjalan di background worker cluster. Jangan tutup modal sampai selesai.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
