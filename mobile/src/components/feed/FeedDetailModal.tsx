import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { router } from 'expo-router';

export interface FeedDetailItem {
  id: string;
  title: string;
  categoryLabel: string;
  categoryType: 'danger' | 'warning' | 'verified' | 'safe_haven';
  location: string;
  distance: string;
  timeAgo: string;
  description: string;
  confirmations: number;
  isConfirmed?: boolean;
  reporterName: string;
  statusUpdate: string;
  routeAdvice: string;
  indicators: Array<{
    icon: 'cctv' | 'light' | 'patrol' | 'water' | 'police';
    label: string;
    value: string;
    isPositive?: boolean;
  }>;
}

interface FeedDetailModalProps {
  visible: boolean;
  item: FeedDetailItem | null;
  onClose: () => void;
  onToggleConfirm?: (id: string) => void;
}

function CloseIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LocationPinIcon({ size = 18, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function ThumbsUpIcon({ size = 16, color = DashboardTheme.colors.primary, isFilled = false }: { size?: number; color?: string; isFilled?: boolean }) {
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

function RouteIcon({ size = 18, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="6" cy="19" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} />
      <Path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function ShareIcon({ size = 18, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={2} />
      <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={2} />
      <Path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function VerifiedShieldIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.15}
        strokeLinecap="round"
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export const FeedDetailModal: React.FC<FeedDetailModalProps> = ({
  visible,
  item,
  onClose,
  onToggleConfirm,
}) => {
  if (!item) return null;

  const getBadgeStyle = () => {
    switch (item.categoryType) {
      case 'danger':
        return { bg: DashboardTheme.colors.semanticAlertBg, text: DashboardTheme.colors.semanticAlert };
      case 'warning':
        return { bg: DashboardTheme.colors.semanticWarningBg, text: DashboardTheme.colors.semanticWarning };
      case 'safe_haven':
        return { bg: DashboardTheme.colors.semanticInfoBg, text: DashboardTheme.colors.semanticInfo };
      default:
        return { bg: DashboardTheme.colors.semanticAccentBg, text: DashboardTheme.colors.primary };
    }
  };

  const badgeTheme = getBadgeStyle();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `📢 Laporan Keamanan JalanAman [${item.categoryLabel}]:\n${item.title}\nLokasi: ${item.location} (${item.distance})\n"${item.description}"\n\nSaran: ${item.routeAdvice}`,
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleReroute = () => {
    onClose();
    router.push('/navigation');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header Bar */}
          <View style={styles.modalHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: badgeTheme.bg }]}>
              <Text style={[styles.categoryBadgeText, { color: badgeTheme.text }]}>
                {item.categoryLabel}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Tutup Detail"
              accessibilityRole="button"
            >
              <CloseIcon size={18} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Title & Location */}
            <Text style={styles.titleText}>{item.title}</Text>

            <View style={styles.locationRow}>
              <LocationPinIcon size={16} />
              <Text style={styles.locationText}>{item.location}</Text>
              <Text style={styles.distanceText}>• {item.distance}</Text>
            </View>

            <View style={styles.timeReporterRow}>
              <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
              <Text style={styles.reporterText}>Oleh: {item.reporterName}</Text>
            </View>

            {/* Live Status Telemetry Box */}
            <View style={styles.statusBox}>
              <View style={styles.statusBoxHeader}>
                <VerifiedShieldIcon size={16} />
                <Text style={styles.statusBoxTitle}>Status Penanganan Terpadu</Text>
              </View>
              <Text style={styles.statusBoxText}>{item.statusUpdate}</Text>
            </View>

            {/* Main Description */}
            <View style={styles.descSection}>
              <Text style={styles.sectionHeading}>Rincian Laporan Komunitas</Text>
              <Text style={styles.descText}>{item.description}</Text>
            </View>

            {/* Environmental Indicators */}
            {item.indicators.length > 0 && (
              <View style={styles.indicatorsSection}>
                <Text style={styles.sectionHeading}>Sensor & Kondisi Sekitar</Text>
                <View style={styles.indicatorGrid}>
                  {item.indicators.map((ind, idx) => (
                    <View key={idx} style={styles.indicatorCard}>
                      <Text style={styles.indicatorLabel}>{ind.label}</Text>
                      <Text
                        style={[
                          styles.indicatorValue,
                          ind.isPositive === false && { color: DashboardTheme.colors.semanticAlert },
                          ind.isPositive === true && { color: DashboardTheme.colors.primary },
                        ]}
                      >
                        {ind.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Route Advice Callout */}
            <View style={styles.adviceCallout}>
              <Text style={styles.adviceCalloutTitle}>Saran Navigasi Aman</Text>
              <Text style={styles.adviceCalloutText}>{item.routeAdvice}</Text>
            </View>
          </ScrollView>

          {/* Fixed Modal Footer Action Strip */}
          <View style={styles.modalFooter}>
            {/* Confirm Upvote Button */}
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                item.isConfirmed && styles.confirmBtnActive,
              ]}
              onPress={() => onToggleConfirm && onToggleConfirm(item.id)}
              activeOpacity={0.8}
            >
              <ThumbsUpIcon
                size={16}
                color={item.isConfirmed ? '#FFFFFF' : DashboardTheme.colors.primary}
                isFilled={item.isConfirmed}
              />
              <Text
                style={[
                  styles.confirmBtnText,
                  item.isConfirmed && styles.confirmBtnTextActive,
                ]}
              >
                {item.isConfirmed ? 'Terverifikasi (+1)' : `Konfirmasi (${item.confirmations})`}
              </Text>
            </TouchableOpacity>

            {/* Reroute Avoidance Button */}
            <TouchableOpacity
              style={styles.rerouteBtn}
              onPress={handleReroute}
              activeOpacity={0.85}
            >
              <RouteIcon size={16} color={DashboardTheme.colors.textPrimary} />
              <Text style={styles.rerouteBtnText}>Rute Aman</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShare}
              activeOpacity={0.7}
              accessibilityLabel="Bagikan Laporan"
            >
              <ShareIcon size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingBottom: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  locationText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: DashboardTheme.colors.primary,
  },
  timeReporterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  timeAgoText: {
    fontSize: 11,
    color: DashboardTheme.colors.textMuted,
  },
  reporterText: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  statusBox: {
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  statusBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusBoxTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  statusBoxText: {
    fontSize: 12,
    color: DashboardTheme.colors.textPrimary,
    lineHeight: 17,
  },
  descSection: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: DashboardTheme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  descText: {
    fontSize: 13,
    color: DashboardTheme.colors.textPrimary,
    lineHeight: 19,
  },
  indicatorsSection: {
    marginBottom: 14,
  },
  indicatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  indicatorCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: 12,
    padding: 10,
  },
  indicatorLabel: {
    fontSize: 10.5,
    color: DashboardTheme.colors.textSecondary,
    marginBottom: 2,
  },
  indicatorValue: {
    fontSize: 12.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  adviceCallout: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: DashboardTheme.colors.semanticAlert,
    borderRadius: 10,
    padding: 10,
  },
  adviceCalloutTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: DashboardTheme.colors.semanticAlert,
    marginBottom: 2,
  },
  adviceCalloutText: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textPrimary,
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: DashboardTheme.colors.surfaceContainerLow,
  },
  confirmBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmBtnActive: {
    backgroundColor: DashboardTheme.colors.primary,
    borderColor: DashboardTheme.colors.primary,
  },
  confirmBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  confirmBtnTextActive: {
    color: '#FFFFFF',
  },
  rerouteBtn: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: DashboardTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  rerouteBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
