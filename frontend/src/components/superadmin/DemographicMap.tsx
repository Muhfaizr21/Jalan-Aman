'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon issue in Next.js/React if marker is used, but we're using CircleMarker here
import L from 'leaflet';

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
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-zinc-900/50">
      <MapContainer 
        center={[-6.2088, 106.8456]} // Jakarta
        zoom={11} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ background: '#0a0a0a' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          className="dark-map-tiles"
        />
        {demographicData.map((region) => (
          <CircleMarker
            key={region.id}
            center={[region.lat, region.lng]}
            pathOptions={{
              color: getColor(region.type),
              fillColor: getColor(region.type),
              fillOpacity: 0.6,
              weight: 2
            }}
            radius={Math.max(region.density / 4, 8)}
          >
            <Tooltip 
              direction="top" 
              offset={[0, -10]} 
              opacity={1} 
              className="bg-[#050505] border border-white/10 text-white !rounded-lg"
            >
              <div className="font-sans px-1">
                <p className="font-semibold text-sm">{region.name}</p>
                <p className="text-xs text-zinc-400">Status: {region.type}</p>
                <p className="text-xs text-zinc-400">Aktivitas: {region.density} Laporan</p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#050505]/90 border border-white/[0.08] p-3 rounded-lg backdrop-blur-sm shadow-xl">
        <h4 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Indeks Kepercayaan</h4>
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
