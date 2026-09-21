import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface ProfileHeaderProps {
  onNotificationPress?: () => void;
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
function BellIcon({ size = 21, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
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

/* Settings Gear Vector Icon */
function SettingsGearIcon({ size = 20, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onNotificationPress,
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
            <Text style={styles.brandSubtitle}>Profile</Text>
          </View>
        </View>

        {/* Right Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Pengaturan Sistem"
          >
            <SettingsGearIcon size={20} />
          </TouchableOpacity>

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

          <View style={styles.profileAvatarWrapper}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          </View>
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
  profileAvatarWrapper: {
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
