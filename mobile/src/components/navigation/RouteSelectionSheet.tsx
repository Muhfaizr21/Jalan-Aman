import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { RouteOptionType } from '@/types/navigation';

interface RouteSelectionSheetProps {
  selectedRoute: RouteOptionType;
  onSelectRoute: (route: RouteOptionType) => void;
  onShareTrip: () => void;
  onStartNavigation: () => void;
  isNavigating?: boolean;
  travelMode?: 'walk' | 'motor';
  safeDurationMin?: number;
  safeDistanceKm?: number;
  fastDurationMin?: number;
  fastDistanceKm?: number;
}

/* Security Shield Mini Icon */
function SecurityShieldIcon({ size = 15, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.2}
      />
    </Svg>
  );
}

/* Check Verified Icon */
function CheckVerifiedIcon({ size = 13, color = DashboardTheme.colors.onPrimaryContainer }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Sun Icon */
function SunIcon({ size = 13, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={2} />
      <Path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* Shield Perk Icon */
function ShieldPerkIcon({ size = 13, color = '#00668A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}

/* CCTV Perk Icon */
function CctvPerkIcon({ size = 13, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 10l5-3v10l-5-3v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h10a1 1 0 011 1v2z"
        fill={color}
      />
    </Svg>
  );
}

/* Caution Lightbulb Icon */
function CautionLightIcon({ size = 13, color = '#9D4300' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2a7 7 0 00-4 12.7V17a1 1 0 001 1h6a1 1 0 001-1v-2.3A7 7 0 0012 2zM9 21h6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* Share Trip Icon */
function ShareTripIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Navigation Arrow Icon */
function NavigationArrowIcon({ size = 20, color = DashboardTheme.colors.onPrimaryContainer }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11l19-9-9 19-2-8-8-2z"
        fill={color}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * RouteSelectionSheet
 * Bottom drawer for comparing AI recommended safe route with fast route option,
 * safety score circular gauges, and quick trip sharing.
 */
export const RouteSelectionSheet: React.FC<RouteSelectionSheetProps> = ({
  selectedRoute,
  onSelectRoute,
  onShareTrip,
  onStartNavigation,
  isNavigating = false,
  travelMode = 'walk',
  safeDurationMin,
  safeDistanceKm,
  fastDurationMin,
  fastDistanceKm,
}) => {
  const actualSafeDuration = safeDurationMin ?? (travelMode === 'walk' ? 14 : 7);
  const actualSafeDistance = safeDistanceKm ?? (travelMode === 'walk' ? 2.1 : 2.5);
  const actualFastDuration = fastDurationMin ?? (travelMode === 'walk' ? 10 : 4);
  const actualFastDistance = fastDistanceKm ?? (travelMode === 'walk' ? 1.8 : 2.0);

  // Compute live ETA formatted HH:mm
  const formatEta = (addMinutes: number) => {
    const d = new Date(Date.now() + addMinutes * 60000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const safeEtaText = `Tiba ${formatEta(actualSafeDuration)} WIB`;
  const fastEtaText = `Tiba ${formatEta(actualFastDuration)} WIB`;
  const diffMinutes = Math.max(1, actualSafeDuration - actualFastDuration);

  return (
    <View style={styles.sheetContainer}>
      {/* Top Handle Drag Indicator */}
      <View style={styles.handleBar} />

      {/* Header: Overview & High Safety Badge */}
      <View style={styles.sheetHeaderRow}>
        <View>
          <Text style={styles.sheetSubtitle}>PILIHAN RUTE PERJALANAN</Text>
          <Text style={styles.sheetTitle}>Navigasi Terproteksi</Text>
        </View>
        <View style={styles.safetyPill}>
          <SecurityShieldIcon size={15} />
          <Text style={styles.safetyPillText}>Skor Aman Tinggi</Text>
        </View>
      </View>

      {/* Route Cards Container */}
      <View style={styles.cardsList}>
        {/* OPTION 1: Rute Rekomendasi Aman (Recommended Safe) */}
        <TouchableOpacity
          style={[
            styles.routeCard,
            selectedRoute === 'safe' ? styles.routeCardActiveSafe : styles.routeCardInactive,
          ]}
          onPress={() => onSelectRoute('safe')}
          activeOpacity={0.88}
        >
          {/* Subtle Glow Strip on Selected State */}
          {selectedRoute === 'safe' && <View style={styles.safeActiveStrip} />}

          <View style={styles.cardHeader}>
            <View style={styles.cardBadgeGroup}>
              <View style={styles.recommendedBadge}>
                <CheckVerifiedIcon size={12} />
                <Text style={styles.recommendedBadgeText}>Rute Rekomendasi Aman</Text>
              </View>
              <Text style={styles.viaText}>Via Koridor PJU & Safe Haven</Text>
            </View>

            {/* Circular Safety Score Gauge (96) */}
            <View style={styles.gaugeWrap}>
              <Svg width={36} height={36} viewBox="0 0 36 36">
                <Circle
                  cx={18}
                  cy={18}
                  r={15.9155}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth={3.5}
                />
                <Circle
                  cx={18}
                  cy={18}
                  r={15.9155}
                  fill="none"
                  stroke="#84CC16"
                  strokeWidth={3.5}
                  strokeDasharray="96, 100"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </Svg>
              <Text style={styles.gaugeScoreText}>96</Text>
            </View>
          </View>

          {/* Duration & Distance Metrics */}
          <View style={styles.metricsRow}>
            <Text style={styles.durationBig}>{actualSafeDuration}</Text>
            <Text style={styles.durationUnit}>mnt</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.distanceText}>{actualSafeDistance.toFixed(1)} km</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.etaSafeText}>{safeEtaText}</Text>
          </View>

          {/* Protection Perks */}
          <View style={styles.perksRow}>
            <View style={styles.perkChip}>
              <SunIcon size={13} />
              <Text style={styles.perkChipText}>100% Terang</Text>
            </View>
            <View style={styles.perkChip}>
              <ShieldPerkIcon size={13} />
              <Text style={styles.perkChipText}>2 Pos Pantau</Text>
            </View>
            <View style={styles.perkChip}>
              <CctvPerkIcon size={13} />
              <Text style={styles.perkChipText}>4 CCTV Aktif</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* OPTION 2: Rute Tercepat (Fast) */}
        <TouchableOpacity
          style={[
            styles.routeCard,
            selectedRoute === 'fast' ? styles.routeCardActiveFast : styles.routeCardInactive,
          ]}
          onPress={() => onSelectRoute('fast')}
          activeOpacity={0.88}
        >
          {selectedRoute === 'fast' && <View style={styles.fastActiveStrip} />}

          <View style={styles.cardHeader}>
            <View style={styles.cardBadgeGroup}>
              <View style={styles.fastBadge}>
                <Text style={styles.fastBadgeText}>Rute Tercepat</Text>
              </View>
              <Text style={styles.viaText}>Via Gg. Johar</Text>
            </View>

            {/* Circular Safety Score Gauge (72) */}
            <View style={styles.gaugeWrap}>
              <Svg width={36} height={36} viewBox="0 0 36 36">
                <Circle
                  cx={18}
                  cy={18}
                  r={15.9155}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth={3.5}
                />
                <Circle
                  cx={18}
                  cy={18}
                  r={15.9155}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth={3.5}
                  strokeDasharray="72, 100"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </Svg>
              <Text style={styles.gaugeScoreText}>72</Text>
            </View>
          </View>

          {/* Duration & Distance Metrics */}
          <View style={styles.metricsRow}>
            <Text style={styles.durationBig}>{actualFastDuration}</Text>
            <Text style={styles.durationUnit}>mnt</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.distanceText}>{actualFastDistance.toFixed(1)} km</Text>
            <Text style={styles.dotSeparator}>•</Text>
            <Text style={styles.etaSafeText}>{fastEtaText}</Text>
            <View style={styles.speedDiffBadge}>
              <Text style={styles.speedDiffText}>-{diffMinutes} mnt lebih cepat</Text>
            </View>
          </View>

          {/* Caution Alert */}
          <View style={styles.cautionRow}>
            <View style={styles.cautionChip}>
              <CautionLightIcon size={13} />
              <Text style={styles.cautionChipText}>1 Titik Penerangan Rusak</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionRow}>
        {/* Companion Trip Share Button */}
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={onShareTrip}
          activeOpacity={0.8}
          accessibilityLabel="Bagikan Perjalanan Langsung"
        >
          <ShareTripIcon size={20} />
        </TouchableOpacity>

        {/* Primary Start Navigation CTA */}
        <TouchableOpacity
          style={[
            styles.startNavBtn,
            isNavigating && styles.startNavBtnActive,
          ]}
          onPress={onStartNavigation}
          activeOpacity={0.9}
        >
          <Text style={styles.startNavText}>
            {isNavigating ? 'Navigasi Aktif' : 'Mulai Navigasi Aman'}
          </Text>
          <NavigationArrowIcon size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 28,
    marginTop: -28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 30,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 6,
  },
  sheetSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: DashboardTheme.colors.textMuted,
    letterSpacing: 0.8,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    marginTop: 2,
  },
  safetyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(132, 204, 22, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: DashboardTheme.radius.full,
    alignSelf: 'flex-start',
  },
  safetyPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: DashboardTheme.colors.primary,
  },
  cardsList: {
    gap: 10,
    marginBottom: 12,
  },
  routeCard: {
    width: '100%',
    borderRadius: 16,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
  },
  routeCardActiveSafe: {
    backgroundColor: '#FFFFFF',
    borderColor: '#84CC16',
    shadowColor: '#84CC16',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  routeCardActiveFast: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FD761A',
    shadowColor: '#FD761A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  routeCardInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  safeActiveStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  fastActiveStrip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#FD761A',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  cardBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DashboardTheme.radius.full,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: DashboardTheme.colors.onPrimaryContainer,
  },
  fastBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DashboardTheme.radius.full,
  },
  fastBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
  },
  viaText: {
    fontSize: 11,
    fontWeight: '500',
    color: DashboardTheme.colors.textSecondary,
  },
  gaugeWrap: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  gaugeScoreText: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  durationBig: {
    fontSize: 20,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    lineHeight: 24,
  },
  durationUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  dotSeparator: {
    color: DashboardTheme.colors.textMuted,
    marginHorizontal: 1,
  },
  distanceText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: DashboardTheme.colors.textSecondary,
  },
  etaSafeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  speedDiffBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  speedDiffText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
  },
  perksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 8,
  },
  perkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.7)',
  },
  perkChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  cautionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cautionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cautionChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9D4300',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  shareBtn: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startNavBtn: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: DashboardTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  startNavBtnActive: {
    backgroundColor: '#65A30D',
  },
  startNavText: {
    fontSize: 14,
    fontWeight: '800',
    color: DashboardTheme.colors.onPrimaryContainer,
  },
});
