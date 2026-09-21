import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname, router } from 'expo-router';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { DashboardTabId } from '@/types/dashboard';

interface DashboardBottomNavProps {
  activeTab?: DashboardTabId;
  onTabPress?: (tabId: DashboardTabId) => void;
  onSosPress?: () => void;
}

/* Radar Wave Icon */
function RadarIcon({ size = 22, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        stroke={color}
        strokeWidth={2}
      />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
      <Path d="M12 12l5-5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/* Route Navigation Icon */
function RouteIcon({ size = 22, color = DashboardTheme.colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="19" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} />
      <Path
        d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* Emergency SOS Icon */
function SosEmergencyIcon({ size = 26, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2.4} />
      <Path
        d="M12 8v5M12 16h.01"
        stroke={color}
        strokeWidth={2.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* Forum Feed Icon */
function FeedChatIcon({ size = 22, color = DashboardTheme.colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Profile Person Icon */
function PersonIcon({ size = 22, color = DashboardTheme.colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export const DashboardBottomNav: React.FC<DashboardBottomNavProps> = ({
  activeTab: explicitActiveTab,
  onTabPress,
  onSosPress,
}) => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Determine active tab: prefer explicit prop, or infer automatically from current route path
  const resolvedActiveTab: DashboardTabId = (() => {
    if (explicitActiveTab) return explicitActiveTab;
    if (pathname && pathname.includes('/radar')) return 'radar';
    if (!pathname || pathname === '/' || pathname === '/index' || pathname.includes('/navigation')) return 'routes';
    if (pathname.includes('/explore')) return 'feed';
    if (pathname.includes('/profile') || pathname.includes('/settings')) return 'profile';
    return 'routes';
  })();

  // Subtle breathing pulse for the center SOS button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [pulseAnim]);

  const handleTab = (id: DashboardTabId) => {
    if (onTabPress) {
      onTabPress(id);
    } else {
      if (id === 'routes') {
        router.push('/');
      } else if (id === 'radar') {
        router.push('/radar');
      } else if (id === 'feed') {
        router.push('/explore');
      } else if (id === 'profile') {
        router.push('/profile');
      }
    }
  };

  const isTabActive = (tab: DashboardTabId) => resolvedActiveTab === tab;

  return (
    <View
      style={[
        styles.fixedWrapper,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
      pointerEvents="box-none"
    >
      {/* Sleek transparent backdrop gradient for GIS map */}
      <Svg
        width="100%"
        height={90}
        style={styles.navBackdropSvg}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="navFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="transparent" />
            <Stop offset="40%" stopColor="rgba(11, 15, 25, 0.35)" />
            <Stop offset="100%" stopColor="rgba(11, 15, 25, 0.85)" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#navFade)" />
      </Svg>

      <View style={styles.floatingPill}>
        {/* Tab 1: Routes (Peta Navigasi Langsung Saat Login) */}
        <TouchableOpacity
          style={[styles.tabButton, isTabActive('routes') && styles.tabButtonActive]}
          onPress={() => handleTab('routes')}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityState={{ selected: isTabActive('routes') }}
        >
          <View style={[styles.iconWrap, isTabActive('routes') && styles.iconWrapActive]}>
            <RouteIcon
              size={20}
              color={
                isTabActive('routes')
                  ? DashboardTheme.colors.onPrimaryContainer
                  : DashboardTheme.colors.textMuted
              }
            />
          </View>
          <Text
            style={[
              styles.tabText,
              isTabActive('routes') && styles.tabTextActive,
            ]}
          >
            Rute
          </Text>
          {isTabActive('routes') && <View style={styles.activeIndicatorPill} />}
        </TouchableOpacity>

        {/* Tab 2: Radar (Command Center & Wawasan Wilayah) */}
        <TouchableOpacity
          style={[styles.tabButton, isTabActive('radar') && styles.tabButtonActive]}
          onPress={() => handleTab('radar')}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityState={{ selected: isTabActive('radar') }}
        >
          <View style={[styles.iconWrap, isTabActive('radar') && styles.iconWrapActive]}>
            <RadarIcon
              size={20}
              color={
                isTabActive('radar')
                  ? DashboardTheme.colors.onPrimaryContainer
                  : DashboardTheme.colors.textMuted
              }
            />
          </View>
          <Text
            style={[
              styles.tabText,
              isTabActive('radar') && styles.tabTextActive,
            ]}
          >
            Radar
          </Text>
          {isTabActive('radar') && <View style={styles.activeIndicatorPill} />}
        </TouchableOpacity>

        {/* Center Raised SOS Floating Action Button */}
        <View style={styles.sosAnchor}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.sosButton}
              onPress={onSosPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Tombol Darurat SOS Cepat"
            >
              <SosEmergencyIcon size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Tab 4: Feed */}
        <TouchableOpacity
          style={[styles.tabButton, isTabActive('feed') && styles.tabButtonActive]}
          onPress={() => handleTab('feed')}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityState={{ selected: isTabActive('feed') }}
        >
          <View style={[styles.iconWrap, isTabActive('feed') && styles.iconWrapActive]}>
            <FeedChatIcon
              size={20}
              color={
                isTabActive('feed')
                  ? DashboardTheme.colors.onPrimaryContainer
                  : DashboardTheme.colors.textMuted
              }
            />
          </View>
          <Text
            style={[
              styles.tabText,
              isTabActive('feed') && styles.tabTextActive,
            ]}
          >
            Feed
          </Text>
          {isTabActive('feed') && <View style={styles.activeIndicatorPill} />}
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          style={[styles.tabButton, isTabActive('profile') && styles.tabButtonActive]}
          onPress={() => handleTab('profile')}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityState={{ selected: isTabActive('profile') }}
        >
          <View style={[styles.iconWrap, isTabActive('profile') && styles.iconWrapActive]}>
            <PersonIcon
              size={20}
              color={
                isTabActive('profile')
                  ? DashboardTheme.colors.onPrimaryContainer
                  : DashboardTheme.colors.textMuted
              }
            />
          </View>
          <Text
            style={[
              styles.tabText,
              isTabActive('profile') && styles.tabTextActive,
            ]}
          >
            Profil
          </Text>
          {isTabActive('profile') && <View style={styles.activeIndicatorPill} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 90,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  navBackdropSvg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  floatingPill: {
    width: '100%',
    maxWidth: 420,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: DashboardTheme.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    ...DashboardTheme.shadows.floating,
  },
  tabButton: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: DashboardTheme.radius.full,
    paddingVertical: 2,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(22, 101, 52, 0.08)',
  },
  iconWrap: {
    width: 26,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    transform: [{ scale: 1.05 }],
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    color: DashboardTheme.colors.textMuted,
    marginTop: 1,
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#15803D',
  },
  activeIndicatorPill: {
    width: 14,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#15803D',
    marginTop: 2,
  },
  sosAnchor: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  sosButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
});
