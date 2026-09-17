'use client';

import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Layers, 
  AlertTriangle, 
  ShieldAlert, 
  SunDim, 
  Car, 
  Footprints, 
  Zap, 
  Waves, 
  HelpCircle, 
  Flame, 
  Construction, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  RotateCcw, 
  Save, 
  Info, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  Scale, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { 
  mockMasterCategories, 
  mockRiskThresholds, 
  mockDbscanConfig,
  mockRoadSegments
} from './mockData';
import { 
  IncidentCategoryMaster, 
  RiskThresholdConfig, 
  DbscanSystemConfig 
} from '../../types/superadmin';

// Icon Map helper to dynamically render Lucide icons
const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertTriangle,
  ShieldAlert,
  SunDim,
  Car,
  Footprints,
  Zap,
  Waves,
  HelpCircle,
  Flame,
  Construction,
};

export function MasterContentView() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'categories' | 'thresholds' | 'dbscan'>('categories');

  // =========================================================================
  // 1. STATE FOR INCIDENT CATEGORIES CRUD
  // =========================================================================
  const [categories, setCategories] = useState<IncidentCategoryMaster[]>(mockMasterCategories);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [categoryFilterSeverity, setCategoryFilterSeverity] = useState('Semua');

  // Create / Edit Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<IncidentCategoryMaster | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formIconName, setFormIconName] = useState('AlertTriangle');
  const [formSeverity, setFormSeverity] = useState(5);
  const [formColorHex, setFormColorHex] = useState('#f43f5e');
  const [formDescription, setFormDescription] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Delete Confirmation Modal State
  const [deletingCategory, setDeletingCategory] = useState<IncidentCategoryMaster | null>(null);

  // =========================================================================
  // 2. STATE FOR RISK THRESHOLDS CONFIG
  // =========================================================================
  const [thresholdConfig, setThresholdConfig] = useState<RiskThresholdConfig>(mockRiskThresholds);
  const [tempSafeMax, setTempSafeMax] = useState(thresholdConfig.safeMax);
  const [tempWarningMax, setTempWarningMax] = useState(thresholdConfig.warningMax);
  const [tempAutoReroute, setTempAutoReroute] = useState(thresholdConfig.autoRerouteThreshold);

  // =========================================================================
  // 3. STATE FOR DBSCAN CONFIG
  // =========================================================================
  const [dbscanConfig, setDbscanConfig] = useState<DbscanSystemConfig>(mockDbscanConfig);
  const [tempEps, setTempEps] = useState(dbscanConfig.eps);
  const [tempMinSamples, setTempMinSamples] = useState(dbscanConfig.minSamples);
  const [tempDistanceMetric, setTempDistanceMetric] = useState(dbscanConfig.distanceMetric);
  const [tempTimeDecay, setTempTimeDecay] = useState(dbscanConfig.timeDecayDays);
  const [tempWeightMode, setTempWeightMode] = useState(dbscanConfig.clusterWeightMode);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper: Open Modal for Create
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormIconName('AlertTriangle');
    setFormSeverity(7);
    setFormColorHex('#f43f5e');
    setFormDescription('');
    setFormIsActive(true);
    setShowCategoryModal(true);
  };

  // Helper: Open Modal for Edit
  const handleOpenEditCategory = (cat: IncidentCategoryMaster) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIconName(cat.iconName);
    setFormSeverity(cat.defaultSeverity);
    setFormColorHex(cat.colorHex);
    setFormDescription(cat.description);
    setFormIsActive(cat.isActive);
    setShowCategoryModal(true);
  };

  // Helper: Auto generate slug from name
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Helper: Save Category (Create / Update)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let severityLabel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis' = 'Sedang';
    if (formSeverity >= 8) severityLabel = 'Kritis';
    else if (formSeverity >= 6) severityLabel = 'Tinggi';
    else if (formSeverity >= 4) severityLabel = 'Sedang';
    else severityLabel = 'Rendah';

    if (editingCategory) {
      // Update
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formName.trim(),
                slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
                iconName: formIconName,
                defaultSeverity: formSeverity,
                severityLabel,
                colorHex: formColorHex,
                description: formDescription.trim(),
                isActive: formIsActive,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
      showToast(`Kategori "${formName}" berhasil diperbarui`);
    } else {
      // Create
      const newCat: IncidentCategoryMaster = {
        id: `CAT-${String(categories.length + 1).padStart(2, '0')}`,
        name: formName.trim(),
        slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
        iconName: formIconName,
        defaultSeverity: formSeverity,
        severityLabel,
        colorHex: formColorHex,
        description: formDescription.trim(),
        reportCount: 0,
        isActive: formIsActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [newCat, ...prev]);
      showToast(`Kategori baru "${formName}" berhasil dibuat`);
    }

    setShowCategoryModal(false);
  };

  // Helper: Toggle Category Active Status
  const handleToggleCategoryActive = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          const nextState = !c.isActive;
          showToast(`Kategori "${c.name}" kini ${nextState ? 'Aktif' : 'Nonaktif'}`);
          return { ...c, isActive: nextState };
        }
        return c;
      })
    );
  };

  // Helper: Delete Category
  const handleConfirmDeleteCategory = () => {
    if (!deletingCategory) return;
    setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
    showToast(`Kategori "${deletingCategory.name}" telah dihapus`);
    setDeletingCategory(null);
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                          c.slug.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(categorySearchQuery.toLowerCase());
      const matchSeverity = categoryFilterSeverity === 'Semua' || c.severityLabel === categoryFilterSeverity;
      return matchSearch && matchSeverity;
    });
  }, [categories, categorySearchQuery, categoryFilterSeverity]);

  // Save Threshold Settings
  const handleSaveThresholds = () => {
    if (tempSafeMax >= tempWarningMax) {
      showToast('Error: Batas Aman harus lebih kecil dari Batas Waspada');
      return;
    }
    const updated: RiskThresholdConfig = {
      safeMax: tempSafeMax,
      warningMax: tempWarningMax,
      criticalMin: tempWarningMax + 1,
      autoRerouteThreshold: tempAutoReroute,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Superadmin (Session Active)',
    };
    setThresholdConfig(updated);
    showToast('Konfigurasi ambang batas skor risiko berhasil disimpan');
  };

  const handleResetThresholds = () => {
    setTempSafeMax(35);
    setTempWarningMax(65);
    setTempAutoReroute(60);
    showToast('Nilai ambang batas dikembalikan ke standar awal sistem');
  };

  // Save DBSCAN Settings
  const handleSaveDbscan = () => {
    const updated: DbscanSystemConfig = {
      eps: tempEps,
      minSamples: tempMinSamples,
      distanceMetric: tempDistanceMetric,
      timeDecayDays: tempTimeDecay,
      clusterWeightMode: tempWeightMode,
      lastCalibration: new Date().toISOString(),
      simulatedClustersCount: Math.round(14 * (450 / tempEps) * (tempMinSamples / 4)),
      simulatedNoisePointsCount: Math.round(42 * (tempEps / 450)),
    };
    setDbscanConfig(updated);
    showToast('Konfigurasi DBSCAN berhasil disimpan dan diaplikasikan ke mesin klaster');
  };

  const handleResetDbscan = () => {
    setTempEps(450);
    setTempMinSamples(4);
    setTempDistanceMetric('haversine');
    setTempTimeDecay(90);
    setTempWeightMode('severity_weighted');
    showToast('Parameter DBSCAN dikembalikan ke nilai default');
  };

  // Helper to simulate road segment classification under current temporary thresholds
  const getSimulatedSegmentLabel = (score: number) => {
    if (score <= tempSafeMax) return { label: 'Aman', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score <= tempWarningMax) return { label: 'Waspada', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Berisiko (Rawan/Kritis)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
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

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Konfigurasi Inti
            </span>
            <span className="text-xs text-zinc-500">Master Data & Engine Parameter</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Manajemen Konten Master & Konfigurasi Sistem
          </h2>
          <p className="text-sm text-zinc-400">
            Pusat kendali master kategori insiden, kalibrasi ambang batas skor risiko jalan, dan penyetelan parameter default mesin spasial DBSCAN.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center bg-[#0a0a0a] border border-white/[0.08] rounded-xl p-1 overflow-x-auto w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'categories'
                ? 'bg-white/10 text-white shadow-sm border border-white/[0.1]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kategori Insiden</span>
          </button>
          <button
            onClick={() => setActiveTab('thresholds')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'thresholds'
                ? 'bg-white/10 text-white shadow-sm border border-white/[0.1]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Threshold Skor Risiko</span>
          </button>
          <button
            onClick={() => setActiveTab('dbscan')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === 'dbscan'
                ? 'bg-white/10 text-white shadow-sm border border-white/[0.1]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Parameter DBSCAN</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CRUD KATEGORI INSIDEN */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  placeholder="Cari kategori / deskripsi..."
                  className="bg-black/50 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 w-full sm:w-64"
                />
              </div>

              <select
                value={categoryFilterSeverity}
                onChange={(e) => setCategoryFilterSeverity(e.target.value)}
                className="bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50"
              >
                <option value="Semua">Semua Tingkat Bahaya</option>
                <option value="Kritis">Kritis (Severity 8-10)</option>
                <option value="Tinggi">Tinggi (Severity 6-7)</option>
                <option value="Sedang">Sedang (Severity 4-5)</option>
                <option value="Rendah">Rendah (Severity 1-3)</option>
              </select>
            </div>

            <button
              onClick={handleOpenCreateCategory}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 border border-blue-500/50 shrink-0 w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori Baru</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => {
              const IconComp = ICON_COMPONENTS[category.iconName] || AlertTriangle;
              const isCritical = category.severityLabel === 'Kritis';
              const isHigh = category.severityLabel === 'Tinggi';
              const isMedium = category.severityLabel === 'Sedang';

              return (
                <div
                  key={category.id}
                  className={`bg-[#0a0a0a] border rounded-2xl p-5 flex flex-col justify-between transition-all group hover:border-white/[0.18] ${
                    category.isActive ? 'border-white/[0.08]' : 'border-white/[0.04] opacity-60 bg-black/40'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon, Severity Badge, Toggle */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center border"
                          style={{
                            backgroundColor: `${category.colorHex}15`,
                            borderColor: `${category.colorHex}30`,
                            color: category.colorHex,
                          }}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-500 font-mono block uppercase tracking-wider">{category.id}</span>
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                            {category.name}
                          </h4>
                        </div>
                      </div>

                      {/* Active Status Badge */}
                      <button
                        onClick={() => handleToggleCategoryActive(category.id)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                          category.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                        title="Klik untuk mengubah status aktif"
                      >
                        {category.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  </div>

                  <div>
                    {/* Severity Metric & Report Count */}
                    <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3 space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Tingkat Bahaya Default:</span>
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            isCritical ? 'bg-rose-500/20 text-rose-400' :
                            isHigh ? 'bg-amber-500/20 text-amber-400' :
                            isMedium ? 'bg-cyan-500/20 text-cyan-400' :
                            'bg-zinc-800 text-zinc-300'
                          }`}>
                            {category.severityLabel}
                          </span>
                          <span className="text-white font-mono">{category.defaultSeverity}/10</span>
                        </div>
                      </div>

                      {/* Severity Meter Bar */}
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${category.defaultSeverity * 10}%`,
                            backgroundColor: category.colorHex,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                        <span>Slug: <code className="text-zinc-400 font-mono text-[10px]">{category.slug}</code></span>
                        <span>{category.reportCount} Laporan</span>
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                      <button
                        onClick={() => handleOpenEditCategory(category)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingCategory(category)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SETTING THRESHOLD SKOR RISIKO */}
      {/* ========================================================================= */}
      {activeTab === 'thresholds' && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white tracking-tight">
                    Kalibrasi Ambang Batas Skor Risiko Ruas Jalan
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                    Konfigurasi Dinamis
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Atur rentang skor risiko numerik (0–100) yang memicu klasifikasi label status "Aman", "Waspada", dan "Berisiko" di seluruh rute warga.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetThresholds}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={handleSaveThresholds}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 border border-blue-500/50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Konfigurasi</span>
                </button>
              </div>
            </div>

            {/* Threshold Sliders & Visual Spectrum */}
            <div className="mt-8 space-y-8">
              {/* Visual Multi-Bracket Spectrum Bar */}
              <div>
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-3">
                  Spektrum Visual Klasifikasi Risiko (Skala 0 - 100)
                </span>
                
                <div className="h-10 w-full rounded-xl overflow-hidden flex border border-white/[0.1] shadow-inner text-xs font-bold text-white">
                  {/* Safe Segment */}
                  <div
                    className="bg-emerald-600/80 flex items-center justify-center transition-all relative group"
                    style={{ width: `${tempSafeMax}%` }}
                  >
                    <span>Aman (0 - {tempSafeMax})</span>
                  </div>

                  {/* Warning Segment */}
                  <div
                    className="bg-amber-600/80 flex items-center justify-center transition-all relative group"
                    style={{ width: `${tempWarningMax - tempSafeMax}%` }}
                  >
                    <span>Waspada ({tempSafeMax + 1} - {tempWarningMax})</span>
                  </div>

                  {/* Critical Segment */}
                  <div
                    className="bg-rose-600/80 flex items-center justify-center transition-all relative group"
                    style={{ width: `${100 - tempWarningMax}%` }}
                  >
                    <span>Berisiko ({tempWarningMax + 1} - 100)</span>
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-zinc-500 mt-2 font-mono">
                  <span>0 (Sangat Aman)</span>
                  <span className="text-emerald-400 font-semibold">Batas Aman: {tempSafeMax}</span>
                  <span className="text-amber-400 font-semibold">Batas Waspada: {tempWarningMax}</span>
                  <span>100 (Kritis Maksimal)</span>
                </div>
              </div>

              {/* Slider Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
                {/* Safe Max Control */}
                <div className="bg-black/30 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-white">Batas Atas "Aman"</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-emerald-400">{tempSafeMax}</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Skor 0 s/d <strong className="text-white">{tempSafeMax}</strong> dikategorikan aman tanpa hambatan.
                  </p>
                  <input
                    type="range"
                    min={10}
                    max={tempWarningMax - 5}
                    value={tempSafeMax}
                    onChange={(e) => setTempSafeMax(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Warning Max Control */}
                <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-sm font-bold text-white">Batas Atas "Waspada"</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-amber-400">{tempWarningMax}</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Skor <strong className="text-white">{tempSafeMax + 1}</strong> s/d <strong className="text-white">{tempWarningMax}</strong> memerlukan kewaspadaan pengendara.
                  </p>
                  <input
                    type="range"
                    min={tempSafeMax + 5}
                    max={90}
                    value={tempWarningMax}
                    onChange={(e) => setTempWarningMax(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Critical / Berisiko Threshold */}
                <div className="bg-black/30 border border-rose-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="text-sm font-bold text-white">Batas Bawah "Berisiko"</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-rose-400">{tempWarningMax + 1}</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Skor <strong className="text-white">{tempWarningMax + 1}</strong> s/d <strong className="text-white">100</strong> memicu peringatan rute rawan bahaya.
                  </p>
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                    Otomatis dihitung dari batas atas zona waspada + 1.
                  </div>
                </div>
              </div>

              {/* Auto Reroute Setting */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <ShieldAlert className="w-4 h-4 text-blue-400" />
                    <span>Ambang Batas Pemicu Saran Pengalihan Rute Otomatis</span>
                  </div>
                  <p className="text-zinc-400">
                    Jika segmen jalan memiliki skor &ge; nilai ini, aplikasi publik akan otomatis menawarkan opsi "Rute Alternatif Teraman".
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={40}
                    max={80}
                    value={tempAutoReroute}
                    onChange={(e) => setTempAutoReroute(Number(e.target.value))}
                    className="w-36 accent-blue-500 cursor-pointer"
                  />
                  <span className="font-mono text-base font-bold text-blue-400 min-w-[36px]">
                    &ge; {tempAutoReroute}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Simulation of Thresholds on Road Segments */}
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
            <div className="pb-4 border-b border-white/[0.08]">
              <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Simulasi Klasifikasi Segmen Jalan Real-Time
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pratinjau langsung bagaimana segmen jalan nyata terklasifikasi berdasarkan nilai slider di atas saat ini.
              </p>
            </div>

            <div className="divide-y divide-white/[0.05] mt-2">
              {mockRoadSegments.slice(0, 5).map((segment) => {
                const sim = getSimulatedSegmentLabel(segment.riskScore);
                return (
                  <div key={segment.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-white block">{segment.name}</span>
                      <span className="text-zinc-500 text-[11px]">{segment.region} • Jam Rawan: {segment.peakDangerHours}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-zinc-300">Skor: {segment.riskScore}</span>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${sim.color}`}>
                        {sim.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SETTING PARAMETER DEFAULT DBSCAN ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'dbscan' && (
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white tracking-tight">
                    Konfigurasi Parameter Default Mesin Klaster DBSCAN
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                    Spatiotemporal Clustering Engine
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Atur radius spasial (epsilon) dan kepadatan sampel minimum (min_samples) untuk mendeteksi klaster konsentrasi kriminalitas secara otomatis.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetDbscan}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={handleSaveDbscan}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 border border-blue-500/50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan & Terapkan</span>
                </button>
              </div>
            </div>

            {/* Core DBSCAN Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Epsilon (eps) Parameter */}
              <div className="bg-black/30 border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      Epsilon (<code className="text-blue-400 font-mono">eps</code>) Radius
                    </span>
                    <span className="text-[11px] text-zinc-500">Radius tetangga geospasial (meter)</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold text-white">{tempEps}</span>
                    <span className="text-xs text-zinc-400">meter</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Jarak maksimum antar dua titik laporan untuk dikelompokkan ke dalam satu klaster bahaya geospasial yang sama. Nilai yang terlalu kecil memecah klaster, nilai yang terlalu besar menggabungkan zona berbeda.
                </p>

                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min={150}
                    max={1200}
                    step={25}
                    value={tempEps}
                    onChange={(e) => setTempEps(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                    <span>150 m (Sangat Ketat)</span>
                    <span className="text-blue-400 font-semibold">Rekomendasi: 400 - 500 m</span>
                    <span>1.200 m (Luas)</span>
                  </div>
                </div>
              </div>

              {/* Minimum Samples (min_samples) Parameter */}
              <div className="bg-black/30 border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      Min Samples (<code className="text-cyan-400 font-mono">min_samples</code>)
                    </span>
                    <span className="text-[11px] text-zinc-500">Ambang titik pembentuk klaster inti</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold text-white">{tempMinSamples}</span>
                    <span className="text-xs text-zinc-400">titik laporan</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Jumlah minimum laporan yang harus berada di dalam radius <code className="text-zinc-300 font-mono">eps</code> agar titik tersebut dianggap sebagai klaster aktif. Titik dengan kepadatan di bawah ini diklasifikasikan sebagai derau.
                </p>

                <div className="space-y-2 pt-2">
                  <input
                    type="range"
                    min={2}
                    max={15}
                    step={1}
                    value={tempMinSamples}
                    onChange={(e) => setTempMinSamples(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                    <span>2 Titik (Sensitif)</span>
                    <span className="text-cyan-400 font-semibold">Rekomendasi: 3 - 5 Titik</span>
                    <span>15 Titik (Ketat)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Algorithm Tuning */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.08]">
              {/* Metric Type */}
              <div className="bg-black/30 border border-white/[0.05] rounded-xl p-4 space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Metrik Jarak Geospasial
                </label>
                <select
                  value={tempDistanceMetric}
                  onChange={(e) => setTempDistanceMetric(e.target.value as 'haversine' | 'euclidean')}
                  className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="haversine">Haversine Great-Circle (Geodesik Akurat)</option>
                  <option value="euclidean">Euclidean Flat Earth (Aproksimasi Cepat)</option>
                </select>
                <p className="text-[11px] text-zinc-500">
                  Haversine memperhitungkan kelengkungan permukaan bumi pada koordinat derajat lat/lng.
                </p>
              </div>

              {/* Time Decay Window */}
              <div className="bg-black/30 border border-white/[0.05] rounded-xl p-4 space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Jendela Waktu Peluruhan Data
                </label>
                <select
                  value={tempTimeDecay}
                  onChange={(e) => setTempTimeDecay(Number(e.target.value))}
                  className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value={30}>30 Hari Terakhir (Fokus Insiden Baru)</option>
                  <option value={60}>60 Hari Terakhir</option>
                  <option value={90}>90 Hari Terakhir (Standar Rekomendasi)</option>
                  <option value={180}>180 Hari Terakhir (Historis Luas)</option>
                </select>
                <p className="text-[11px] text-zinc-500">
                  Insiden yang lebih lama dari rentang ini mengalami peluruhan bobot kepadatan (decay).
                </p>
              </div>

              {/* Cluster Weight Mode */}
              <div className="bg-black/30 border border-white/[0.05] rounded-xl p-4 space-y-2">
                <label className="text-xs font-semibold text-zinc-300 block">
                  Mode Pembobotan Laporan
                </label>
                <select
                  value={tempWeightMode}
                  onChange={(e) => setTempWeightMode(e.target.value as 'uniform' | 'severity_weighted')}
                  className="w-full bg-black/60 border border-white/[0.08] rounded-xl p-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="severity_weighted">Severity-Weighted (Begal/Curas Berbobot Tinggi)</option>
                  <option value="uniform">Uniform Weight (Semua Insiden Setara)</option>
                </select>
                <p className="text-[11px] text-zinc-500">
                  Kejahatan berkekerasan berat mempercepat pembentukan klaster merah bahaya.
                </p>
              </div>
            </div>

            {/* Simulated Clustering Telemetry */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/[0.04] border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white block">
                    Hasil Proyeksi Kalibrasi DBSCAN
                  </span>
                  <span className="text-zinc-400">
                    Dengan radius <strong className="text-white">{tempEps}m</strong> dan min samples <strong className="text-white">{tempMinSamples}</strong>:
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-zinc-300">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Klaster Terbentuk</span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    {Math.round(14 * (450 / tempEps) * (tempMinSamples / 4))} Klaster
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Titik Outlier/Noise</span>
                  <span className="font-mono text-base font-bold text-amber-400">
                    {Math.round(42 * (tempEps / 450))} Titik
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT INCIDENT CATEGORY */}
      {/* ========================================================================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0c0c0e] border border-white/[0.12] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {editingCategory ? 'Edit Kategori Insiden' : 'Tambah Kategori Insiden Baru'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Master konten kategori laporan bahaya jalan untuk pelapor dan model AI.
                </p>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              {/* Nama Kategori & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Nama Kategori <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Contoh: Balap Liar Dini Hari"
                    className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Slug Sistem <span className="text-zinc-500">(Auto)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="balap-liar"
                    className="w-full bg-black/50 border border-white/[0.08] rounded-xl px-3 py-2 text-zinc-300 font-mono focus:outline-none focus:border-blue-500/50 text-xs"
                  />
                </div>
              </div>

              {/* Icon Selector & Color Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Pilihan Ikon Visual
                  </label>
                  <div className="grid grid-cols-5 gap-2 p-2 rounded-xl bg-black/40 border border-white/[0.08]">
                    {Object.keys(ICON_COMPONENTS).map((iconKey) => {
                      const IconItem = ICON_COMPONENTS[iconKey];
                      const isSelected = formIconName === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setFormIconName(iconKey)}
                          className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                          }`}
                          title={iconKey}
                        >
                          <IconItem className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Warna Aksen Kategori
                  </label>
                  <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/[0.08]">
                    {[
                      '#f43f5e',
                      '#e11d48',
                      '#d946ef',
                      '#06b6d4',
                      '#38bdf8',
                      '#f59e0b',
                      '#ea580c',
                      '#8b5cf6',
                      '#10b981',
                      '#64748b',
                    ].map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => setFormColorHex(hex)}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          formColorHex === hex ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Default Severity Slider */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">
                    Tingkat Bahaya Default (Severity Scale 1 - 10)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      formSeverity >= 8 ? 'bg-rose-500/20 text-rose-400' :
                      formSeverity >= 6 ? 'bg-amber-500/20 text-amber-400' :
                      formSeverity >= 4 ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-zinc-800 text-zinc-300'
                    }`}>
                      {formSeverity >= 8 ? 'Kritis' : formSeverity >= 6 ? 'Tinggi' : formSeverity >= 4 ? 'Sedang' : 'Rendah'}
                    </span>
                    <span className="font-mono text-base font-bold text-white">{formSeverity}/10</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={formSeverity}
                  onChange={(e) => setFormSeverity(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Deskripsi & Panduan Pelaporan
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Jelaskan karakteristik insiden untuk acuan moderasi..."
                  className="w-full bg-black/50 border border-white/[0.08] rounded-xl p-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 text-xs"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.05]">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white block">Status Kategori</span>
                  <span className="text-[11px] text-zinc-500">Tampilkan kategori ini pada formulir pelaporan masyarakat</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              {/* Form Footer */}
              <div className="p-4 -mx-6 -mb-6 mt-6 border-t border-white/[0.08] flex items-center justify-end gap-3 bg-black/40">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 border border-blue-500/50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CATEGORY CONFIRMATION */}
      {/* ========================================================================= */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0c0c0e] border border-white/[0.12] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Hapus Kategori "{deletingCategory.name}"?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tindakan ini akan menghapus kategori dari sistem. Jika kategori ini telah memiliki riwayat laporan, disarankan untuk <strong>menonaktifkan</strong> alih-alih menghapus demi menjaga integritas data historis.
              </p>
            </div>

            <div className="p-4 border-t border-white/[0.08] flex items-center justify-end gap-3 bg-black/40">
              <button
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-lg shadow-rose-600/25"
              >
                Tetap Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
