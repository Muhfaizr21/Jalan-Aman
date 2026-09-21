import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface AnomalyAlertBannerProps {
  onDismiss: () => void;
  onTriggerEmergency: () => void;
  initialSeconds?: number;
}

function CrisisAlertIcon({ size = 22, color = DashboardTheme.colors.semanticAlert }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M12 7v6M12 17h.01" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function TimerIcon({ size = 18, color = DashboardTheme.colors.semanticAlert }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="14" r="8" stroke={color} strokeWidth={2} />
      <Path d="M12 10v4l2.5 2.5M10 2h4M12 2v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function VerifiedShieldIcon({ size = 17, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EmergencySirenIcon({ size = 17, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a6 6 0 0 0-6 6v3H4v3h16v-3h-2V9a6 6 0 0 0-6-6z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M10 21h4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export const AnomalyAlertBanner: React.FC<AnomalyAlertBannerProps> = ({
  onDismiss,
  onTriggerEmergency,
  initialSeconds = 24,
}) => {
  const [countdown, setCountdown] = useState(initialSeconds);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Timer countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTriggerEmergency();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      pulseLoop.stop();
      clearInterval(timer);
    };
  }, [onTriggerEmergency, pulseAnim]);

  return (
    <View style={styles.card}>
      {/* Top Red Tint Accent */}
      <View style={styles.topAccentBar} />

      {/* Header Row */}
      <View style={styles.headerRow}>
        <Animated.View style={[styles.iconBox, { transform: [{ scale: pulseAnim }] }]}>
          <CrisisAlertIcon size={22} />
        </Animated.View>

        <View style={styles.headerTextWrap}>
          <View style={styles.badgeRow}>
            <View style={styles.pingDot} />
            <Text style={styles.badgeText}>Deteksi Bahaya Otomatis</Text>
          </View>
          <Text style={styles.cardTitle}>
            Sensor Mendeteksi Anomali: Tidak Ada Pergerakan &gt; 3 Menit
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        Apakah Anda baik-baik saja? Sirene lokal &amp; koordinat GPS real-time akan dipancarkan ke
        Lingkaran Pengawal dalam:
      </Text>

      {/* Countdown Display Pill */}
      <View style={styles.countdownPill}>
        <View style={styles.countdownLeft}>
          <TimerIcon size={18} />
          <Text style={styles.countdownLabel}>Hitung Mundur Otomatis</Text>
        </View>
        <View style={styles.countdownRight}>
          <Text style={styles.countdownValue}>
            00:{countdown < 10 ? `0${countdown}` : countdown}
          </Text>
          <Text style={styles.countdownUnit}>dtk</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onDismiss}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Saya Aman Batal"
        >
          <VerifiedShieldIcon size={17} />
          <Text style={styles.cancelButtonText} numberOfLines={1}>
            Saya Aman (Batal)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={onTriggerEmergency}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Kirim Bantuan Darurat"
        >
          <EmergencySirenIcon size={17} />
          <Text style={styles.emergencyButtonText} numberOfLines={1}>
            Kirim Bantuan
          </Text>
        </TouchableOpacity>
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
    borderColor: 'rgba(239, 68, 68, 0.25)',
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.semanticAlert,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.16,
        shadowRadius: 18,
      },
      android: {
        elevation: 4,
      },
    }),
    position: 'relative',
    overflow: 'hidden',
    gap: 12,
  },
  topAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: DashboardTheme.colors.semanticAlert,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DashboardTheme.colors.semanticAlertBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: DashboardTheme.colors.semanticAlertBg,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: DashboardTheme.radius.full,
    gap: 5,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DashboardTheme.colors.semanticAlert,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticAlert,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
    lineHeight: 17,
  },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    borderRadius: DashboardTheme.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  countdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  countdownLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  countdownRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  countdownValue: {
    fontSize: 24,
    fontWeight: '900',
    color: DashboardTheme.colors.semanticAlert,
    letterSpacing: -0.5,
  },
  countdownUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticAlert,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    borderRadius: DashboardTheme.radius.full,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: DashboardTheme.colors.semanticAlert,
    borderRadius: DashboardTheme.radius.full,
    paddingVertical: 12,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.semanticAlert,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  emergencyButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
