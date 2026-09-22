import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as maplibregl from 'maplibre-gl';
import { circlegeoEsriStyle, getCirclegeoEsriStyle } from '@/lib/circlegeoMapStyle';
import { offlineMapCache } from '@/services/offlineMapCache';

export interface GisMarkerItem {
  id: string;
  name: string;
  detail: string;
  lng: number;
  lat: number;
  type: 'haven' | 'hazard' | 'cctv' | 'user';
}

interface CirclegeoGisMapProps {
  interactive?: boolean;
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
  showSafeRoute?: boolean;
  routeCoordinates?: [number, number][];
  altRouteCoordinates?: [number, number][];
  userLocation?: [number, number] | null;
  droppedPinCoords?: [number, number] | null;
  markers?: GisMarkerItem[];
  showCctvLayer?: boolean;
  autoRotate?: boolean;
  onPinPress?: (name: string, detail: string) => void;
  onMapPress?: (coords: [number, number]) => void;
  onSelectAltRoute?: () => void;
  children?: React.ReactNode;
}

// Indramayu (Jatibarang - Bulak Safe Corridor Pilot)
// Dynamic GIS center can be calibrated locally and scaled nationally across Indonesia
export const DEFAULT_GIS_CENTER: [number, number] = [108.3073, -6.4745];

export const DEFAULT_INDRAMAYU_ROUTE: [number, number][] = [
  [108.3073, -6.4745], // Stasiun KAI Jatibarang (Titik Awal Komuter)
  [108.3090, -6.4735], // Jl. Mayor Dasuki (Penerangan Jalan Aktif)
  [108.3115, -6.4718], // Koridor Ruko & Pertokoan Ramai
  [108.3120, -6.4712], // Safe Haven: Polsek Jatibarang (Siaga 24 Jam)
  [108.3148, -6.4688], // Pertigaan Bulak (PJU Terpasang & CCTV Terkoneksi)
];

// Alias for backwards compatibility across older imports
export const DEFAULT_MENTENG_ROUTE = DEFAULT_INDRAMAYU_ROUTE;

export const DEFAULT_GIS_MARKERS: GisMarkerItem[] = [
  {
    id: 'haven-1',
    name: 'Polsek Jatibarang',
    detail: 'Jl. Mayor Dasuki No. 12 - Siaga 24 Jam',
    lng: 108.3120,
    lat: -6.4712,
    type: 'haven',
  },
  {
    id: 'hazard-1',
    name: 'PJU Padam / Minim Lampu',
    detail: 'Bypass Bulak Jatibarang - Gelap 150m',
    lng: 108.3160,
    lat: -6.4675,
    type: 'hazard',
  },
  {
    id: 'haven-2',
    name: 'Indomaret 24 Jam Bulak',
    detail: 'Jl. Raya Bulak No. 45 - Shelter Komunitas',
    lng: 108.3145,
    lat: -6.4690,
    type: 'haven',
  },
  {
    id: 'cctv-1',
    name: 'CCTV Dishub Stasiun',
    detail: 'Kamera HD Pemantau Pintu Keluar KAI',
    lng: 108.3078,
    lat: -6.4742,
    type: 'cctv',
  },
  {
    id: 'cctv-2',
    name: 'CCTV Simpang Bulak',
    detail: 'Kamera Pemantau Koridor Pantura',
    lng: 108.3150,
    lat: -6.4682,
    type: 'cctv',
  },
];

export const CirclegeoGisMap: React.FC<CirclegeoGisMapProps> = ({
  interactive = true,
  center = DEFAULT_GIS_CENTER,
  zoom = 15.2,
  pitch = 45,
  bearing = -15,
  showSafeRoute = true,
  routeCoordinates = DEFAULT_INDRAMAYU_ROUTE,
  altRouteCoordinates = [],
  userLocation = null,
  droppedPinCoords = null,
  markers = DEFAULT_GIS_MARKERS,
  showCctvLayer = true,
  autoRotate = false,
  onPinPress,
  onMapPress,
  onSelectAltRoute,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerInstancesRef = useRef<maplibregl.Marker[]>([]);
  const isLoadedRef = useRef(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Inject MapLibre stylesheet into <head> once
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cssId = 'maplibre-gl-css';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
        document.head.appendChild(link);
      }
    }
  }, []);

  // Initialize MapLibre
  useEffect(() => {
    if (!containerRef.current) return;

    let animId: number | null = null;

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: getCirclegeoEsriStyle() as any,
        center: center,
        zoom: zoom,
        pitch: pitch,
        maxPitch: 85,
        bearing: bearing,
        interactive: interactive,
        attributionControl: false,
        transformRequest: offlineMapCache.getMapLibreTransformRequest(),
      });

      mapRef.current = map;

      // Handle non-fatal asset loading events gracefully
      map.on('error', (e) => {
        // Suppress non-blocking asset warnings (sprites/glyphs)
        if (e.error?.message?.includes('sprite') || e.error?.message?.includes('Load failed')) {
          return;
        }
        console.warn('MapLibre event:', e.error?.message || e);
      });

      let isMapReadyFired = false;
      const onMapReady = () => {
        if (isMapReadyFired) return;
        isMapReadyFired = true;
        isLoadedRef.current = true;
        setMapLoaded(true);
        map.resize();

        // 1. Always Add Safe Corridor Route Sources & Layers
        try {
          const initialRouteData = (showSafeRoute && routeCoordinates.length > 1) ? {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: routeCoordinates }
          } : { type: 'FeatureCollection', features: [] };

          const originCoords = userLocation || (showSafeRoute && routeCoordinates.length > 1 ? routeCoordinates[0] : null);
          const initialOriginData = originCoords ? {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: originCoords }
          } : { type: 'FeatureCollection', features: [] };

          // Alternative Route (Grey Dashed / Secondary Corridor)
          map.addSource('jalanaman-route-alt', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });

          map.addLayer({
            id: 'route-alt-line',
            type: 'line',
            source: 'jalanaman-route-alt',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#64748B',
              'line-width': 4.5,
              'line-opacity': 0.65,
              'line-dasharray': [2, 1.5],
            },
          });

          map.addSource('jalanaman-route', {
            type: 'geojson',
            data: initialRouteData as any,
          });

          // Outer Neon Green Glow
          map.addLayer({
            id: 'route-halo-glow',
            type: 'line',
            source: 'jalanaman-route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#10B981',
              'line-width': 12,
              'line-opacity': 0.45,
              'line-blur': 6,
            },
          });

          // Bright Core Safe Route
          map.addLayer({
            id: 'route-core-line',
            type: 'line',
            source: 'jalanaman-route',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#A3E635',
              'line-width': 4.2,
              'line-opacity': 0.98,
            },
          });

          // Animated / glowing origin pulse
          map.addSource('route-user-origin', {
            type: 'geojson',
            data: initialOriginData as any,
          });

          map.addLayer({
            id: 'origin-pulse-outer',
            type: 'circle',
            source: 'route-user-origin',
            paint: {
              'circle-radius': 16,
              'circle-color': '#3B82F6', // Blue GPS
              'circle-opacity': 0.35,
            },
          });

          map.addLayer({
            id: 'origin-pulse-core',
            type: 'circle',
            source: 'route-user-origin',
            paint: {
              'circle-radius': 7,
              'circle-color': '#FFFFFF',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#2563EB', // Blue GPS Stroke
            },
          });

          // Destination Pin marker source & layers
          const destCoords = (showSafeRoute && routeCoordinates.length > 1) 
            ? routeCoordinates[routeCoordinates.length - 1] 
            : null;
          const initialDestData = destCoords ? {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: destCoords }
          } : { type: 'FeatureCollection', features: [] };

          map.addSource('route-destination', {
            type: 'geojson',
            data: initialDestData as any,
          });

          map.addLayer({
            id: 'dest-pin-outer',
            type: 'circle',
            source: 'route-destination',
            paint: {
              'circle-radius': 15,
              'circle-color': '#EF4444',
              'circle-opacity': 0.35,
            },
          });

          map.addLayer({
            id: 'dest-pin-core',
            type: 'circle',
            source: 'route-destination',
            paint: {
              'circle-radius': 7,
              'circle-color': '#DC2626',
              'circle-stroke-width': 3,
              'circle-stroke-color': '#FFFFFF',
            },
          });

          // Dropped Pin on Map Tap (Google Maps Red Pin Marker)
          const initialDroppedData = droppedPinCoords ? {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: droppedPinCoords }
          } : { type: 'FeatureCollection', features: [] };

          map.addSource('jalanaman-dropped-pin', {
            type: 'geojson',
            data: initialDroppedData as any,
          });

          map.addLayer({
            id: 'dropped-pin-outer',
            type: 'circle',
            source: 'jalanaman-dropped-pin',
            paint: {
              'circle-radius': 18,
              'circle-color': '#EF4444',
              'circle-opacity': 0.35,
            },
          });

          map.addLayer({
            id: 'dropped-pin-core',
            type: 'circle',
            source: 'jalanaman-dropped-pin',
            paint: {
              'circle-radius': 8,
              'circle-color': '#DC2626',
              'circle-stroke-width': 3.2,
              'circle-stroke-color': '#FFFFFF',
            },
          });
        } catch (e) {
          console.warn('Could not add GIS route layers:', e);
        }

        // 2. Render Markers
        renderMarkers(map, markers, showCctvLayer, onPinPress);

        // 3. Auto rotation if requested
        if (autoRotate && !interactive) {
          let currBearing = bearing;
          const step = () => {
            currBearing = (currBearing + 0.03) % 360;
            if (mapRef.current) {
              mapRef.current.setBearing(currBearing);
              animId = requestAnimationFrame(step);
            }
          };
          animId = requestAnimationFrame(step);
        }
      };

      map.on('style.load', onMapReady);
      map.on('idle', onMapReady);
      map.on('load', onMapReady);

      const handleMapClick = (e: maplibregl.MapMouseEvent) => {
        if (onMapPress) {
          onMapPress([e.lngLat.lng, e.lngLat.lat]);
        }
      };
      map.on('click', handleMapClick);

      // Alternative route click to toggle route
      map.on('click', 'route-alt-line', (e) => {
        e.originalEvent.stopPropagation();
        if (onSelectAltRoute) onSelectAltRoute();
      });
      map.on('mouseenter', 'route-alt-line', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'route-alt-line', () => {
        map.getCanvas().style.cursor = '';
      });

      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        if (animId) cancelAnimationFrame(animId);
        resizeObserver.disconnect();
        markerInstancesRef.current.forEach((m) => m.remove());
        markerInstancesRef.current = [];
        map.remove();
      };
    } catch (err) {
      console.warn('Error initializing MapLibre GIS map:', err);
    }
  }, []);

  // Update pitch & bearing smoothly when props change (e.g. 3D tilt toggle)
  useEffect(() => {
    if (mapRef.current && isLoadedRef.current) {
      mapRef.current.easeTo({
        pitch: pitch,
        bearing: bearing,
        duration: 500,
      });
    }
  }, [pitch, bearing]);

  // Update center when recentered
  useEffect(() => {
    if (mapRef.current && isLoadedRef.current) {
      mapRef.current.easeTo({
        center: center,
        zoom: zoom,
        duration: 600,
      });
    }
  }, [center, zoom]);

  // Update markers when showCctvLayer or markers change
  useEffect(() => {
    if (mapRef.current && isLoadedRef.current) {
      renderMarkers(mapRef.current, markers, showCctvLayer, onPinPress);
    }
  }, [markers, showCctvLayer, onPinPress]);

  // Update dynamic route coordinates when they change or when map switches states
  useEffect(() => {
    if (!mapRef.current || !isLoadedRef.current) return;
    const map = mapRef.current;

    const updateSource = (sourceId: string, data: any) => {
      if (!mapRef.current || !isLoadedRef.current) return;
      const map = mapRef.current;
      const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
      if (source && source.setData) {
        source.setData(data);
      }
    };

    // If map isn't ready yet, don't try to update sources.
    if (!mapLoaded || !isLoadedRef.current) return;

    if (showSafeRoute && routeCoordinates.length > 1) {
      const routeData = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeCoordinates,
        },
      };
      
      const originCoords = userLocation || routeCoordinates[0];
      const originData = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: originCoords,
        },
      };

      const destCoords = routeCoordinates[routeCoordinates.length - 1];
      const destData = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: destCoords,
        },
      };

      updateSource('jalanaman-route', routeData);
      updateSource('route-user-origin', originData);
      updateSource('route-destination', destData);

      // Render Alternative Route if provided (in grey behind primary route)
      if (altRouteCoordinates && altRouteCoordinates.length > 1) {
        updateSource('jalanaman-route-alt', {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: altRouteCoordinates,
          },
        });
      } else {
        updateSource('jalanaman-route-alt', { type: 'FeatureCollection', features: [] });
      }

      // In 3D Cockpit mode (pitch > 35), camera focuses on user position heading forward
      if (pitch > 35) {
        const focusPoint = userLocation || routeCoordinates[0];
        if (focusPoint) {
          map.easeTo({
            center: focusPoint,
            zoom: zoom || 16.5,
            pitch: pitch,
            bearing: bearing,
            duration: 600,
          });
        }
      } else {
        // In 2D Route Preview, smoothly fit the map bounds to frame both user and destination
        try {
          const bounds = new maplibregl.LngLatBounds(routeCoordinates[0], routeCoordinates[0]);
          routeCoordinates.forEach((c) => bounds.extend(c));
          if (altRouteCoordinates) altRouteCoordinates.forEach((c) => bounds.extend(c));
          if (userLocation) bounds.extend(userLocation);
          map.fitBounds(bounds, {
            padding: { top: 90, bottom: 250, left: 60, right: 60 },
            maxZoom: 16.5,
            duration: 900,
          });
        } catch (err) {
          console.warn('fitBounds error:', err);
        }
      }
    } else {
      // Clear the route when not showing
      const emptyData = { type: 'FeatureCollection', features: [] };
      updateSource('jalanaman-route', emptyData);
      updateSource('jalanaman-route-alt', emptyData);
      updateSource('route-destination', emptyData);
      
      // But keep showing user location if we have it!
      if (userLocation) {
        updateSource('route-user-origin', {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Point', coordinates: userLocation },
        });
      } else {
        updateSource('route-user-origin', emptyData);
      }
    }

    // Always update dropped pin (for idle_explore & pin drop)
    if (droppedPinCoords) {
      updateSource('jalanaman-dropped-pin', {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: droppedPinCoords },
      });
    } else {
      updateSource('jalanaman-dropped-pin', { type: 'FeatureCollection', features: [] });
    }
  }, [routeCoordinates, altRouteCoordinates, showSafeRoute, userLocation, droppedPinCoords, mapLoaded, pitch, bearing, zoom]);

  const renderMarkers = (
    map: maplibregl.Map,
    markerList: GisMarkerItem[],
    cctvVisible: boolean,
    clickHandler?: (name: string, detail: string) => void
  ) => {
    // Clear existing
    markerInstancesRef.current.forEach((m) => m.remove());
    markerInstancesRef.current = [];

    markerList.forEach((item) => {
      if (item.type === 'cctv' && !cctvVisible) return;

      const el = document.createElement('div');
      el.className = 'gis-marker-badge';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.gap = '5px';
      el.style.padding = '4px 8px';
      el.style.borderRadius = '999px';
      el.style.fontSize = '10.5px';
      el.style.fontWeight = '700';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.35)';
      el.style.whiteSpace = 'nowrap';
      el.style.userSelect = 'none';

      if (item.type === 'haven') {
        el.style.backgroundColor = '#0284C7';
        el.style.color = '#FFFFFF';
        el.innerHTML = `🛡️ <span>${item.name}</span>`;
      } else if (item.type === 'hazard') {
        el.style.backgroundColor = '#F59E0B';
        el.style.color = '#111827';
        el.innerHTML = `⚠️ <span>${item.name}</span>`;
      } else if (item.type === 'cctv') {
        el.style.backgroundColor = '#65A30D';
        el.style.color = '#FFFFFF';
        el.innerHTML = `📹 <span>${item.name}</span>`;
      }

      el.onclick = (e) => {
        e.stopPropagation();
        if (clickHandler) {
          clickHandler(item.name, item.detail);
        }
      };

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([item.lng, item.lat])
        .addTo(map);

      markerInstancesRef.current.push(marker);
    });
  };

  return (
    <View style={styles.container}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#1E232A',
        }}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B0F19',
    overflow: 'hidden',
  },
});
