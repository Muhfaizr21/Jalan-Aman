import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface DashboardHeaderProps {
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  avatarUrl?: string;
  hasUnreadNotifications?: boolean;
}

/* Shield With Heart Vector Icon */
function ShieldHeartIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
        fill={DashboardTheme.colors.primaryFixed}
        opacity={0.35}
      />
      <Path
        d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8.5c-.83-.83-2.17-.83-3 0s-.83 2.17 0 3L12 14.5l3-3c.83-.83.83-2.17 0-3s-2.17-.83-3 0z"
        fill={color}
      />
    </Svg>
  );
}

/* Notification Bell Vector Icon */
function BellIcon({ size = 22, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onNotificationPress,
  onProfilePress,
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  hasUnreadNotifications = true,
}) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const topPadding = Math.max(insets.top, statusBarHeight) + (Platform.OS === 'android' ? 8 : 12);

  return (
    <View style={[styles.headerContainer, { paddingTop: topPadding }]}>
      <View style={styles.headerContent}>
        {/* Brand Identity */}
        <View style={styles.brandRow}>
          <View style={styles.iconCircle}>
            <ShieldHeartIcon size={20} />
          </View>
          <View style={styles.brandTextWrapper}>
            <Text style={styles.brandTitle}>JalanAman</Text>
            <Text style={styles.brandSubtitle}>Radar</Text>
          </View>
        </View>

        {/* Right Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Notifikasi Keselamatan"
          >
            <BellIcon size={21} />
            {hasUnreadNotifications && <View style={styles.unreadBadge} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={onProfilePress}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Buka Profil Pengguna"
          >
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: DashboardTheme.colors.surfaceCardTranslucent,
    borderBottomWidth: 1,
    borderBottomColor: DashboardTheme.colors.borderCard,
    zIndex: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      },
    }),
  },
  headerContent: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(132, 204, 22, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
    marginTop: 1,
    letterSpacing: 0.2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(240, 243, 255, 0.6)',
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: DashboardTheme.colors.semanticAlert,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
  },
});
