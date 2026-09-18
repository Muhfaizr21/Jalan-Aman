import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Rect,
  Text as SvgText,
  G,
  Polygon,
} from 'react-native-svg';

export interface ActiveSafeNavigationHUDProps {
  onStopNavigation: () => void;
  onOpenShelters?: () => void;
  onOpenSOS?: () => void;
  speed?: number;
}

/* ================= VECTOR ICONS ================= */
function ArrowTurnRightUpIcon({ color = '#06B6D4', size = 32 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 19v-6a4 4 0 014-4h9"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 5l4 4-4 4"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AlertOctagonIcon({ color = '#FFFFFF', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
      />
      <Path d="M12 8v4" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1.2" fill="#DC2626" />
    </Svg>
  );
}

function CompassNorthIcon({ color = '#0284C7', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Polygon points="12,6 15,14 12,12 9,14" fill={color} />
      <Polygon points="12,18 9,10 12,12 15,10" fill="#94A3B8" />
    </Svg>
  );
}

function ShieldMiniIcon({ color = '#059669', size = 13 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.2"
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

export function ActiveSafeNavigationHUD({
  onStopNavigation,
  onOpenShelters,
  onOpenSOS,
  speed: initialSpeed = 38,
}: ActiveSafeNavigationHUDProps) {
  const insets = useSafeAreaInsets();
  const [currentSpeed, setCurrentSpeed] = useState(initialSpeed);

  // Animated pulse for user heading cone
  const headingPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(headingPulseAnim, {
          toValue: 1.25,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(headingPulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    const speedInterval = setInterval(() => {
      setCurrentSpeed(Math.floor(36 + Math.random() * 6));
    }, 3000);

    return () => {
      loop.stop();
      clearInterval(speedInterval);
    };
  }, [headingPulseAnim]);

  return (
    <View style={styles.container} testID="ActiveSafeNavigationHUD">
      {/* ================= 1. VECTOR MAP VIEWPORT (3D DRIVING VIEW) ================= */}
      <View style={styles.mapViewportContainer}>
        <Svg width="100%" height="100%" viewBox="0 0 390 620" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <LinearGradient id="hudRouteGlow" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
            </LinearGradient>

            <LinearGradient id="hudRouteGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor="#06B6D4" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0284C7" stopOpacity="1" />
            </LinearGradient>

            <LinearGradient id="hudHeadingCone" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor="#0284C7" stopOpacity="0.4" />
              <Stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </LinearGradient>

            <LinearGradient id="hudRoadSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.9" />
              <Stop offset="100%" stopColor="#E2E8F0" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Perspective Ground */}
          <Rect x="0" y="0" width="390" height="620" fill="#F1F5F9" />

          {/* Urban Polygons */}
          <Polygon points="0,0 130,180 0,260" fill="#EEF2F6" />
          <Polygon points="390,0 260,180 390,260" fill="#EEF2F6" />
          <Polygon points="0,290 110,310 0,460" fill="#EEF2F6" />
          <Polygon points="390,290 280,310 390,460" fill="#EEF2F6" />

          {/* Green Boulevard Trees */}
          <Polygon points="100,180 125,180 80,450 45,450" fill="#DCFCE7" />
          <Polygon points="265,180 290,180 345,450 310,450" fill="#DCFCE7" />

          {/* 3D Tilted Driving Roadway */}
          <Polygon
            points="140,140 250,140 330,620 60,620"
            fill="url(#hudRoadSurface)"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />

          {/* Side Street (Jl. Mayor Dasuki) */}
          <Polygon
            points="220,240 390,200 390,260 235,275"
            fill="#E2E8F0"
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          <SvgText x="320" y="228" fill="#0284C7" fontSize="9" fontWeight="700" textAnchor="middle">
            Jl. Mayor Dasuki ➔
          </SvgText>

          {/* Lane Center Dashes */}
          <Path
            d="M 195 150 L 195 180 M 195 200 L 195 235 M 195 260 L 195 305 M 195 335 L 195 390 M 195 425 L 195 490 M 195 530 L 195 610"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeDasharray="14,10"
          />

          {/* PJU Glowing Indicators */}
          <Circle cx="120" cy="220" r="3" fill="#F59E0B" />
          <Circle cx="105" cy="300" r="4" fill="#F59E0B" />
          <Circle cx="85" cy="390" r="5" fill="#F59E0B" />
          <Circle cx="65" cy="490" r="6" fill="#F59E0B" />

          <Circle cx="270" cy="220" r="3" fill="#F59E0B" />
          <Circle cx="285" cy="300" r="4" fill="#F59E0B" />
          <Circle cx="305" cy="390" r="5" fill="#F59E0B" />
          <Circle cx="325" cy="490" r="6" fill="#F59E0B" />

          {/* Danger Cluster Hotspot */}
          <G transform="translate(60, 260)">
            <Circle
              cx="0"
              cy="0"
              r="34"
              fill="#FEE2E2"
              fillOpacity="0.4"
              stroke="#DC2626"
              strokeWidth="1.8"
              strokeDasharray="4,3"
            />
            <Circle cx="0" cy="0" r="6" fill="#DC2626" />
            <Rect x="-45" y="-24" width="90" height="15" rx="3" fill="#DC2626" />
            <SvgText x="0" y="-14" fill="#FFFFFF" fontSize="7" fontWeight="800" textAnchor="middle">
              ⚠️ GANG GELAP (BEGAL)
            </SvgText>
          </G>

          {/* Safe Haven indicator: Polsek Jatibarang (320m) */}
          <G transform="translate(340, 245)">
            <Circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
            <SvgText x="0" y="4" fill="#0284C7" fontSize="8" fontWeight="800" textAnchor="middle">
              POL
            </SvgText>
            <Rect x="-26" y="-20" width="52" height="12" rx="3" fill="#0284C7" />
            <SvgText x="0" y="-11" fill="#FFFFFF" fontSize="6.5" fontWeight="700" textAnchor="middle">
              POLSEK (320m)
            </SvgText>
          </G>

          {/* Active Navigation Polyline Glow & Ribbon */}
          <Path
            d="M 195 540 L 195 260 Q 195 245 220 240 L 380 220"
            stroke="url(#hudRouteGlow)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M 195 540 L 195 260 Q 195 245 220 240 L 380 220"
            stroke="url(#hudRouteGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* User Heading Radar Light Cone */}
          <Polygon points="195,540 145,430 245,430" fill="url(#hudHeadingCone)" />

          {/* User Puck Cursor */}
          <G transform="translate(195, 540)">
            <Circle cx="0" cy="0" r="22" fill="#0284C7" fillOpacity="0.2" />
            <Circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
            <Polygon points="0,-8 7,6 0,3 -7,6" fill="#0284C7" />
          </G>
        </Svg>

        {/* Speedometer & Compass Overlay */}
        <View style={styles.speedometerContainer}>
          <Text style={styles.speedNumber}>{currentSpeed}</Text>
          <Text style={styles.speedUnit}>KM/H</Text>
          <View style={styles.compassRow}>
            <CompassNorthIcon color="#0284C7" size={12} />
            <Text style={styles.compassText}>UTARA</Text>
          </View>
        </View>

        {/* Quick Floating SOS Button */}
        {onOpenSOS && (
          <TouchableOpacity
            style={styles.floatingSOSButton}
            onPress={onOpenSOS}
            activeOpacity={0.85}
            accessibilityLabel="Quick SOS Trigger"
            accessibilityRole="button"
          >
            <AlertOctagonIcon color="#FFFFFF" size={24} />
            <Text style={styles.sosQuickText}>SOS</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ================= 2. TOP DIRECTION HUD CARD ================= */}
      <SafeAreaView
        style={styles.headerSafeArea}
        edges={['top']}
        testID="top-direction-hud-card"
        accessibilityLabel="Top Direction HUD Card"
      >
        <View style={styles.turnByTurnHUDCard}>
          <View style={styles.directionInstructionRow}>
            <View style={styles.directionIconBox}>
              <ArrowTurnRightUpIcon color="#06B6D4" size={32} />
            </View>

            <View style={styles.instructionTextCol}>
              <Text style={styles.distanceToTurn}>150 m</Text>
              <Text style={styles.instructionText} numberOfLines={2}>
                Belok Kanan ke Jl. Mayor Dasuki (Jalur Terang)
              </Text>
            </View>
          </View>

          <View style={styles.hudFooterRow}>
            <View style={styles.safetyStatusPill}>
              <View style={styles.liveGreenDot} />
              <ShieldMiniIcon color="#059669" size={13} />
              <Text style={styles.safetyStatusLabel}>Koridor Aman PJU Aktif</Text>
            </View>

            <Text style={styles.satelliteLiveText}>● GPS Akurat (3m)</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ================= 3. BOTTOM TRIP TELEMETRY SUMMARY ================= */}
      <View
        style={[
          styles.bottomTelemetryBar,
          { paddingBottom: Math.max(insets.bottom, 12) + 8 },
        ]}
        testID="bottom-trip-telemetry-summary"
        accessibilityLabel="Bottom Trip Telemetry Summary"
      >
        {/* Metrics Row */}
        <View style={styles.metricsSummaryRow}>
          <View style={styles.etaBlock}>
            <Text style={styles.etaTimeText}>22.45</Text>
            <Text style={styles.etaSubtext}>Estimasi Tiba (ETA)</Text>
          </View>

          <View style={styles.telemetryDivider} />

          <View style={styles.telemetryMiniCol}>
            <Text style={styles.telemetryValueText}>14 mnt</Text>
            <Text style={styles.telemetryLabelText}>Waktu Tempuh</Text>
          </View>

          <View style={styles.telemetryDivider} />

          <View style={styles.telemetryMiniCol}>
            <Text style={styles.telemetryValueText}>4.8 km</Text>
            <Text style={styles.telemetryLabelText}>Sisa Jarak</Text>
          </View>

          <View style={styles.telemetryDivider} />

          <View style={styles.safetyRatingBadge}>
            <Text style={styles.safetyRatingNumber}>96/100</Text>
            <Text style={styles.safetyRatingLabel}>Skor Aman</Text>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.stopNavButton}
            onPress={onStopNavigation}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Hentikan Navigasi"
          >
            <Text style={styles.stopNavButtonText}>Akhiri Perjalanan</Text>
          </TouchableOpacity>

          {onOpenShelters && (
            <TouchableOpacity
              style={styles.rerouteShelterButton}
              onPress={onOpenShelters}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Cari Shelter Darurat"
            >
              <ShieldMiniIcon color="#FFFFFF" size={15} />
              <Text style={styles.rerouteShelterButtonText}>Cari Shelter Darurat</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default ActiveSafeNavigationHUD;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  mapViewportContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F1F5F9',
  },
  speedometerContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      },
    }),
  },
  speedNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  speedUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  compassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  compassText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
  },
  floatingSOSButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {
        boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
      },
    }),
  },
  sosQuickText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 1,
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  turnByTurnHUDCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#334155',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
      default: {
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  directionInstructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  directionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  instructionTextCol: {
    flex: 1,
  },
  distanceToTurn: {
    fontSize: 20,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: -0.5,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  hudFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  safetyStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  safetyStatusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  satelliteLiveText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  bottomTelemetryBar: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 14,
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      default: {
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  metricsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  etaBlock: {
    alignItems: 'flex-start',
  },
  etaTimeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  etaSubtext: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  telemetryDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  telemetryMiniCol: {
    alignItems: 'center',
  },
  telemetryValueText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  telemetryLabelText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  safetyRatingBadge: {
    alignItems: 'flex-end',
  },
  safetyRatingNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
  },
  safetyRatingLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    marginTop: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stopNavButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stopNavButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  rerouteShelterButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  rerouteShelterButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
