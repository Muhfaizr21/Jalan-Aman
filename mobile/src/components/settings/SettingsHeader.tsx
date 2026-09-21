import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface SettingsHeaderProps {
  onBackPress?: () => void;
  title?: string;
  subtitle?: string;
  statusBadge?: string;
}

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

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onBackPress,
  title = 'Pengaturan Sistem',
  subtitle = 'Konfigurasi perangkat & data lokal',
  statusBadge = 'Hemat Daya Siaga',
}) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  const topPadding = Math.max(insets.top, statusBarHeight) + (Platform.OS === 'android' ? 8 : 12);

  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.contentRow}>
        {/* Left: Back Button & Title */}
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
            accessibilityLabel="Kembali ke halaman sebelumnya"
            accessibilityRole="button"
          >
            <ArrowBackIcon size={20} />
          </TouchableOpacity>

          <View style={styles.titleWrapper}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.subtitleText} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>

        {/* Right: Power Saving Badge */}
        <View style={styles.badgeWrap}>
          <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
          <Text style={styles.badgeText}>{statusBadge}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  titleWrapper: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
});
