import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface QuickActionGridProps {
  onStartRoutePress?: () => void;
  onReportHazardPress?: () => void;
  onSheltersPress?: () => void;
  onContactsPress?: () => void;
  contactsCount?: number;
}

/* Turn Sharp Right / Navigation Arrow Icon */
function NavigationArrowIcon({ size = 22, color = DashboardTheme.colors.onPrimaryContainer }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 18V8a2 2 0 0 1 2-2h8m-3-3l4 4-4 4"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Hazard Triangle / Report Icon */
function HazardTriangleIcon({ size = 22, color = DashboardTheme.colors.semanticWarning }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

/* Shelter / Tent Icon */
function ShelterIcon({ size = 22, color = DashboardTheme.colors.semanticInfo }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 21h18M12 3L2 19h20L12 3zM12 14v7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Contact Phone / Guardian Icon */
function ContactPhoneIcon({ size = 22, color = DashboardTheme.colors.semanticAlert }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({
  onStartRoutePress,
  onReportHazardPress,
  onSheltersPress,
  onContactsPress,
  contactsCount = 3,
}) => {
  return (
    <View style={styles.gridContainer}>
      {/* Row 1 */}
      <View style={styles.gridRow}>
        {/* Mulai Rute */}
        <TouchableOpacity
          style={styles.card}
          onPress={onStartRoutePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Mulai Rute Terproteksi"
        >
          {/* Top-Right Decorative Corner Glow */}
          <View style={styles.cornerAccentGlow} />

          <View style={styles.routeIconWrapper}>
            <NavigationArrowIcon size={22} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Mulai Rute</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              Navigasi terpantau CCTV 24/7
            </Text>
          </View>
        </TouchableOpacity>

        {/* Lapor Bahaya */}
        <TouchableOpacity
          style={styles.card}
          onPress={onReportHazardPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Lapor Bahaya Sekitar"
        >
          <View style={styles.warningIconWrapper}>
            <HazardTriangleIcon size={22} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Lapor Bahaya</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              Laporkan titik gelap / sepi
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Row 2 */}
      <View style={styles.gridRow}>
        {/* Shelter Dekat */}
        <TouchableOpacity
          style={styles.card}
          onPress={onSheltersPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Lihat Shelter Dekat"
        >
          <View style={styles.infoIconWrapper}>
            <ShelterIcon size={22} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Shelter Dekat</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              3 titik aman &lt; 500m
            </Text>
          </View>
        </TouchableOpacity>

        {/* Kontak Siaga */}
        <TouchableOpacity
          style={styles.card}
          onPress={onContactsPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Kontak Darurat dan Siaga"
        >
          <View style={styles.contactsTopRow}>
            <View style={styles.alertIconWrapper}>
              <ContactPhoneIcon size={22} />
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{contactsCount}</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Kontak Siaga</Text>
            <Text style={styles.cardSubtitle} numberOfLines={2}>
              Keluarga & Patroli RW
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    height: 142,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xl,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    position: 'relative',
    overflow: 'hidden',
    ...DashboardTheme.shadows.card,
  },
  cornerAccentGlow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: 60,
    borderBottomLeftRadius: 60,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
  },
  routeIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.semanticWarningBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.semanticInfoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.semanticAlertBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  cardContent: {
    gap: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: DashboardTheme.colors.textSecondary,
    lineHeight: 16,
  },
});
