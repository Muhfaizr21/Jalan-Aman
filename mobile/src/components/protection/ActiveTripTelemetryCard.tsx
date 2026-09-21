import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { TripTelemetryData } from '@/types/protection';

interface ActiveTripTelemetryCardProps {
  telemetry?: TripTelemetryData;
}

const DEFAULT_TELEMETRY: TripTelemetryData = {
  destinationTitle: 'Perjalanan Menuju Rumah',
  distanceKm: 2.4,
  etaMinutes: 14,
  speedKmh: 18,
  batteryPercent: 82,
  signalLabel: 'Kuat (5G)',
  isCorridorSafe: true,
};

function NearMeIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 3L3 10.53l7.91 2.56L13.47 21 21 3z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function VerifiedCheckSmallIcon({ size = 14, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l2.4 2.8 3.7-.4 1 3.5 3.3 1.7-1 3.5 1.7 3.3-2.6 2.6.4 3.7-3.5 1-1.7 3.3-3.5-1-3.3 1.7-2.6-2.6-3.7.4-1-3.5-3.3-1.7 1-3.5-1.7-3.3 2.6-2.6-.4-3.7 3.5-1 1.7-3.3 3.5 1z"
        fill={DashboardTheme.colors.semanticAccentBg}
        stroke={color}
        strokeWidth={1.5}
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function SpeedIcon({ size = 16, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2a10 10 0 0 0-10 10c0 3.6 1.9 6.8 4.8 8.5L12 15l5.2 5.5c2.9-1.7 4.8-4.9 4.8-8.5a10 10 0 0 0-10-10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M12 15l2-5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function BatteryIcon({ size = 16, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM21 11v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M5 10v4M8 10v4M11 10v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CellTowerIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="6" r="2" fill={color} />
      <Path
        d="M8.5 3a5 5 0 0 0 0 6M15.5 3a5 5 0 0 1 0 6M12 8v13M8 21l4-8 4 8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export const ActiveTripTelemetryCard: React.FC<ActiveTripTelemetryCardProps> = ({
  telemetry = DEFAULT_TELEMETRY,
}) => {
  return (
    <View style={styles.card}>
      {/* Route Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.routeLeft}>
          <View style={styles.iconBox}>
            <NearMeIcon size={20} />
          </View>
          <View style={styles.routeDetails}>
            <Text style={styles.destinationTitle} numberOfLines={1}>
              {telemetry.destinationTitle}
            </Text>
            <Text style={styles.distanceEtaText}>
              {telemetry.distanceKm} km • Est. {telemetry.etaMinutes} Menit lagi
            </Text>
          </View>
        </View>

        {/* Koridor Aman Verified Tag */}
        <View style={styles.safeCorridorTag}>
          <VerifiedCheckSmallIcon size={14} />
          <Text style={styles.safeCorridorText}>Koridor Aman</Text>
        </View>
      </View>

      {/* 3-Column Micro-Telemetry Grid */}
      <View style={styles.telemetryGrid}>
        {/* Metric 1: Kecepatan */}
        <View style={styles.telemetryItem}>
          <SpeedIcon size={15} />
          <View style={styles.telemetryTextCol}>
            <Text style={styles.telemetryVal}>{telemetry.speedKmh} km/j</Text>
            <Text style={styles.telemetryLbl}>Kecepatan</Text>
          </View>
        </View>

        {/* Metric 2: Daya HP */}
        <View style={styles.telemetryItem}>
          <BatteryIcon size={15} />
          <View style={styles.telemetryTextCol}>
            <Text style={styles.telemetryVal}>{telemetry.batteryPercent}%</Text>
            <Text style={styles.telemetryLbl}>Daya HP</Text>
          </View>
        </View>

        {/* Metric 3: Sinyal 5G */}
        <View style={styles.telemetryItem}>
          <CellTowerIcon size={15} />
          <View style={styles.telemetryTextCol}>
            <Text style={styles.telemetryVal}>{telemetry.signalLabel}</Text>
            <Text style={styles.telemetryLbl}>Sinyal 5G</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xxl,
    padding: 15,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  routeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 180,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: 'rgba(132, 204, 22, 0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDetails: {
    flex: 1,
    gap: 2,
  },
  destinationTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  distanceEtaText: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
  },
  safeCorridorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: DashboardTheme.radius.full,
  },
  safeCorridorText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 4,
  },
  telemetryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    borderRadius: DashboardTheme.radius.md,
    paddingHorizontal: 8,
    paddingVertical: 7,
    gap: 6,
    minWidth: 0,
  },
  telemetryTextCol: {
    flex: 1,
    minWidth: 0,
  },
  telemetryVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  telemetryLbl: {
    fontSize: 9.5,
    color: DashboardTheme.colors.textMuted,
    marginTop: 1,
  },
});
