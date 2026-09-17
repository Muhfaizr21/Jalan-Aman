'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Tooltip, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockHazardousZones, mockIncidents } from './mockData';
import { HazardousZoneItem } from '../../types/superadmin';
import { ShieldAlert, AlertTriangle, MapPin, Eye, Layers } from 'lucide-react';

interface AnalyticsLiveMapProps {
  selectedZone: HazardousZoneItem | null;
  onSelectZone: (zone: HazardousZoneItem) => void;
  categoryFilter?: string;
}

function MapFlyToController({ targetCoordinates }: { targetCoordinates: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoordinates) {
      map.flyTo([targetCoordinates.lat, targetCoordinates.lng], 14, { duration: 1.2 });
    }
  }, [targetCoordinates, map]);
  return null;
}

export default function AnalyticsLiveMap({ selectedZone, onSelectZone, categoryFilter = 'Semua' }: AnalyticsLiveMapProps) {
  const [showIncidents, setShowIncidents] = useState(true);
  const [showDangerCorridors, setShowDangerCorridors] = useState(true);
  const [showPoliceRadius, setShowPoliceRadius] = useState(true);

  // Category Color mapping
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

  // Filtered incidents
  const visibleIncidents = mockIncidents.filter((inc) => {
    if (categoryFilter === 'Semua') return true;
    return inc.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  return (
    <div className="w-full h-full rounded-xl overflow-hidden relative z-0 border border-white/[0.08] bg-[#050505]">
      <MapContainer
        center={[-6.2200, 106.8400]} // Center Jabodetabek / Jakarta
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: '#0a0a0a' }}
      >
        <MapFlyToController targetCoordinates={selectedZone ? selectedZone.coordinates : null} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          className="dark-map-tiles"
        />

        {/* 1. DANGER CORRIDORS (CIRCLES) */}
        {showDangerCorridors && mockHazardousZones.map((zone) => {
          const isSelected = selectedZone?.id === zone.id;
          const strokeColor = getRiskColor(zone.dangerLevel);

          return (
            <React.Fragment key={`corridor-${zone.id}`}>
              <Circle
                center={[zone.coordinates.lat, zone.coordinates.lng]}
                radius={isSelected ? 650 : 450}
                pathOptions={{
                  color: strokeColor,
                  fillColor: strokeColor,
                  fillOpacity: isSelected ? 0.35 : 0.18,
                  weight: isSelected ? 3 : 1.5,
                  dashArray: zone.dangerLevel === 'Kritis' ? '4, 4' : undefined,
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 text-xs bg-[#0c0c0e] text-white rounded-lg border border-white/10 font-sans max-w-[240px]">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>{zone.dangerLevel} ({zone.riskScore}/100)</span>
                    </div>
                    <p className="font-semibold text-sm text-white mb-0.5">{zone.name}</p>
                    <p className="text-zinc-400 text-[11px] mb-2">{zone.region}, {zone.city}</p>
                    <div className="space-y-1 text-[11px] border-t border-white/10 pt-1.5">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Total Insiden:</span>
                        <span className="font-semibold text-white">{zone.incidentCount} Kasus</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Jam Rawan:</span>
                        <span className="font-mono text-amber-300">{zone.peakHours}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Ancaman Dominan:</span>
                        <span className="font-semibold text-rose-300">{zone.dominantCategory}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectZone(zone)}
                      className="w-full mt-2 py-1 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium text-center"
                    >
                      Buka Rincian Taktis
                    </button>
                  </div>
                </Popup>
              </Circle>

              {/* Center point marker */}
              <CircleMarker
                center={[zone.coordinates.lat, zone.coordinates.lng]}
                radius={isSelected ? 8 : 6}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: strokeColor,
                  fillOpacity: 1,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={0.95} className="custom-tooltip">
                  <div className="font-sans text-xs px-1 text-white">
                    <span className="font-bold">{zone.name}</span>
                    <span className="text-zinc-400 block text-[10px]">Skor: {zone.riskScore} • {zone.incidentCount} Kasus</span>
                  </div>
                </Tooltip>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* 2. LIVE INCIDENTS (INDIVIDUAL PINS) */}
        {showIncidents && visibleIncidents.map((inc) => {
          const incColor = getCategoryColor(inc.category);

          return (
            <CircleMarker
              key={`inc-${inc.id}`}
              center={[inc.coordinates.lat, inc.coordinates.lng]}
              radius={7}
              pathOptions={{
                color: '#ffffff',
                fillColor: incColor,
                fillOpacity: 0.9,
                weight: 1.5,
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.95} className="custom-tooltip">
                <div className="font-sans text-xs px-1 text-white">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: incColor }} />
                    <span className="font-bold">{inc.category}</span>
                  </div>
                  <span className="text-zinc-300 block text-[11px] mt-0.5">{inc.locationName}</span>
                  <span className="text-zinc-400 block text-[10px]">Tingkat Bahaya: {inc.dangerScore}/10 • Status: {inc.status}</span>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}

        {/* 3. POLICE / SECURITY POST BUFFER */}
        {showPoliceRadius && mockHazardousZones.slice(0, 5).map((zone) => (
          <Circle
            key={`police-${zone.id}`}
            center={[zone.coordinates.lat + 0.003, zone.coordinates.lng - 0.004]}
            radius={250}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.12,
              weight: 1,
              dashArray: '2, 4',
            }}
          >
            <Tooltip direction="center" opacity={0.9} className="custom-tooltip">
              <span className="text-[10px] text-blue-300 font-sans">Pos Siaga Sabhara</span>
            </Tooltip>
          </Circle>
        ))}
      </MapContainer>

      {/* Layer Controls Pill (Top Right) */}
      <div className="absolute top-4 right-4 z-[1000] bg-[#0c0c0e]/90 border border-white/[0.1] p-2.5 rounded-xl backdrop-blur-md shadow-2xl flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 font-semibold border-b border-white/[0.08] pb-1.5 text-[11px]">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Lapisan Spasial</span>
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
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#0c0c0e]/95 border border-white/[0.1] p-3 rounded-xl backdrop-blur-md shadow-2xl space-y-2 text-xs">
        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
          Gradasi Risiko Spatiotemporal
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
