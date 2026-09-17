'use client';

import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  BellRing, 
  Clock, 
  MapPin, 
  SlidersHorizontal, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Volume2, 
  Vibrate, 
  Radio, 
  Flame, 
  Compass, 
  Info, 
  Layers, 
  X,
  SmartphoneNfc,
  Apple
} from 'lucide-react';
import { 
  mockGlobalNotificationSettings, 
  mockNotificationTemplates, 
  mockZoneNotificationSchedules, 
  mockPushTestLogs 
} from './mockData';
import { 
  GlobalNotificationSettings, 
  NotificationTemplate, 
  ZoneNotificationSchedule, 
  PushTestLog, 
  RiskNotificationLevel 
} from '../../types/superadmin';

export function NotificationConfigView() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'templates' | 'preview'>('schedule');

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState<GlobalNotificationSettings>(mockGlobalNotificationSettings);
  
  // Templates State
  const [templates, setTemplates] = useState<NotificationTemplate[]>(mockNotificationTemplates);
  const [selectedTemplateLevel, setSelectedTemplateLevel] = useState<RiskNotificationLevel>('Bahaya');

  // Zone Schedules State
  const [zoneSchedules, setZoneSchedules] = useState<ZoneNotificationSchedule[]>(mockZoneNotificationSchedules);

  // Preview & Sandbox State
  const [devicePlatform, setDevicePlatform] = useState<'ios' | 'android'>('ios');
  const [previewLevel, setPreviewLevel] = useState<RiskNotificationLevel>('Bahaya');
  const [testTargetInput, setTestTargetInput] = useState('+62 812-9900-1122 (Perangkat Admin QA)');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testLogs, setTestLogs] = useState<PushTestLog[]>(mockPushTestLogs);

  // Notification Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const showNotice = (type: 'success' | 'info' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Active template being edited
  const currentEditingTemplate = useMemo(() => {
    return templates.find(t => t.level === selectedTemplateLevel) || templates[0];
  }, [templates, selectedTemplateLevel]);

  // Handle template field change
  const handleTemplateChange = (field: keyof NotificationTemplate, value: any) => {
    setTemplates(prev => prev.map(t => {
      if (t.level === selectedTemplateLevel) {
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  // Insert variable into template
  const handleInsertVariable = (variableKey: string) => {
    const updatedBody = currentEditingTemplate.bodyTemplate + ` {${variableKey}}`;
    handleTemplateChange('bodyTemplate', updatedBody);
    showNotice('info', `Variabel {${variableKey}} disisipkan ke template.`);
  };

  // Handle zone schedule update
  const handleZoneScheduleChange = (id: string, field: keyof ZoneNotificationSchedule, value: any) => {
    setZoneSchedules(prev => prev.map(z => {
      if (z.id === id) {
        return { ...z, [field]: value };
      }
      return z;
    }));
  };

  // Render variables for preview
  const renderedPreview = useMemo(() => {
    const targetTmpl = templates.find(t => t.level === previewLevel) || templates[1];
    
    // Sample contextual data
    const sampleData: Record<string, string> = {
      user_name: 'Fauzi',
      zone_name: 'Casablanca & Tebet',
      distance_m: '350',
      radius_m: globalSettings.defaultRadiusMeters.toString(),
      incident_count: '14',
      incident_type: 'Begal & Curas',
      risk_score: '84',
      detour_min: '6',
    };

    let renderedTitle = targetTmpl.titleTemplate;
    let renderedBody = targetTmpl.bodyTemplate;

    Object.entries(sampleData).forEach(([k, v]) => {
      renderedTitle = renderedTitle.replaceAll(`{${k}}`, v);
      renderedBody = renderedBody.replaceAll(`{${k}}`, v);
    });

    return {
      title: renderedTitle,
      body: renderedBody,
      action: targetTmpl.actionButtonText,
      secondary: targetTmpl.secondaryButtonText,
      level: targetTmpl.level,
      accentColor: targetTmpl.accentColor,
    };
  }, [templates, previewLevel, globalSettings.defaultRadiusMeters]);

  // Trigger Send Test Push
  const handleSendTestPush = () => {
    if (!testTargetInput.trim()) {
      showNotice('error', 'Masukkan nomor handphone atau token penguji.');
      return;
    }

    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      const newLog: PushTestLog = {
        id: `PUSH-TEST-${Date.now().toString().slice(-3)}`,
        timestamp: new Date().toISOString(),
        targetIdentifier: testTargetInput,
        level: previewLevel,
        renderedTitle: renderedPreview.title,
        renderedBody: renderedPreview.body,
        status: 'Delivered',
        deliveryLatencyMs: Math.floor(Math.random() * 40) + 75,
        fcmMessageId: `fcm_msg_${Date.now().toString().slice(-8)}`,
      };

      setTestLogs(prev => [newLog, ...prev]);
      showNotice('success', `Test Push berhasil terkirim ke ${testTargetInput}! Latensi: ${newLog.deliveryLatencyMs}ms.`);
    }, 1200);
  };

  // Save Config
  const handleSaveConfiguration = () => {
    showNotice('success', 'Konfigurasi notifikasi, jadwal zona, dan template risiko berhasil disimpan & diterapkan!');
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
          {notification.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
          {notification.type === 'info' && <Radio className="w-5 h-5 text-blue-400 shrink-0" />}
          <span className="text-xs sm:text-sm font-medium leading-tight">{notification.message}</span>
        </div>
      )}

      {/* Header & Page Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Konfigurasi Notifikasi Real-Time</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              FCM & APNs Active
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Pengaturan geofence radius trigger, jadwal jam rawan (default 00.00–04.59) per zona, template pesan risiko, dan preview uji coba push.
          </p>
        </div>

        <button
          onClick={handleSaveConfiguration}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all self-start md:self-auto"
        >
          <Check className="w-4 h-4" />
          Simpan Semua Konfigurasi
        </button>
      </div>

      {/* High-level Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Radius Trigger Bawaan</p>
            <p className="text-2xl font-bold text-white mt-1">{globalSettings.defaultRadiusMeters} <span className="text-xs font-normal text-zinc-500">meter</span></p>
            <p className="text-[11px] text-emerald-400 mt-0.5">Geofence Spasial Pengguna</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Jam Rawan Default (Malam)</p>
            <p className="text-2xl font-bold text-white mt-1">{globalSettings.defaultStartTime} – {globalSettings.defaultEndTime}</p>
            <p className="text-[11px] text-blue-400 mt-0.5">Dini Hari (Dapat di-override)</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Anti-Spam Cooldown</p>
            <p className="text-2xl font-bold text-white mt-1">{globalSettings.globalCooldownMinutes} <span className="text-xs font-normal text-zinc-500">menit</span></p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Batas Jeda per Pengguna</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">24/7 Darurat Kritis</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">Aktif Selalu</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">Bypass Jadwal untuk Skor &ge;90</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'schedule'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Clock className="w-4 h-4" />
          Radius Trigger & Jadwal per Zona
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'templates'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Template Pesan Level Risiko
          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/10 text-zinc-300">
            3 Tingkat
          </span>
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
            activeTab === 'preview'
              ? 'bg-white/10 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Preview HP & Uji Coba Push (Sandbox)
        </button>
      </div>

      {/* TAB 1: RADIUS TRIGGER & JADWAL PER ZONA */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Global Geofence & Schedule Master */}
          <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Parameter Global Default Geofencing</h2>
                <p className="text-xs text-zinc-400">Pengaturan ini menjadi acuan utama sebelum zona memberlakukan jadwal kustom khusus.</p>
              </div>
              <span className="text-xs text-zinc-500 font-mono">FCM Engine v2.4</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Radius Trigger Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">Radius Geofence Default</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">{globalSettings.defaultRadiusMeters} m</span>
                </div>
                <input
                  type="range"
                  min={globalSettings.minRadiusMeters}
                  max={globalSettings.maxRadiusMeters}
                  step={50}
                  value={globalSettings.defaultRadiusMeters}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, defaultRadiusMeters: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>200m (Ketat)</span>
                  <span>1.000m (Sedang)</span>
                  <span>2.000m (Luas)</span>
                </div>
              </div>

              {/* Default Active Hours */}
              <div className="space-y-2">
                <span className="text-zinc-300 font-medium text-xs block">Jam Rawan Default (WIB)</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Mulai</label>
                    <input
                      type="time"
                      value={globalSettings.defaultStartTime}
                      onChange={(e) => setGlobalSettings(prev => ({ ...prev, defaultStartTime: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block mb-1">Selesai</label>
                    <input
                      type="time"
                      value={globalSettings.defaultEndTime}
                      onChange={(e) => setGlobalSettings(prev => ({ ...prev, defaultEndTime: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">Waktu malam s/d subuh saat frekuensi kejahatan jalanan memuncak.</p>
              </div>

              {/* Cooldown & Emergency Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium">Jeda Anti-Spam (Cooldown)</span>
                  <span className="text-purple-400 font-mono font-bold">{globalSettings.globalCooldownMinutes} mnt</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={globalSettings.globalCooldownMinutes}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, globalCooldownMinutes: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="emergToggle"
                    checked={globalSettings.emergencyBroadcastEnabled}
                    onChange={(e) => setGlobalSettings(prev => ({ ...prev, emergencyBroadcastEnabled: e.target.checked }))}
                    className="rounded border-zinc-700 bg-zinc-900 text-emerald-500"
                  />
                  <label htmlFor="emergToggle" className="text-xs text-zinc-300 cursor-pointer">
                    Bypass cooldown untuk insiden Darurat Kritis
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Zone Specific Configuration List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Override Jam Aktif & Radius per Zona Operasional</h3>
                <p className="text-xs text-zinc-400">Setiap zona dapat menerapkan radius dan jam operasional sendiri berdasarkan pola kriminalitas lokal.</p>
              </div>
              <span className="text-xs text-zinc-400">{zoneSchedules.length} Zona Terkonfigurasi</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zoneSchedules.map((zone) => {
                return (
                  <div 
                    key={zone.id}
                    className={`p-4 rounded-xl border bg-[#0a0a0a] transition-all ${
                      zone.isActive 
                        ? 'border-white/[0.08]' 
                        : 'border-white/[0.04] opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{zone.zoneName}</h4>
                        <p className="text-xs text-zinc-400">{zone.region}</p>
                      </div>

                      <button
                        onClick={() => handleZoneScheduleChange(zone.id, 'isActive', !zone.isActive)}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors ${
                          zone.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {zone.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </div>

                    <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-white/[0.05] space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Mode Jadwal:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleZoneScheduleChange(zone.id, 'isCustomSchedule', false)}
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              !zone.isCustomSchedule 
                                ? 'bg-white/10 text-white font-medium' 
                                : 'text-zinc-500 hover:text-white'
                            }`}
                          >
                            Default
                          </button>
                          <button
                            onClick={() => handleZoneScheduleChange(zone.id, 'isCustomSchedule', true)}
                            className={`px-2 py-0.5 rounded text-[10px] ${
                              zone.isCustomSchedule 
                                ? 'bg-blue-500/20 text-blue-300 font-medium' 
                                : 'text-zinc-500 hover:text-white'
                            }`}
                          >
                            Kustom
                          </button>
                        </div>
                      </div>

                      {/* Active Hours */}
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Jam Aktif:</span>
                        {zone.isCustomSchedule ? (
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <input
                              type="time"
                              value={zone.activeStartTime}
                              onChange={(e) => handleZoneScheduleChange(zone.id, 'activeStartTime', e.target.value)}
                              className="px-1 py-0.5 rounded bg-zinc-900 border border-white/10 text-white text-[11px]"
                            />
                            <span className="text-zinc-500">–</span>
                            <input
                              type="time"
                              value={zone.activeEndTime}
                              onChange={(e) => handleZoneScheduleChange(zone.id, 'activeEndTime', e.target.value)}
                              className="px-1 py-0.5 rounded bg-zinc-900 border border-white/10 text-white text-[11px]"
                            />
                          </div>
                        ) : (
                          <span className="text-blue-400 font-mono text-[11px]">
                            {globalSettings.defaultStartTime} – {globalSettings.defaultEndTime} (Global)
                          </span>
                        )}
                      </div>

                      {/* Radius per Zone */}
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Radius Geofence:</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={200}
                            max={2000}
                            step={50}
                            value={zone.triggerRadiusMeters}
                            onChange={(e) => handleZoneScheduleChange(zone.id, 'triggerRadiusMeters', parseInt(e.target.value) || 500)}
                            className="w-16 px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-emerald-400 font-mono text-right text-xs"
                          />
                          <span className="text-[11px] text-zinc-500">m</span>
                        </div>
                      </div>

                      {/* 24/7 Emergency Toggle */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
                        <span className="text-[11px] text-zinc-400">Darurat 24/7:</span>
                        <button
                          onClick={() => handleZoneScheduleChange(zone.id, 'is24HoursEmergencyActive', !zone.is24HoursEmergencyActive)}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                            zone.is24HoursEmergencyActive 
                              ? 'text-rose-400 bg-rose-500/10' 
                              : 'text-zinc-500 bg-zinc-800'
                          }`}
                        >
                          {zone.is24HoursEmergencyActive ? 'Aktif 24 Jam' : 'Ikuti Jam Aktif'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEMPLATE PESAN LEVEL RISIKO */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Level Selector Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {templates.map((tmpl) => {
              const isSelected = tmpl.level === selectedTemplateLevel;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateLevel(tmpl.level)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-white/10 text-white border-white/20 shadow-md'
                      : 'bg-[#0a0a0a] text-zinc-400 border-white/[0.08] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: tmpl.accentColor }}
                  ></span>
                  {tmpl.levelLabel}
                </button>
              );
            })}
          </div>

          {/* Template Editor Box */}
          <div className="p-6 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Edit Template:</span>
                  <span style={{ color: currentEditingTemplate.accentColor }}>{currentEditingTemplate.level}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Dipicu ketika pengguna mendekati area dengan Skor Risiko &ge; {currentEditingTemplate.minRiskScore}/100.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Min. Skor Risiko:</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={currentEditingTemplate.minRiskScore}
                  onChange={(e) => handleTemplateChange('minRiskScore', parseInt(e.target.value) || 50)}
                  className="w-16 px-2 py-1 rounded bg-zinc-900 border border-white/10 text-white text-xs font-mono text-center"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Judul Notifikasi (Push Title)
                </label>
                <input
                  type="text"
                  value={currentEditingTemplate.titleTemplate}
                  onChange={(e) => handleTemplateChange('titleTemplate', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Isi Pesan Notifikasi (Push Body)
                  </label>
                  <span className="text-[11px] text-zinc-500">Maks. 180 karakter disarankan</span>
                </div>
                <textarea
                  rows={3}
                  value={currentEditingTemplate.bodyTemplate}
                  onChange={(e) => handleTemplateChange('bodyTemplate', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/20 leading-relaxed"
                />
              </div>

              {/* Dynamic Variables Chips */}
              <div>
                <span className="text-xs font-medium text-zinc-400 block mb-2">
                  Sisipkan Variabel Dinamis (Klik untuk Menambahkan):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'zone_name', label: '{zone_name} - Nama Wilayah' },
                    { key: 'distance_m', label: '{distance_m} - Jarak Pengguna (meter)' },
                    { key: 'radius_m', label: '{radius_m} - Radius Geofence' },
                    { key: 'incident_count', label: '{incident_count} - Total Insiden' },
                    { key: 'incident_type', label: '{incident_type} - Kategori Utama' },
                    { key: 'risk_score', label: '{risk_score} - Skor Risiko (0-100)' },
                    { key: 'detour_min', label: '{detour_min} - Estimasi Selisih Waktu Rute' },
                  ].map(v => (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => handleInsertVariable(v.key)}
                      className="px-2.5 py-1 rounded-md text-xs bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/[0.08] font-mono transition-colors"
                    >
                      + {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Sound Tuning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Teks Tombol Aksi Utama (Primary Action)
                  </label>
                  <input
                    type="text"
                    value={currentEditingTemplate.actionButtonText}
                    onChange={(e) => handleTemplateChange('actionButtonText', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Teks Tombol Sekunder (Opsional)
                  </label>
                  <input
                    type="text"
                    value={currentEditingTemplate.secondaryButtonText || ''}
                    onChange={(e) => handleTemplateChange('secondaryButtonText', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Suara Peringatan (Audio Channel)
                  </label>
                  <select
                    value={currentEditingTemplate.soundAlert}
                    onChange={(e) => handleTemplateChange('soundAlert', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-white text-xs focus:outline-none"
                  >
                    <option value="discrete_chime">Discrete Chime (Halus)</option>
                    <option value="urgent_siren">Urgent Siren (Sirene Keras)</option>
                    <option value="default">Default OS Push Notification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Pola Getar (Haptic Feedback)
                  </label>
                  <select
                    value={currentEditingTemplate.vibrationPattern}
                    onChange={(e) => handleTemplateChange('vibrationPattern', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/[0.08] text-white text-xs focus:outline-none"
                  >
                    <option value="normal">Normal (1x Getar Singkat)</option>
                    <option value="pulsed_alarm">Pulsed Alarm (Berdenyut Berulang)</option>
                    <option value="continuous">Continuous SOS (Getar Panjang)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PREVIEW SMARTPHONE & SANDBOX UJI COBA PUSH */}
      {activeTab === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Phone Mockup */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Live Push Preview</h3>
              </div>

              {/* Platform & Level Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#0a0a0a] border border-white/[0.08] rounded-lg p-0.5">
                  <button
                    onClick={() => setDevicePlatform('ios')}
                    className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                      devicePlatform === 'ios' ? 'bg-white/10 text-white font-medium' : 'text-zinc-500'
                    }`}
                  >
                    <Apple className="w-3 h-3" /> iOS
                  </button>
                  <button
                    onClick={() => setDevicePlatform('android')}
                    className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-all ${
                      devicePlatform === 'android' ? 'bg-white/10 text-white font-medium' : 'text-zinc-500'
                    }`}
                  >
                    <SmartphoneNfc className="w-3 h-3" /> Android
                  </button>
                </div>

                <select
                  value={previewLevel}
                  onChange={(e) => setPreviewLevel(e.target.value as RiskNotificationLevel)}
                  className="bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="Waspada">Level: Waspada</option>
                  <option value="Bahaya">Level: Bahaya</option>
                  <option value="Darurat">Level: Darurat Live</option>
                </select>
              </div>
            </div>

            {/* Phone Frame Container */}
            <div className="relative mx-auto w-full max-w-sm rounded-[40px] border-4 border-zinc-700 bg-zinc-950 p-4 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
              {/* Wallpaper Background Simulation */}
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black opacity-90 z-0"></div>

              {/* Status Bar */}
              <div className="relative z-10 flex items-center justify-between px-3 pt-2 text-[11px] text-zinc-300 font-medium">
                <span>01:45</span>
                {devicePlatform === 'ios' ? (
                  <div className="w-20 h-4 rounded-full bg-black flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Radio className="w-3 h-3" />
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <div className="w-4 h-2 rounded-sm border border-zinc-400 flex items-center p-0.5">
                    <div className="w-2.5 h-1 bg-emerald-400 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* Lock Screen Push Notification Card */}
              <div className="relative z-10 my-auto py-6">
                <div className="p-4 rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-3">
                  {/* Push Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-black font-bold text-[10px]">
                        JA
                      </div>
                      <span className="text-xs font-semibold text-white">JalanAman</span>
                      <span className="text-[10px] text-zinc-500">&bull; Safety Shield</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Baru saja</span>
                  </div>

                  {/* Rendered Push Content */}
                  <div className="space-y-1">
                    <h4 
                      className="text-xs font-bold leading-tight" 
                      style={{ color: renderedPreview.accentColor }}
                    >
                      {renderedPreview.title}
                    </h4>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      {renderedPreview.body}
                    </p>
                  </div>

                  {/* Push Interactive Action Buttons */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
                    <button 
                      onClick={() => showNotice('info', `Simulasi klik aksi: "${renderedPreview.action}"`)}
                      className="flex-1 py-1.5 px-2 rounded-lg text-center font-semibold text-[11px] bg-white/15 hover:bg-white/20 text-white transition-colors"
                    >
                      {renderedPreview.action}
                    </button>
                    {renderedPreview.secondary && (
                      <button 
                        onClick={() => showNotice('info', `Simulasi klik aksi sekunder: "${renderedPreview.secondary}"`)}
                        className="py-1.5 px-2 rounded-lg text-center text-[10px] text-zinc-400 hover:text-white transition-colors"
                      >
                        {renderedPreview.secondary}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="relative z-10 flex justify-center pb-1">
                <div className="w-28 h-1 rounded-full bg-zinc-600"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Push Test Sandbox Sender */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-4">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Sandbox Uji Kirim Push Notifikasi</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Lakukan uji coba live push ke nomor handphone penguji atau device simulator sebelum perubahan dirilis ke semua pengguna jalan.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1.5">Target Perangkat / Nomor Penguji</label>
                  <input
                    type="text"
                    value={testTargetInput}
                    onChange={(e) => setTestTargetInput(e.target.value)}
                    placeholder="+62 812-xxxx-xxxx atau FCM Device Token"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/[0.08] text-white focus:outline-none focus:border-white/20 font-mono"
                  />
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] space-y-1.5 font-mono text-[11px] text-zinc-400">
                  <div className="flex justify-between">
                    <span>Provider Gateway:</span>
                    <span className="text-emerald-400">Firebase Cloud Messaging (FCM High Priority)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Level:</span>
                    <span className="text-white font-semibold">{previewLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payload Size:</span>
                    <span className="text-zinc-300">384 bytes (HTTP/2)</span>
                  </div>
                </div>

                <button
                  onClick={handleSendTestPush}
                  disabled={isSendingTest}
                  className="w-full py-2.5 px-4 rounded-lg font-semibold text-xs bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
                  {isSendingTest ? 'Mengirim Test Push ke Perangkat...' : 'Kirim Notifikasi Uji Coba Sekarang'}
                </button>
              </div>
            </div>

            {/* Riwayat Test Log */}
            <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a] space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Riwayat Uji Kirim Terakhir</span>
                <span className="text-[10px] text-zinc-500 font-mono">{testLogs.length} Terkirim</span>
              </h4>

              <div className="space-y-2">
                {testLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-2.5 rounded-lg bg-black/40 border border-white/[0.05] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white font-mono">{log.id}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full border border-emerald-500/20">
                        <Check className="w-2.5 h-2.5" /> Delivered ({log.deliveryLatencyMs}ms)
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">{log.renderedTitle}</p>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono pt-0.5">
                      <span>{log.targetIdentifier}</span>
                      <span suppressHydrationWarning>{new Date(log.timestamp).toLocaleTimeString('id-ID')} WIB</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
