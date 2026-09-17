'use client';

import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { circlegeoEsriStyle } from '../../lib/gisMapStyle';
import { mockIncidents, mockClusters } from './mockData';

interface ClusterMapProps {
  showRaw: boolean;
  showClusters: boolean;
  showPolice: boolean;
  center: { lat: number; lng: number };
}

const mockPoliceZones = [
  { id: 'POL-1', center: { lat: -6.1950, lng: 106.8329 }, radius: 400, name: 'Zona Rawan Cikini', cases: 24 },
  { id: 'POL-2', center: { lat: -6.241586, lng: 106.823547 }, radius: 600, name: 'Blok M Area', cases: 45 },
  { id: 'POL-3', center: { lat: -6.1578, lng: 106.9004 }, radius: 500, name: 'Kelapa Gading Ring', cases: 18 },
];

export default function ClusterMap({ showRaw, showClusters, showPolice, center }: ClusterMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const getDangerColor = (level: string) => {
    switch (level) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      default: return '#3b82f6';
    }
  };

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: circlegeoEsriStyle as any,
      center: [center.lng, center.lat],
      zoom: 12,
      pitch: 35,
      maxPitch: 85,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      map.resize();
    });

    const timers = [
      setTimeout(() => map.resize(), 100),
      setTimeout(() => map.resize(), 400),
    ];

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      timers.forEach(clearTimeout);
      resizeObserver.disconnect();
      map.remove();
    };
  }, []);

  // Update center
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [center.lng, center.lat],
      zoom: map.getZoom() > 12 ? map.getZoom() : 13,
      duration: 1200,
    });
  }, [center]);

  // Update Layers / Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // 1. Police Hotspots
    if (showPolice) {
      mockPoliceZones.forEach((zone) => {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          background-color: rgba(220, 38, 38, 0.25);
          border: 1.5px dashed #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `;
        el.innerHTML = `<span style="font-size: 11px;">🚨</span>`;

        const popup = new maplibregl.Popup({ offset: 10, closeButton: false }).setHTML(`
          <div style="font-family: sans-serif; padding: 6px; font-size: 11px; background: #0c0c0e; color: #fff; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color: #f43f5e; font-weight: bold;">${zone.name}</div>
            <div style="color: #a1a1aa; font-size: 10px;">Data Kepolisian: ${zone.cases} Kasus</div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([zone.center.lng, zone.center.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 2. DBSCAN Clusters
    if (showClusters) {
      mockClusters.forEach((cluster) => {
        const color = getDangerColor(cluster.dangerLevel);
        const el = document.createElement('div');
        el.style.cssText = `
          width: 28px;
          height: 28px;
          border-radius: 9999px;
          background-color: ${color};
          opacity: 0.85;
          border: 2px solid #ffffff;
          box-shadow: 0 0 12px ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: bold;
          font-size: 10px;
          cursor: pointer;
        `;
        el.textContent = `${cluster.incidentCount}`;

        const popup = new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(`
          <div style="font-family: sans-serif; padding: 8px; font-size: 11px; background: #0c0c0e; color: #fff; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); min-width: 160px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-weight: bold;">Klaster ${cluster.id}</span>
              <span style="background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 4px; font-size: 9px;">${cluster.dangerLevel}</span>
            </div>
            <div style="color: #a1a1aa; font-size: 10px;">Total Insiden: <b>${cluster.incidentCount} Kasus</b></div>
            <div style="color: #a1a1aa; font-size: 10px;">Radius Pengaruh: <b>${cluster.radius}m</b></div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([cluster.center.lng, cluster.center.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3. Raw Incidents
    if (showRaw) {
      mockIncidents.forEach((inc) => {
        const color = inc.status === 'Verified' ? '#10b981' : '#f59e0b';
        const el = document.createElement('div');
        el.style.cssText = `
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: ${color};
          border: 1px solid #ffffff;
          cursor: pointer;
        `;

        const popup = new maplibregl.Popup({ offset: 8, closeButton: false }).setHTML(`
          <div style="font-family: sans-serif; padding: 4px 6px; font-size: 10px; background: #0c0c0e; color: #fff; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="font-weight: 600;">${inc.category}</div>
            <div style="color: #a1a1aa;">${inc.id} • ${inc.status}</div>
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([inc.coordinates.lng, inc.coordinates.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
      });
    }
  }, [showRaw, showClusters, showPolice]);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.08] relative z-0">
      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '400px' }} />
    </div>
  );
}
