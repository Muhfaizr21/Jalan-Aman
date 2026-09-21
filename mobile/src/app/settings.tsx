import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { DashboardTheme } from '@/constants/dashboardTheme';
import {
  SettingsHeader,
  OfflineStorageSection,
  SensorsAutoProtectionSection,
  PrivacyTrackingSection,
  AudioSirenSection,
  SettingsFooter,
} from '@/components/settings';
import { DashboardBottomNav } from '@/components/dashboard/DashboardBottomNav';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';
import { DashboardTabId } from '@/types/dashboard';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useAuth } from '@/hooks/useAuth';

/**
 * Modul 7: Pengaturan Sistem (Hardware Telemetry, Offline Maps, Sensors, Privacy & Sirens)
 * Converted from modul7.html following Clean Code & SOLID principles.
 */
export function SystemSettingsScreen() {
  const [isSosModalVisible, setIsSosModalVisible] = useState(false);
  const {
    settings,
    storageData,
    isDownloadingMap,
    downloadProgress,
    updateSetting,
    resetToDefaults,
    purgeCache,
    toggleOfflineMapDownload,
    backupSettingsToCloud,
  } = useSystemSettings();
  const { logout } = useAuth();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/profile');
    }
  }, []);

  const handleTabPress = useCallback((tabId: DashboardTabId) => {
    if (tabId === 'routes') {
      router.replace('/');
    } else if (tabId === 'radar') {
      router.replace('/radar');
    } else if (tabId === 'feed') {
      router.replace('/explore');
    } else if (tabId === 'profile') {
      router.replace('/profile');
    }
  }, []);

  const handleTriggerSos = useCallback(() => {
    setIsSosModalVisible(true);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun JalanAman?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  }, [logout]);

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={DashboardTheme.colors.surfaceCanvas} />

      {/* Settings Top In-Screen App Bar */}
      <SettingsHeader onBackPress={handleBack} />

      {/* Main Scrollable Body */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Offline Map & Storage Module */}
        <OfflineStorageSection
          data={storageData}
          isDownloadingMap={isDownloadingMap}
          downloadProgress={downloadProgress}
          onPurgeCache={purgeCache}
          onToggleDownload={toggleOfflineMapDownload}
        />

        {/* Section 2: Sensors & Auto-Protection Module */}
        <SensorsAutoProtectionSection
          anomalyDetection={settings.anomalyDetection}
          onToggleAnomalyDetection={(val) => updateSetting('anomalyDetection', val)}
          autoDeadmanSwitch={settings.autoDeadmanSwitch}
          onToggleAutoDeadmanSwitch={(val) => updateSetting('autoDeadmanSwitch', val)}
          shockSensitivity={settings.shockSensitivity}
          onChangeShockSensitivity={(val) => updateSetting('shockSensitivity', val)}
        />

        {/* Section 3: Privacy & Data Protection */}
        <PrivacyTrackingSection
          endToEndEncryption={settings.endToEndEncryption}
          onToggleEndToEndEncryption={(val) => updateSetting('endToEndEncryption', val)}
          obfuscateFeedLocation={settings.obfuscateFeedLocation}
          onToggleObfuscateFeedLocation={(val) => updateSetting('obfuscateFeedLocation', val)}
          autoPurgeHistory={settings.autoPurgeHistory}
          onToggleAutoPurgeHistory={(val) => updateSetting('autoPurgeHistory', val)}
        />

        {/* Section 4: Audio & Siren Overrides */}
        <AudioSirenSection
          maxSirenVolume={settings.maxSirenVolume}
          onToggleMaxSirenVolume={(val) => updateSetting('maxSirenVolume', val)}
          hapticFeedback={settings.hapticFeedback}
          onToggleHapticFeedback={(val) => updateSetting('hapticFeedback', val)}
        />

        {/* Section 5: Footer Actions & Version Info */}
        <SettingsFooter
          onBackupPress={backupSettingsToCloud}
          onResetPress={resetToDefaults}
          onLogoutPress={handleLogout}
        />

        {/* Clearance spacer for floating bottom nav */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Persistent Floating Bottom Nav */}
      <DashboardBottomNav
        activeTab="profile"
        onTabPress={handleTabPress}
        onSosPress={handleTriggerSos}
      />

      {/* Decoupled Emergency SOS Modal */}
      <EmergencySOSModal
        visible={isSosModalVisible}
        onDismiss={() => setIsSosModalVisible(false)}
      />
    </View>
  );
}

export default SystemSettingsScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  bottomSpacer: {
    height: 120,
  },
});
