import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { DashboardTheme } from '@/constants/dashboardTheme';
import {
  DashboardHeader,
  TrustScoreCard,
  QuickCommuteSearch,
  AmbientSafetyMapCard,
  QuickActionGrid,
  CommunitySafetyFeed,
  EmergencyTriggerBanner,
  DashboardBottomNav,
  NotificationCenterModal,
} from '@/components/dashboard';
import { IncidentReportModal } from '@/components/IncidentReportModal';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';
import { SafeHavenDirectoryModal } from '@/components/SafeHavenDirectoryModal';
import { SafetyHandbookModal } from '@/components/emergency';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { useTrustScore } from '@/hooks/useTrustScore';
import { DashboardTabId, QuickDestinationChip, CommunitySafetyReport } from '@/types/dashboard';

/**
 * Modul 1: Beranda / Dashboard Radar Command Center
 * Converted from modul1.html following Clean Code & SOLID principles.
 * Accessible via /radar tab.
 */
export function DashboardScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { hasUnread } = useNotifications();
  const { score: dynamicTrustScore } = useTrustScore();

  // Modal Visibility States (Dependency Inversion: Decoupled Modals)
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [isSosModalVisible, setIsSosModalVisible] = useState(false);
  const [isShelterModalVisible, setIsShelterModalVisible] = useState(false);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
  const [isHandbookModalVisible, setIsHandbookModalVisible] = useState(false);

  // Handlers for Header
  const handleNotificationPress = useCallback(() => {
    setIsNotifModalVisible(true);
  }, []);

  const handleProfilePress = useCallback(() => {
    router.push('/profile');
  }, []);

  // Handlers for Search & Commute Chips -> Opens Full Map on '/'
  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery.trim()) return;
    router.push({
      pathname: '/',
      params: { destination: searchQuery },
    });
  }, [searchQuery]);

  const handleChipPress = useCallback((chip: QuickDestinationChip) => {
    setSearchQuery(chip.label);
    router.push({
      pathname: '/',
      params: { destination: chip.query },
    });
  }, []);

  const handleFilterPress = useCallback(() => {
    Alert.alert(
      'Filter Rute Aman',
      'Pilih preferensi rute:\n• Terang & Ber-PJU (94%)\n• Terpantau CCTV 24/7\n• Dekat Pos Keamanan / Shelter'
    );
  }, []);

  // Handlers for Ambient Safety Map
  const handleLayerToggle = useCallback(() => {
    Alert.alert(
      'Filter Layer Spasial',
      'Layer aktif: CCTV Terbuka & Titik Patroli Terverifikasi.'
    );
  }, []);

  const handleSafeHavenPinPress = useCallback((havenName: string) => {
    setIsShelterModalVisible(true);
  }, []);

  const handleHazardPinPress = useCallback((hazardName: string) => {
    Alert.alert(
      'Titik Peringatan Warga',
      `${hazardName}\nStatus: Dilaporkan warga 25 menit lalu. Tim teknis PJU telah menerima notifikasi.`
    );
  }, []);

  const handleMapCanvasPress = useCallback(() => {
    router.push('/');
  }, []);

  // Handlers for Quick Action Grid
  const handleStartRoute = useCallback(() => {
    router.push('/');
  }, []);

  const handleReportHazard = useCallback(() => {
    setIsReportModalVisible(true);
  }, []);

  const handleShelters = useCallback(() => {
    setIsShelterModalVisible(true);
  }, []);

  const handleContacts = useCallback(() => {
    Alert.alert(
      '🛡️ Proteksi Siaga & Buku Saku Darurat',
      'Pilih akses cepat keselamatan yang Anda butuhkan:',
      [
        {
          text: '📖 Buka Buku Saku & SOP Krisis',
          onPress: () => setIsHandbookModalVisible(true),
        },
        {
          text: 'Lihat Kontak Siaga Terhubung (4)',
          onPress: () => {
            Alert.alert(
              'Kontak Siaga Terhubung (4)',
              '1. Ibu (Keluarga Inti)\n2. Suami / Wali\n3. Kakak\n4. Pos Satpam Perum Griya Jatibarang\n\nSiap ditelepon otomatis jika pemicu darurat aktif.'
            );
          },
        },
        { text: 'Tutup', style: 'cancel' },
      ]
    );
  }, []);

  // Handlers for Community Feed & Emergency
  const handleFeedViewAll = useCallback(() => {
    router.push('/explore');
  }, []);

  const handleFeedReportPress = useCallback((report: CommunitySafetyReport) => {
    Alert.alert(
      `Laporan: ${report.badgeLabel}`,
      `${report.description}\n\nWaktu: ${report.timeAgo}\nKonfirmasi: ${report.confirmations} warga sekitar.`
    );
  }, []);

  const handleTriggerSos = useCallback(() => {
    setIsSosModalVisible(true);
  }, []);

  // Bottom Navigation Bar Handler
  const handleTabPress = useCallback((tabId: DashboardTabId) => {
    if (tabId === 'routes') {
      router.push('/');
    } else if (tabId === 'radar') {
      router.push('/radar');
    } else if (tabId === 'feed') {
      router.push('/explore');
    } else if (tabId === 'profile') {
      router.push('/profile');
    }
  }, []);

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Scrollable Canvas */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sticky App Header */}
        <DashboardHeader
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
          hasUnreadNotifications={hasUnread}
        />

        {/* User Identity & AI Trust Score Section */}
        <TrustScoreCard
          userName={user?.name ? user.name.split(' ')[0] : 'Pengguna'}
          locationLabel={`${user?.domicile || 'Jatibarang, Indramayu'} • Aman`}
          trustScore={dynamicTrustScore}
          radiusKm={2.5}
          isRealtime={true}
          onPressScore={() => router.push('/profile')}
        />

        {/* Quick Commute Search & Destination Chips */}
        <QuickCommuteSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSubmitSearch={handleSearchSubmit}
          onChipPress={handleChipPress}
          onFilterPress={handleFilterPress}
        />

        {/* Real 3D Circlegeo ESRI Satellite GIS Safety Corridor Map */}
        <AmbientSafetyMapCard
          onLayerToggle={handleLayerToggle}
          onSafeHavenPress={handleSafeHavenPinPress}
          onHazardPress={handleHazardPinPress}
          onMapPress={handleMapCanvasPress}
          verifiedPercentage={94}
          radiusText="Radius 500m"
        />

        {/* Quick Action Grid: Mulai Rute, Lapor Bahaya, Shelter, Kontak */}
        <QuickActionGrid
          onStartRoutePress={handleStartRoute}
          onReportHazardPress={handleReportHazard}
          onSheltersPress={handleShelters}
          onContactsPress={handleContacts}
        />

        {/* Live Community Feed Card */}
        <CommunitySafetyFeed
          onViewAllPress={handleFeedViewAll}
          onReportPress={handleFeedReportPress}
        />

        {/* Discreet Emergency Quick Trigger Banner */}
        <EmergencyTriggerBanner onPress={handleTriggerSos} />
      </ScrollView>

      {/* Floating Bottom Navigation Bar (Radar active) */}
      <DashboardBottomNav
        activeTab="radar"
        onTabPress={handleTabPress}
        onSosPress={() => setIsSosModalVisible(true)}
      />

      {/* Incident Report Modal (Modul 2) */}
      <IncidentReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
      />

      {/* Emergency SOS Modal (Modul 5) */}
      <EmergencySOSModal
        visible={isSosModalVisible}
        onDismiss={() => setIsSosModalVisible(false)}
      />

      {/* Safe Haven Directory Modal */}
      <SafeHavenDirectoryModal
        visible={isShelterModalVisible}
        onClose={() => setIsShelterModalVisible(false)}
      />

      {/* Item 3: Professional Notification Center Modal */}
      <NotificationCenterModal
        visible={isNotifModalVisible}
        onDismiss={() => setIsNotifModalVisible(false)}
        onNavigateToMap={() => router.push('/')}
        onNavigateToReport={() => router.push('/report')}
        onNavigateToGuardian={() => router.push('/profile')}
      />

      {/* Item 7: Safety Handbook & Emergency Directory Modal */}
      <SafetyHandbookModal
        visible={isHandbookModalVisible}
        onDismiss={() => setIsHandbookModalVisible(false)}
      />
    </View>
  );
}

export default DashboardScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110,
    gap: 16,
  },
});
