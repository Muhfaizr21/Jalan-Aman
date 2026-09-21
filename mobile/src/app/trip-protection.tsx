import React, { useState, useCallback, useEffect } from 'react';
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
  ProtectionHeader,
  AnomalyAlertBanner,
  ActiveTripTelemetryCard,
  DeadmanSwitchCard,
  LiveTripSharingCard,
  ArrivalSuccessModal,
} from '@/components/protection';
import { DashboardBottomNav } from '@/components/dashboard/DashboardBottomNav';
import { EmergencySOSModal } from '@/components/EmergencySOSModal';
import { DashboardTabId } from '@/types/dashboard';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { hardwareSensors, MotionTelemetrySample } from '@/services/hardwareSensors';
import { tripService, Trip } from '@/services/tripService';

/**
 * Modul 4: Proteksi Perjalanan & Deadman's Switch
 * Converted from modul4.html following Clean Code & SOLID principles.
 */
export function TripProtectionScreen() {
  const { settings } = useSystemSettings();
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [isAnomalyActive, setIsAnomalyActive] = useState(settings.anomalyDetection);
  const [isAudioActive, setIsAudioActive] = useState(settings.maxSirenVolume);
  const [isArrivalModalVisible, setIsArrivalModalVisible] = useState(false);
  const [isSosModalVisible, setIsSosModalVisible] = useState(false);

  // Sync active trip with backend
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        let current = await tripService.getActiveTrip();
        if (!current) {
          current = await tripService.startTrip({
            origin_name: 'Pos Pengawasan Jatibarang',
            destination_name: 'Pusat Kota Indramayu',
            origin_lat: -6.4741,
            origin_lng: 108.3075,
            dest_lat: -6.3263,
            dest_lng: 108.32,
          });
        }
        if (isMounted && current) {
          setActiveTrip(current);
        }
      } catch {
        // Offline or unauthenticated fallback
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pasang listener akselerometer guncangan 3D sesuai sensitivitas yang dipilih di Pengaturan
  useEffect(() => {
    hardwareSensors.startMotionDetection(settings.shockSensitivity, (sample: MotionTelemetrySample) => {
      // 1. Haptic alert
      if (settings.hapticFeedback) {
        hardwareSensors.triggerHaptic([250, 100, 250]);
      }

      // 2. Play emergency siren jika audio aktif
      if (isAudioActive) {
        hardwareSensors.playEmergencySiren(settings.maxSirenVolume);
      }

      // 3. Aktifkan banner anomali
      setIsAnomalyActive(true);

      Alert.alert(
        '🚨 Benturan / Guncangan Keras Terdeteksi!',
        `Sensor mendeteksi percepatan ${sample.totalG}G (Sensitivitas: ${settings.shockSensitivity.toUpperCase()}). Konfirmasi kondisi Anda sebelum peringatan otomatis terkirim ke Lingkaran Pengawal.`,
        [
          {
            text: 'Saya Baik-Baik Saja',
            onPress: () => {
              hardwareSensors.stopEmergencySiren();
              setIsAnomalyActive(false);
            },
          },
          {
            text: 'Butuh Bantuan Segera',
            style: 'destructive',
            onPress: () => {
              setIsSosModalVisible(true);
            },
          },
        ]
      );
    });

    return () => {
      hardwareSensors.stopEmergencySiren();
    };
  }, [settings.shockSensitivity, settings.maxSirenVolume, settings.hapticFeedback, isAudioActive]);

  // Sinkronkan state saat preferensi anomalyDetection diubah dari pengaturan
  useEffect(() => {
    if (!settings.anomalyDetection) {
      setIsAnomalyActive(false);
      hardwareSensors.stopEmergencySiren();
    }
  }, [settings.anomalyDetection]);

  // Navigation handlers
  const handleBack = useCallback(() => {
    hardwareSensors.stopEmergencySiren();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/navigation');
    }
  }, []);

  const handleToggleAudio = useCallback(() => {
    setIsAudioActive((prev) => {
      const nextState = !prev;
      if (!nextState) {
        hardwareSensors.stopEmergencySiren();
      }
      Alert.alert(
        nextState ? 'Sirene Aktif' : 'Sirene Senyap',
        nextState
          ? 'Sirene darurat otomatis akan berbunyi bila sensor anomali terpicu.'
          : 'Sirene dinonaktifkan. Mode pemantauan senyap aktif.'
      );
      return nextState;
    });
  }, []);

  const handleDismissAnomaly = useCallback(() => {
    hardwareSensors.stopEmergencySiren();
    setIsAnomalyActive(false);
    Alert.alert('Status Aman', 'Sensor anomali pergerakan dinormalisasi.');
  }, []);

  const handleTriggerEmergency = useCallback(() => {
    if (isAudioActive) {
      hardwareSensors.playEmergencySiren(settings.maxSirenVolume);
    }
    setIsSosModalVisible(true);
  }, [isAudioActive, settings.maxSirenVolume]);

  const handleArrivedSafely = useCallback(() => {
    hardwareSensors.stopEmergencySiren();
    setIsAnomalyActive(false);
    setIsArrivalModalVisible(true);
    if (activeTrip?.id) {
      tripService.completeTrip(activeTrip.id).catch(() => {});
      setActiveTrip(null);
    }
  }, [activeTrip]);

  const handleReturnHome = useCallback(() => {
    hardwareSensors.stopEmergencySiren();
    setIsArrivalModalVisible(false);
    router.replace('/');
  }, []);

  const handleTabChange = useCallback((tab: DashboardTabId) => {
    hardwareSensors.stopEmergencySiren();
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

      {/* Header with safe status bar calculation */}
      <ProtectionHeader
        onBack={handleBack}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
      />

      {/* Scrollable Content with ample bottom padding to clear floating nav */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Anomaly Detection Banner (Conditional) */}
        {isAnomalyActive && (
          <AnomalyAlertBanner
            onDismiss={handleDismissAnomaly}
            onTriggerEmergency={handleTriggerEmergency}
            initialSeconds={24}
          />
        )}

        {/* Active Route Telemetry Card */}
        <ActiveTripTelemetryCard />

        {/* Deadman's Switch Hero Card */}
        <DeadmanSwitchCard
          isEnabled={settings.autoDeadmanSwitch}
          onArrivedSafely={handleArrivedSafely}
          onTimerExpired={handleTriggerEmergency}
        />

        {/* Live Trip Sharing Card */}
        <LiveTripSharingCard />
      </ScrollView>

      {/* Safe Arrival Modal */}
      <ArrivalSuccessModal
        visible={isArrivalModalVisible}
        onReturnHome={handleReturnHome}
      />

      {/* Emergency SOS Modal Integration */}
      <EmergencySOSModal
        visible={isSosModalVisible}
        onDismiss={() => setIsSosModalVisible(false)}
      />

      {/* Floating Bottom Navigation */}
      <DashboardBottomNav
        activeTab="routes"
        onTabPress={handleTabChange}
        onSosPress={() => setIsSosModalVisible(true)}
      />
    </View>
  );
}

export default TripProtectionScreen;

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
});
