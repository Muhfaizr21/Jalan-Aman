import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  StatusBar,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Rect,
  Text as SvgText,
  G,
} from 'react-native-svg';
import { IncidentReportModal } from '@/components/IncidentReportModal';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';
import { SafeHavenDirectoryModal } from '@/components/SafeHavenDirectoryModal';
import { ActiveSafeNavigationHUD } from '@/components/ActiveSafeNavigationHUD';
import { BottomNavigationBar } from '@/components/BottomNavigationBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type RouteType = 'safe' | 'fast';
export type AppState = 'idle_explore' | 'route_preview_active' | 'turn_by_turn_nav';
export type MapStyle = 'clean_editorial' | 'satellite' | 'night_contrast';

const MAP_THEMES = {
  clean_editorial: {
    name: 'Standar Peta Aman',
    background: '#F8FAFC',
    blockFill: '#EEF2F6',
    blockBorder: '#E2E8F0',
    parkFill: '#F0FDF4',
    parkBorder: '#DCFCE7',
    parkText: '#16A34A',
    river: '#E0F2FE',
    roadGrid: '#F1F5F9',
    roadSecondary: '#E2E8F0',
    labelFill: '#0F172A',
    sublabelFill: '#64748B',
    userPillBg: '#0F172A',
  },
  satellite: {
    name: 'Satelit Bumi',
    background: '#0F172A',
    blockFill: '#1E293B',
    blockBorder: '#334155',
    parkFill: '#14532D',
    parkBorder: '#166534',
    parkText: '#86EFAC',
    river: '#0369A1',
    roadGrid: '#334155',
    roadSecondary: '#475569',
    labelFill: '#F8FAFC',
    sublabelFill: '#94A3B8',
    userPillBg: '#0284C7',
  },
  night_contrast: {
    name: 'Mode Malam Kontras',
    background: '#050811',
    blockFill: '#0D1527',
    blockBorder: '#1E293B',
    parkFill: '#064E3B',
    parkBorder: '#047857',
    parkText: '#34D399',
    river: '#0C4A6E',
    roadGrid: '#1E293B',
    roadSecondary: '#0284C7',
    labelFill: '#E2E8F0',
    sublabelFill: '#64748B',
    userPillBg: '#0F172A',
  },
};

/* ================= VECTOR ICONS ================= */
function LayersOutlineIcon({ color = '#0284C7', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CrosshairsGpsIcon({ color = '#0284C7', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="7" stroke={color} strokeWidth="2" />
      <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="2.5" fill={color} />
    </Svg>
  );
}

function SearchIcon({ color = '#64748B', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
      <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function HomeOutlineIcon({ color = '#0284C7', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V9.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SchoolOutlineIcon({ color = '#0284C7', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 2 3 3 6 3s6-1 6-3v-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BriefcaseOutlineIcon({ color = '#0284C7', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="7" width="18" height="14" rx="2" stroke={color} strokeWidth="2" />
      <Path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" stroke={color} strokeWidth="2" />
      <Path d="M12 12v2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function MainRouteNavigationScreen() {
  const insets = useSafeAreaInsets();

  // State Management
  const [appState, setAppState] = useState<AppState>('idle_explore');
  const [activeMapStyle, setActiveMapStyle] = useState<MapStyle>('clean_editorial');
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string>('Rumah');
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [selectedRoute, setSelectedRoute] = useState<RouteType>('safe');

  // Modal States
  const [isSOSModalVisible, setIsSOSModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isShelterModalVisible, setIsShelterModalVisible] = useState(false);

  // Pulse animation for TopRadarBanner and GPS Puck
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const radarRingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(radarRingAnim, {
            toValue: 2.2,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(radarRingAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [pulseAnim, radarRingAnim]);

  // Handlers
  const handleSOSPress = () => {
    setIsSOSModalVisible(true);
  };

  const handleSheltersPress = () => {
    setIsShelterModalVisible(true);
  };

  const handleReportPress = () => {
    setIsReportModalVisible(true);
  };

  const handleSelectDestination = (destName: string) => {
    setSelectedDestination(destName);
    setAppState('route_preview_active');
  };

  const handleSearchSubmit = () => {
    const dest = searchInputValue.trim() || 'Pusat Kota / Sleman';
    setSelectedDestination(dest);
    setAppState('route_preview_active');
  };

  const handleCancelRoutePreview = () => {
    setAppState('idle_explore');
  };

  const handleStartNavigation = () => {
    setAppState('turn_by_turn_nav');
  };

  const handleRecenterGPS = () => {
    Alert.alert(
      '📍 Posisi GPS Dipusatkan',
      'Kamera peta berpusat ke koordinat Anda (-6.3264, 108.3242) dengan radius geofence aman 500 meter.'
    );
  };

  // Dynamic Route Metrics
  const isSafe = selectedRoute === 'safe';
  const durationText = isSafe ? '18 mins' : '15 mins';
  const distanceText = isSafe
    ? '6.2 km via Main Arterial Corridor'
    : '5.1 km via Dark Shortcut Gang';
  const safetyScoreText = isSafe ? 'Safety Score: 96/100' : 'Safety Score: 38/100';
  const streetlightValue = isSafe ? '92% Illuminated' : '38% Illuminated';
  const riskClustersValue = isSafe ? '2 Hotspots Avoided' : '2 Hotspots Crossed';
  const sheltersValue = isSafe ? '3 Locations' : '0 Shelters';
  const actionButtonText = isSafe
    ? 'Start Safe Navigation'
    : 'Start Navigation (High Risk)';

  const mapTheme = MAP_THEMES[activeMapStyle];
  const showRoutePolylines = appState === 'route_preview_active';

  // State 3: Turn-by-turn Navigation HUD
  if (appState === 'turn_by_turn_nav') {
    return (
      <View style={styles.screenContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <ActiveSafeNavigationHUD
          onStopNavigation={() => setAppState('route_preview_active')}
          onOpenShelters={handleSheltersPress}
          onOpenSOS={handleSOSPress}
        />

        {/* Modals during active navigation */}
        <IncidentReportModal
          visible={isReportModalVisible}
          onClose={() => setIsReportModalVisible(false)}
        />
        <EmergencySOSModal
          visible={isSOSModalVisible}
          onDismiss={() => setIsSOSModalVisible(false)}
          onEvacuationStart={() => setIsSOSModalVisible(false)}
        />
        <SafeHavenDirectoryModal
          visible={isShelterModalVisible}
          onClose={() => setIsShelterModalVisible(false)}
          onReroute={() => setIsShelterModalVisible(false)}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle={activeMapStyle === 'clean_editorial' ? 'dark-content' : 'light-content'}
        backgroundColor={activeMapStyle === 'clean_editorial' ? '#FFFFFF' : '#0F172A'}
      />

      {/* ================= 1. TOP RADAR BANNER ================= */}
      <View style={styles.topRadarBanner}>
        <View style={styles.pulseDotContainer}>
          <Animated.View
            style={[
              styles.radarPulseRing,
              {
                transform: [{ scale: radarRingAnim }],
                opacity: radarRingAnim.interpolate({
                  inputRange: [1, 2.2],
                  outputRange: [0.6, 0],
                }),
              },
            ]}
          />
          <Animated.View
            style={[
              styles.pulseDot,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        </View>

        <Text style={styles.radarLabel}>Live Geofence Radar: 500m Radius Clear</Text>

        <View style={styles.radarStatusPill}>
          <Text style={styles.radarStatusText}>ONLINE</Text>
        </View>
      </View>

      {/* ================= 2. INTERACTIVE VECTOR MAP VIEWPORT ================= */}
      <View style={styles.mapCanvasContainer}>
        <Svg width="100%" height="100%" viewBox="0 0 390 420" preserveAspectRatio="xMidYMid slice">
          <Defs>
            {/* Cyan-to-Blue Linear Gradient for Safe Route */}
            <LinearGradient id="safeRouteGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#0284C7" stopOpacity="1" />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
            </LinearGradient>

            {/* Glowing filter for active safe path */}
            <LinearGradient id="safeRouteGlow" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
            </LinearGradient>
          </Defs>

          {/* Cartography Background based on activeMapStyle */}
          <Rect x="0" y="0" width="390" height="420" fill={mapTheme.background} />

          {/* Urban Map City Blocks */}
          <Rect x="20" y="30" width="70" height="60" rx="6" fill={mapTheme.blockFill} stroke={mapTheme.blockBorder} strokeWidth="1" />
          <Rect x="105" y="25" width="85" height="50" rx="6" fill={mapTheme.blockFill} stroke={mapTheme.blockBorder} strokeWidth="1" />
          <Rect x="285" y="35" width="80" height="55" rx="6" fill={mapTheme.blockFill} stroke={mapTheme.blockBorder} strokeWidth="1" />

          <Rect x="15" y="115" width="65" height="70" rx="6" fill={mapTheme.blockFill} stroke={mapTheme.blockBorder} strokeWidth="1" />
          <Rect x="300" y="110" width="75" height="75" rx="6" fill={mapTheme.blockFill} stroke={mapTheme.blockBorder} strokeWidth="1" />

          <Rect x="25" y="235" width="75" height="60" rx="6" fill={mapTheme.blockFill} stroke={mapTheme.blockBorder} strokeWidth="1" />
          <Rect x="290" y="225" width="80" height="70" rx="6" fill={mapTheme.blockFill} stroke={mapTheme.blockBorder} strokeWidth="1" />

          {/* Green Community Park Zone */}
          <Rect x="110" y="240" width="60" height="50" rx="8" fill={mapTheme.parkFill} stroke={mapTheme.parkBorder} strokeWidth="1" />
          <SvgText x="140" y="268" fill={mapTheme.parkText} fontSize="9" fontWeight="600" textAnchor="middle">
            TAMAN KOTA
          </SvgText>

          {/* River / Water Canal */}
          <Path
            d="M -10 330 C 90 310, 180 340, 270 315 C 330 300, 370 320, 410 310"
            stroke={mapTheme.river}
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />

          {/* Minor Road Grid Lines */}
          <Path d="M 0 100 L 390 100" stroke={mapTheme.roadGrid} strokeWidth="10" />
          <Path d="M 0 205 L 390 205" stroke={mapTheme.roadGrid} strokeWidth="12" />
          <Path d="M 95 0 L 95 420" stroke={mapTheme.roadGrid} strokeWidth="10" />
          <Path d="M 285 0 L 285 420" stroke={mapTheme.roadGrid} strokeWidth="10" />

          {/* Secondary Street Arteries */}
          <Path d="M 195 20 L 195 400" stroke={mapTheme.roadSecondary} strokeWidth="6" strokeLinecap="round" />
          <Path d="M 20 150 Q 200 130 370 150" stroke={mapTheme.roadSecondary} strokeWidth="8" strokeLinecap="round" />

          {/* Crime Cluster Overlay (Red Warning Perimeter) */}
          <G>
            <Circle
              cx="195"
              cy="148"
              r="46"
              fill="#FEE2E2"
              fillOpacity="0.45"
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            <Circle cx="195" cy="148" r="7" fill="#DC2626" fillOpacity="0.8" />
            <Rect x="140" y="112" width="110" height="18" rx="4" fill="#DC2626" />
            <SvgText x="195" y="124" fill="#FFFFFF" fontSize="8" fontWeight="800" textAnchor="middle">
              ⚠️ KLASTER BEGAL AKTIF
            </SvgText>
          </G>

          {/* Shelters (Always rendered on map) */}
          {/* Shelter 1: Pos Polisi */}
          <G transform="translate(160, 205)">
            <Circle cx="0" cy="0" r="13" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
            <SvgText x="0" y="4" fill="#0284C7" fontSize="8" fontWeight="800" textAnchor="middle">
              POL
            </SvgText>
            <Rect x="-28" y="-22" width="56" height="13" rx="3" fill="#0284C7" />
            <SvgText x="0" y="-13" fill="#FFFFFF" fontSize="7" fontWeight="700" textAnchor="middle">
              POS POLISI
            </SvgText>
          </G>

          {/* Shelter 2: Minimarket 24 Jam */}
          <G transform="translate(290, 175)">
            <Circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke="#059669" strokeWidth="2" />
            <SvgText x="0" y="4" fill="#059669" fontSize="8" fontWeight="800" textAnchor="middle">
              24H
            </SvgText>
            <Rect x="-25" y="-20" width="50" height="13" rx="3" fill="#059669" />
            <SvgText x="0" y="-11" fill="#FFFFFF" fontSize="7" fontWeight="700" textAnchor="middle">
              SHELTER
            </SvgText>
          </G>

          {/* User Current Location Marker (Minimal Blue Pulse Puck) */}
          <G transform="translate(50, 310)">
            <Circle cx="0" cy="0" r="26" fill="#0284C7" fillOpacity="0.12" stroke="#0284C7" strokeWidth="1" strokeDasharray="3,3" />
            <Circle cx="0" cy="0" r="14" fill="#0284C7" fillOpacity="0.25" />
            <Circle cx="0" cy="0" r="7" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2.5" />
            <Rect x="-36" y="14" width="72" height="18" rx="4" fill={mapTheme.userPillBg} />
            <SvgText x="0" y="26" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">
              LOKASI SAYA
            </SvgText>
          </G>

          {/* CONDITIONAL: Navigation Polylines & Destination Pin ONLY in route_preview_active */}
          {showRoutePolylines && (
            <>
              {/* Shortest Route (Dashed Line) */}
              <Path
                d="M 50 310 L 110 205 L 195 148 L 285 100 L 340 70"
                stroke={!isSafe ? '#DC2626' : '#94A3B8'}
                strokeWidth={!isSafe ? 4.5 : 3}
                strokeDasharray="7,5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={!isSafe ? 1 : 0.65}
              />

              {/* Safe Route (Glow Layer) */}
              {isSafe && (
                <Path
                  d="M 50 310 C 90 310, 100 240, 160 220 C 230 200, 270 205, 300 160 C 320 130, 310 90, 340 70"
                  stroke="url(#safeRouteGlow)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              )}

              {/* Safe Route Ribbon */}
              <Path
                d="M 50 310 C 90 310, 100 240, 160 220 C 230 200, 270 205, 300 160 C 320 130, 310 90, 340 70"
                stroke="url(#safeRouteGradient)"
                strokeWidth={isSafe ? 5 : 3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={isSafe ? 1 : 0.45}
              />

              {/* Destination Pin */}
              <G transform="translate(340, 70)">
                <Circle cx="0" cy="0" r="15" fill="#059669" fillOpacity="0.2" />
                <Circle cx="0" cy="0" r="8" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                <Rect x="-42" y="-26" width="84" height="18" rx="4" fill="#059669" />
                <SvgText x="0" y="-14" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">
                  {selectedDestination.toUpperCase()} 🏠
                </SvgText>
              </G>
            </>
          )}
        </Svg>

        {/* Floating Control 1: Map Layer Switcher (Top Left) */}
        <View style={styles.layerSwitcherContainer}>
          <TouchableOpacity
            style={styles.floatingLayerButton}
            onPress={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Ganti Gaya Peta"
          >
            <LayersOutlineIcon color="#0284C7" size={20} />
          </TouchableOpacity>

          {/* Layer Options Popup Menu */}
          {isStyleMenuOpen && (
            <View style={styles.layerOptionsDropdown}>
              {(['clean_editorial', 'satellite', 'night_contrast'] as MapStyle[]).map((styleKey) => {
                const isSelected = activeMapStyle === styleKey;
                const themeOpt = MAP_THEMES[styleKey];
                return (
                  <TouchableOpacity
                    key={styleKey}
                    style={[
                      styles.layerOptionItem,
                      isSelected && styles.layerOptionItemActive,
                    ]}
                    onPress={() => {
                      setActiveMapStyle(styleKey);
                      setIsStyleMenuOpen(false);
                    }}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.styleColorDot,
                        { backgroundColor: themeOpt.background === '#F8FAFC' ? '#0284C7' : themeOpt.background },
                      ]}
                    />
                    <Text
                      style={[
                        styles.layerOptionText,
                        isSelected && styles.layerOptionTextActive,
                      ]}
                    >
                      {themeOpt.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Floating Control 2: Emergency SOS Button (Top Right) */}
        <TouchableOpacity
          style={styles.sosFloatingButton}
          onPress={handleSOSPress}
          activeOpacity={0.85}
          testID="floating-sos-button"
          accessibilityLabel="Floating SOS Button"
          accessibilityRole="button"
        >
          <Text style={styles.sosButtonText}>SOS</Text>
        </TouchableOpacity>

        {/* Floating Control 3: Recenter GPS Button (Bottom Right above sheet) */}
        <TouchableOpacity
          style={styles.recenterGpsButton}
          onPress={handleRecenterGPS}
          activeOpacity={0.85}
          testID="recenter-gps-button"
          accessibilityLabel="Recenter GPS Button"
          accessibilityRole="button"
        >
          <CrosshairsGpsIcon color="#0284C7" size={22} />
        </TouchableOpacity>

        {/* Route Preview Legend Overlay */}
        {showRoutePolylines && (
          <View style={styles.mapLegendOverlay}>
            <TouchableOpacity
              style={[styles.legendChip, isSafe && styles.legendChipActiveSafe]}
              onPress={() => setSelectedRoute('safe')}
            >
              <View style={[styles.legendColorDot, { backgroundColor: '#0284C7' }]} />
              <Text style={[styles.legendText, isSafe && styles.legendTextActive]}>Rute Aman</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.legendChip, !isSafe && styles.legendChipActiveFast]}
              onPress={() => setSelectedRoute('fast')}
            >
              <View style={[styles.legendColorDot, { backgroundColor: '#DC2626' }]} />
              <Text style={[styles.legendText, !isSafe && styles.legendTextActive]}>Rute Biasa</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ================= 3. BOTTOM SHEETS DEPENDING ON APP STATE ================= */}

      {/* STATE A: idle_explore -> IdleSearchBarBottomSheet */}
      {appState === 'idle_explore' && (
        <View style={styles.idleBottomSheetContainer}>
          <View style={styles.sheetHandlePill} />

          {/* Search Input Trigger */}
          <View style={styles.idleSearchRow}>
            <SearchIcon color="#64748B" size={18} />
            <TextInput
              style={styles.idleSearchInput}
              placeholder="Cari rute teraman ke mana malam ini?"
              placeholderTextColor="#94A3B8"
              value={searchInputValue}
              onChangeText={setSearchInputValue}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.idleSearchSubmitBtn}
              onPress={handleSearchSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.idleSearchSubmitText}>Cari</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Saved Places Row */}
          <View style={styles.savedPlacesContainer}>
            <Text style={styles.savedPlacesTitle}>Tujuan Cepat Tersimpan</Text>
            <View style={styles.savedPlacesRow}>
              <TouchableOpacity
                style={styles.savedPlaceChip}
                onPress={() => handleSelectDestination('Rumah')}
                activeOpacity={0.8}
              >
                <HomeOutlineIcon color="#0284C7" size={16} />
                <Text style={styles.savedPlaceText}>Rumah</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.savedPlaceChip}
                onPress={() => handleSelectDestination('Kampus')}
                activeOpacity={0.8}
              >
                <SchoolOutlineIcon color="#0284C7" size={16} />
                <Text style={styles.savedPlaceText}>Kampus</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.savedPlaceChip}
                onPress={() => handleSelectDestination('Kantor / Shift')}
                activeOpacity={0.8}
              >
                <BriefcaseOutlineIcon color="#0284C7" size={16} />
                <Text style={styles.savedPlaceText}>Kantor / Shift</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nearby Hazard Alert Pill */}
          <View style={styles.hazardAlertPill}>
            <Text style={styles.hazardAlertPillText}>
              ⚠️ 1 Klaster Rawan aktif terdeteksi 1.2 km dari Anda
            </Text>
          </View>
        </View>
      )}

      {/* STATE B: route_preview_active -> RouteComparisonBottomSheet */}
      {appState === 'route_preview_active' && (
        <View style={styles.bottomSheetContainer}>
          <View style={styles.sheetHandlePill} />

          {/* Route Preview Header with Reset/Cancel action */}
          <View style={styles.routePreviewHeaderBar}>
            <View style={styles.routeDestinationPill}>
              <Text style={styles.routeDestinationLabel}>
                Tujuan: <Text style={styles.routeDestinationName}>{selectedDestination}</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.cancelPreviewBtn}
              onPress={handleCancelRoutePreview}
              activeOpacity={0.75}
            >
              <Text style={styles.cancelPreviewText}>✕ Kembali ke Jelajah</Text>
            </TouchableOpacity>
          </View>

          {/* 3.1 Segmented Control */}
          <View style={styles.segmentedControlContainer}>
            <TouchableOpacity
              style={[
                styles.segmentedButton,
                isSafe && styles.segmentedButtonActive,
              ]}
              onPress={() => setSelectedRoute('safe')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentedButtonText,
                  isSafe && styles.segmentedButtonTextActive,
                ]}
              >
                🛡️ Safest Route
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentedButton,
                !isSafe && styles.segmentedButtonActiveAlert,
              ]}
              onPress={() => setSelectedRoute('fast')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.segmentedButtonText,
                  !isSafe && styles.segmentedButtonTextActiveAlert,
                ]}
              >
                ⚠️ Fastest Route
              </Text>
            </TouchableOpacity>
          </View>

          {/* 3.2 Route Header Summary */}
          <View style={styles.routeHeaderSummary}>
            <View style={styles.durationDistanceCol}>
              <Text style={styles.durationHeading}>{durationText}</Text>
              <Text style={styles.distanceSubtext}>{distanceText}</Text>
            </View>

            <View
              style={[
                styles.safetyScoreBadge,
                isSafe ? styles.badgeSafeGreen : styles.badgeWarningRed,
              ]}
            >
              <Text
                style={[
                  styles.safetyScoreText,
                  isSafe ? styles.scoreTextGreen : styles.scoreTextRed,
                ]}
              >
                {safetyScoreText}
              </Text>
            </View>
          </View>

          {/* 3.3 Comparative Metrics Row */}
          <View style={styles.comparativeMetricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricCardLabel}>Streetlight Density</Text>
              <Text
                style={[
                  styles.metricCardValue,
                  isSafe ? styles.textGreenHighlight : styles.textRedHighlight,
                ]}
              >
                {streetlightValue}
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricCardLabel}>Risk Clusters Avoided</Text>
              <Text
                style={[
                  styles.metricCardValue,
                  isSafe ? styles.textGreenHighlight : styles.textRedHighlight,
                ]}
              >
                {riskClustersValue}
              </Text>
            </View>

            {/* Metric 3: Active Safe Shelters Card */}
            <TouchableOpacity
              style={styles.metricCard}
              onPress={handleSheltersPress}
              activeOpacity={0.75}
              testID="active-safe-shelters-card"
              accessibilityLabel="Active Safe Shelters Card"
              accessibilityRole="button"
            >
              <Text style={styles.metricCardLabel}>Active Safe Shelters ↗</Text>
              <Text style={[styles.metricCardValue, { color: '#0284C7' }]}>{sheltersValue}</Text>
            </TouchableOpacity>
          </View>

          {/* 3.4 Main Navigation Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              isSafe ? styles.actionButtonSafe : styles.actionButtonWarning,
            ]}
            onPress={handleStartNavigation}
            activeOpacity={0.88}
            testID="start-safe-navigation-button"
            accessibilityLabel="'Start Safe Navigation' Primary Button"
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonText}>{actionButtonText}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================= 4. BOTTOM NAVIGATION BAR ================= */}
      <BottomNavigationBar
        activeTab="navigasi"
        onTabPress={(tabId) => {
          if (tabId === 'info') router.push('/explore');
          else if (tabId === 'lapor') handleReportPress();
        }}
        onLaporPress={handleReportPress}
      />

      {/* ================= 5. FEATURE MODALS ================= */}
      <IncidentReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
      />
      <EmergencySOSModal
        visible={isSOSModalVisible}
        onDismiss={() => setIsSOSModalVisible(false)}
        onEvacuationStart={() => {
          setIsSOSModalVisible(false);
          setAppState('turn_by_turn_nav');
        }}
      />
      <SafeHavenDirectoryModal
        visible={isShelterModalVisible}
        onClose={() => setIsShelterModalVisible(false)}
        onReroute={() => {
          setIsShelterModalVisible(false);
          setAppState('turn_by_turn_nav');
        }}
      />
    </SafeAreaView>
  );
}

export default MainRouteNavigationScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* ================= 1. TOP RADAR BANNER ================= */
  topRadarBanner: {
    backgroundColor: '#E0F2FE',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  pulseDotContainer: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radarPulseRing: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0284C7',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
  },
  radarLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
    letterSpacing: -0.1,
  },
  radarStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
  },
  radarStatusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },

  /* ================= 2. VECTOR MAP CANVAS ================= */
  mapCanvasContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },

  /* Layer Switcher (Top Left) */
  layerSwitcherContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 25,
  },
  floatingLayerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  layerOptionsDropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    width: 175,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  layerOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 8,
  },
  layerOptionItemActive: {
    backgroundColor: '#F0F9FF',
  },
  styleColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  layerOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  layerOptionTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },

  /* SOS Button (Top Right) */
  sosFloatingButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      default: {
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)',
      },
    }),
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* Recenter GPS Button (Bottom Right above sheet) */
  recenterGpsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
      },
    }),
  },

  mapLegendOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    flexDirection: 'row',
    gap: 8,
    zIndex: 20,
  },
  legendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendChipActiveSafe: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  legendChipActiveFast: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  legendColorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  legendTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },

  /* ================= 3.A IDLE SEARCH BOTTOM SHEET ================= */
  idleBottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    zIndex: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      default: {
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  idleSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  idleSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 2,
  },
  idleSearchSubmitBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  idleSearchSubmitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  savedPlacesContainer: {
    marginBottom: 10,
  },
  savedPlacesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  savedPlacesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  savedPlaceChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  savedPlaceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },
  hazardAlertPill: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  hazardAlertPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },

  /* ================= 3.B ROUTE COMPARISON BOTTOM SHEET ================= */
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    zIndex: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      default: {
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  sheetHandlePill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 10,
  },
  routePreviewHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeDestinationPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  routeDestinationLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  routeDestinationName: {
    fontWeight: '800',
    color: '#0F172A',
  },
  cancelPreviewBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cancelPreviewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },

  /* 3.1 Segmented Control */
  segmentedControlContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  segmentedButtonActive: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  segmentedButtonActiveAlert: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  segmentedButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentedButtonTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },
  segmentedButtonTextActiveAlert: {
    color: '#DC2626',
    fontWeight: '700',
  },

  /* 3.2 Route Header Summary */
  routeHeaderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  durationDistanceCol: {
    flex: 1,
  },
  durationHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  distanceSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  safetyScoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeSafeGreen: {
    backgroundColor: '#D1FAE5',
  },
  badgeWarningRed: {
    backgroundColor: '#FEE2E2',
  },
  safetyScoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreTextGreen: {
    color: '#059669',
  },
  scoreTextRed: {
    color: '#DC2626',
  },

  /* 3.3 Comparative Metrics Row */
  comparativeMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  metricCardLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  metricCardValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  textGreenHighlight: {
    color: '#059669',
  },
  textRedHighlight: {
    color: '#DC2626',
  },

  /* 3.4 Action Button */
  actionButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonSafe: {
    backgroundColor: '#0284C7',
  },
  actionButtonWarning: {
    backgroundColor: '#DC2626',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
