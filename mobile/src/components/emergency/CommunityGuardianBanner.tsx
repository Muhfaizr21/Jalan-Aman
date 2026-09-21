import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface CommunityGuardianBannerProps {
  contactsCount?: number;
  guardianName?: string;
}

function RecordVoiceOverIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="9" r="4" stroke={color} strokeWidth={2} />
      <Path
        d="M9 15c-4 0-7 2.5-7 5v1h14v-1c0-2.5-3-5-7-5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M17 9c.5.8.8 1.9.8 3s-.3 2.2-.8 3M20 7c.8 1.4 1.3 3.1 1.3 5s-.5 3.6-1.3 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export const CommunityGuardianBanner: React.FC<CommunityGuardianBannerProps> = ({
  contactsCount = 3,
  guardianName,
}) => {
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <View style={styles.iconCircle}>
          <RecordVoiceOverIcon size={20} />
        </View>
        <View style={styles.textCol}>
          <Text style={styles.title}>Guardian Relay Aktif</Text>
          <Text style={styles.subtitle}>
            {guardianName
              ? `${guardianName} & ${Math.max(contactsCount - 1, 1)} kontak darurat siaga otomatis`
              : `${contactsCount} kontak darurat & pos siaga terhubung otomatis`}
          </Text>
        </View>
      </View>

      <Animated.View style={[styles.activeDot, { opacity: pulseAnim }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: 'rgba(222, 232, 255, 0.65)',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
});
