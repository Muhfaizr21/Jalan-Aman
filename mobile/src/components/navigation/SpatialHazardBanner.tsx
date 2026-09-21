import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface SpatialHazardBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
  onApplyDeviation: () => void;
  onIgnoreHazard: () => void;
}

/* Warning Triangle Icon */
function WarningIcon({ size = 18, color = '#9D4300' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Close Icon */
function CloseIcon({ size = 16, color = DashboardTheme.colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Alt Route Deviation Icon */
function AltRouteIcon({ size = 14, color = DashboardTheme.colors.onPrimaryContainer }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 19H4.5A2.5 2.5 0 012 16.5v-9A2.5 2.5 0 014.5 5H9M15 5h4.5A2.5 2.5 0 0122 7.5v9a2.5 2.5 0 01-2.5 2.5H15M6 2l3 3-3 3M18 16l3 3-3 3"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * SpatialHazardBanner
 * Slide-down notification for spatial hazards ahead, offering 1-tap route deviation.
 */
export const SpatialHazardBanner: React.FC<SpatialHazardBannerProps> = ({
  isVisible,
  onDismiss,
  onApplyDeviation,
  onIgnoreHazard,
}) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  if (!isVisible) return null;

  const handleDismissWithAnim = (action: () => void) => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -8,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      action();
    });
  };

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        {
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <View style={styles.topRow}>
        {/* Warning Squircle */}
        <View style={styles.warningSquircle}>
          <WarningIcon size={18} />
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.titleText}>Peringatan Spasial: Titik Gelap</Text>
            <TouchableOpacity
              onPress={() => handleDismissWithAnim(onDismiss)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Tutup Peringatan"
            >
              <CloseIcon size={16} />
            </TouchableOpacity>
          </View>

          <Text style={styles.descriptionText}>
            250m di depan (Jl. Kebon Sirih) minim lampu jalan. Disarankan deviasi via Jl. Sabang.
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.deviationBtn}
              onPress={() => handleDismissWithAnim(onApplyDeviation)}
              activeOpacity={0.85}
            >
              <AltRouteIcon size={14} />
              <Text style={styles.deviationBtnText}>Gunakan Deviasi (+2 mnt)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ignoreBtn}
              onPress={() => handleDismissWithAnim(onIgnoreHazard)}
              activeOpacity={0.8}
            >
              <Text style={styles.ignoreBtnText}>Tetap di Rute</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(253, 118, 26, 0.25)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  warningSquircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBody: {
    flex: 1,
    minWidth: 0,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9D4300',
  },
  descriptionText: {
    fontSize: 12,
    lineHeight: 17,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  deviationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DashboardTheme.radius.full,
    shadowColor: DashboardTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  deviationBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.onPrimaryContainer,
  },
  ignoreBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: DashboardTheme.radius.full,
  },
  ignoreBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
});
