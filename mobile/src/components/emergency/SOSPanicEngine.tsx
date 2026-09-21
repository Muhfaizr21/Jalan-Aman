import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface SOSPanicEngineProps {
  onTriggerSOS?: (data: { isSilent: boolean }) => void;
  title?: string;
  subtitle?: string;
}

function AlertExclamationIcon({ size = 42, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      <Path d="M12 7v4" stroke="#DC2626" strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx="12" cy="14" r="1.2" fill="#DC2626" />
    </Svg>
  );
}

function VolumeOffIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
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

const TOTAL_CIRCUMFERENCE = 465; // 2 * Math.PI * 74 approx

export const SOSPanicEngine: React.FC<SOSPanicEngineProps> = ({
  onTriggerSOS,
  title = 'Pusat Darurat & Safe Haven',
  subtitle = 'Akses kilat proteksi keselamatan & evakuasi 24 jam',
}) => {
  const [isSilent, setIsSilent] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [isHolding, setIsHolding] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);

  // Concentric Ripple Wave Animations
  const rippleAnim1 = useRef(new Animated.Value(1)).current;
  const rippleAnim2 = useRef(new Animated.Value(1)).current;
  const holdIntervalRef = useRef<any>(null);

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(rippleAnim1, {
          toValue: 1.25,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(rippleAnim2, {
          toValue: 1.45,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim2, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    loop1.start();
    loop2.start();

    return () => {
      loop1.stop();
      loop2.stop();
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [rippleAnim1, rippleAnim2]);

  const triggerEmergency = useCallback(() => {
    setIsTriggered(true);
    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate([200, 100, 200, 100, 500]);
      } catch (e) {
        // Safe fallback
      }
    }
    if (onTriggerSOS) {
      onTriggerSOS({ isSilent });
    }
  }, [isSilent, onTriggerSOS]);

  const handlePressIn = () => {
    setIsHolding(true);
    setIsTriggered(false);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 3000;

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setHoldProgress(progress);

      if (progress >= 1) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        triggerEmergency();
      }
    }, 40);
  };

  const handlePressOut = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    if (holdProgress < 1) {
      setHoldProgress(0);
    }
  };

  // SVG Circular Dashoffset
  const strokeDashoffset = TOTAL_CIRCUMFERENCE - holdProgress * TOTAL_CIRCUMFERENCE;

  // Feedback Text computation
  let feedbackText = 'Kirim sinyal darurat, alarm keras & koordinat real-time';
  let isAlertState = false;

  if (isTriggered) {
    feedbackText = isSilent
      ? '✓ S.O.S SENYAP TERKIRIM: Koordinat disalurkan ke Polsek & Kontak Inti!'
      : '🚨 DARURAT AKTIF: Sirene berbunyi & tim bantuan dikirimkan!';
    isAlertState = true;
  } else if (isHolding) {
    feedbackText = isSilent
      ? 'Mengirim S.O.S Senyap dalam 3 detik...'
      : 'Menahan tombol... Alarm & sirene darurat bersiap!';
    isAlertState = true;
  }

  return (
    <View style={styles.container}>
      {/* Header text */}
      <View style={styles.headerBlock}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>

      {/* SOS Button Anchor */}
      <View style={styles.sosButtonAnchor}>
        {/* Ripple Wave Rings */}
        <Animated.View
          style={[
            styles.rippleRing,
            styles.rippleRingOuter,
            { transform: [{ scale: rippleAnim2 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.rippleRing,
            styles.rippleRingInner,
            { transform: [{ scale: rippleAnim1 }] },
          ]}
        />

        {/* Main Touch Button */}
        <TouchableOpacity
          style={styles.sosButton}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.92}
          accessibilityLabel="Tekan tombol SOS darurat selama 3 detik"
          accessibilityRole="button"
        >
          <AlertExclamationIcon size={38} />
          <Text style={styles.sosBtnTitle}>SOS 3 DETIK</Text>
          <Text style={styles.sosBtnSub}>
            {isHolding ? `${Math.ceil((1 - holdProgress) * 3)}s Lagi...` : 'Tahan Tombol'}
          </Text>
        </TouchableOpacity>

        {/* Circular Progress SVG Overlay */}
        <View style={styles.svgOverlay} pointerEvents="none">
          <Svg width={164} height={164} viewBox="0 0 160 160">
            <Circle
              cx="80"
              cy="80"
              r="74"
              fill="transparent"
              stroke={DashboardTheme.colors.accentNeon}
              strokeWidth="6"
              strokeDasharray={`${TOTAL_CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          </Svg>
        </View>
      </View>

      {/* Dynamic Feedback Text */}
      <Text
        style={[
          styles.feedbackText,
          isAlertState && styles.feedbackTextAlert,
          isTriggered && styles.feedbackTextTriggered,
        ]}
      >
        {feedbackText}
      </Text>

      {/* Silent SOS Toggle Card */}
      <View style={styles.silentToggleCard}>
        <View style={styles.silentToggleLeft}>
          <View style={styles.silentIconBox}>
            <VolumeOffIcon size={20} />
          </View>
          <View style={styles.silentTextBox}>
            <Text style={styles.silentTitle}>Mode Senyap (Silent SOS)</Text>
            <Text style={styles.silentSubtitle}>Kirim lokasi tanpa sirene suara</Text>
          </View>
        </View>
        <Switch
          value={isSilent}
          onValueChange={setIsSilent}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor={DashboardTheme.colors.surfaceCard}
          accessibilityLabel="Aktifkan Mode Senyap"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 28,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DashboardTheme.colors.semanticAlert,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 13,
    color: DashboardTheme.colors.textSecondary,
    textAlign: 'center',
  },
  sosButtonAnchor: {
    width: 210,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  rippleRing: {
    position: 'absolute',
    borderRadius: 999,
  },
  rippleRingOuter: {
    width: 200,
    height: 200,
    backgroundColor: DashboardTheme.colors.semanticAlertBg,
    opacity: 0.45,
  },
  rippleRingInner: {
    width: 172,
    height: 172,
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    opacity: 0.6,
  },
  sosButton: {
    width: 148,
    height: 148,
    borderRadius: 74,
    backgroundColor: DashboardTheme.colors.semanticAlert,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DashboardTheme.colors.semanticAlert,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
    zIndex: 10,
  },
  sosBtnTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  sosBtnSub: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 2,
  },
  svgOverlay: {
    position: 'absolute',
    width: 164,
    height: 164,
    zIndex: 20,
  },
  feedbackText: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    lineHeight: 18,
    fontWeight: '500',
  },
  feedbackTextAlert: {
    color: DashboardTheme.colors.semanticAlert,
    fontWeight: '700',
  },
  feedbackTextTriggered: {
    color: DashboardTheme.colors.semanticAlert,
    fontWeight: '900',
  },
  silentToggleCard: {
    width: '100%',
    marginTop: 16,
    padding: 12,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  silentToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  silentIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  silentTextBox: {
    flex: 1,
  },
  silentTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  silentSubtitle: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 1,
  },
});
