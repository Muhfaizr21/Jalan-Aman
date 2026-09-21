import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface VerifiedStatusBannerProps {
  verifiedCount?: number;
  radiusKm?: number;
}

function VerifiedUserIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const VerifiedStatusBanner: React.FC<VerifiedStatusBannerProps> = ({
  verifiedCount = 14,
  radiusKm = 2,
}) => {
  return (
    <View style={styles.bannerContainer}>
      <View style={styles.leftCol}>
        <View style={styles.iconBox}>
          <VerifiedUserIcon size={20} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.titleText} numberOfLines={1}>
            {verifiedCount} Laporan Terverifikasi
          </Text>
          <Text style={styles.subtitleText} numberOfLines={1}>
            Aktif dalam radius {radiusKm} km hari ini
          </Text>
        </View>
      </View>

      <View style={styles.liveBadge}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>Live</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    ...DashboardTheme.shadows.card,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  titleText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  subtitleText: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textSecondary,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: DashboardTheme.radius.full,
    flexShrink: 0,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DashboardTheme.colors.onPrimaryContainer,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: DashboardTheme.colors.onPrimaryContainer,
  },
});
