'use client';

import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { circlegeoEsriStyle } from '../../lib/gisMapStyle';

const demographicData = [
  { id: 1, name: 'Kebayoran Baru', lat: -6.2382, lng: 106.8024, density: 85, type: 'High Trust' },
  { id: 2, name: 'Menteng', lat: -6.1950, lng: 106.8329, density: 60, type: 'Medium Trust' },
  { id: 3, name: 'Tanah Abang', lat: -6.1874, lng: 106.8133, density: 40, type: 'Low Trust' },
  { id: 4, name: 'Kemang', lat: -6.2615, lng: 106.8163, density: 75, type: 'High Trust' },
  { id: 5, name: 'Tebet', lat: -6.2260, lng: 106.8584, density: 90, type: 'High Trust' },
  { id: 6, name: 'Cilandak', lat: -6.2926, lng: 106.7993, density: 55, type: 'Medium Trust' },
  { id: 7, name: 'Kelapa Gading', lat: -6.1578, lng: 106.9004, density: 70, type: 'High Trust' },
];

const getColor = (type: string) => {
  if (type === 'High Trust') return '#3b82f6'; // blue-500
  if (type === 'Medium Trust') return '#8b5cf6'; // violet-500
  return '#f43f5e'; // rose-500
};

export default function DemographicMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: circlegeoEsriStyle as any,
      center: [106.8456, -6.2088], // [lng, lat] Jakarta
      zoom: 11,
      pitch: 30,
      maxPitch: 85,
    });

    mapRef.current = map;

    // Add markers
    demographicData.forEach((region) => {
      const color = getColor(region.type);
      const size = Math.max(region.density / 3, 16);

      const el = document.createElement('div');
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        border-radius: 9999px;
        background-color: ${color};
        opacity: 0.85;
        border: 2px solid #ffffff;
        box-shadow: 0 0 10px ${color};
        cursor: pointer;
      `;

      const popup = new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(`
        <div style="font-family: sans-serif; padding: 6px; font-size: 11px; background: #0c0c0e; color: #fff; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="font-weight: bold; font-size: 12px; margin-bottom: 2px;">${region.name}</div>
          <div style="color: #a1a1aa; font-size: 10px;">Status: <span style="color:${color}; font-weight:600;">${region.type}</span></div>
          <div style="color: #a1a1aa; font-size: 10px;">Aktivitas: ${region.density} Laporan</div>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([region.lng, region.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
    };
  }, []);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-zinc-900/50 relative z-0">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '350px' }} />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[10] bg-[#050505]/90 border border-white/[0.08] p-3 rounded-lg backdrop-blur-sm shadow-xl">
        <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Indeks Kepercayaan GIS</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500/80 ring-1 ring-blue-500"></div>
            <span className="text-xs text-zinc-300">Tinggi (Terverifikasi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500/80 ring-1 ring-violet-500"></div>
            <span className="text-xs text-zinc-300">Menengah</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 ring-1 ring-rose-500"></div>
            <span className="text-xs text-zinc-300">Rendah (Risiko Spam)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
