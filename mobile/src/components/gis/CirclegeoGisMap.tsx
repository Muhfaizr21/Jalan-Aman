import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Polyline, Region, Camera } from 'react-native-maps';

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
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  pitch?: number;
  bearing?: number;
  showSafeRoute?: boolean;
  routeCoordinates?: [number, number][]; // [lng, lat][]
  altRouteCoordinates?: [number, number][];
  userLocation?: [number, number] | null; // [lng, lat]
  droppedPinCoords?: [number, number] | null;
  markers?: GisMarkerItem[];
  showCctvLayer?: boolean;
  autoRotate?: boolean;
  onPinPress?: (name: string, detail: string) => void;
  onMapPress?: (coords: [number, number]) => void;
  onSelectAltRoute?: () => void;
  children?: React.ReactNode;
}

export const CirclegeoGisMap: React.FC<CirclegeoGisMapProps> = ({
  interactive = true,
  center = [108.3073, -6.4745],
  zoom = 15,
  pitch = 0,
  bearing = 0,
  showSafeRoute = false,
  routeCoordinates = [],
  altRouteCoordinates = [],
  userLocation = null,
  droppedPinCoords = null,
  markers = [],
  showCctvLayer = true,
  autoRotate = false,
  onPinPress,
  onMapPress,
  onSelectAltRoute,
  children,
}) => {
  const mapRef = useRef<MapView>(null);

  // Convert maplibregl zoom to react-native-maps latitudeDelta roughly
  const getDeltaFromZoom = (zoomLevel: number) => {
    return Math.exp(Math.LN2 * (20 - zoomLevel)) / 1000;
  };

  const initialRegion: Region = {
    latitude: center[1],
    longitude: center[0],
    latitudeDelta: getDeltaFromZoom(zoom),
    longitudeDelta: getDeltaFromZoom(zoom) * 0.6, // rough aspect ratio
  };

  useEffect(() => {
    if (mapRef.current) {
      const camera: Camera = {
        center: {
          latitude: center[1],
          longitude: center[0],
        },
        pitch,
        heading: bearing,
        zoom,
        altitude: 1000,
      };
      mapRef.current.animateCamera(camera, { duration: 600 });
    }
  }, [center, pitch, bearing, zoom]);

  const routeLatLngs = routeCoordinates.map((coord) => ({
    latitude: coord[1],
    longitude: coord[0],
  }));

  const altRouteLatLngs = (altRouteCoordinates || []).map((coord) => ({
    latitude: coord[1],
    longitude: coord[0],
  }));

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'haven':
        return '#0284C7';
      case 'hazard':
        return '#F59E0B';
      case 'cctv':
        return '#65A30D';
      default:
        return '#EF4444';
    }
  };

  const getMarkerEmoji = (type: string) => {
    switch (type) {
      case 'haven': return '🛡️';
      case 'hazard': return '⚠️';
      case 'cctv': return '📹';
      default: return '📍';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        mapType="satellite"
        initialRegion={initialRegion}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        pitchEnabled={interactive}
        rotateEnabled={interactive}
        showsUserLocation={false}
        onPress={(e) => {
          if (onMapPress) {
            onMapPress([e.nativeEvent.coordinate.longitude, e.nativeEvent.coordinate.latitude]);
          }
        }}
      >
        {/* Always Render User Location GPS Marker (Blue Dot) */}
        {userLocation && (
          <Marker
            coordinate={{ latitude: userLocation[1], longitude: userLocation[0] }}
            anchor={{ x: 0.5, y: 0.5 }}
            title="Lokasi Anda"
          >
            <View style={styles.userPulseOuter}>
              <View style={styles.userPulseCore} />
            </View>
          </Marker>
        )}

        {/* Render Dropped Pin Marker (Red Google Maps Pin) */}
        {droppedPinCoords && (
          <Marker
            coordinate={{ latitude: droppedPinCoords[1], longitude: droppedPinCoords[0] }}
            anchor={{ x: 0.5, y: 0.5 }}
            title="Pin Terpasang"
          >
            <View style={styles.destMarkerOuter}>
              <View style={styles.destMarkerCore} />
            </View>
          </Marker>
        )}

        {/* Render Alternative Route (Grey Dashed) */}
        {showSafeRoute && altRouteLatLngs.length > 1 && (
          <Polyline
            coordinates={altRouteLatLngs}
            strokeColor="#64748B"
            strokeWidth={4.5}
            lineDashPattern={[6, 5]}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Render Route */}
        {showSafeRoute && routeLatLngs.length > 1 && (
          <>
            {/* Outer Glow */}
            <Polyline
              coordinates={routeLatLngs}
              strokeColor="rgba(16, 185, 129, 0.45)"
              strokeWidth={12}
              lineCap="round"
              lineJoin="round"
            />
            {/* Inner Core */}
            <Polyline
              coordinates={routeLatLngs}
              strokeColor="#A3E635"
              strokeWidth={4.2}
              lineCap="round"
              lineJoin="round"
            />
            {/* Origin Point (if userLocation not rendered) */}
            {!userLocation && (
              <Marker coordinate={routeLatLngs[0]} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.userPulseOuter}>
                  <View style={styles.userPulseCore} />
                </View>
              </Marker>
            )}
            {/* Destination Marker */}
            <Marker
              coordinate={routeLatLngs[routeLatLngs.length - 1]}
              anchor={{ x: 0.5, y: 0.5 }}
              title="Tujuan"
            >
              <View style={styles.destMarkerOuter}>
                <View style={styles.destMarkerCore} />
              </View>
            </Marker>
          </>
        )}

        {/* Render Markers */}
        {markers.map((item) => {
          if (item.type === 'cctv' && !showCctvLayer) return null;

          return (
            <Marker
              key={item.id}
              coordinate={{ latitude: item.lat, longitude: item.lng }}
              onPress={() => onPinPress && onPinPress(item.name, item.detail)}
            >
              <View style={[styles.markerBadge, { backgroundColor: getMarkerColor(item.type) }]}>
                <Text style={styles.markerText}>{`${getMarkerEmoji(item.type)} ${item.name}`}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>
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
  originPulseOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(163, 230, 53, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  originPulseCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#65A30D',
  },
  userPulseOuter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(59, 130, 246, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userPulseCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 3.5,
    borderColor: '#2563EB',
  },
  destMarkerOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destMarkerCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#DC2626',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  markerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  markerText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
