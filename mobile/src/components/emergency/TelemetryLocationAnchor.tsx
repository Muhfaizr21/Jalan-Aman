import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { TelemetryLocationData } from '@/types/emergencyCenter';

interface TelemetryLocationAnchorProps {
  location?: TelemetryLocationData;
  onRefreshLocation?: () => void;
}

function MyLocationIcon({ size = 18, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={2} />
      <Path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function LocationPinIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export const TelemetryLocationAnchor: React.FC<TelemetryLocationAnchorProps> = ({
  location = {
    address: 'Jl. Mayor Dasuki No. 8',
    district: 'Jatibarang, Indramayu • Titik Presisi Terkunci',
    accuracyMeters: 3,
    statusText: 'GPS Akurasi Tinggi: 3m • Siaga Darurat',
  },
  onRefreshLocation,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusRow}>
        <View style={styles.pillBadge}>
          <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
          <Text style={styles.pillText}>{location.statusText}</Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={onRefreshLocation}
          activeOpacity={0.7}
          accessibilityLabel="Perbarui Lokasi Presisi"
          accessibilityRole="button"
        >
          <MyLocationIcon size={18} />
        </TouchableOpacity>
      </View>

      {/* Location Details */}
      <View style={styles.locationDetailsRow}>
        <View style={styles.iconBox}>
          <LocationPinIcon size={20} />
        </View>
        <View style={styles.addressCol}>
          <Text style={styles.addressTitle} numberOfLines={1}>
            {location.address}
          </Text>
          <Text style={styles.districtSubtitle} numberOfLines={1}>
            {location.district}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 24,
    padding: 16,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.semanticAlertBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 6,
  },
  pulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: DashboardTheme.colors.semanticAlert,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticAlert,
    letterSpacing: 0.2,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressCol: {
    flex: 1,
    justifyContent: 'center',
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  districtSubtitle: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
  },
});
