'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { circlegeoEsriStyle } from '../../lib/gisMapStyle';
import { mockHazardousZones, mockIncidents } from './mockData';
import { HazardousZoneItem } from '../../types/superadmin';
import { ShieldAlert, Layers, Compass, ZoomIn, ZoomOut } from 'lucide-react';

interface AnalyticsLiveMapProps {
  selectedZone: HazardousZoneItem | null;
  onSelectZone: (zone: HazardousZoneItem) => void;
  categoryFilter?: string;
}

export default function AnalyticsLiveMap({ selectedZone, onSelectZone, categoryFilter = 'Semua' }: AnalyticsLiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [showIncidents, setShowIncidents] = useState(true);
  const [showDangerCorridors, setShowDangerCorridors] = useState(true);
  const [showPoliceRadius, setShowPoliceRadius] = useState(true);
  const [is3D, setIs3D] = useState(true);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Begal': return '#f43f5e';
      case 'Pelecehan': return '#d946ef';
      case 'Kecelakaan': return '#f59e0b';
      case 'Infrastruktur': return '#06b6d4';
      default: return '#8b5cf6';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Kritis': return '#ef4444';
      case 'Rawan': return '#f97316';
      case 'Waspada': return '#eab308';
      default: return '#10b981';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: circlegeoEsriStyle as any,
      center: [106.8400, -6.2200], // [lng, lat] Jabodetabek
      zoom: 12,
      pitch: 45, // 3D perspective
      maxPitch: 85,
      bearing: -10,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update markers and overlays
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Danger Corridors
    if (showDangerCorridors) {
      mockHazardousZones.forEach((zone) => {
        const isSelected = selectedZone?.id === zone.id;
        const color = getRiskColor(zone.dangerLevel);

        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex items-center justify-center';
        el.innerHTML = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: ${isSelected ? '64px' : '44px'};
              height: ${isSelected ? '64px' : '44px'};
              border-radius: 9999px;
              background-color: ${color};
              opacity: 0.25;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width: ${isSelected ? '24px' : '16px'};
              height: ${isSelected ? '24px' : '16px'};
              border-radius: 9999px;
              background-color: ${color};
              border: 2px solid #ffffff;
              box-shadow: 0 0 14px ${color};
            "></div>
          </div>
        `;

        const popupContent = `
          <div style="font-family: sans-serif; padding: 6px; font-size: 11px; background: #0c0c0e; color: #fff; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); min-width: 180px;">
            <div style="color: #f43f5e; font-weight: bold; margin-bottom: 4px;">⚠️ ${zone.dangerLevel} (${zone.riskScore}/100)</div>
            <div style="font-weight: 600; font-size: 12px; margin-bottom: 2px;">${zone.name}</div>
            <div style="color: #a1a1aa; margin-bottom: 6px;">${zone.region}, ${zone.city}</div>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px; display: flex; justify-content: space-between;">
              <span style="color: #a1a1aa;">Kasus:</span>
              <span style="font-weight: 600;">${zone.incidentCount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 2px;">
              <span style="color: #a1a1aa;">Jam Rawan:</span>
              <span style="color: #fde047;">${zone.peakHours}</span>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 15, closeButton: false }).setHTML(popupContent);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([zone.coordinates.lng, zone.coordinates.lat])
          .setPopup(popup)
          .addTo(map);

        el.addEventListener('click', () => {
          onSelectZone(zone);
        });

        markersRef.current.push(marker);
      });
    }

    // 2. Incidents
    if (showIncidents) {
      const filtered = mockIncidents.filter((inc) => {
        if (categoryFilter === 'Semua') return true;
        return inc.category.toLowerCase() === categoryFilter.toLowerCase();
      });

      filtered.forEach((inc) => {
        const color = getCategoryColor(inc.category);
        const el = document.createElement('div');
        el.style.cssText = `
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background-color: ${color};
          border: 1.5px solid #ffffff;
          box-shadow: 0 0 8px ${color};
          cursor: pointer;
        `;

        const popupContent = `
          <div style="font-family: sans-serif; padding: 6px; font-size: 11px; background: #0c0c0e; color: #fff; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); min-width: 150px;">
            <div style="color: ${color}; font-weight: bold; margin-bottom: 2px;">● ${inc.category}</div>
            <div style="font-weight: 600; color: #e4e4e7;">${inc.locationName}</div>
            <div style="color: #a1a1aa; font-size: 10px; margin-top: 4px;">Bahaya: ${inc.dangerScore}/10 • ${inc.status}</div>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 10, closeButton: false }).setHTML(popupContent);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([inc.coordinates.lng, inc.coordinates.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3. Police Station Radius
    if (showPoliceRadius) {
      mockHazardousZones.slice(0, 5).forEach((zone) => {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 22px;
          height: 22px;
          border-radius: 9999px;
          background-color: rgba(59, 130, 246, 0.2);
          border: 1.5px dashed #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          cursor: pointer;
        `;
        el.innerHTML = `<span style="font-size: 10px;">👮</span>`;

        const popup = new maplibregl.Popup({ offset: 10, closeButton: false })
          .setHTML(`<div style="background:#0c0c0e; color:#93c5fd; padding:4px 8px; border-radius:6px; font-size:10px; border: 1px solid rgba(59, 130, 246, 0.3);">Pos Siaga Sabhara / Presisi</div>`);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([zone.coordinates.lng - 0.004, zone.coordinates.lat + 0.003])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  }, [showIncidents, showDangerCorridors, showPoliceRadius, selectedZone, categoryFilter, onSelectZone]);

  // Fly to selected zone
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedZone) return;

    map.flyTo({
      center: [selectedZone.coordinates.lng, selectedZone.coordinates.lat],
      zoom: 14,
      pitch: is3D ? 60 : 0,
      duration: 1200,
    });
  }, [selectedZone, is3D]);

  const toggle3D = () => {
    const map = mapRef.current;
    if (!map) return;
    const next3D = !is3D;
    setIs3D(next3D);
    map.easeTo({
      pitch: next3D ? 55 : 0,
      duration: 800,
    });
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative z-0 border border-white/[0.08] bg-[#050505]">
      {/* MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />

      {/* Layer Controls Pill (Top Right) */}
      <div className="absolute top-4 right-4 z-[10] bg-[#0c0c0e]/90 border border-white/[0.1] p-2.5 rounded-xl backdrop-blur-md shadow-2xl flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between gap-2 text-zinc-400 font-semibold border-b border-white/[0.08] pb-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>GIS ESRI Satelit</span>
          </div>
          <button
            onClick={toggle3D}
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
              is3D ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            3D
          </button>
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
          <input
            type="checkbox"
            checked={showDangerCorridors}
            onChange={(e) => setShowDangerCorridors(e.target.checked)}
            className="rounded bg-zinc-900 border-white/20 text-rose-500 focus:ring-0 w-3.5 h-3.5"
          />
          <span>Zona Koridor Rawan</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
          <input
            type="checkbox"
            checked={showIncidents}
            onChange={(e) => setShowIncidents(e.target.checked)}
            className="rounded bg-zinc-900 border-white/20 text-amber-500 focus:ring-0 w-3.5 h-3.5"
          />
          <span>Titik Laporan Masuk</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-zinc-300 hover:text-white">
          <input
            type="checkbox"
            checked={showPoliceRadius}
            onChange={(e) => setShowPoliceRadius(e.target.checked)}
            className="rounded bg-zinc-900 border-white/20 text-blue-500 focus:ring-0 w-3.5 h-3.5"
          />
          <span>Radius Pos Siaga</span>
        </label>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[10] bg-[#0c0c0e]/95 border border-white/[0.1] p-3 rounded-xl backdrop-blur-md shadow-2xl space-y-2 text-xs">
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
          Circlegeo 3D ESRI GIS
        </span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
            <span className="text-zinc-300">Kritis (80-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/30" />
            <span className="text-zinc-300">Rawan (60-79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 ring-2 ring-yellow-500/30" />
            <span className="text-zinc-300">Waspada (40-59)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/30" />
            <span className="text-zinc-300">Pos Pengamanan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
