import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { ReportTimelineStepData } from '@/types/communityReport';

interface IncidentLifecycleTimelineProps {
  reportId?: string;
  categoryLabel?: string;
  steps?: ReportTimelineStepData[];
}

const DEFAULT_STEPS: ReportTimelineStepData[] = [
  {
    id: 's1',
    title: 'Laporan Terkirim',
    time: '21:05 WIB',
    description: 'Diterima server & diverifikasi secara otomatis.',
    status: 'completed',
    icon: 'check',
  },
  {
    id: 's2',
    title: 'Verifikasi Warga & Sensor',
    time: '21:12 WIB',
    description: 'Terkonfirmasi melalui sensor pencahayaan smartphone 8 warga.',
    status: 'completed',
    icon: 'verified',
    badgeLabel: '8 Suara Terverifikasi',
  },
  {
    id: 's3',
    title: 'Diteruskan ke Tim Patroli / PLN',
    time: '21:18 WIB',
    description: 'Petugas Pos Pantau Polsek Jatibarang meluncur ke koordinat.',
    status: 'in_progress',
    icon: 'patrol',
  },
  {
    id: 's4',
    title: 'Bahaya Teratasi / Lampu Diperbaiki',
    time: 'Estimasi 21:45',
    description: 'Menunggu konfirmasi lapangan oleh tim posko.',
    status: 'pending',
    icon: 'done',
  },
];

function StepCheckIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StepVerifiedIcon({ size = 16, color = '#D97706' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l2.4 2.8 3.7-.4 1 3.5 3.3 1.7-1 3.5 1.7 3.3-2.6 2.6.4 3.7-3.5 1-1.7 3.3-3.5-1-3.3 1.7-2.6-2.6-3.7.4-1-3.5-3.3-1.7 1-3.5-1.7-3.3 2.6-2.6-.4-3.7 3.5-1 1.7-3.3 3.5 1z"
        stroke={color}
        strokeWidth={1.8}
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function StepTruckIcon({ size = 16, color = DashboardTheme.colors.skyBlue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth={2} />
      <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function StepPendingIcon({ size = 16, color = DashboardTheme.colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export const IncidentLifecycleTimeline: React.FC<IncidentLifecycleTimelineProps> = ({
  reportId = '#LAP-88219',
  categoryLabel = 'Penerangan Padam',
  steps = DEFAULT_STEPS,
}) => {
  const renderStepIcon = (step: ReportTimelineStepData) => {
    switch (step.icon) {
      case 'check':
        return <StepCheckIcon size={15} />;
      case 'verified':
        return <StepVerifiedIcon size={15} />;
      case 'patrol':
        return <StepTruckIcon size={15} />;
      default:
        return <StepPendingIcon size={15} />;
    }
  };

  const getStepStyles = (status: ReportTimelineStepData['status']) => {
    switch (status) {
      case 'completed':
        return {
          iconBg: DashboardTheme.colors.semanticAccentBg,
          titleColor: DashboardTheme.colors.textPrimary,
        };
      case 'in_progress':
        return {
          iconBg: DashboardTheme.colors.semanticInfoBg,
          titleColor: DashboardTheme.colors.textPrimary,
        };
      case 'pending':
      default:
        return {
          iconBg: DashboardTheme.colors.surfaceContainerLow,
          titleColor: DashboardTheme.colors.textMuted,
        };
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <Text style={styles.headerTitle}>Status Laporan Aktif Anda</Text>
          <Text style={styles.headerSubtitle}>
            ID: {reportId} ({categoryLabel})
          </Text>
        </View>

        <View style={styles.processBadge}>
          <Text style={styles.processBadgeText}>Proses</Text>
        </View>
      </View>

      {/* Vertical Timeline */}
      <View style={styles.timelineContainer}>
        {/* Connecting Vertical Line */}
        <View style={styles.connectingLine} />

        {steps.map((step, idx) => {
          const stepStyle = getStepStyles(step.status);
          const isLast = idx === steps.length - 1;

          return (
            <View key={step.id} style={[styles.stepItem, isLast && styles.stepItemLast]}>
              <View style={[styles.stepIconWrap, { backgroundColor: stepStyle.iconBg }]}>
                {renderStepIcon(step)}
              </View>

              <View style={styles.stepContentCol}>
                <View style={styles.stepTitleRow}>
                  <Text style={[styles.stepTitle, { color: stepStyle.titleColor }]} numberOfLines={1}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepTime}>{step.time}</Text>
                </View>

                <Text
                  style={[
                    styles.stepDesc,
                    step.status === 'pending' && { color: DashboardTheme.colors.textMuted },
                  ]}
                >
                  {step.description}
                </Text>

                {step.badgeLabel && (
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{step.badgeLabel}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xxl,
    padding: 16,
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
  headerTextCol: {
    gap: 2,
    flex: 1,
    minWidth: 160,
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textSecondary,
  },
  processBadge: {
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DashboardTheme.radius.full,
  },
  processBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: DashboardTheme.colors.onPrimaryContainer,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 4,
    gap: 16,
  },
  connectingLine: {
    position: 'absolute',
    left: 19,
    top: 16,
    bottom: 24,
    width: 2,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepItemLast: {
    marginBottom: 2,
  },
  stepIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepContentCol: {
    flex: 1,
    gap: 3,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },
  stepTime: {
    fontSize: 11,
    color: DashboardTheme.colors.textMuted,
  },
  stepDesc: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textSecondary,
    lineHeight: 16,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    marginTop: 2,
  },
  stepBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
});
