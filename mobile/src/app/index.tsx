import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Share,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import {
  NavigationHeaderOverlay,
  TurnByTurnCard,
  SpatialHazardBanner,
  NavigationMapCanvas,
  RouteSelectionSheet,
  SearchSuggestionModal,
  MapLayersModal,
  MapLayerConfig,
} from '@/components/navigation';
import { QuickCommuteSearch } from '@/components/dashboard/QuickCommuteSearch';
import { DashboardBottomNav, NotificationCenterModal } from '@/components/dashboard';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';
import { ArrivalSuccessModal } from '@/components/protection';
import { RouteFeedbackSheet } from '@/components/community-report';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { DashboardTabId, QuickDestinationChip } from '@/types/dashboard';
import { RouteOptionType, TurnInstructionData } from '@/types/navigation';
import {
  fetchDualRoadRoutes,
  geocodeDestination,
  RouteData,
} from '@/services/routingService';

/**
 * Approximate spherical distance between two coordinates in kilometers
 */
function computeDistanceKm(c1: [number, number], c2: [number, number]): number {
  const dLng = (c2[0] - c1[0]) * Math.cos(((c1[1] + c2[1]) / 2) * (Math.PI / 180));
  const dLat = c2[1] - c1[1];
  return parseFloat((Math.sqrt(dLng * dLng + dLat * dLat) * 111.32).toFixed(1));
}

/**
 * Pre-calibrated geographical coordinates for key Indramayu & Pantura landmarks
 */
function getKnownCoordsForPlace(name: string): [number, number] | null {
  const t = name.toLowerCase();
  if (t.includes('stasiun')) return [108.3073, -6.4745];
  if (t.includes('polsek')) return [108.3120, -6.4712];
  if (t.includes('bulak') || t.includes('indomaret')) return [108.3148, -6.4688];
  if (t.includes('pasar')) return [108.3060, -6.4720];
  if (t.includes('simpang lima')) return [108.3280, -6.3350];
  if (t.includes('alun-alun')) return [108.3220, -6.3260];
  if (t.includes('rsud')) return [108.3225, -6.3315];
  if (t.includes('polres')) return [108.3200, -6.3290];
  if (t.includes('polindra') || t.includes('politeknik')) return [108.2830, -6.4150];
  if (t.includes('rumah') || t.includes('griya')) return [108.3015, -6.4690];
  if (t.includes('kos')) return [108.3180, -6.3320];
  return null;
}

/**
 * Google Maps-Style Navigation Flow States:
 * 1. 'idle_explore': Standby full-screen map with search bar & category chips.
 * 2. 'route_preview': Route selection sheet with safe vs fast routes.
 * 3. 'active_navigation': Cockpit mode with 3D tilted map, turn-by-turn HUD, and exit controls.
 */
export type MapFlowState = 'idle_explore' | 'route_preview' | 'active_navigation';

/* Vector Icons for State Transitions */
function ArrowBackIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CloseIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WalkingIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="4" r="2" fill={color} />
      <Path
        d="M10 22l2-7 3 3v4M8 12l3-3 2 1 2 4M14 9l2-3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MotorcycleIcon({ size = 16, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="5" cy="17" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="19" cy="17" r="3" stroke={color} strokeWidth={2} />
      <Path
        d="M5 17l4-7h5l3 7M9 10l2-4h3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DirectionsDiamondIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.71 11.29l-9-9a1 1 0 00-1.42 0l-9 9a1 1 0 000 1.42l9 9a1 1 0 001.42 0l9-9a1 1 0 000-1.42z"
        fill={color}
      />
      <Path
        d="M13.5 14.5V11H9.5"
        stroke="#0B0F19"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 9l2.5 2-2.5 2"
        stroke="#0B0F19"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SwapIcon({ size = 16, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12M17 20l4-4M17 20l-4-4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function NavigationHomeScreen() {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight);
  const safeBottom = Math.max(insets.bottom, 12);

  // Google Maps Flow State Machine: 'idle_explore' -> 'route_preview' -> 'active_navigation'
  const [mapFlowState, setMapFlowState] = useState<MapFlowState>('idle_explore');
  const [originName, setOriginName] = useState('Lokasi Anda');
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(null);
  const [destinationName, setDestinationName] = useState('Pertigaan Bulak (Koridor PJU)');
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>([108.3148, -6.4688]);
  const [searchQuery, setSearchQuery] = useState('');
  const [travelMode, setTravelMode] = useState<'walk' | 'motor'>('walk');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [locationStatus, setLocationStatus] = useState<'locating' | 'ready' | 'fallback'>('locating');
  const [selectedMapPin, setSelectedMapPin] = useState<[number, number] | null>(null);

  // Dual Real Road Route Data from OSRM
  const [safeRouteData, setSafeRouteData] = useState<RouteData | null>(null);
  const [fastRouteData, setFastRouteData] = useState<RouteData | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Route Selection & Navigation HUD
  const [selectedRoute, setSelectedRoute] = useState<RouteOptionType>('safe');
  const [activeNavStepIndex, setActiveNavStepIndex] = useState<number>(0);
  const [isSimulatingNav, setIsSimulatingNav] = useState<boolean>(false);

  // Active & Alternative Route Computations
  const activeRouteData = selectedRoute === 'safe' ? safeRouteData : fastRouteData;
  const altRouteData = selectedRoute === 'safe' ? fastRouteData : safeRouteData;
  const activeRouteCoords = activeRouteData?.coordinates || [];
  const altRouteCoords = altRouteData?.coordinates || [];

  // Recalculate authentic road routes using OSRM
  const recalculateRoutes = useCallback(
    async (
      orig?: [number, number],
      dest?: [number, number],
      mode?: 'walk' | 'motor'
    ) => {
      const o = orig || originCoords || userLocation || [108.3073, -6.4745];
      const d = dest || destinationCoords || [108.3148, -6.4688];
      const m = mode || travelMode;

      setIsLoadingRoute(true);
      try {
        const result = await fetchDualRoadRoutes(o, d, m);
        setSafeRouteData(result.safeRoute);
        setFastRouteData(result.fastRoute);
      } catch (err) {
        console.warn('Error fetching road routes:', err);
      } finally {
        setIsLoadingRoute(false);
      }
    },
    [originCoords, destinationCoords, userLocation, travelMode]
  );

  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [isHazardVisible, setIsHazardVisible] = useState(true);
  const [isTilt3D, setIsTilt3D] = useState(false);
  const [isCctvLayerActive, setIsCctvLayerActive] = useState(true);
  const [isSosModalVisible, setIsSosModalVisible] = useState(false);

  // Modals & Sheets
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isLayersModalVisible, setIsLayersModalVisible] = useState(false);
  const [isArrivalModalVisible, setIsArrivalModalVisible] = useState(false);
  const [isFeedbackSheetVisible, setIsFeedbackSheetVisible] = useState(false);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
  const { hasUnread } = useNotifications();
  const { user } = useAuth();
  const [layerConfig, setLayerConfig] = useState<MapLayerConfig>({
    mapType: 'satellite',
    showCrimeHeatmap: false,
    showPjuLighting: true,
    showCctvCameras: true,
    showSafeHavens: true,
  });

  // Track Real User Location (Supports Web Geolocation & Mobile GPS)
  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    let webWatchId: number | null = null;

    const initialDest: [number, number] = [108.3148, -6.4688];

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setUserLocation(coords);
          setOriginCoords(coords);
          setMapCenter(coords);
          setLocationStatus('ready');
          recalculateRoutes(coords, initialDest, 'walk');
        },
        (err) => {
          console.warn('Browser geolocation fallback:', err);
          setLocationStatus('fallback');
          const fallbackCoords: [number, number] = [108.3073, -6.4745];
          setUserLocation(fallbackCoords);
          setOriginCoords(fallbackCoords);
          setMapCenter(fallbackCoords);
          recalculateRoutes(fallbackCoords, initialDest, 'walk');
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 30000 }
      );

      webWatchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setUserLocation((prev) => {
            // Only update GPS if not actively simulating
            if (isSimulatingNav) return prev;
            return coords;
          });
          setLocationStatus('ready');
        },
        (err) => console.warn('Watch error:', err),
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
      );
    } else {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setLocationStatus('fallback');
            const fallbackCoords: [number, number] = [108.3073, -6.4745];
            setUserLocation(fallbackCoords);
            setOriginCoords(fallbackCoords);
            recalculateRoutes(fallbackCoords, initialDest, 'walk');
            return;
          }

          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const coords: [number, number] = [location.coords.longitude, location.coords.latitude];
          setUserLocation(coords);
          setOriginCoords(coords);
          setMapCenter(coords);
          setLocationStatus('ready');
          recalculateRoutes(coords, initialDest, 'walk');

          locationSubscription = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.High,
              timeInterval: 2500,
              distanceInterval: 1,
            },
            (loc) => {
              const newCoords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
              setUserLocation((prev) => {
                if (isSimulatingNav) return prev;
                return newCoords;
              });
              setLocationStatus('ready');
            }
          );
        } catch (err) {
          console.warn('Gagal mendapatkan lokasi GPS:', err);
          setLocationStatus('fallback');
          const fallbackCoords: [number, number] = [108.3073, -6.4745];
          setUserLocation(fallbackCoords);
          setOriginCoords(fallbackCoords);
          recalculateRoutes(fallbackCoords, initialDest, 'walk');
        }
      })();
    }

    return () => {
      if (webWatchId !== null && typeof navigator !== 'undefined') {
        navigator.geolocation.clearWatch(webWatchId);
      }
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Handlers for State 1: Idle Explore (Search, Chips, Map Click)
  const handleSearchSubmit = useCallback(async () => {
    const target = searchQuery.trim() || 'Stasiun KAI Jatibarang';
    setDestinationName(target);
    setSelectedMapPin(null);

    let coords = getKnownCoordsForPlace(target);
    if (!coords) {
      coords = await geocodeDestination(target);
    }
    const finalCoords = coords || [
      (userLocation ? userLocation[0] : 108.3073) + 0.0075,
      (userLocation ? userLocation[1] : -6.4745) + 0.0055,
    ];
    setDestinationCoords(finalCoords);
    recalculateRoutes(originCoords || userLocation || [108.3073, -6.4745], finalCoords, travelMode);
    setMapFlowState('route_preview');
  }, [searchQuery, originCoords, userLocation, travelMode, recalculateRoutes]);

  const handleChipPress = useCallback((chip: QuickDestinationChip) => {
    setDestinationName(chip.label);
    setSearchQuery(chip.label);
    setSelectedMapPin(null);

    const coords = getKnownCoordsForPlace(chip.label) || [
      (userLocation ? userLocation[0] : 108.3073) + 0.0075,
      (userLocation ? userLocation[1] : -6.4745) + 0.0055,
    ];
    setDestinationCoords(coords);
    recalculateRoutes(originCoords || userLocation || [108.3073, -6.4745], coords, travelMode);
    setMapFlowState('route_preview');
  }, [originCoords, userLocation, travelMode, recalculateRoutes]);

  const handleOpenSearchModal = useCallback(() => {
    setIsSearchModalVisible(true);
  }, []);

  const handleSelectPlace = useCallback((placeName: string, coords?: [number, number]) => {
    setDestinationName(placeName);
    setSearchQuery(placeName);
    setSelectedMapPin(null);

    const resolvedCoords = coords || getKnownCoordsForPlace(placeName) || [
      (userLocation ? userLocation[0] : 108.3073) + 0.0075,
      (userLocation ? userLocation[1] : -6.4745) + 0.0055,
    ];
    setDestinationCoords(resolvedCoords);
    recalculateRoutes(originCoords || userLocation || [108.3073, -6.4745], resolvedCoords, travelMode);
    setMapFlowState('route_preview');
  }, [originCoords, userLocation, travelMode, recalculateRoutes]);

  const handleOpenLayersModal = useCallback(() => {
    setIsLayersModalVisible(true);
  }, []);

  const handleChangeLayerConfig = useCallback((newConfig: MapLayerConfig) => {
    setLayerConfig(newConfig);
    setIsCctvLayerActive(newConfig.showCctvCameras);
  }, []);

  // Map Click Handler: Drops red pin on the map
  const handleMapPress = useCallback((coords: [number, number]) => {
    setSelectedMapPin(coords);
    if (mapFlowState === 'idle_explore') {
      // In explore mode: only drop pin & show card, do not draw route yet!
      setMapCenter(coords);
    } else if (mapFlowState === 'route_preview') {
      // In route preview: tapping map updates the destination point
      const pinLabel = `Titik (${coords[1].toFixed(3)}, ${coords[0].toFixed(3)})`;
      setDestinationName(pinLabel);
      setDestinationCoords(coords);
      recalculateRoutes(originCoords || userLocation || [108.3073, -6.4745], coords, travelMode);
    }
  }, [mapFlowState, originCoords, userLocation, travelMode, recalculateRoutes]);

  // Directions from Dropped Pin in Idle Explore
  const handleRouteToDroppedPin = useCallback(() => {
    if (!selectedMapPin) return;
    const pinLabel = `Titik (${selectedMapPin[1].toFixed(3)}, ${selectedMapPin[0].toFixed(3)})`;
    setDestinationName(pinLabel);
    setDestinationCoords(selectedMapPin);
    recalculateRoutes(originCoords || userLocation || [108.3073, -6.4745], selectedMapPin, travelMode);
    setMapFlowState('route_preview');
  }, [selectedMapPin, originCoords, userLocation, travelMode, recalculateRoutes]);

  // Start Navigation Directly from Dropped Pin
  const handleStartDirectToDroppedPin = useCallback(() => {
    if (!selectedMapPin) return;
    const pinLabel = `Titik (${selectedMapPin[1].toFixed(3)}, ${selectedMapPin[0].toFixed(3)})`;
    setDestinationName(pinLabel);
    setDestinationCoords(selectedMapPin);
    recalculateRoutes(originCoords || userLocation || [108.3073, -6.4745], selectedMapPin, travelMode);
    setMapFlowState('active_navigation');
    setIsTilt3D(true);
    setActiveNavStepIndex(0);
    setIsSimulatingNav(false);
  }, [selectedMapPin, originCoords, userLocation, travelMode, recalculateRoutes]);

  // Swap Origin and Destination (⇅)
  const handleSwapPoints = useCallback(() => {
    const nextOrigName = destinationName;
    const nextDestName = originName;
    const nextOrigCoords = destinationCoords;
    const nextDestCoords = originCoords || userLocation || [108.3073, -6.4745];

    setOriginName(nextOrigName);
    setDestinationName(nextDestName);
    setOriginCoords(nextOrigCoords);
    setDestinationCoords(nextDestCoords);

    recalculateRoutes(nextOrigCoords, nextDestCoords, travelMode);
  }, [originName, destinationName, originCoords, destinationCoords, userLocation, travelMode, recalculateRoutes]);

  // Travel Mode Switcher ('walk' vs 'motor')
  const handleSelectTravelMode = useCallback((mode: 'walk' | 'motor') => {
    setTravelMode(mode);
    recalculateRoutes(originCoords || userLocation || [108.3073, -6.4745], destinationCoords, mode);
  }, [originCoords, userLocation, destinationCoords, recalculateRoutes]);

  // Select Alternative Route by tapping dashed polyline on map
  const handleSelectAltRoute = useCallback(() => {
    setSelectedRoute((prev) => (prev === 'safe' ? 'fast' : 'safe'));
  }, []);

  // Handlers for State 2: Route Preview
  const handleCancelPreview = useCallback(() => {
    setMapFlowState('idle_explore');
  }, []);

  const handleStartNavigation = useCallback(() => {
    setMapFlowState('active_navigation');
    setIsTilt3D(true);
    setActiveNavStepIndex(0);
    setIsSimulatingNav(false);
  }, []);

  // Simulation Hook: Advance along road coordinates when simulation is active
  useEffect(() => {
    if (mapFlowState !== 'active_navigation' || !isSimulatingNav) return;
    const coords = activeRouteCoords;
    if (!coords || coords.length === 0) return;

    let simIdx = 0;
    const interval = setInterval(() => {
      simIdx++;
      if (simIdx < coords.length) {
        const current = coords[simIdx];
        setUserLocation(current);
        setMapCenter(current);

        const steps = activeRouteData?.steps;
        if (steps && steps.length > 0) {
          const ratio = simIdx / coords.length;
          const targetStep = Math.min(
            steps.length - 1,
            Math.floor(ratio * steps.length)
          );
          setActiveNavStepIndex(targetStep);
        }
      } else {
        clearInterval(interval);
        setIsSimulatingNav(false);
        setIsArrivalModalVisible(true);
      }
    }, 1400);

    return () => clearInterval(interval);
  }, [mapFlowState, isSimulatingNav, activeRouteCoords, activeRouteData]);

  const handleToggleSimulation = useCallback(() => {
    setIsSimulatingNav((prev) => !prev);
  }, []);

  // Handlers for State 3: Active Turn-by-Turn Navigation
  const handleExitNavigation = useCallback(() => {
    Alert.alert(
      'Selesaikan Perjalanan?',
      'Apakah Anda telah tiba di tujuan dengan selamat?',
      [
        {
          text: '✅ Ya, Saya Sudah Tiba',
          onPress: () => {
            setIsArrivalModalVisible(true);
          },
        },
        {
          text: 'Keluar Tanpa Selesai',
          style: 'destructive',
          onPress: () => {
            setMapFlowState('idle_explore');
            setIsTilt3D(false);
          },
        },
        { text: 'Lanjutkan Navigasi', style: 'cancel' },
      ]
    );
  }, []);

  const handleReturnFromArrival = useCallback(() => {
    setIsArrivalModalVisible(false);
    setMapFlowState('idle_explore');
    setIsTilt3D(false);
    setIsFeedbackSheetVisible(true);
  }, []);

  const handleCloseFeedback = useCallback(() => {
    setIsFeedbackSheetVisible(false);
  }, []);

  const handleToggleVoice = useCallback(() => {
    setIsVoiceActive((prev) => {
      const next = !prev;
      Alert.alert(
        next ? 'Panduan Suara Aktif' : 'Panduan Suara Senyap',
        next
          ? 'Instruksi suara navigasi bahasa Indonesia aktif.'
          : 'Instruksi suara dimatikan.'
      );
      return next;
    });
  }, []);

  const handleSosPress = useCallback(() => {
    setIsSosModalVisible(true);
  }, []);

  // Spatial Hazard Banner Actions
  const handleDismissHazard = useCallback(() => {
    setIsHazardVisible(false);
  }, []);

  const handleApplyDeviation = useCallback(() => {
    setSelectedRoute('safe');
    setIsHazardVisible(false);
    Alert.alert(
      'Deviasi Diterapkan',
      'Rute dialihkan via Jl. Sabang (+2 mnt). Melewati 100% jalan dengan penerangan PJU penuh & 2 Pos Pantau aktif.'
    );
  }, []);

  const handleIgnoreHazard = useCallback(() => {
    setIsHazardVisible(false);
  }, []);

  // Companion Live Trip Share
  const handleShareTrip = useCallback(async () => {
    try {
      const routeDesc =
        selectedRoute === 'safe'
          ? 'Rute Rekomendasi Aman (Skor 96/100)'
          : 'Rute Tercepat (Skor 72/100)';
      const travelerName = user?.name || 'Warga';
      const userSlug = user?.name
        ? encodeURIComponent(user.name.trim().toLowerCase().replace(/\s+/g, '-'))
        : 'warga';
      await Share.share({
        title: `Pantau Perjalanan Aman ${travelerName} - JalanAman`,
        message: `Hai, saya sedang dalam perjalanan menuju ${destinationName} menggunakan JalanAman AI (${routeDesc}). Pantau lokasi langsung saya secara terenkripsi: https://jalanaman.id/track/live-${userSlug}-indramayu`,
      });
    } catch {
      Alert.alert('Tautan Tersedia', 'Tautan pelacakan aman disalin ke clipboard.');
    }
  }, [selectedRoute, destinationName, user]);

  // Map Controls
  const handleRecenter = useCallback(() => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setUserLocation(coords);
          setMapCenter([...coords]);
          if (mapFlowState !== 'idle_explore') {
            recalculateRoutes(coords, destinationCoords, travelMode);
          }
        },
        (err) => {
          console.warn('Recenter geolocation error:', err);
          if (userLocation) setMapCenter([...userLocation]);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else if (userLocation) {
      setMapCenter([...userLocation]);
    }
  }, [destinationCoords, recalculateRoutes, travelMode, userLocation, mapFlowState]);

  const handleToggleTilt = useCallback(() => {
    setIsTilt3D((prev) => !prev);
  }, []);

  const handleToggleCctvLayer = useCallback(() => {
    setIsCctvLayerActive((prev) => !prev);
  }, []);

  const handlePinPress = useCallback((pinTitle: string, pinDetail: string) => {
    Alert.alert(pinTitle, pinDetail);
  }, []);

  // Bottom Navigation Bar Handler
  const handleTabPress = useCallback((tabId: DashboardTabId) => {
    if (tabId === 'routes') {
      setMapFlowState('route_preview');
    } else if (tabId === 'radar') {
      router.push('/radar');
    } else if (tabId === 'feed') {
      router.push('/explore');
    } else if (tabId === 'profile') {
      router.push('/profile');
    }
  }, []);

  return (
    <View style={styles.screenContainer}>
      <StatusBar
        barStyle={mapFlowState === 'active_navigation' ? 'light-content' : 'dark-content'}
        backgroundColor="#0B0F19"
      />

      {/* ================= 1. FULL BACKGROUND GIS SATELLITE MAP ================= */}
      <View style={styles.mapCanvasWrapper}>
        <NavigationMapCanvas
          center={mapCenter}
          selectedRoute={selectedRoute}
          routeCoordinates={activeRouteCoords}
          altRouteCoordinates={altRouteCoords}
          userLocation={userLocation}
          isTilt3D={isTilt3D}
          isCctvLayerActive={isCctvLayerActive}
          onRecenter={handleRecenter}
          onToggleTilt={handleToggleTilt}
          onToggleCctvLayer={handleToggleCctvLayer}
          onOpenLayersModal={handleOpenLayersModal}
          onPinPress={handlePinPress}
          onMapPress={handleMapPress}
          showSafeRoute={mapFlowState !== 'idle_explore'}
          droppedPinCoords={selectedMapPin}
          onSelectAltRoute={handleSelectAltRoute}
          pitch={mapFlowState === 'active_navigation' ? 58 : isTilt3D ? 52 : 0}
          bearing={mapFlowState === 'active_navigation' ? -20 : isTilt3D ? -20 : 0}
          zoom={mapFlowState === 'active_navigation' ? 16.2 : mapFlowState === 'route_preview' ? 15.2 : 14.8}
          dockTop={
            mapFlowState === 'active_navigation'
              ? safeTop + 175
              : mapFlowState === 'route_preview'
              ? safeTop + 95
              : safeTop + 140
          }
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* ================= 2. KONDISI 1: IDLE / EXPLORE (STANDBY PETA) ================= */}
      {mapFlowState === 'idle_explore' && (
        <>
          <View style={[styles.idleTopOverlay, { paddingTop: safeTop + 8 }]} pointerEvents="box-none">
            <QuickCommuteSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSubmitSearch={handleSearchSubmit}
              onPressSearchInput={handleOpenSearchModal}
              onChipPress={handleChipPress}
              onFilterPress={handleOpenLayersModal}
              onNotificationPress={() => setIsNotifModalVisible(true)}
              hasUnreadNotifications={hasUnread}
            />
          </View>

          {/* Dropped Pin Place Card ala Google Maps */}
          {selectedMapPin && (
            <View style={[styles.droppedPinCard, { bottom: safeBottom + 65 }]}>
              <View style={styles.droppedPinLeft}>
                <Text style={styles.droppedPinTitle}>Titik Pilihan di Peta</Text>
                <Text style={styles.droppedPinSub}>
                  {selectedMapPin[1].toFixed(4)}, {selectedMapPin[0].toFixed(4)} • Ketuk Rute untuk mulai
                </Text>
              </View>
              <View style={styles.droppedPinActions}>
                <TouchableOpacity
                  style={styles.directionsPinBtn}
                  onPress={handleRouteToDroppedPin}
                  activeOpacity={0.85}
                  accessibilityLabel="Tampilkan rute ke titik pilihan"
                >
                  <DirectionsDiamondIcon size={18} color="#FFFFFF" />
                  <Text style={styles.directionsPinBtnText}>Rute</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.startDirectPinBtn}
                  onPress={handleStartDirectToDroppedPin}
                  activeOpacity={0.85}
                  accessibilityLabel="Mulai navigasi langsung ke titik pilihan"
                >
                  <Text style={styles.startDirectPinBtnText}>Mulai</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closePinBtn}
                  onPress={() => setSelectedMapPin(null)}
                >
                  <Text style={styles.closePinBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Google Maps Floating Directions FAB */}
          {!selectedMapPin && (
            <TouchableOpacity
              style={[styles.directionsFab, { bottom: safeBottom + 68 }]}
              onPress={() => {
                recalculateRoutes(originCoords || userLocation || [108.3073, -6.4745], destinationCoords, travelMode);
                setMapFlowState('route_preview');
              }}
              activeOpacity={0.88}
              accessibilityLabel="Buka Petunjuk Arah"
            >
              <DirectionsDiamondIcon size={20} color="#FFFFFF" />
              <Text style={styles.directionsFabText}>Rute</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* ================= 3. KONDISI 2: ROUTE PREVIEW (PILIH RUTE) ================= */}
      {mapFlowState === 'route_preview' && (
        <View style={styles.previewContainer} pointerEvents="box-none">
          {/* Top Route Planning Header (Google Maps Style) */}
          <View style={[styles.routeHeaderCard, { marginTop: safeTop + 8 }]}>
            <View style={styles.routeHeaderTopRow}>
              <TouchableOpacity
                style={styles.backCircleBtn}
                onPress={handleCancelPreview}
                activeOpacity={0.8}
                accessibilityLabel="Kembali ke peta jelajah"
              >
                <ArrowBackIcon size={20} />
              </TouchableOpacity>

              <View style={styles.pointsColumn}>
                <View style={styles.pointRow}>
                  <View style={[styles.originDot, { backgroundColor: '#2563EB' }]} />
                  <Text style={styles.pointText} numberOfLines={1}>
                    {originName === 'Lokasi Anda'
                      ? locationStatus === 'ready' && userLocation
                        ? `Lokasi Anda (GPS: ${userLocation[1].toFixed(4)}, ${userLocation[0].toFixed(4)})`
                        : 'Lokasi Anda (Mendeteksi GPS...)'
                      : originName}
                  </Text>
                </View>
                <View style={styles.pointsDivider} />
                <TouchableOpacity
                  style={styles.pointRow}
                  onPress={handleOpenSearchModal}
                  activeOpacity={0.7}
                  accessibilityLabel="Ubah tujuan perjalanan"
                >
                  <View style={[styles.destDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={[styles.pointText, styles.destText]} numberOfLines={1}>
                    {destinationName}
                  </Text>
                  <Text style={styles.changeDestHint}>Ubah ✎</Text>
                </TouchableOpacity>
              </View>

              {/* Swap Origin/Dest Button */}
              <TouchableOpacity
                style={styles.swapPointsBtn}
                onPress={handleSwapPoints}
                activeOpacity={0.7}
                accessibilityLabel="Tukar titik asal dan tujuan"
              >
                <SwapIcon size={16} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelTextBtn}
                onPress={handleCancelPreview}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelTextBtnLabel}>Tutup</Text>
              </TouchableOpacity>
            </View>

            {/* Travel Mode Selector Tabs */}
            <View style={styles.travelModeRow}>
              <TouchableOpacity
                style={[styles.modeTab, travelMode === 'walk' && styles.modeTabActive]}
                onPress={() => handleSelectTravelMode('walk')}
                activeOpacity={0.75}
              >
                <WalkingIcon size={16} color={travelMode === 'walk' ? '#0B0F19' : DashboardTheme.colors.textSecondary} />
                <Text style={[styles.modeTabLabel, travelMode === 'walk' && styles.modeTabLabelActive]}>
                  Jalan Kaki • {safeRouteData?.durationMin ?? 14} mnt
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, travelMode === 'motor' && styles.modeTabActive]}
                onPress={() => handleSelectTravelMode('motor')}
                activeOpacity={0.75}
              >
                <MotorcycleIcon size={16} color={travelMode === 'motor' ? '#0B0F19' : DashboardTheme.colors.textSecondary} />
                <Text style={[styles.modeTabLabel, travelMode === 'motor' && styles.modeTabLabelActive]}>
                  Motor • {fastRouteData?.durationMin ?? 6} mnt
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Route Comparison Sheet */}
          <View style={styles.previewBottomSheetWrap}>
            <RouteSelectionSheet
              selectedRoute={selectedRoute}
              onSelectRoute={setSelectedRoute}
              onShareTrip={handleShareTrip}
              onStartNavigation={handleStartNavigation}
              travelMode={travelMode}
              safeDurationMin={safeRouteData?.durationMin ?? (travelMode === 'walk' ? 14 : 6)}
              safeDistanceKm={safeRouteData?.distanceKm ?? (travelMode === 'walk' ? 2.1 : 2.5)}
              fastDurationMin={fastRouteData?.durationMin ?? (travelMode === 'walk' ? 10 : 4)}
              fastDistanceKm={fastRouteData?.distanceKm ?? (travelMode === 'walk' ? 1.8 : 2.0)}
              isNavigating={false}
            />
          </View>
        </View>
      )}

      {/* ================= 4. KONDISI 3: ACTIVE TURN-BY-TURN NAVIGATION ================= */}
      {mapFlowState === 'active_navigation' && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* Top Sticky HUD Overlays */}
          <View style={[styles.activeTopOverlay, { paddingTop: safeTop + 8 }]} pointerEvents="box-none">
            {/* Header Line */}
            <NavigationHeaderOverlay
              isVoiceActive={isVoiceActive}
              onBackPress={handleExitNavigation}
              onToggleVoice={handleToggleVoice}
              onSosPress={handleSosPress}
            />

            {/* Big Green Turn-by-Turn Card */}
            <View style={styles.cardSpacing}>
              <TurnByTurnCard
                step={activeRouteData?.steps?.[activeNavStepIndex]}
                stepIndex={activeNavStepIndex}
                totalSteps={activeRouteData?.steps?.length || 1}
              />
            </View>

            {/* Spatial Hazard Alert Banner (Conditional) */}
            <View style={styles.cardSpacing}>
              <SpatialHazardBanner
                isVisible={isHazardVisible}
                onDismiss={handleDismissHazard}
                onApplyDeviation={handleApplyDeviation}
                onIgnoreHazard={handleIgnoreHazard}
              />
            </View>
          </View>

          {/* Bottom Navigation Cockpit Bar (Replaces Tab Bar ala Google Maps) */}
          <View
            style={[
              styles.cockpitBottomBar,
              { paddingBottom: safeBottom + 4 },
            ]}
          >
            {/* Left Trip Telemetry */}
            <View style={styles.cockpitMetricsCol}>
              <View style={styles.cockpitEtaRow}>
                <Text style={styles.cockpitEtaMinutes}>
                  {activeRouteData?.durationMin ?? (travelMode === 'walk' ? 14 : 6)}
                </Text>
                <Text style={styles.cockpitEtaUnit}>mnt</Text>
                <Text style={styles.cockpitSubtext}>
                  • {activeRouteData?.distanceKm ?? 2.1} km • {destinationName}
                </Text>
              </View>
              <View style={styles.cockpitSafetyBadge}>
                <Text style={styles.cockpitSafetyBadgeText}>
                  {selectedRoute === 'safe'
                    ? '🛡️ Skor 96/100 • Jalur Terang & Aman'
                    : '⚡ Rute Cepat • Jalur Alternatif'}
                </Text>
              </View>
            </View>

            {/* Right Action Group: Simulation, SOS & Exit */}
            <View style={styles.cockpitActionsRow}>
              {/* Simulation Play/Pause Button for interactive demo */}
              <TouchableOpacity
                style={[styles.cockpitSimBtn, isSimulatingNav && styles.cockpitSimBtnActive]}
                onPress={handleToggleSimulation}
                activeOpacity={0.8}
                accessibilityLabel="Simulasi pergerakan rute"
              >
                <Text style={[styles.cockpitSimText, isSimulatingNav && styles.cockpitSimTextActive]}>
                  {isSimulatingNav ? '⏸ Jeda' : '▶ Simulasi'}
                </Text>
              </TouchableOpacity>

              {/* Discreet SOS Button */}
              <TouchableOpacity
                style={styles.cockpitSosBtn}
                onPress={handleSosPress}
                activeOpacity={0.8}
                accessibilityLabel="Panggil Bantuan SOS"
              >
                <Text style={styles.cockpitSosText}>SOS</Text>
              </TouchableOpacity>

              {/* End / Exit Navigation Button */}
              <TouchableOpacity
                style={styles.cockpitExitBtn}
                onPress={handleExitNavigation}
                activeOpacity={0.8}
                accessibilityLabel="Hentikan dan keluar dari navigasi"
              >
                <CloseIcon size={18} color="#FFFFFF" />
                <Text style={styles.cockpitExitText}>Selesai</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ================= 5. PERSISTENT FLOATING BOTTOM NAV (HIDDEN IN ACTIVE NAV) ================= */}
      {mapFlowState !== 'active_navigation' && (
        <DashboardBottomNav
          activeTab="routes"
          onTabPress={handleTabPress}
          onSosPress={() => setIsSosModalVisible(true)}
        />
      )}

      {/* Emergency SOS Modal */}
      <EmergencySOSModal
        visible={isSosModalVisible}
        onDismiss={() => setIsSosModalVisible(false)}
      />

      {/* Item 1: Professional Full Search & Saved Places Modal */}
      <SearchSuggestionModal
        visible={isSearchModalVisible}
        onDismiss={() => setIsSearchModalVisible(false)}
        onSelectPlace={handleSelectPlace}
        initialQuery={searchQuery}
      />

      {/* Item 2: Professional Map Layer & Spatial Filter Sheet */}
      <MapLayersModal
        visible={isLayersModalVisible}
        onDismiss={() => setIsLayersModalVisible(false)}
        config={layerConfig}
        onChangeConfig={handleChangeLayerConfig}
      />

      {/* Arrival Success & Guardians Safe Notification Modal */}
      <ArrivalSuccessModal
        visible={isArrivalModalVisible}
        onReturnHome={handleReturnFromArrival}
      />

      {/* 5-Star Route Feedback Sheet */}
      <RouteFeedbackSheet
        visible={isFeedbackSheetVisible}
        onClose={handleCloseFeedback}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        visible={isNotifModalVisible}
        onDismiss={() => setIsNotifModalVisible(false)}
        onNavigateToMap={() => {
          setIsNotifModalVisible(false);
          setMapFlowState('idle_explore');
        }}
        onNavigateToReport={() => {
          setIsNotifModalVisible(false);
          router.push('/report');
        }}
        onNavigateToGuardian={() => {
          setIsNotifModalVisible(false);
          router.push('/profile');
        }}
      />
    </View>
  );
}

export { NavigationHomeScreen as ActiveSafeNavigationScreen };
export default NavigationHomeScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    position: 'relative',
  },
  mapCanvasWrapper: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },

  /* State 1: Idle Explore */
  idleTopOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: 16,
  },

  /* State 2: Route Preview */
  previewContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 30,
    justifyContent: 'space-between',
  },
  routeHeaderCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
    gap: 12,
  },
  routeHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsColumn: {
    flex: 1,
    gap: 6,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#0284C7',
  },
  destDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#A3E635',
  },
  pointsDivider: {
    width: 2,
    height: 8,
    backgroundColor: '#CBD5E1',
    marginLeft: 3.5,
  },
  pointText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    flexShrink: 1,
  },
  destText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
  },
  cancelTextBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cancelTextBtnLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  travelModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
  },
  modeTabActive: {
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  modeTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  modeTabLabelActive: {
    color: '#0B0F19',
    fontWeight: '800',
  },
  previewBottomSheetWrap: {
    width: '100%',
    paddingBottom: 85, // clearance above bottom nav
  },

  /* State 3: Active Navigation */
  activeTopOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    gap: 10,
  },
  cardSpacing: {
    paddingHorizontal: 16,
  },
  cockpitBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  cockpitMetricsCol: {
    flex: 1,
    gap: 4,
  },
  cockpitEtaRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  cockpitEtaMinutes: {
    fontSize: 26,
    fontWeight: '900',
    color: '#A3E635',
    letterSpacing: -0.5,
  },
  cockpitEtaUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A3E635',
  },
  cockpitSubtext: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  cockpitSafetyBadge: {
    backgroundColor: 'rgba(163, 230, 53, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cockpitSafetyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A3E635',
  },
  cockpitActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cockpitSimBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  cockpitSimBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  cockpitSimText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E2E8F0',
  },
  cockpitSimTextActive: {
    color: '#FFFFFF',
  },
  cockpitSosBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    borderWidth: 1.5,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cockpitSosText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#EF4444',
  },
  cockpitExitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  cockpitExitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  /* Google Maps Style Directions FAB */
  directionsFab: {
    position: 'absolute',
    right: 18,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 999,
    zIndex: 40,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  directionsFabText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  /* Google Maps Style Dropped Pin Bottom Card */
  droppedPinCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 45,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  droppedPinLeft: {
    flex: 1,
    marginRight: 10,
  },
  droppedPinTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  droppedPinSub: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  droppedPinActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  directionsPinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284C7',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 999,
  },
  directionsPinBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  startDirectPinBtn: {
    backgroundColor: '#16A34A',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 999,
  },
  startDirectPinBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  closePinBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  closePinBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },
  swapPointsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  changeDestHint: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#0284C7',
    marginLeft: 'auto',
  },
});
