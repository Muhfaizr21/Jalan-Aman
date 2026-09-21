import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { CirclegeoGisMap, DEFAULT_GIS_CENTER } from '@/components/gis';

interface AmbientSafetyMapCardProps {
  onLayerToggle?: () => void;
  onSafeHavenPress?: (havenName: string) => void;
  onHazardPress?: (hazardName: string) => void;
  onMapPress?: () => void;
  verifiedPercentage?: number;
  radiusText?: string;
}

/* Explore Compass Icon */
function ExploreIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"
        fill={color}
      />
    </Svg>
  );
}

/* Layers Icon */
function LayersIcon({ size = 14, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
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

/* Shield Check Icon */
function ShieldIcon({ size = 18, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="rgba(132, 204, 22, 0.2)"
        stroke={color}
        strokeWidth={2}
      />
    </Svg>
  );
}

export const AmbientSafetyMapCard: React.FC<AmbientSafetyMapCardProps> = ({
  onLayerToggle,
  onSafeHavenPress,
  onHazardPress,
  onMapPress,
  verifiedPercentage = 94,
  radiusText = 'Radius 500m',
}) => {
  const [isCctvActive, setIsCctvActive] = useState(true);

  const handleLayerToggle = () => {
    setIsCctvActive(!isCctvActive);
    if (onLayerToggle) onLayerToggle();
  };

  return (
    <View style={styles.cardContainer}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <ExploreIcon size={20} />
          <Text style={styles.headerTitle}>Koridor Aman Sekitar</Text>
        </View>
        <TouchableOpacity
          style={[styles.layerButton, isCctvActive && styles.layerButtonActive]}
          onPress={handleLayerToggle}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Filter Layer CCTV dan Patroli"
        >
          <LayersIcon size={14} color={isCctvActive ? '#FFFFFF' : DashboardTheme.colors.textSecondary} />
          <Text style={[styles.layerButtonText, isCctvActive && styles.layerButtonTextActive]}>
            CCTV • Patroli
          </Text>
        </TouchableOpacity>
      </View>

      {/* Circlegeo 3D ESRI Satellite GIS Map Canvas */}
      <View style={styles.mapCanvas}>
        <CirclegeoGisMap
          interactive={true}
          center={DEFAULT_GIS_CENTER}
          zoom={14.8}
          pitch={38}
          bearing={-15}
          showSafeRoute={true}
          showCctvLayer={isCctvActive}
          onPinPress={onHazardPress}
        />

        {/* Floating Quick Action: Open Full Routes */}
        <TouchableOpacity
          style={styles.expandMapButton}
          onPress={onMapPress}
          activeOpacity={0.85}
          accessibilityLabel="Buka Peta Navigasi Interaktif"
        >
          <Text style={styles.expandMapButtonText}>Buka Navigasi Rute ›</Text>
        </TouchableOpacity>
      </View>

      {/* Verified Safe Percentage Bar */}
      <View style={styles.footerRow}>
        <View style={styles.verifiedPercentRow}>
          <ShieldIcon size={18} />
          <Text style={styles.verifiedPercentText}>
            {verifiedPercentage}% Jalur Terverifikasi Aman
          </Text>
        </View>
        <Text style={styles.radiusText}>{radiusText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xxl,
    padding: 16,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  layerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: DashboardTheme.radius.full,
  },
  layerButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  layerButtonActive: {
    backgroundColor: DashboardTheme.colors.primary,
  },
  layerButtonTextActive: {
    color: '#0B0F19',
  },
  mapCanvas: {
    width: '100%',
    height: 220,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    borderRadius: DashboardTheme.radius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  expandMapButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 20,
  },
  expandMapButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A3E635',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  verifiedPercentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  verifiedPercentText: {
    fontSize: 13,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
  },
  radiusText: {
    fontSize: 11,
    fontWeight: '500',
    color: DashboardTheme.colors.textSecondary,
  },
});
