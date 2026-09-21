import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface CommunityReportHeaderProps {
  onBack: () => void;
  onOpenFeedbackSheet: () => void;
  onOpenMyReports?: () => void;
}

function ArrowBackIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ClipboardListIcon({ size = 18, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12h6M9 16h4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function RateReviewIcon({ size = 18, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M14.5 7.5l2 2L9 17H7v-2l7.5-7.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const CommunityReportHeader: React.FC<CommunityReportHeaderProps> = ({
  onBack,
  onOpenFeedbackSheet,
  onOpenMyReports,
}) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight) + 8;

  return (
    <View style={[styles.headerContainer, { paddingTop: safeTop }]}>
      {/* Top Bar with Back and Review Action */}
      <View style={styles.topActionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <ArrowBackIcon size={20} />
        </TouchableOpacity>

        <View style={styles.rightActionsRow}>
          {onOpenMyReports && (
            <TouchableOpacity
              style={styles.myReportsButton}
              onPress={onOpenMyReports}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Buka Laporanku"
            >
              <ClipboardListIcon size={16} />
              <Text style={styles.myReportsButtonText}>Laporanku</Text>
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>4</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.reviewButton}
            onPress={onOpenFeedbackSheet}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Beri Umpan Balik Rute"
          >
            <RateReviewIcon size={16} />
            <Text style={styles.reviewButtonText}>Ulas Rute</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Title & Subtitle */}
      <View style={styles.titleWrapper}>
        <Text style={styles.pageTitle}>Pelaporan Komunitas &amp; Bahaya</Text>
        <Text style={styles.pageSubtitle}>
          Bantu sesama pejalan &amp; pengendara ciptakan rute aman
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    gap: 12,
  },
  topActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  myReportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: DashboardTheme.radius.full,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  myReportsButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  badgeCount: {
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: DashboardTheme.radius.full,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reviewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  titleWrapper: {
    gap: 2,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: DashboardTheme.colors.textSecondary,
  },
});
