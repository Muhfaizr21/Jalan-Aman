import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type RouteType = 'safe' | 'fast';

export function MainRouteNavigationScreen() {
  const insets = useSafeAreaInsets();
  const [selectedRoute, setSelectedRoute] = useState<RouteType>('safe');
  const [isNavigating, setIsNavigating] = useState(false);

  // Pulse animation for TopRadarBanner dot
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

  // SOS Emergency Handler
  const handleSOSPress = () => {
    router.push('/sos');
  };

  // Toggle Navigation Mode
  const handleStartNavigation = () => {
    if (isNavigating) {
      setIsNavigating(false);
      Alert.alert('Navigasi Dihentikan', 'Sesi panduan perjalanan telah selesai.');
    } else {
      setIsNavigating(true);
      if (selectedRoute === 'safe') {
        Alert.alert(
          '🛡️ Navigasi Aman Aktif',
          'Rute dipandu melalui Koridor Arteri Utama dengan 92% penerangan jalan aktif dan melewati 3 shelter pengamanan.',
          [{ text: 'Mulai Meluncur' }]
        );
      } else {
        Alert.alert(
          '⚠️ Peringatan Risiko Tinggi',
          'Anda memilih rute tercepat namun melintasi 2 titik rawan begal dan minim penerangan. Radar Geofence tetap aktif mengawal Anda.',
          [{ text: 'Lanjutkan dengan Waspada' }]
        );
      }
    }
  };

  // Dynamic Route Data
  const isSafe = selectedRoute === 'safe';
  const durationText = isSafe ? '18 mins' : '15 mins';
  const distanceText = isSafe
    ? '6.2 km via Main Arterial Corridor'
    : '5.1 km via Dark Shortcut Gang';
  const safetyScoreText = isSafe ? 'Safety Score: 96/100' : 'Safety Score: 38/100';
  const streetlightValue = isSafe ? '92% Illuminated' : '38% Illuminated';
  const riskClustersValue = isSafe ? '2 Hotspots Avoided' : '2 Hotspots Crossed';
  const sheltersValue = isSafe ? '3 Locations' : '0 Shelters';
  const actionButtonText = isNavigating
    ? 'Hentikan Navigasi'
    : isSafe
    ? 'Start Safe Navigation'
    : 'Start Navigation (High Risk)';

  return (
    <SafeAreaView style={styles.screenContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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

      {/* ================= 2. VECTOR MAP CANVAS ================= */}
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
              <Stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.25" />
            </LinearGradient>
          </Defs>

          {/* Minimalist Cartography Background */}
          <Rect x="0" y="0" width="390" height="420" fill="#F8FAFC" />

          {/* Urban Map City Blocks (Minimalist Gray Shapes) */}
          <Rect x="20" y="30" width="70" height="60" rx="6" fill="#EEF2F6" stroke="#E2E8F0" strokeWidth="1" />
          <Rect x="105" y="25" width="85" height="50" rx="6" fill="#EEF2F6" stroke="#E2E8F0" strokeWidth="1" />
          <Rect x="285" y="35" width="80" height="55" rx="6" fill="#EEF2F6" stroke="#E2E8F0" strokeWidth="1" />

          <Rect x="15" y="115" width="65" height="70" rx="6" fill="#EEF2F6" stroke="#E2E8F0" strokeWidth="1" />
          <Rect x="300" y="110" width="75" height="75" rx="6" fill="#EEF2F6" stroke="#E2E8F0" strokeWidth="1" />

          <Rect x="25" y="235" width="75" height="60" rx="6" fill="#EEF2F6" stroke="#E2E8F0" strokeWidth="1" />
          <Rect x="290" y="225" width="80" height="70" rx="6" fill="#EEF2F6" stroke="#E2E8F0" strokeWidth="1" />

          {/* Green Community Park Zone */}
          <Rect x="110" y="240" width="60" height="50" rx="8" fill="#F0FDF4" stroke="#DCFCE7" strokeWidth="1" />
          <SvgText x="140" y="268" fill="#16A34A" fontSize="9" fontWeight="600" textAnchor="middle">
            TAMAN KOTA
          </SvgText>

          {/* River / Water Canal */}
          <Path
            d="M -10 330 C 90 310, 180 340, 270 315 C 330 300, 370 320, 410 310"
            stroke="#E0F2FE"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
          />

          {/* Minor Road Grid Lines */}
          <Path d="M 0 100 L 390 100" stroke="#F1F5F9" strokeWidth="10" />
          <Path d="M 0 205 L 390 205" stroke="#F1F5F9" strokeWidth="12" />
          <Path d="M 95 0 L 95 420" stroke="#F1F5F9" strokeWidth="10" />
          <Path d="M 285 0 L 285 420" stroke="#F1F5F9" strokeWidth="10" />

          {/* Secondary Street Arteries */}
          <Path d="M 195 20 L 195 400" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />
          <Path d="M 20 150 Q 200 130 370 150" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />

          {/* Danger Cluster Hotspot (Red Warning Perimeter) */}
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

          {/* Standard Shortest Route (Dashed Line) */}
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

          {/* Safe Route (Glow Layer when active) */}
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

          {/* Jalan Aman Route (Solid Vibrant Cyan-to-Blue Gradient Path) */}
          <Path
            d="M 50 310 C 90 310, 100 240, 160 220 C 230 200, 270 205, 300 160 C 320 130, 310 90, 340 70"
            stroke="url(#safeRouteGradient)"
            strokeWidth={isSafe ? 5 : 3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={isSafe ? 1 : 0.45}
          />

          {/* Active Safe Shelters on Safe Route */}
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

          {/* Origin Pin (Titik Awal) */}
          <G transform="translate(50, 310)">
            <Circle cx="0" cy="0" r="14" fill="#0284C7" fillOpacity="0.2" />
            <Circle cx="0" cy="0" r="8" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2.5" />
            <Rect x="-36" y="14" width="72" height="18" rx="4" fill="#0F172A" />
            <SvgText x="0" y="26" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">
              LOKASI AWAL
            </SvgText>
          </G>

          {/* Destination Pin (Titik Tujuan) */}
          <G transform="translate(340, 70)">
            <Circle cx="0" cy="0" r="15" fill="#059669" fillOpacity="0.2" />
            <Circle cx="0" cy="0" r="8" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
            <Rect x="-28" y="-26" width="56" height="18" rx="4" fill="#059669" />
            <SvgText x="0" y="-14" fill="#FFFFFF" fontSize="8" fontWeight="700" textAnchor="middle">
              TUJUAN 🏠
            </SvgText>
          </G>
        </Svg>

        {/* Floating Emergency SOS Button (Top Right) */}
        <TouchableOpacity
          style={styles.sosFloatingButton}
          onPress={handleSOSPress}
          activeOpacity={0.85}
          accessibilityLabel="Emergency SOS Button"
        >
          <Text style={styles.sosButtonText}>SOS</Text>
        </TouchableOpacity>

        {/* Map Interactive Legend Chip */}
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
      </View>

      {/* ================= 3. ROUTE COMPARISON BOTTOM SHEET ================= */}
      <View
        style={[
          styles.bottomSheetContainer,
          { paddingBottom: Math.max(insets.bottom, 16) + 8 },
        ]}
      >
        {/* Grabber Handle Pill */}
        <View style={styles.sheetHandlePill} />

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
          {/* Metric 1: Streetlight Density */}
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

          {/* Metric 2: Risk Clusters Avoided */}
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

          {/* Metric 3: Active Safe Shelters */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/shelters')}
            activeOpacity={0.75}
          >
            <Text style={styles.metricCardLabel}>Active Safe Shelters ↗</Text>
            <Text style={[styles.metricCardValue, { color: '#0284C7' }]}>{sheltersValue}</Text>
          </TouchableOpacity>
        </View>

        {/* 3.4 Main Navigation Action Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            isNavigating
              ? styles.actionButtonNavigating
              : isSafe
              ? styles.actionButtonSafe
              : styles.actionButtonWarning,
          ]}
          onPress={handleStartNavigation}
          activeOpacity={0.88}
        >
          <Text style={styles.actionButtonText}>{actionButtonText}</Text>
        </TouchableOpacity>
      </View>
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
    // Elevation & Shadow
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
  mapLegendOverlay: {
    position: 'absolute',
    bottom: 12,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
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

  /* ================= 3. ROUTE COMPARISON BOTTOM SHEET ================= */
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
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
    marginBottom: 14,
  },

  /* 3.1 Segmented Control */
  segmentedControlContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
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
    marginBottom: 16,
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
    marginBottom: 18,
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
  actionButtonNavigating: {
    backgroundColor: '#0F172A',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
