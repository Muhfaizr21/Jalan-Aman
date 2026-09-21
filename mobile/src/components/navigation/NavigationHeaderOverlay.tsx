import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface NavigationHeaderOverlayProps {
  isVoiceActive: boolean;
  onBackPress: () => void;
  onToggleVoice: () => void;
  onSosPress: () => void;
}

/* Arrow Back Icon */
function ArrowBackIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Volume Up / Off Icon */
function VolumeIcon({
  isActive,
  size = 19,
}: {
  isActive: boolean;
  size?: number;
}) {
  const color = isActive ? DashboardTheme.colors.textSecondary : DashboardTheme.colors.semanticAlert;
  if (!isActive) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Shield SOS Icon */
function ShieldIcon({ size = 19, color = DashboardTheme.colors.onPrimaryContainer }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill={color}
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

/**
 * NavigationHeaderOverlay
 * Top floating bar with back pill, pulsing active status indicator, voice toggle, and quick SOS shield.
 */
export const NavigationHeaderOverlay: React.FC<NavigationHeaderOverlayProps> = ({
  isVoiceActive,
  onBackPress,
  onToggleVoice,
  onSosPress,
}) => {
  // Pulse animation for the active radar ping dot
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2.2,
            duration: 1400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.8,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim, pulseOpacity]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Back Button */}
      <TouchableOpacity
        style={styles.circleButton}
        onPress={onBackPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Kembali ke layar sebelumnya"
      >
        <ArrowBackIcon size={20} />
      </TouchableOpacity>

      {/* Mode Indicator Pill */}
      <View style={styles.statusPill}>
        <View style={styles.pingContainer}>
          <Animated.View
            style={[
              styles.pingRipple,
              {
                transform: [{ scale: pulseAnim }],
                opacity: pulseOpacity,
              },
            ]}
          />
          <View style={styles.pingDot} />
        </View>
        <Text style={styles.statusText}>Navigasi Siaga Aktif</Text>
      </View>

      {/* Right Controls Group: Voice Mute Toggle & SOS Shield */}
      <View style={styles.rightGroup}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={onToggleVoice}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isVoiceActive ? 'Matikan panduan suara' : 'Aktifkan panduan suara'}
        >
          <VolumeIcon isActive={isVoiceActive} size={19} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={onSosPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Perlindungan Cepat Darurat"
        >
          <ShieldIcon size={19} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 10,
    zIndex: 50,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...DashboardTheme.shadows.card,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: DashboardTheme.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...DashboardTheme.shadows.card,
  },
  pingContainer: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pingRipple: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sosButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    ...DashboardTheme.shadows.card,
  },
});
