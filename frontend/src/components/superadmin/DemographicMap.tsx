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

    // Trigger resize on load and multiple animation frames
    map.on('load', () => {
      map.resize();
    });

    const timers = [
      setTimeout(() => map.resize(), 50),
      setTimeout(() => map.resize(), 200),
      setTimeout(() => map.resize(), 500),
    ];

    // ResizeObserver ensures map always occupies 100% of flex container
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Add markers
    demographicData.forEach((region) => {
      const color = getColor(region.type);
      const size = Math.max(region.density / 3.5, 14);

      const el = document.createElement('div');
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        border-radius: 9999px;
        background-color: ${color};
        opacity: 0.9;
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
      timers.forEach(clearTimeout);
      resizeObserver.disconnect();
      markersRef.current.forEach((m) => m.remove());
      map.remove();
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 rounded-lg overflow-hidden bg-zinc-900">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0" />
      
      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[10] bg-[#050505]/90 border border-white/[0.1] px-3 py-2 rounded-lg backdrop-blur-md shadow-xl text-xs">
        <h4 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Indeks Kepercayaan</h4>
        <div className="flex flex-col gap-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-zinc-300">Tinggi (Terverifikasi)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
            <span className="text-zinc-300">Menengah</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-zinc-300">Rendah (Risiko Spam)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
