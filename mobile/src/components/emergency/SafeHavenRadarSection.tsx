import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { SafeHavenItem } from '@/types/emergencyCenter';
import { useShelters } from '@/hooks/useShelters';

interface SafeHavenRadarSectionProps {
  shelters?: SafeHavenItem[];
  onEvacuatePress?: (shelter: SafeHavenItem) => void;
  onViewMapPress?: (shelter: SafeHavenItem) => void;
  onViewAllShelters?: () => void;
}

const DEFAULT_SHELTERS: SafeHavenItem[] = [
  {
    id: 'shelter_1',
    name: 'Polsek Jatibarang (Siaga 24 Jam)',
    address: 'Jl. Mayor Dasuki No. 12',
    distanceMeters: 320,
    etaMinutes: 2,
    badges: [
      { id: 'b1', label: 'Petugas Siaga 24 Jam', icon: 'shield', colorType: 'primary' },
      { id: 'b2', label: 'Penerangan Tinggi', icon: 'light_mode', colorType: 'secondary' },
      { id: 'b3', label: 'CCTV Aktif', icon: 'videocam', colorType: 'tertiary' },
    ],
    actionType: 'evacuate_now',
    actionLabel: 'Evakuasi ke Sini Sekarang',
  },
  {
    id: 'shelter_2',
    name: 'Indomaret 24 Jam Bulak',
    address: 'Jl. Raya Bulak No. 45',
    distanceMeters: 580,
    etaMinutes: 4,
    badges: [
      { id: 'b4', label: 'Staf 24 Jam', icon: 'store', colorType: 'alert' },
      { id: 'b5', label: 'Area Terbuka Ramai', icon: 'group', colorType: 'tertiary' },
    ],
    actionType: 'evacuate_now',
    actionLabel: 'Evakuasi ke Sini Sekarang',
  },
  {
    id: 'shelter_3',
    name: 'Pos Satpam Perum Griya Jatibarang',
    address: 'Gerbang Utama Griya Asri',
    distanceMeters: 850,
    etaMinutes: 6,
    badges: [
      { id: 'b6', label: 'Satpam Siaga', icon: 'shield', colorType: 'muted' },
      { id: 'b7', label: 'Parkir Terang PJU', icon: 'wb_sunny', colorType: 'secondary' },
    ],
    actionType: 'view_route_map',
    actionLabel: 'Peta Rute Perlindungan',
  },
];

function NearMeIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11l19-9-9 19-2-8-8-2z"
        stroke={color}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.15}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WalkingDirectionIcon({ size = 18, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="13.5" cy="4.5" r="2.5" fill={color} />
      <Path
        d="M13.5 7L10 13l3 2v6m-3-6l-3-2V9l3-2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MapPinIcon({ size = 18, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l-6-3V3l6 3 6-3 6 3v15l-6-3-6 3z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 6v15M15 3v15" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ChevronRightMiniIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BadgeMiniIcon({
  icon,
  colorType,
}: {
  icon: SafeHavenItem['badges'][0]['icon'];
  colorType: SafeHavenItem['badges'][0]['colorType'];
}) {
  let color: string = DashboardTheme.colors.primary;
  if (colorType === 'secondary') color = DashboardTheme.colors.semanticWarning;
  if (colorType === 'tertiary') color = DashboardTheme.colors.semanticInfo;
  if (colorType === 'alert') color = DashboardTheme.colors.semanticAlert;
  if (colorType === 'muted') color = DashboardTheme.colors.textSecondary;

  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="6" fill={color} />
    </Svg>
  );
}

export const SafeHavenRadarSection: React.FC<SafeHavenRadarSectionProps> = ({
  shelters: propShelters,
  onEvacuatePress,
  onViewMapPress,
  onViewAllShelters,
}) => {
  const { shelters: liveShelters, isLoading } = useShelters();
  const shelters = propShelters && propShelters.length > 0 ? propShelters : liveShelters;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconBox}>
            <NearMeIcon size={18} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Safe Haven Terdekat</Text>
            <Text style={styles.sectionSub}>Radar Evakuasi Cepat 24 Jam</Text>
          </View>
        </View>
        <View style={styles.countBadge}>
          {isLoading && shelters.length === 0 ? (
            <ActivityIndicator size="small" color={DashboardTheme.colors.primary} />
          ) : (
            <Text style={styles.countBadgeText}>{shelters.length} Titik Terverifikasi</Text>
          )}
        </View>
      </View>

      {/* Shelter Cards */}
      <View style={styles.shelterList}>
        {shelters.map((shelter) => {
          const isEvacuation = shelter.actionType === 'evacuate_now';

          return (
            <View key={shelter.id} style={styles.shelterCard}>
              {/* Card Top: Name & Metrics */}
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleCol}>
                  <Text style={styles.shelterName} numberOfLines={1}>
                    {shelter.name}
                  </Text>
                  <Text style={styles.shelterAddress} numberOfLines={1}>
                    {shelter.address}
                  </Text>
                </View>

                {/* Distance & ETA */}
                <View style={styles.metricCol}>
                  <Text style={styles.metricDistance}>{shelter.distanceMeters}</Text>
                  <Text style={styles.metricUnit}>m</Text>
                  <Text style={styles.metricSeparator}>•</Text>
                  <Text style={styles.metricEta}>{shelter.etaMinutes}</Text>
                  <Text style={styles.metricUnit}>mnt</Text>
                </View>
              </View>

              {/* Badges */}
              <View style={styles.badgesRow}>
                {shelter.badges.map((b) => (
                  <View key={b.id} style={styles.badgePill}>
                    <BadgeMiniIcon icon={b.icon} colorType={b.colorType} />
                    <Text style={styles.badgeLabel}>{b.label}</Text>
                  </View>
                ))}
              </View>

              {/* Action Button */}
              {isEvacuation ? (
                <TouchableOpacity
                  style={styles.evacuateBtn}
                  onPress={() => onEvacuatePress && onEvacuatePress(shelter)}
                  activeOpacity={0.85}
                  accessibilityLabel={`Evakuasi ke ${shelter.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.evacuateBtnText}>{shelter.actionLabel}</Text>
                  <WalkingDirectionIcon size={18} color={DashboardTheme.colors.textPrimary} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.mapBtn}
                  onPress={() => onViewMapPress && onViewMapPress(shelter)}
                  activeOpacity={0.85}
                  accessibilityLabel={`Lihat peta ke ${shelter.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.mapBtnText}>{shelter.actionLabel}</Text>
                  <MapPinIcon size={18} color={DashboardTheme.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* View All Shelters CTA Button */}
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={onViewAllShelters ? onViewAllShelters : () => router.push('/shelters')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Buka seluruh direktori shelter"
        >
          <Text style={styles.viewAllBtnText}>Buka Seluruh Direktori Safe Haven (12 Titik)</Text>
          <ChevronRightMiniIcon size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 26,
    padding: 16,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 1,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(132, 204, 22, 0.15)',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  shelterList: {
    gap: 12,
  },
  shelterCard: {
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: 20,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  cardTitleCol: {
    flex: 1,
  },
  shelterName: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.1,
  },
  shelterAddress: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
  metricCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    flexShrink: 0,
  },
  metricDistance: {
    fontSize: 17,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  metricEta: {
    fontSize: 17,
    fontWeight: '800',
    color: DashboardTheme.colors.primary,
  },
  metricUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: DashboardTheme.colors.textMuted,
  },
  metricSeparator: {
    fontSize: 10,
    color: DashboardTheme.colors.textMuted,
    marginHorizontal: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
  },
  evacuateBtn: {
    width: '100%',
    height: 44,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: DashboardTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 3,
  },
  evacuateBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  mapBtn: {
    width: '100%',
    height: 42,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  mapBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewAllBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
});
