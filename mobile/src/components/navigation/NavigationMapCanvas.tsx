import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { RouteOptionType } from '@/types/navigation';
import { CirclegeoGisMap, DEFAULT_GIS_CENTER } from '@/components/gis';

import { StyleProp, ViewStyle } from 'react-native';

interface NavigationMapCanvasProps {
  selectedRoute: RouteOptionType;
  isTilt3D: boolean;
  isCctvLayerActive: boolean;
  onRecenter: () => void;
  onToggleTilt: () => void;
  onToggleCctvLayer: () => void;
  onOpenLayersModal?: () => void;
  onPinPress?: (pinName: string, detail: string) => void;
  showSafeRoute?: boolean;
  pitch?: number;
  bearing?: number;
  zoom?: number;
  style?: StyleProp<ViewStyle>;
  dockTop?: number;
}

/* Layers Map Filter Icon */
function LayersIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Recenter / My Location Icon */
function MyLocationIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth={2} />
      <Circle cx="12" cy="12" r="3" fill={color} />
      <Path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/* Video Cam / CCTV Icon */
function VideocamIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 10l5-3v10l-5-3v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h10a1 1 0 011 1v2z"
        fill={color}
      />
    </Svg>
  );
}

/**
 * NavigationMapCanvas
 * 3D ESRI Satellite GIS Navigation Canvas with real-time controls,
 * corridor route visualization, recenter action, and CCTV layer toggle.
 */
export const NavigationMapCanvas: React.FC<NavigationMapCanvasProps> = ({
  selectedRoute,
  isTilt3D,
  isCctvLayerActive,
  onRecenter,
  onToggleTilt,
  onToggleCctvLayer,
  onOpenLayersModal,
  onPinPress,
  showSafeRoute = true,
  pitch,
  bearing,
  zoom = 15.4,
  style,
  dockTop = 130,
}) => {
  const resolvedPitch = pitch !== undefined ? pitch : (isTilt3D ? 52 : 0);
  const resolvedBearing = bearing !== undefined ? bearing : (isTilt3D ? -20 : 0);

  return (
    <View style={[styles.outerContainer, style]}>
      {/* Real 3D Circlegeo ESRI Satellite GIS Map Engine */}
      <CirclegeoGisMap
        interactive={true}
        center={DEFAULT_GIS_CENTER}
        zoom={zoom}
        pitch={resolvedPitch}
        bearing={resolvedBearing}
        showSafeRoute={showSafeRoute}
        showCctvLayer={isCctvLayerActive}
        onPinPress={onPinPress}
      />

      {/* ================= MAP UTILITY ACTION DOCK (RIGHT ALIGNED) ================= */}
      <View style={[styles.utilityDock, { top: dockTop }]} pointerEvents="box-none">
        {/* Map Layers & Safety Filter Sheet */}
        {onOpenLayersModal && (
          <TouchableOpacity
            style={styles.utilityBtn}
            onPress={onOpenLayersModal}
            activeOpacity={0.8}
            accessibilityLabel="Pilih Lapisan Peta"
          >
            <LayersIcon size={20} />
          </TouchableOpacity>
        )}

        {/* Re-center GPS */}
        <TouchableOpacity
          style={styles.utilityBtn}
          onPress={onRecenter}
          activeOpacity={0.8}
          accessibilityLabel="Pusatkan Lokasi"
        >
          <MyLocationIcon size={20} />
        </TouchableOpacity>

        {/* 3D Perspective Tilt Toggle */}
        <TouchableOpacity
          style={[styles.utilityBtn, isTilt3D && styles.utilityBtnActive]}
          onPress={onToggleTilt}
          activeOpacity={0.8}
          accessibilityLabel="Mode 3D"
        >
          <Text
            style={[
              styles.tiltBtnText,
              isTilt3D && styles.tiltBtnTextActive,
            ]}
          >
            3D
          </Text>
        </TouchableOpacity>

        {/* CCTV & Safe Layer Filter */}
        <TouchableOpacity
          style={[styles.utilityBtn, isCctvLayerActive && styles.utilityBtnActive]}
          onPress={onToggleCctvLayer}
          activeOpacity={0.8}
          accessibilityLabel="Lapisan Keamanan"
        >
          <VideocamIcon
            size={20}
            color={
              isCctvLayerActive
                ? DashboardTheme.colors.primary
                : DashboardTheme.colors.textMuted
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#0B0F19',
    overflow: 'hidden',
    position: 'relative',
  },
  utilityDock: {
    position: 'absolute',
    right: 16,
    top: 130,
    gap: 10,
    zIndex: 25,
  },
  utilityBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  utilityBtnActive: {
    borderColor: DashboardTheme.colors.primary,
    backgroundColor: '#F7FEE7',
  },
  tiltBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: DashboardTheme.colors.textSecondary,
  },
  tiltBtnTextActive: {
    color: DashboardTheme.colors.primary,
  },
});
