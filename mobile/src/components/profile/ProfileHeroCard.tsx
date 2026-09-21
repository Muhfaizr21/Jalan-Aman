import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { TransportMode, UserProfileDetails } from '@/types/profile';

interface ProfileHeroCardProps {
  profile?: UserProfileDetails;
  onEditProfilePress?: () => void;
  onTransportModeChange?: (mode: TransportMode) => void;
}

const DEFAULT_PROFILE: UserProfileDetails = {
  name: 'Warga JalanAman',
  phone: '-',
  email: '-',
  avatarUrl: '',
  memberId: 'JA-WARGA-01',
  isKtpVerified: true,
  isActiveMember: true,
  selectedTransport: 'motorcycle',
};

/* Verified Badge Icon */
function VerifiedCheckIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l2.4 2.8 3.7-.4 1 3.5 3.3 1.7-1 3.5 1.7 3.3-2.6 2.6.4 3.7-3.5 1-1.7 3.3-3.5-1-3.3 1.7-2.6-2.6-3.7.4-1-3.5-3.3-1.7 1-3.5-1.7-3.3 2.6-2.6-.4-3.7 3.5-1 1.7-3.3 3.5 1z"
        fill="rgba(132, 204, 22, 0.2)"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

/* Edit Pencil Icon */
function EditPencilIcon({ size = 18, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Walking Icon */
function WalkIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 21l3-7 2 3v5M17 21l-2-6-3-2 2-4 4 3v4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Motorcycle Two-Wheeler Icon */
function MotorcycleIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 13h4l3-6h4M12 13l2-3h3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Car Icon */
function CarIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 17h14M3 11l2-6h14l2 6v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M7 14h.01M17 14h.01" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  profile = DEFAULT_PROFILE,
  onEditProfilePress,
  onTransportModeChange,
}) => {
  const { user, isGuest, logout } = useAuth();
  const [selectedMode, setSelectedMode] = React.useState<TransportMode>(
    profile.selectedTransport
  );

  const displayName = user?.name || (isGuest ? 'Pengguna Tamu' : 'Warga JalanAman');
  const displayEmail = user?.email || (isGuest ? 'Mode Tamu (Belum Masuk)' : 'Belum terhubung email');
  const displayPhone = user?.phone ? user.phone : 'Nomor HP belum diisi';
  const displayMemberId = user
    ? (user.role === 'Superadmin' ? 'JA-SUPERADMIN' : `JA-${user.id.slice(0, 8).toUpperCase()}`)
    : (isGuest ? 'GUEST-MODE' : 'JA-INDRAMAYU');

  const userInitials = (displayName || 'WA')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSelectMode = (mode: TransportMode) => {
    setSelectedMode(mode);
    if (onTransportModeChange) {
      onTransportModeChange(mode);
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Keluar dari JalanAman',
      'Apakah Anda yakin ingin keluar dari akun ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Meta Context Title */}
      <View style={styles.metaRow}>
        <View style={styles.metaTextWrapper}>
          <Text style={styles.metaTitle}>Profil &amp; Identitas Aman</Text>
          <Text style={styles.metaSubtitle}>
            Manajemen profil, ID darurat, dan jejaring pengawal
          </Text>
        </View>
        <View style={styles.verifiedBadge}>
          <VerifiedCheckIcon size={15} />
          <Text style={styles.verifiedText}>Terverifikasi Komunitas</Text>
        </View>
      </View>

      {/* Main Profile Card */}
      <View style={styles.profileCard}>
        {/* User Info Header */}
        <View style={styles.userRow}>
          <View style={styles.userProfileInfo}>
            <View style={styles.avatarWrapper}>
              {user?.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarInitialsText}>{userInitials}</Text>
                </View>
              )}
              <View style={styles.avatarCheckBadge}>
                <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 6L9 17l-5-5"
                    stroke="#111C2D"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
            </View>
            <View style={styles.userTextDetails}>
              <Text style={styles.userName}>{displayName}</Text>
              <Text style={styles.userPhone}>{displayPhone}</Text>
              <Text style={styles.userEmail}>{displayEmail}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditProfilePress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Edit Profil"
          >
            <EditPencilIcon size={18} />
          </TouchableOpacity>
        </View>

        {/* Member Status Badge */}
        <View style={styles.memberStatusRow}>
          <View style={styles.memberStatusLeft}>
            <View style={[styles.activeDot, isGuest && { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.memberStatusText}>
              {user ? (user.role === 'Superadmin' ? 'Superadmin Aktif' : 'Anggota Siaga Aktif') : 'Mode Tamu'}
            </Text>
          </View>
          <View style={styles.memberStatusRight}>
            <Text style={styles.memberIdText}>ID: {displayMemberId}</Text>
            {user ? (
              <TouchableOpacity
                onPress={handleLogoutPress}
                activeOpacity={0.7}
                style={styles.logoutBtn}
                accessibilityLabel="Keluar dari Akun"
              >
                <Text style={styles.logoutBtnText}>Keluar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => router.push('/login')}
                activeOpacity={0.7}
                style={styles.switchAccountBtn}
                accessibilityLabel="Masuk ke Akun"
              >
                <Text style={styles.switchAccountText}>Masuk ›</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Vehicle Mode Selector */}
        <View style={styles.vehicleSection}>
          <View style={styles.vehicleHeaderRow}>
            <Text style={styles.vehicleLabel}>Moda Transportasi Utama</Text>
            <Text style={styles.vehicleSubLabel}>Rute Siaga Disesuaikan</Text>
          </View>

          <View style={styles.vehicleGrid}>
            {/* Walk */}
            <TouchableOpacity
              style={[
                styles.transportButton,
                selectedMode === 'walk' && styles.transportButtonActive,
              ]}
              onPress={() => handleSelectMode('walk')}
              activeOpacity={0.8}
            >
              <WalkIcon
                size={20}
                color={
                  selectedMode === 'walk'
                    ? DashboardTheme.colors.textPrimary
                    : DashboardTheme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.transportLabel,
                  selectedMode === 'walk' && styles.transportLabelActive,
                ]}
              >
                Jalan Kaki
              </Text>
            </TouchableOpacity>

            {/* Motorcycle */}
            <TouchableOpacity
              style={[
                styles.transportButton,
                selectedMode === 'motorcycle' && styles.transportButtonActive,
              ]}
              onPress={() => handleSelectMode('motorcycle')}
              activeOpacity={0.8}
            >
              <MotorcycleIcon
                size={20}
                color={
                  selectedMode === 'motorcycle'
                    ? DashboardTheme.colors.textPrimary
                    : DashboardTheme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.transportLabel,
                  selectedMode === 'motorcycle' && styles.transportLabelActive,
                ]}
              >
                Sepeda Motor
              </Text>
            </TouchableOpacity>

            {/* Car */}
            <TouchableOpacity
              style={[
                styles.transportButton,
                selectedMode === 'car' && styles.transportButtonActive,
              ]}
              onPress={() => handleSelectMode('car')}
              activeOpacity={0.8}
            >
              <CarIcon
                size={20}
                color={
                  selectedMode === 'car'
                    ? DashboardTheme.colors.textPrimary
                    : DashboardTheme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.transportLabel,
                  selectedMode === 'car' && styles.transportLabelActive,
                ]}
              >
                Mobil / Taksi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  metaTextWrapper: {
    flex: 1,
    minWidth: 160,
  },
  metaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  metaSubtitle: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: DashboardTheme.radius.full,
    backgroundColor: 'rgba(132, 204, 22, 0.15)',
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: DashboardTheme.colors.onPrimaryContainer,
  },
  profileCard: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xl,
    padding: 15,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
    gap: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  userProfileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
  },
  avatarFallback: {
    backgroundColor: '#416900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    borderWidth: 2,
    borderColor: DashboardTheme.colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTextDetails: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  userPhone: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textSecondary,
  },
  userEmail: {
    fontSize: 11,
    color: DashboardTheme.colors.textMuted,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: DashboardTheme.radius.md,
  },
  memberStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  memberStatusText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
  },
  memberIdText: {
    fontSize: 10.5,
    color: DashboardTheme.colors.textMuted,
    fontWeight: '500',
  },
  memberStatusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchAccountBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(132, 204, 22, 0.12)',
  },
  switchAccountText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  logoutBtn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  logoutBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#EF4444',
  },
  vehicleSection: {
    gap: 8,
    paddingTop: 2,
  },
  vehicleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  vehicleLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  vehicleSubLabel: {
    fontSize: 10.5,
    color: DashboardTheme.colors.textMuted,
  },
  vehicleGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  transportButton: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    gap: 4,
  },
  transportButtonActive: {
    backgroundColor: DashboardTheme.colors.primaryContainer,
    ...DashboardTheme.shadows.sosGlow,
  },
  transportLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    color: DashboardTheme.colors.textSecondary,
    textAlign: 'center',
  },
  transportLabelActive: {
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
});
