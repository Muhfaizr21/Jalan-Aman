import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { CommunitySafetyReport } from '@/types/dashboard';
import { useIncidents } from '@/hooks/useIncidents';

interface CommunitySafetyFeedProps {
  onViewAllPress?: () => void;
  reports?: CommunitySafetyReport[];
  onReportPress?: (report: CommunitySafetyReport) => void;
}

/* Dynamic Feed Icon */
function FeedIcon({ size = 18, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 11h16M4 4h16M4 18h10"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Verified Badge Icon */
function VerifiedCheckIcon({ size = 12, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l2.4 2.8 3.7-.4 1 3.5 3.3 1.7-1 3.5 1.7 3.3-2.6 2.6.4 3.7-3.5 1-1.7 3.3-3.5-1-3.3 1.7-2.6-2.6-3.7.4-1-3.5-3.3-1.7 1-3.5-1.7-3.3 2.6-2.6-.4-3.7 3.5-1 1.7-3.3 3.5 1z"
        fill={DashboardTheme.colors.semanticAccentBg}
        stroke={color}
        strokeWidth={1.5}
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/* Thumbs Up Icon */
function ThumbsUpIcon({ size = 15, color = DashboardTheme.colors.primary, isFilled = false }: { size?: number; color?: string; isFilled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
        fill={isFilled ? color : 'none'}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Share Icon */
function ShareIcon({ size = 16, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const CommunitySafetyFeed: React.FC<CommunitySafetyFeedProps> = ({
  onViewAllPress,
  reports: propReports,
  onReportPress,
}) => {
  const { incidents, isLoading } = useIncidents();
  const [reports, setReports] = useState<CommunitySafetyReport[]>(propReports || []);

  useEffect(() => {
    if (propReports && propReports.length > 0) {
      setReports(propReports);
      return;
    }

    if (incidents && incidents.length > 0) {
      const mapped: CommunitySafetyReport[] = incidents.map((inc, idx) => ({
        id: inc.id,
        badgeType: inc.status === 'Verified' ? 'verified' : 'warning',
        badgeLabel: inc.status === 'Verified' ? 'Terverifikasi' : 'Laporan Warga',
        timeAgo: 'Baru saja',
        description: `${inc.title} - ${inc.description}`,
        confirmations: 12 + idx * 5,
        isConfirmed: false,
      }));
      setReports(mapped);
    }
  }, [incidents, propReports]);

  const toggleConfirm = (reportId: string) => {
    setReports((prev) =>
      prev.map((item) => {
        if (item.id === reportId) {
          const wasConfirmed = item.isConfirmed;
          return {
            ...item,
            isConfirmed: !wasConfirmed,
            confirmations: wasConfirmed ? item.confirmations - 1 : item.confirmations + 1,
          };
        }
        return item;
      })
    );
  };

  const handleShare = async (description: string) => {
    try {
      await Share.share({
        message: `[Info Keselamatan JalanAman]: ${description} #JalanAmanRadar`,
      });
    } catch {
      // ignore
    }
  };

  const getBadgeStyles = (type: CommunitySafetyReport['badgeType']) => {
    switch (type) {
      case 'verified':
        return {
          bg: DashboardTheme.colors.semanticAccentBg,
          text: DashboardTheme.colors.primary,
        };
      case 'warning':
        return {
          bg: DashboardTheme.colors.semanticWarningBg,
          text: DashboardTheme.colors.semanticWarning,
        };
      case 'safe_haven':
        return {
          bg: DashboardTheme.colors.semanticInfoBg,
          text: DashboardTheme.colors.semanticInfo,
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <FeedIcon size={19} />
          <Text style={styles.sectionTitle}>Laporan Komunitas</Text>
        </View>
        <TouchableOpacity
          onPress={onViewAllPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Lihat Semua Laporan Komunitas"
        >
          <Text style={styles.viewAllText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
        {reports.map((item) => {
          const badgeStyle = getBadgeStyles(item.badgeType);

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => onReportPress && onReportPress(item)}
              activeOpacity={0.9}
            >
              <View style={styles.cardTop}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                    <VerifiedCheckIcon size={12} color={badgeStyle.text} />
                    <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
                      {item.badgeLabel}
                    </Text>
                  </View>
                  <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
                </View>

                <Text style={styles.descriptionText} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => toggleConfirm(item.id)}
                  activeOpacity={0.7}
                >
                  <ThumbsUpIcon
                    size={15}
                    color={item.isConfirmed ? DashboardTheme.colors.primary : DashboardTheme.colors.textSecondary}
                    isFilled={item.isConfirmed}
                  />
                  <Text
                    style={[
                      styles.confirmText,
                      item.isConfirmed && { color: DashboardTheme.colors.primary, fontWeight: '700' },
                    ]}
                  >
                    {item.confirmations} Konfirmasi
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => handleShare(item.description)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Bagikan Laporan"
                >
                  <ShareIcon size={16} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: DashboardTheme.colors.primary,
  },
  carouselContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  card: {
    width: 260,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.lg,
    padding: 15,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
  },
  cardTop: {
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timeAgoText: {
    fontSize: 12,
    color: DashboardTheme.colors.textMuted,
  },
  descriptionText: {
    fontSize: 13,
    color: DashboardTheme.colors.textPrimary,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: DashboardTheme.colors.borderCard,
    paddingTop: 10,
    marginTop: 10,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  confirmText: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
    fontWeight: '500',
  },
  shareButton: {
    padding: 4,
  },
});
