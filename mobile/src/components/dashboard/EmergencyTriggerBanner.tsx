import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface EmergencyTriggerBannerProps {
  onPress?: () => void;
}

/* Crisis Alert / Emergency Beacon Icon */
function CrisisAlertIcon({ size = 24, color = DashboardTheme.colors.primaryFixed }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" fill={color} />
      <Path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* Chevron Right Icon */
function ChevronRightIcon({ size = 20, color = DashboardTheme.colors.onPrimaryContainer }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const EmergencyTriggerBanner: React.FC<EmergencyTriggerBannerProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.bannerContainer}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel="Pemicu Darurat di Perjalanan. Buka Bantuan SOS Instan"
    >
      <View style={styles.leftRow}>
        <View style={styles.iconCircle}>
          <CrisisAlertIcon size={24} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.bannerTitle}>Darurat di Perjalanan?</Text>
          <Text style={styles.bannerSubtitle}>
            Tekan tombol SOS di bawah untuk bantuan instan
          </Text>
        </View>
      </View>
      <ChevronRightIcon size={22} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    backgroundColor: DashboardTheme.colors.primaryContainer,
    borderRadius: DashboardTheme.radius.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    ...DashboardTheme.shadows.sosGlow,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DashboardTheme.colors.onPrimaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    gap: 3,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DashboardTheme.colors.onPrimaryContainer,
    letterSpacing: -0.2,
  },
  bannerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(49, 82, 0, 0.85)',
    lineHeight: 16,
  },
});
