import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { TurnInstructionData } from '@/types/navigation';

interface TurnByTurnCardProps {
  instructionData?: TurnInstructionData;
}

const DEFAULT_INSTRUCTION: TurnInstructionData = {
  distance: 180,
  unit: 'meter',
  instruction: 'Lurus melintas di Jl. Mayor Dasuki',
  nextStep: 'Lalu 320m menuju Safe Haven Polsek Jatibarang',
  cctvCount: 4,
  patrollerCount: 3,
};

/* Maneuver Turn Right Icon */
function TurnRightIcon({ size = 26, color = DashboardTheme.colors.onPrimaryContainer }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 19v-7a3 3 0 013-3h9"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 5l4 4-4 4"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Straight Navigation Icon */
function StraightIcon({ size = 15, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 19V5M5 12l7-7 7 7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Verified User Shield Icon */
function VerifiedShieldIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.15}
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * TurnByTurnCard
 * Floating instruction HUD showing immediate maneuver, distance metric, next turn preview,
 * and live safety corridor verification badge.
 */
export const TurnByTurnCard: React.FC<TurnByTurnCardProps> = ({
  instructionData = DEFAULT_INSTRUCTION,
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Top Maneuver Row */}
      <View style={styles.maneuverRow}>
        {/* Maneuver Icon in Lime Bubble */}
        <View style={styles.iconBubble}>
          <TurnRightIcon size={28} />
        </View>

        {/* Distance & Main Instruction */}
        <View style={styles.instructionBody}>
          <View style={styles.metricRow}>
            <Text style={styles.metricNumber}>{instructionData.distance}</Text>
            <Text style={styles.metricUnit}>{instructionData.unit}</Text>
          </View>
          <Text style={styles.instructionText} numberOfLines={2}>
            {instructionData.instruction}
          </Text>
        </View>
      </View>

      {/* Step 2 Preview & Corridor Badge */}
      <View style={styles.stepPreviewContainer}>
        <View style={styles.nextStepRow}>
          <StraightIcon size={15} />
          <Text style={styles.nextStepText} numberOfLines={1}>
            {instructionData.nextStep}
          </Text>
        </View>

        {/* Live Corridor Status Badge */}
        <View style={styles.corridorBadge}>
          <View style={styles.badgeLeft}>
            <View style={styles.activeDot} />
            <Text style={styles.corridorText}>
              Koridor Aman: {instructionData.cctvCount} CCTV & {instructionData.patrollerCount} Patroller Aktif
            </Text>
          </View>
          <VerifiedShieldIcon size={16} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  maneuverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBubble: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DashboardTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  instructionBody: {
    flex: 1,
    minWidth: 0,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    marginTop: 2,
  },
  stepPreviewContainer: {
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(241, 245, 249, 0.9)',
    gap: 8,
  },
  nextStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextStepText: {
    fontSize: 12,
    fontWeight: '500',
    color: DashboardTheme.colors.textSecondary,
    flex: 1,
  },
  corridorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  badgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  corridorText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
});
