import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import {
  CommunityReportHeader,
  VerifiedStatusBanner,
  IncidentCategoryForm,
  IncidentLifecycleTimeline,
  RouteFeedbackSheet,
  MyReportsModal,
} from '@/components/community-report';
import { DashboardBottomNav } from '@/components/dashboard/DashboardBottomNav';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';
import { DashboardTabId } from '@/types/dashboard';
import { IncidentCategoryId } from '@/types/communityReport';

function ThumbUpIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
 * Modul 5: Pelaporan Komunitas & Bahaya Spasial
 * Converted from modul5.html following Clean Code & SOLID principles.
 */
export function CommunityReportScreen() {
  const [isFeedbackSheetVisible, setIsFeedbackSheetVisible] = useState(false);
  const [isMyReportsModalVisible, setIsMyReportsModalVisible] = useState(false);
  const [isSosModalVisible, setIsSosModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTabId>('radar');

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, []);

  const handleOpenFeedbackSheet = useCallback(() => {
    setIsFeedbackSheetVisible(true);
  }, []);

  const handleCloseFeedbackSheet = useCallback(() => {
    setIsFeedbackSheetVisible(false);
  }, []);

  const handleSubmitReport = useCallback(
    (data: {
      category: IncidentCategoryId;
      location: string;
      description: string;
      hasPhoto: boolean;
    }) => {
      Alert.alert(
        '✅ Laporan Komunitas Berhasil Dikirim',
        `Laporan kategori "${data.category}" di ${data.location} telah disiarkan ke server spasial JalanAman dan masuk ke verifikasi warga sekitar.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Stay on page to see timeline or return
            },
          },
        ]
      );
    },
    []
  );

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FA" />

      {/* Header with back button, title, and review trigger */}
      <CommunityReportHeader
        onBack={handleBack}
        onOpenFeedbackSheet={handleOpenFeedbackSheet}
        onOpenMyReports={() => setIsMyReportsModalVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Status Mini Banner: 14 Laporan Terverifikasi Live */}
        <VerifiedStatusBanner verifiedCount={14} radiusKm={2} />

        {/* Multi-Category Incident Form Card */}
        <IncidentCategoryForm onSubmitReport={handleSubmitReport} />

        {/* Incident Lifecycle Tracker Card: #LAP-88219 Timeline */}
        <IncidentLifecycleTimeline
          reportId="#LAP-88219"
          categoryLabel="Penerangan Padam"
        />

        {/* Interactive Bottom Sheet Trigger Pill in-flow */}
        <TouchableOpacity
          style={styles.reviewTriggerPill}
          onPress={handleOpenFeedbackSheet}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Ulas Rute Terakhirmu"
        >
          <View style={styles.reviewPillLeft}>
            <View style={styles.thumbIconBox}>
              <ThumbUpIcon size={20} />
            </View>
            <View style={styles.reviewPillTextCol}>
              <Text style={styles.reviewPillTitle}>Ulas Rute Terakhirmu</Text>
              <Text style={styles.reviewPillSubtitle}>
                Beri rating 5 bintang &amp; feedback kondisi
              </Text>
            </View>
          </View>

          <ChevronRightIcon size={18} />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Manajemen Laporanku */}
      <MyReportsModal
        visible={isMyReportsModalVisible}
        onDismiss={() => setIsMyReportsModalVisible(false)}
        onNewReportPress={() => setIsMyReportsModalVisible(false)}
      />

      {/* Interactive 5-Star Route Feedback Bottom Sheet */}
      <RouteFeedbackSheet
        visible={isFeedbackSheetVisible}
        onClose={handleCloseFeedbackSheet}
      />

      {/* Emergency SOS Modal Integration */}
      <EmergencySOSModal
        visible={isSosModalVisible}
        onDismiss={() => setIsSosModalVisible(false)}
      />

      {/* Floating Bottom Navigation Bar */}
      <DashboardBottomNav
        activeTab={activeTab}
        onTabPress={handleTabPress}
        onSosPress={() => setIsSosModalVisible(true)}
      />
    </View>
  );
}

export default CommunityReportScreen;
export { CommunityReportScreen as IncidentReportScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 120, // ample clearance for floating bottom pill nav
    gap: 14,
  },
  reviewTriggerPill: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xl,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
    marginBottom: 8,
  },
  reviewPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  thumbIconBox: {
    width: 40,
    height: 40,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: 'rgba(198, 255, 0, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewPillTextCol: {
    flex: 1,
    gap: 2,
  },
  reviewPillTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  reviewPillSubtitle: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
  },
});
