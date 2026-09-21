import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface DeadmanSwitchCardProps {
  onArrivedSafely: () => void;
  onTimerExpired?: () => void;
  initialSeconds?: number;
  isEnabled?: boolean;
}

function LockClockIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function MoreTimeIcon({ size = 16, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10" cy="14" r="7" stroke={color} strokeWidth={2} />
      <Path d="M10 11v3l2 1.5M19 8v6M16 11h6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function TuneIcon({ size = 16, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function CheckIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const DeadmanSwitchCard: React.FC<DeadmanSwitchCardProps> = ({
  onArrivedSafely,
  onTimerExpired,
  initialSeconds = 18 * 60 + 42, // 18:42
  isEnabled = true,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const maxRefSeconds = 25 * 60; // 25 minutes as full scale

  // SVG Circular Ring parameters
  const ringRadius = 64;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * ringRadius; // ~402.12

  useEffect(() => {
    if (!isEnabled) return; // Mode manual / nonaktif

    const timer = setInterval(() => {
      setTotalSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimerExpired) onTimerExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, onTimerExpired]);

  const handleAddMinutes = (minutes: number) => {
    setTotalSeconds((prev) => prev + minutes * 60);
  };

  const handleResetTimer = () => {
    setTotalSeconds(20 * 60);
  };

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressFraction = Math.max(0, Math.min(1, totalSeconds / maxRefSeconds));
  const strokeDashoffset = circumference * (1 - progressFraction);

  return (
    <View style={styles.card}>
      {/* Title & Description */}
      <View style={styles.headerRow}>
        <View style={styles.titleIconRow}>
          <LockClockIcon size={20} />
          <Text style={styles.headerTitle}>Deadman's Switch</Text>
        </View>
        <Text style={styles.headerDesc}>
          Jika timer habis tanpa konfirmasi, sinyal SOS otomatis terkirim ke Lingkaran Pengawal &amp; Pos Ronda.
        </Text>
      </View>

      {/* Circular Countdown Radial Ring */}
      <View style={styles.ringSection}>
        <View style={styles.svgContainer}>
          <Svg width={180} height={180} viewBox="0 0 160 160">
            {/* Background Track Ring */}
            <Circle
              cx={80}
              cy={80}
              r={ringRadius}
              stroke={DashboardTheme.colors.surfaceContainer}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active Progress Ring */}
            <Circle
              cx={80}
              cy={80}
              r={ringRadius}
              stroke={DashboardTheme.colors.primaryContainer}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform="rotate(-90 80 80)"
            />
          </Svg>

          {/* Center Metric Display */}
          <View style={styles.metricCenter}>
            <Text style={styles.metricLabel}>SISA WAKTU AMAN</Text>
            <Text style={styles.metricCountdown}>{formattedTime}</Text>
            <Text style={styles.metricUnit}>menit : detik</Text>
          </View>
        </View>

        {/* Motion Sensitivity Status Badge */}
        <View style={[styles.sensitivityBadge, !isEnabled && { backgroundColor: DashboardTheme.colors.surfaceContainer }]}>
          <View style={[styles.pingDot, !isEnabled && { backgroundColor: DashboardTheme.colors.textMuted }]} />
          <Text style={[styles.sensitivityText, !isEnabled && { color: DashboardTheme.colors.textSecondary }]}>
            {isEnabled ? 'Deadman Switch Siaga Aktif' : 'Deadman Switch Nonaktif (Manual)'}
          </Text>
        </View>
      </View>

      {/* Quick Time Adjuster Chips */}
      <View style={styles.chipsRow}>
        <TouchableOpacity
          style={styles.timeChip}
          onPress={() => handleAddMinutes(5)}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Tambah 5 Menit"
        >
          <MoreTimeIcon size={15} />
          <Text style={styles.timeChipText}>+5 mnt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeChip}
          onPress={() => handleAddMinutes(10)}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Tambah 10 Menit"
        >
          <MoreTimeIcon size={15} />
          <Text style={styles.timeChipText}>+10 mnt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.timeChip, styles.resetChip]}
          onPress={handleResetTimer}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Sesuaikan Timer"
        >
          <TuneIcon size={15} />
          <Text style={styles.resetChipText}>Sesuaikan</Text>
        </TouchableOpacity>
      </View>

      {/* Primary Safe Arrival CTA Button */}
      <TouchableOpacity
        style={styles.arrivedButton}
        onPress={onArrivedSafely}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Saya Sudah Sampai dengan Selamat"
      >
        <View style={styles.checkCircle}>
          <CheckIcon size={16} />
        </View>
        <Text style={styles.arrivedButtonText} numberOfLines={1}>
          Saya Sudah Sampai dengan Selamat
        </Text>
      </TouchableOpacity>
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
    gap: 4,
  },
  titleIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  headerDesc: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
    lineHeight: 17,
  },
  ringSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  svgContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  metricCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: DashboardTheme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metricCountdown: {
    fontSize: 34,
    fontWeight: '900',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -1,
  },
  metricUnit: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  sensitivityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: DashboardTheme.radius.full,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DashboardTheme.colors.primary,
  },
  sensitivityText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.onPrimaryContainer,
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: DashboardTheme.radius.full,
    gap: 5,
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  resetChip: {
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
  },
  resetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  arrivedButton: {
    backgroundColor: DashboardTheme.colors.primaryContainer,
    borderRadius: DashboardTheme.radius.xl,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.primaryContainer,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: DashboardTheme.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivedButtonText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
});
