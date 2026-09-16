'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { mockIncidents, mockClusters } from './mockData';

interface ClusterMapProps {
  showRaw: boolean;
  showClusters: boolean;
  showPolice: boolean;
  center: { lat: number; lng: number };
}

function MapController({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], map.getZoom() > 12 ? map.getZoom() : 13, { duration: 1.5 });
  }, [center, map]);
  return null;
}

// Mock Police Historical Data Zones (Red Zones)
const mockPoliceZones = [
  { id: 'POL-1', center: { lat: -6.1950, lng: 106.8329 }, radius: 400, name: 'Zona Rawan Cikini', cases: 24 },
  { id: 'POL-2', center: { lat: -6.241586, lng: 106.823547 }, radius: 600, name: 'Blok M Area', cases: 45 },
  { id: 'POL-3', center: { lat: -6.1578, lng: 106.9004 }, radius: 500, name: 'Kelapa Gading Ring', cases: 18 },
];

export default function ClusterMap({ showRaw, showClusters, showPolice, center }: ClusterMapProps) {
  // Determine danger level color for clusters
  const getDangerColor = (level: string) => {
    switch (level) {
      case 'Critical': return '#ef4444'; // Red-500
      case 'High': return '#f97316'; // Orange-500
      case 'Medium': return '#eab308'; // Yellow-500
      default: return '#3b82f6'; // Blue-500
    }
  };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.08] relative z-0">
      <MapContainer 
        center={[-6.2088, 106.8456]} // Jakarta
        zoom={12} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        style={{ background: '#0a0a0a' }}
      >
        <MapController center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          className="dark-map-tiles"
        />

        {/* Layer 3: Police Historical Data */}
        {showPolice && mockPoliceZones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.center.lat, zone.center.lng]}
            radius={zone.radius}
            pathOptions={{
              color: '#991b1b', // Red-800
              fillColor: '#7f1d1d', // Red-900
              fillOpacity: 0.3,
              weight: 1,
              dashArray: '4 4'
            }}
          >
            <Tooltip 
              direction="top" 
              opacity={1} 
              className="bg-[#050505] border border-white/10 text-white !rounded-lg"
            >
              <div className="font-sans px-1">
                <p className="font-bold text-xs text-rose-500">{zone.name}</p>
                <p className="text-[10px] text-zinc-400">Data Kepolisian 2022-2023</p>
                <p className="text-xs font-mono mt-1">{zone.cases} Kasus Kejahatan</p>
              </div>
            </Tooltip>
          </Circle>
        ))}

        {/* Layer 2: DBSCAN Clusters */}
        {showClusters && mockClusters.map((cluster) => (
          <Circle
            key={cluster.id}
            center={[cluster.center.lat, cluster.center.lng]}
            radius={cluster.radius} // in meters
            pathOptions={{
              color: getDangerColor(cluster.dangerLevel),
              fillColor: getDangerColor(cluster.dangerLevel),
              fillOpacity: 0.4,
              weight: 2
            }}
          >
            <Tooltip 
              direction="top" 
              opacity={1} 
              className="bg-[#050505] border border-white/10 text-white !rounded-lg"
            >
              <div className="font-sans px-1 w-48">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold text-sm text-white">Klaster {cluster.id}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-medium">
                    {cluster.dangerLevel}
                  </span>
                </div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Total Insiden</span>
                    <span className="text-white font-mono">{cluster.incidentCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Radius</span>
                    <span className="text-white font-mono">{cluster.radius}m</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Pusat</span>
                    <span className="text-white font-mono text-[10px]">{cluster.center.lat.toFixed(3)}, {cluster.center.lng.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </Tooltip>
          </Circle>
        ))}

        {/* Layer 1: Raw Incidents */}
        {showRaw && mockIncidents.map((inc) => (
          <CircleMarker
            key={inc.id}
            center={[inc.coordinates.lat, inc.coordinates.lng]}
            radius={3}
            pathOptions={{
              color: inc.status === 'Verified' ? '#10b981' : '#f59e0b',
              fillColor: inc.status === 'Verified' ? '#10b981' : '#f59e0b',
              fillOpacity: 0.8,
              weight: 1
            }}
          >
            <Tooltip 
              direction="auto" 
              opacity={1} 
              className="bg-[#050505] border border-white/10 text-white !rounded-lg"
            >
              <div className="font-sans px-1">
                <p className="font-semibold text-xs text-white">{inc.category}</p>
                <p className="text-[10px] text-zinc-400">{inc.id} - {inc.status}</p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
