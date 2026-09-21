import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { SensorSensitivityLevel } from '@/types/settings';

interface SensorsAutoProtectionSectionProps {
  anomalyDetection: boolean;
  onToggleAnomalyDetection: (val: boolean) => void;
  autoDeadmanSwitch: boolean;
  onToggleAutoDeadmanSwitch: (val: boolean) => void;
  shockSensitivity: SensorSensitivityLevel;
  onChangeShockSensitivity: (val: SensorSensitivityLevel) => void;
}

function SensorsWaveIcon({ size = 22, color = DashboardTheme.colors.semanticWarning }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4M4.93 19.07A10 10 0 0 1 2 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M6 12a6 6 0 0 1 6-6c2.5 0 4.6 1.5 5.5 3.7M7.76 16.24A6 6 0 0 1 6 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

export const SensorsAutoProtectionSection: React.FC<SensorsAutoProtectionSectionProps> = ({
  anomalyDetection,
  onToggleAnomalyDetection,
  autoDeadmanSwitch,
  onToggleAutoDeadmanSwitch,
  shockSensitivity,
  onChangeShockSensitivity,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <SensorsWaveIcon size={22} />
        </View>
        <View style={styles.headerTextCol}>
          <Text style={styles.titleText}>Sensor & Proteksi Otomatis</Text>
          <Text style={styles.subtitleText}>Respon keselamatan mandiri berbasis AI gerak</Text>
        </View>
      </View>

      {/* Item 1: Deteksi Anomali Diam */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextCol}>
          <Text style={styles.toggleTitle}>Deteksi Anomali Diam ({'>'}3 Menit)</Text>
          <Text style={styles.toggleDesc}>
            Kirim sinyal jika gerakan berhenti tiba-tiba di rute berisiko
          </Text>
        </View>
        <Switch
          value={anomalyDetection}
          onValueChange={onToggleAnomalyDetection}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor={DashboardTheme.colors.surfaceCard}
          accessibilityLabel="Aktifkan Deteksi Anomali Diam"
        />
      </View>

      <View style={styles.divider} />

      {/* Item 2: Deadman's Switch Otomatis */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextCol}>
          <View style={styles.titleWithBadgeRow}>
            <Text style={styles.toggleTitle}>Deadman's Switch Otomatis</Text>
            <View style={styles.warningBadge}>
              <Text style={styles.warningBadgeText}>Waspada</Text>
            </View>
          </View>
          <Text style={styles.toggleDesc}>
            Mulai hitung mundur konfirmasi saat memasuki zona rawan
          </Text>
        </View>
        <Switch
          value={autoDeadmanSwitch}
          onValueChange={onToggleAutoDeadmanSwitch}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor={DashboardTheme.colors.surfaceCard}
          accessibilityLabel="Aktifkan Deadmans Switch Otomatis"
        />
      </View>

      <View style={styles.divider} />

      {/* Item 3: Segmented Control Sensitivitas */}
      <View style={styles.segmentedBlock}>
        <View style={styles.segmentHeader}>
          <Text style={styles.toggleTitle}>Sensitivitas Guncangan & Tabrakan</Text>
          <Text style={styles.sensorBadge}>Akselerometer 3D</Text>
        </View>

        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              shockSensitivity === 'low' && styles.segmentBtnActive,
            ]}
            onPress={() => onChangeShockSensitivity('low')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentBtnText,
                shockSensitivity === 'low' && styles.segmentBtnTextActive,
              ]}
            >
              Rendah
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              shockSensitivity === 'medium' && styles.segmentBtnActive,
            ]}
            onPress={() => onChangeShockSensitivity('medium')}
            activeOpacity={0.8}
          >
            {shockSensitivity === 'medium' && <View style={styles.activeDot} />}
            <Text
              style={[
                styles.segmentBtnText,
                shockSensitivity === 'medium' && styles.segmentBtnTextActive,
              ]}
            >
              Sedang
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              shockSensitivity === 'high' && styles.segmentBtnActive,
            ]}
            onPress={() => onChangeShockSensitivity('high')}
            activeOpacity={0.8}
          >
            {shockSensitivity === 'high' && <View style={styles.activeDot} />}
            <Text
              style={[
                styles.segmentBtnText,
                shockSensitivity === 'high' && styles.segmentBtnTextActive,
              ]}
            >
              Tinggi
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.helperText}>
          Mode 'Sedang' menyaring guncangan lubang jalan umum.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 22,
    padding: 16,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: DashboardTheme.colors.semanticWarningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingVertical: 4,
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  titleWithBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  warningBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    backgroundColor: DashboardTheme.colors.semanticWarningBg,
  },
  warningBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticWarning,
  },
  toggleDesc: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    marginVertical: 12,
  },
  segmentedBlock: {
    paddingTop: 4,
  },
  segmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sensorBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    borderRadius: 999,
    padding: 3,
    gap: 4,
    marginBottom: 8,
  },
  segmentBtn: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  segmentBtnActive: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  segmentBtnTextActive: {
    color: DashboardTheme.colors.textPrimary,
    fontWeight: '800',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  helperText: {
    fontSize: 11,
    color: DashboardTheme.colors.textMuted,
    textAlign: 'center',
  },
});
