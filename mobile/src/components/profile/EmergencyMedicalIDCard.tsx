import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { useAuth } from '@/hooks/useAuth';
import { MedicalIDData } from '@/types/profile';

interface EmergencyMedicalIDCardProps {
  medicalData?: MedicalIDData;
  onToggleLockScreen?: (enabled: boolean) => void;
}

/* Medical Kit Icon */
function MedicalKitIcon({ size = 22, color = DashboardTheme.colors.semanticAlert }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 3h6v4H9V3zM4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11v6M9 14h6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const EmergencyMedicalIDCard: React.FC<EmergencyMedicalIDCardProps> = ({
  medicalData,
  onToggleLockScreen,
}) => {
  const { user } = useAuth();
  const [isLockScreenEnabled, setIsLockScreenEnabled] = useState(
    medicalData?.showOnLockScreen ?? true
  );

  const displayBloodType = user?.blood_type || '-';
  const isFilled = Boolean(user?.blood_type && user.blood_type.trim() !== '');
  const displayRhesus = isFilled
    ? (!displayBloodType.includes('-') ? 'Rhesus Positif' : 'Rhesus Negatif')
    : 'Belum Dikonfigurasi';

  const vitals = [
    {
      label: 'Alergi Kritis',
      value: user?.allergies ? user.allergies : 'Tidak Ada Alergi Kritis',
      subValue: user?.allergies ? 'Tercatat di Profil Medis' : 'Belum ditambahkan di profil',
      indicatorColor: user?.allergies ? DashboardTheme.colors.semanticAlert : DashboardTheme.colors.textMuted,
    },
    {
      label: 'Kondisi Medis',
      value: user?.medical_notes ? user.medical_notes : 'Tidak Ada Catatan Khusus',
      subValue: user?.medical_notes ? 'Kondisi Kesehatan Terdaftar' : 'Belum ditambahkan di profil',
      indicatorColor: user?.medical_notes ? DashboardTheme.colors.semanticWarning : DashboardTheme.colors.textMuted,
    },
    {
      label: 'Fasilitas Kesehatan',
      value: user?.emergency_hospital ? user.emergency_hospital : 'RSUD Indramayu',
      subValue: 'Fasilitas Rujukan Siaga 24 Jam',
      indicatorColor: DashboardTheme.colors.semanticInfo,
    },
    {
      label: 'Status Siaga Warga',
      value: user?.status === 'Active' ? 'Warga Siaga Aktif' : 'Terverifikasi Komunitas',
      subValue: user?.role === 'Superadmin' ? 'Pusat Komando Indramayu' : 'JalanAman Shield',
      indicatorColor: DashboardTheme.colors.primary,
    },
  ];

  const handleToggle = (val: boolean) => {
    setIsLockScreenEnabled(val);
    if (onToggleLockScreen) {
      onToggleLockScreen(val);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.medicalIconWrapper}>
            <MedicalKitIcon size={22} />
          </View>
          <View style={styles.titleTextWrap}>
            <Text style={styles.headerTitle}>ID Medis Darurat</Text>
            <Text style={styles.headerSubtitle}>Akses cepat petugas saat insiden</Text>
          </View>
        </View>

        <View style={styles.lockBadge}>
          <Text style={styles.lockBadgeText}>Lock Screen</Text>
        </View>
      </View>

      {/* Blood Type Highlight */}
      <View style={styles.bloodTypeCard}>
        <View style={styles.bloodTypeDetails}>
          <Text style={styles.bloodLabel}>GOLONGAN DARAH</Text>
          <View style={styles.bloodValueRow}>
            <Text style={styles.bloodValueText}>{displayBloodType}</Text>
            <Text style={styles.rhesusText}>{displayRhesus}</Text>
          </View>
        </View>

        <View style={styles.donorBadge}>
          <View style={styles.donorDot} />
          <Text style={styles.donorText}>{medicalData?.donorLabel || 'Pendonor Sukarela Siaga'}</Text>
        </View>
      </View>

      {/* Vital Records 2x2 Grid */}
      <View style={styles.vitalsGrid}>
        {vitals.map((vital, index) => (
          <View key={index} style={styles.vitalItem}>
            <View style={styles.vitalTop}>
              <View
                style={[styles.vitalDot, { backgroundColor: vital.indicatorColor }]}
              />
              <Text style={styles.vitalLabel}>{vital.label}</Text>
            </View>
            <Text style={styles.vitalValue} numberOfLines={1}>
              {vital.value}
            </Text>
            <Text style={styles.vitalSubValue} numberOfLines={1}>
              {vital.subValue}
            </Text>
          </View>
        ))}
      </View>

      {/* Toggle Action */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextWrapper}>
          <Text style={styles.toggleTitle}>
            Tampilkan di Layar Kunci saat SOS Aktif
          </Text>
          <Text style={styles.toggleSubtitle}>
            Bisa dibaca paramedis tanpa buka PIN
          </Text>
        </View>

        <Switch
          value={isLockScreenEnabled}
          onValueChange={handleToggle}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xl,
    padding: 15,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 160,
  },
  medicalIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.semanticAlertBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextWrap: {
    gap: 1,
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textSecondary,
  },
  lockBadge: {
    backgroundColor: DashboardTheme.colors.semanticAlertBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DashboardTheme.radius.full,
  },
  lockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticAlert,
  },
  bloodTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: DashboardTheme.radius.lg,
    flexWrap: 'wrap',
    gap: 8,
  },
  bloodTypeDetails: {
    gap: 2,
  },
  bloodLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
    letterSpacing: 0.2,
  },
  bloodValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  bloodValueText: {
    fontSize: 26,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.5,
  },
  rhesusText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: DashboardTheme.colors.textMuted,
  },
  donorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.surfaceCard,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: DashboardTheme.radius.md,
    gap: 6,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
  },
  donorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: DashboardTheme.colors.semanticAlert,
  },
  donorText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vitalItem: {
    width: '48%',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: DashboardTheme.radius.md,
    padding: 11,
    gap: 3,
  },
  vitalTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vitalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  vitalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  vitalValue: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  vitalSubValue: {
    fontSize: 11,
    color: DashboardTheme.colors.textMuted,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  toggleTextWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
  },
  toggleSubtitle: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
});
