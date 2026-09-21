import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { useAuth } from '@/hooks/useAuth';
import {
  TelemetryLocationAnchor,
  SOSPanicEngine,
  EmergencyQuickDialGrid,
  SafeHavenRadarSection,
  CommunityGuardianBanner,
  SafetyHandbookModal,
} from '@/components/emergency';
import { DashboardBottomNav } from '@/components/dashboard/DashboardBottomNav';
import { DashboardTabId } from '@/types/dashboard';
import { SafeHavenItem } from '@/types/emergencyCenter';

export interface EmergencySOSModalProps {
  visible?: boolean;
  onDismiss?: () => void;
  onEvacuationStart?: (shelterData: any) => void;
}

function ShieldHeartLogoIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8.5c-.6-1-2-1-2.5 0-.5 1 0 2 2.5 3.5 2.5-1.5 3-2.5 2.5-3.5-.5-1-1.9-1-2.5 0z"
        fill={color}
      />
    </Svg>
  );
}

function BellNotificationIcon({ size = 20, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CloseIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ArrowBackIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BookOpenIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ size = 18, color = DashboardTheme.colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/**
 * Modul 6: Pusat Darurat & Safe Haven (Akses Kilat Proteksi Keselamatan & Evakuasi 24 Jam)
 * Converted from modul6.html following Clean Code & SOLID principles.
 */
export function EmergencyCenterScreen({
  visible,
  onDismiss,
  onEvacuationStart,
}: EmergencySOSModalProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTabId>('sos');
  const [isHandbookModalVisible, setIsHandbookModalVisible] = useState(false);

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight);

  const isModalMode = visible !== undefined;

  const handleDismiss = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [onDismiss]);

  const handleTriggerSOS = useCallback((data: { isSilent: boolean }) => {
    const guardianNotice = user?.guardian_name
      ? `${user.guardian_name} (${user.guardian_phone || 'Kontak'}), Polsek Jatibarang Siaga 24 Jam, dan Call Center 112`
      : 'Polsek Jatibarang Siaga 24 Jam dan Call Center 112';

    if (data.isSilent) {
      Alert.alert(
        '✓ S.O.S SENYAP TERKIRIM',
        `Koordinat GPS live Anda telah disalurkan secara terenkripsi ke ${guardianNotice} tanpa membunyikan sirene.`,
        [{ text: 'Mengerti', style: 'default' }]
      );
    } else {
      Alert.alert(
        '🚨 PROTOKOL DARURAT AKTIF',
        `Sinyal marabahaya disiarkan ke ${guardianNotice}! Alarm ponsel diaktifkan, koordinat dikirimkan ke Satgas Patroli & Safe Haven terdekat.`,
        [
          {
            text: 'Pandu Evakuasi ke Shelter Terdekat',
            onPress: () => {
              if (onEvacuationStart) {
                onEvacuationStart({
                  shelter_name: 'Pos Pantau RW 04 & Satpam 24 Jam',
                  distance: '180 meter',
                  eta: '2 menit',
                });
              } else {
                router.push('/navigation');
              }
            },
          },
          { text: 'Tutup Sinyal', style: 'cancel' },
        ]
      );
    }
  }, [user, onEvacuationStart]);

  const handleEvacuateToShelter = useCallback((shelter: SafeHavenItem) => {
    if (onEvacuationStart) {
      onEvacuationStart(shelter);
    } else {
      Alert.alert(
        `🛡️ Evakuasi ke ${shelter.name}`,
        `Navigasi rute darurat diarahkan ke ${shelter.address} (${shelter.distanceMeters}m • ${shelter.etaMinutes} mnt). Tetap berada di jalan dengan penerangan terang.`,
        [
          {
            text: 'Mulai Navigasi Evakuasi',
            onPress: () => {
              if (isModalMode && onDismiss) {
                onDismiss();
              }
              router.push('/navigation');
            },
          },
          { text: 'Batal', style: 'cancel' },
        ]
      );
    }
  }, [isModalMode, onDismiss, onEvacuationStart]);

  const handleViewShelterMap = useCallback((shelter: SafeHavenItem) => {
    if (isModalMode && onDismiss) {
      onDismiss();
    }
    router.push('/navigation');
  }, [isModalMode, onDismiss]);

  const handleRefreshLocation = useCallback(() => {
    Alert.alert(
      '📡 GPS Diperbarui',
      'Koordinat satelit dikunci ulang dengan presisi tinggi 3m (Jl. Teuku Cik Ditiro No. 22).'
    );
  }, []);

  const handleTabPress = useCallback((tab: DashboardTabId) => {
    setActiveTab(tab);
    if (tab === 'routes') {
      router.replace('/');
    } else if (tab === 'radar') {
      router.replace('/radar');
    } else if (tab === 'feed') {
      router.replace('/explore');
    } else if (tab === 'profile') {
      router.replace('/profile');
    }
  }, []);

  const content = (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={DashboardTheme.colors.surfaceCard} />

      {/* Header Bar */}
      <View style={[styles.headerContainer, { paddingTop: safeTop }]}>
        <View style={styles.headerContent}>
          {isModalMode ? (
            <>
              <View style={styles.headerBrandRow}>
                <View style={styles.brandIconBox}>
                  <ShieldHeartLogoIcon size={20} />
                </View>
                <View>
                  <Text style={styles.brandTitle}>JalanAman</Text>
                  <Text style={styles.brandSubtitle}>Pusat Darurat</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setIsHandbookModalVisible(true)}
                  activeOpacity={0.7}
                  accessibilityLabel="Buka Buku Saku Panduan Darurat"
                >
                  <BookOpenIcon size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={handleDismiss}
                  activeOpacity={0.7}
                  accessibilityLabel="Tutup Pusat Darurat"
                  accessibilityRole="button"
                >
                  <CloseIcon size={20} />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.headerBrandRow}>
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={handleDismiss}
                  activeOpacity={0.7}
                  accessibilityLabel="Kembali"
                >
                  <ArrowBackIcon size={20} />
                </TouchableOpacity>

                <View style={styles.brandIconBox}>
                  <ShieldHeartLogoIcon size={20} />
                </View>
                <View>
                  <Text style={styles.brandTitle}>JalanAman</Text>
                  <Text style={styles.brandSubtitle}>Pusat Darurat</Text>
                </View>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.iconActionBtn}
                  onPress={() => setIsHandbookModalVisible(true)}
                  activeOpacity={0.7}
                  accessibilityLabel="Buku Saku Panduan Darurat"
                >
                  <BookOpenIcon size={20} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconActionBtn}
                  onPress={() => Alert.alert('Notifikasi', 'Tidak ada sinyal darurat aktif dari kontak Anda saat ini.')}
                  activeOpacity={0.7}
                  accessibilityLabel="Notifikasi"
                >
                  <BellNotificationIcon size={22} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileAvatarWrap}
                  onPress={() => router.push('/profile')}
                  activeOpacity={0.8}
                  accessibilityLabel="Profil Saya"
                >
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                    }}
                    style={styles.profileAvatar}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: isModalMode ? 40 : 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Live Telemetry & Location Anchor */}
        <TelemetryLocationAnchor onRefreshLocation={handleRefreshLocation} />

        {/* Section 2: SOS Panic Action Engine (Hold 3 seconds + Silent Toggle) */}
        <SOSPanicEngine onTriggerSOS={handleTriggerSOS} />

        {/* Section 3: Direktori Panggilan Kilat (2x2 Grid) */}
        <EmergencyQuickDialGrid />

        {/* Section 3.5: Buku Saku & Panduan Krisis Taktis Offline Banner */}
        <TouchableOpacity
          style={styles.handbookBannerCard}
          onPress={() => setIsHandbookModalVisible(true)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Buka Buku Saku & Panduan Darurat Offline"
        >
          <View style={styles.handbookBannerLeft}>
            <View style={styles.handbookIconBox}>
              <BookOpenIcon size={22} color="#0284C7" />
            </View>
            <View style={styles.handbookBannerTextCol}>
              <View style={styles.handbookBadgeRow}>
                <Text style={styles.handbookBadge}>OFFLINE SOP &amp; HOTLINES</Text>
              </View>
              <Text style={styles.handbookBannerTitle}>Buku Saku Panduan Krisis</Text>
              <Text style={styles.handbookBannerSubtitle}>
                SOP taktis saat dibuntuti, begal, pelecehan &amp; P3K luka kecelakaan
              </Text>
            </View>
          </View>
          <ChevronRightIcon size={18} color="#64748B" />
        </TouchableOpacity>

        {/* Section 4: Safe Haven Radar: Titik Evakuasi Terdekat */}
        <SafeHavenRadarSection
          onEvacuatePress={handleEvacuateToShelter}
          onViewMapPress={handleViewShelterMap}
        />

        {/* Section 5: Community Guardian Micro-Banner */}
        <CommunityGuardianBanner
          contactsCount={user?.guardian_name ? 3 : 2}
          guardianName={user?.guardian_name}
        />
      </ScrollView>

      {/* Modal Buku Saku & Panduan Darurat Offline */}
      <SafetyHandbookModal
        visible={isHandbookModalVisible}
        onDismiss={() => setIsHandbookModalVisible(false)}
      />

      {/* Floating Bottom Nav (Only in Standalone Page Mode) */}
      {!isModalMode && (
        <DashboardBottomNav
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onSosPress={() => {
            // Already on emergency center
            Alert.alert('Pusat Darurat Aktif', 'Anda sedang berada di layar Pusat Darurat & Safe Haven.');
          }}
        />
      )}
    </View>
  );

  if (visible !== undefined) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleDismiss}
      >
        {content}
      </Modal>
    );
  }

  return content;
}

export { EmergencyCenterScreen as EmergencySOSModal };
export default EmergencyCenterScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
  },
  headerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    zIndex: 50,
  },
  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(132, 204, 22, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.3,
    lineHeight: 18,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: DashboardTheme.colors.primaryContainer,
  },
  profileAvatar: {
    width: '100%',
    height: '100%',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  handbookBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  handbookBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  handbookIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handbookBannerTextCol: {
    flex: 1,
    gap: 3,
  },
  handbookBadgeRow: {
    flexDirection: 'row',
  },
  handbookBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 0.5,
  },
  handbookBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  handbookBannerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
});
