import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { TrustScoreDetails } from '@/types/profile';
import { useTrustScore } from '@/hooks/useTrustScore';

interface TrustScoreCircleCardProps {
  scoreData?: TrustScoreDetails;
  onPressDetails?: () => void;
}

const DEFAULT_SCORE_DATA: TrustScoreDetails = {
  score: 98,
  maxScore: 100,
  tierLabel: 'Skor Tinggi (Tier Emas)',
  tierStatus: 'Sangat Terpercaya',
  verifiedRoutesCount: 142,
  sosResponseRate: 99.4,
  violationsCount: 0,
};

/* Verified User Shield Icon */
function VerifiedShieldIcon({ size = 22, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
        fill={color}
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Route Navigation Icon */
function RouteIcon({ size = 18, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="19" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} />
      <Path
        d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/* Bolt / Fast Response Icon */
function BoltIcon({ size = 18, color = DashboardTheme.colors.skyBlue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Shield Safe Icon */
function ShieldIcon({ size = 18, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
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

export const TrustScoreCircleCard: React.FC<TrustScoreCircleCardProps> = ({
  scoreData: propScoreData,
  onPressDetails,
}) => {
  const { scoreData: hookScoreData, tierColor } = useTrustScore();
  const scoreData = propScoreData || hookScoreData;

  // SVG Circular Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16
  const strokeDashoffset = circumference - (circumference * scoreData.score) / scoreData.maxScore;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPressDetails}
      activeOpacity={onPressDetails ? 0.88 : 1}
      disabled={!onPressDetails}
      accessibilityRole={onPressDetails ? 'button' : undefined}
      accessibilityLabel={`Tingkat Kepercayaan ${scoreData.score} dari ${scoreData.maxScore}`}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <VerifiedShieldIcon size={22} color={tierColor} />
          <Text style={styles.headerTitle}>Tingkat Kepercayaan</Text>
        </View>
        <View style={[styles.tierBadge, { backgroundColor: '#F7FEE7' }]}>
          <Text style={[styles.tierBadgeText, { color: tierColor }]}>{scoreData.tierLabel}</Text>
        </View>
      </View>

      {/* Circular Gauge Center */}
      <View style={styles.gaugeContainer}>
        <View style={styles.gaugeWrapper}>
          <Svg width={140} height={140} viewBox="0 0 120 120" style={styles.svgGauge}>
            {/* Background Track Circle */}
            <Circle
              cx={60}
              cy={60}
              r={radius}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={11}
            />
            {/* Progress Active Arc */}
            <Circle
              cx={60}
              cy={60}
              r={radius}
              fill="none"
              stroke={tierColor || DashboardTheme.colors.primaryContainer}
              strokeWidth={11}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>

          {/* Center Metric */}
          <View style={styles.gaugeCenterContent}>
            <View style={styles.scoreNumberRow}>
              <Text style={styles.scoreText}>{scoreData.score}</Text>
              <Text style={styles.maxScoreText}>/{scoreData.maxScore}</Text>
            </View>
            <Text style={[styles.statusText, { color: tierColor }]}>{scoreData.tierStatus}</Text>
          </View>
        </View>
      </View>

      {/* Breakdown Mini Metrics (3 Columns) */}
      <View style={styles.metricsGrid}>
        {/* Metric 1 */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrapGreen}>
            <RouteIcon size={18} color={tierColor} />
          </View>
          <Text style={styles.metricValue}>{scoreData.verifiedRoutesCount}</Text>
          <Text style={styles.metricLabel}>Verifikasi Rute</Text>
        </View>

        {/* Metric 2 */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrapBlue}>
            <BoltIcon size={18} />
          </View>
          <Text style={styles.metricValue}>{scoreData.sosResponseRate}%</Text>
          <Text style={styles.metricLabel}>Respons SOS</Text>
        </View>

        {/* Metric 3 */}
        <View style={styles.metricItem}>
          <View style={styles.metricIconWrapGray}>
            <ShieldIcon size={18} />
          </View>
          <Text style={styles.metricValue}>{scoreData.violationsCount}</Text>
          <Text style={styles.metricLabel}>Pelanggaran</Text>
        </View>
      </View>

      {onPressDetails && (
        <View style={styles.detailsCtaRow}>
          <Text style={[styles.detailsCtaText, { color: tierColor }]}>
            Lihat Faktor Penentu & Hak Istimewa →
          </Text>
        </View>
      )}
    </TouchableOpacity>
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
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    flexShrink: 1,
  },
  tierBadge: {
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: DashboardTheme.radius.full,
    alignSelf: 'flex-start',
  },
  tierBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  gaugeWrapper: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svgGauge: {
    transform: [{ rotate: '-90deg' }],
  },
  gaugeCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreText: {
    fontSize: 34,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -1,
  },
  maxScoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: DashboardTheme.colors.textMuted,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
    marginTop: -2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  metricItem: {
    flex: 1,
    minWidth: 0,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: DashboardTheme.radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconWrapGreen: {
    width: 30,
    height: 30,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  metricIconWrapBlue: {
    width: 30,
    height: 30,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.semanticInfoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  metricIconWrapGray: {
    width: 30,
    height: 30,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10.5,
    color: DashboardTheme.colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  detailsCtaRow: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCtaText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
});

