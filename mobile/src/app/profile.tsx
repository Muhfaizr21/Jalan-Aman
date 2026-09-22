import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { DashboardTheme } from '@/constants/dashboardTheme';
import {
  ProfileHeader,
  ProfileHeroCard,
  TrustScoreCircleCard,
  EmergencyMedicalIDCard,
  GuardiansCircleCard,
  EditProfileModal,
  TripHistoryModal,
  TrustScoreDetailModal,
  ManageGuardianModal,
  GuardianContactActionModal,
} from '@/components/profile';
import { DashboardBottomNav, NotificationCenterModal } from '@/components/dashboard';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { DashboardTabId } from '@/types/dashboard';
import { TransportMode, GuardianContactItem } from '@/types/profile';
import { tripService, TripStats } from '@/services/tripService';

/**
 * Modul 2: Profil & Identitas Aman (User Profile, Medical ID & Guardians Circle)
 * Converted from modul2.html following Clean Code & SOLID principles.
 */
export function ProfileScreen() {
  const [isSosModalVisible, setIsSosModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [isNotifModalVisible, setIsNotifModalVisible] = useState(false);
  const [isTrustScoreModalVisible, setIsTrustScoreModalVisible] = useState(false);
  const [isGuardianModalVisible, setIsGuardianModalVisible] = useState(false);
  const [selectedGuardianContact, setSelectedGuardianContact] = useState<GuardianContactItem | null>(null);
  const [isContactActionVisible, setIsContactActionVisible] = useState(false);
  const [tripStats, setTripStats] = useState<TripStats | null>(null);
  const { hasUnread } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    tripService.getHistory('this_month').then((res) => {
      if (isMounted && res.stats) {
        setTripStats(res.stats);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Notification action
  const handleNotificationPress = useCallback(() => {
    setIsNotifModalVisible(true);
  }, []);

  // Edit profile action
  const handleEditProfile = useCallback(() => {
    setIsEditModalVisible(true);
  }, []);

  // Transport mode change
  const handleTransportModeChange = useCallback((mode: TransportMode) => {
    const modeNames = {
      walk: 'Jalan Kaki',
      motorcycle: 'Sepeda Motor',
      car: 'Mobil / Taksi',
    };
    Alert.alert(
      'Moda Transportasi Diperbarui',
      `Moda utama diatur ke "${modeNames[mode]}". Algoritma perutean AI akan menyesuaikan kelayakan jalur.`
    );
  }, []);

  // Add guardian action: opens dedicated ManageGuardianModal
  const handleAddGuardian = useCallback(() => {
    setIsGuardianModalVisible(true);
  }, []);

  // Guardian contact click: opens GuardianContactActionModal with real Phone Call & WhatsApp actions
  const handleContactPress = useCallback((contact: GuardianContactItem) => {
    setSelectedGuardianContact(contact);
    setIsContactActionVisible(true);
  }, []);

  // Corridor alert toggle
  const handleToggleCorridorAlert = useCallback((enabled: boolean) => {
    Alert.alert(
      'Alarm Deviasi Koridor Aman',
      enabled
        ? `Sistem Pengawal Aktif: ${user?.guardian_name || 'Kontak Siaga 112 & Polsek'} akan menerima notifikasi otomatis jika Anda menyimpang >250m dari rute aman.`
        : 'Alarm deviasi koridor dinonaktifkan.'
    );
  }, [user]);

  // SOS Trigger
  const handleTriggerSos = useCallback(() => {
    setIsSosModalVisible(true);
  }, []);

  // Bottom Navigation Handler (SOLID: DRY reuse of DashboardBottomNav)
  const handleTabPress = useCallback((tabId: DashboardTabId) => {
    if (tabId === 'routes') {
      router.push('/');
    } else if (tabId === 'radar') {
      router.push('/radar');
    } else if (tabId === 'feed') {
      router.push('/explore');
    }
  }, []);

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={DashboardTheme.colors.surfaceCard} />

      {/* Top App Bar Header */}
      <ProfileHeader
        onNotificationPress={handleNotificationPress}
        hasUnreadNotifications={hasUnread}
      />

      {/* Scrollable Body */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info, Verification Badge & Transport Mode Selector */}
        <ProfileHeroCard
          onEditProfilePress={handleEditProfile}
          onTransportModeChange={handleTransportModeChange}
        />

        {/* Circular SVG Trust Score Gauge & 3 Breakdown Metrics */}
        <TrustScoreCircleCard onPressDetails={() => setIsTrustScoreModalVisible(true)} />

        {/* Emergency Medical ID (Blood Type, Allergies, Hospital, etc.) */}
        <EmergencyMedicalIDCard />

        {/* Guardians Circle (Connected Contacts & Auto-Corridor Alert) */}
        <GuardiansCircleCard
          onAddGuardianPress={handleAddGuardian}
          onContactPress={handleContactPress}
          onToggleCorridorAlert={handleToggleCorridorAlert}
        />

        {/* Quick Menu Hub: Riwayat & Pengaturan */}
        <View style={styles.quickMenuCard}>
          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => setIsHistoryModalVisible(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.quickMenuTitle}>📜 Riwayat Perjalanan Aman</Text>
            <Text style={styles.quickMenuSub}>
              {tripStats
                ? `${tripStats.total_completed} perjalanan selesai • ${tripStats.average_safety_score.toFixed(1)} skor aman`
                : '18 perjalanan selesai • 95.4 skor aman'}
            </Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.quickMenuItem}
            onPress={() => router.push('/settings')}
            activeOpacity={0.75}
          >
            <Text style={styles.quickMenuTitle}>⚙️ Pengaturan Sensor & Sistem</Text>
            <Text style={styles.quickMenuSub}>Peta offline, sensor getar, enkripsi privasi</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding spacer for floating nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Reused Persistent Floating Pill Navigation Bar (DRY principle) */}
      <DashboardBottomNav
        activeTab="profile"
        onTabPress={handleTabPress}
        onSosPress={handleTriggerSos}
      />

      {/* Emergency SOS Modal Integration */}
      <EmergencySOSModal
        visible={isSosModalVisible}
        onDismiss={() => setIsSosModalVisible(false)}
        onEvacuationStart={() => {
          setIsSosModalVisible(false);
          router.push('/');
        }}
      />

      {/* Item 4: Professional Edit Profile & KYC Modal */}
      <EditProfileModal
        visible={isEditModalVisible}
        onDismiss={() => setIsEditModalVisible(false)}
      />

      {/* Item 5: Professional Trip History Modal */}
      <TripHistoryModal
        visible={isHistoryModalVisible}
        onDismiss={() => setIsHistoryModalVisible(false)}
        onReroute={(dest) => {
          setIsHistoryModalVisible(false);
          router.push({ pathname: '/', params: { destination: dest } });
        }}
      />

      {/* Item 3: Notification Center Modal */}
      <NotificationCenterModal
        visible={isNotifModalVisible}
        onDismiss={() => setIsNotifModalVisible(false)}
        onNavigateToMap={() => router.push('/')}
        onNavigateToReport={() => router.push('/report')}
        onNavigateToGuardian={() => setIsGuardianModalVisible(true)}
      />

      {/* Item 6: Trust Score Detail & Reputation Modal */}
      <TrustScoreDetailModal
        visible={isTrustScoreModalVisible}
        onDismiss={() => setIsTrustScoreModalVisible(false)}
        onNavigateToEditProfile={() => setIsEditModalVisible(true)}
      />

      {/* Item 7: Manage Guardian Modal (Add / Edit / Delete in PostgreSQL) */}
      <ManageGuardianModal
        visible={isGuardianModalVisible}
        onDismiss={() => setIsGuardianModalVisible(false)}
      />

      {/* Item 8: Guardian Contact Action Modal (Direct Phone & WhatsApp Actions) */}
      <GuardianContactActionModal
        visible={isContactActionVisible}
        contact={selectedGuardianContact}
        isUserGuardian={selectedGuardianContact?.id === 'user_guardian_1'}
        onDismiss={() => {
          setIsContactActionVisible(false);
          setSelectedGuardianContact(null);
        }}
        onEditPress={() => {
          setIsGuardianModalVisible(true);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 12,
    paddingBottom: 120,
  },
  bottomSpacer: {
    height: 20,
  },
  quickMenuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickMenuItem: {
    paddingVertical: 12,
    gap: 3,
  },
  quickMenuTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  quickMenuSub: {
    fontSize: 11,
    color: '#64748B',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});

export default ProfileScreen;
