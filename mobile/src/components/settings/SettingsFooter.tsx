import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface SettingsFooterProps {
  onBackupPress?: () => void;
  onResetPress?: () => void;
  onLogoutPress?: () => void;
  appVersion?: string;
  protocolBadge?: string;
}

function CloudUploadIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 16.9A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M12 12v9m0-9l-3 3m3-3l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LogOutIcon({ size = 18, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShieldMiniIcon({ size = 14, color = DashboardTheme.colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const SettingsFooter: React.FC<SettingsFooterProps> = ({
  onBackupPress,
  onResetPress,
  onLogoutPress,
  appVersion = 'JalanAman v2.4.1 (Build 890)',
  protocolBadge = 'Protokol Siaga Terpadu Basarnas & Polisi RI',
}) => {
  const handleBackup = () => {
    if (onBackupPress) {
      onBackupPress();
    } else {
      Alert.alert(
        'Cadangan Berhasil',
        'Konfigurasi sensor, preferensi rute, dan setelan privasi berhasil dienkripsi dan dicadangkan ke Cloud Aman JalanAman.'
      );
    }
  };

  const handleReset = () => {
    if (onResetPress) {
      onResetPress();
    } else {
      Alert.alert(
        'Atur Ulang Pengaturan?',
        'Seluruh konfigurasi sensor dan preferensi akan dikembalikan ke standar bawaan aplikasi.',
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Atur Ulang',
            style: 'destructive',
            onPress: () => {
              Alert.alert('Selesai', 'Pengaturan berhasil direset ke standar pabrik.');
            },
          },
        ]
      );
    }
  };

  const handleLogout = () => {
    if (onLogoutPress) {
      onLogoutPress();
      return;
    }

    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: () => {
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Actions */}
      <View style={styles.buttonsCol}>
        <TouchableOpacity
          style={styles.backupBtn}
          onPress={handleBackup}
          activeOpacity={0.85}
          accessibilityLabel="Cadangkan Pengaturan ke Cloud Aman"
          accessibilityRole="button"
        >
          <CloudUploadIcon size={20} />
          <Text style={styles.backupBtnText}>Cadangkan Pengaturan ke Cloud Aman</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityLabel="Keluar / Buka Halaman Masuk"
          accessibilityRole="button"
        >
          <LogOutIcon size={18} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Keluar / Ganti Akun</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleReset}
          activeOpacity={0.7}
          accessibilityLabel="Atur Ulang Pengaturan ke Standar Pabrik"
          accessibilityRole="button"
        >
          <Text style={styles.resetBtnText}>Atur Ulang Pengaturan ke Standar Pabrik</Text>
        </TouchableOpacity>
      </View>

      {/* Version & Protocol Info */}
      <View style={styles.versionCol}>
        <View style={styles.versionRow}>
          <ShieldMiniIcon size={14} />
          <Text style={styles.versionText}>{appVersion}</Text>
        </View>
        <Text style={styles.protocolText}>{protocolBadge}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  buttonsCol: {
    width: '100%',
    gap: 10,
  },
  backupBtn: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  backupBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  logoutBtn: {
    width: '100%',
    height: 46,
    borderRadius: 999,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  resetBtn: {
    width: '100%',
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  versionCol: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 4,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textMuted,
  },
  protocolText: {
    fontSize: 11,
    color: DashboardTheme.colors.textMuted,
    textAlign: 'center',
  },
});
