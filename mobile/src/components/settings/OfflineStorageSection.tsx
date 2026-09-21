import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { StorageAllocationData } from '@/types/settings';
import { OfflineDownloadProgress } from '@/services/offlineMapCache';

interface OfflineStorageSectionProps {
  data?: StorageAllocationData;
  isDownloadingMap?: boolean;
  downloadProgress?: OfflineDownloadProgress | null;
  onManageMaps?: () => void;
  onPurgeCache?: () => void;
  onToggleDownload?: (downloaded: boolean) => void;
}

const DEFAULT_STORAGE_DATA: StorageAllocationData = {
  usedGb: 2.42,
  totalGb: 8.0,
  usedPercentage: 30,
  items: [
    {
      id: 'maps',
      label: 'Peta Indramayu & Pantura Jatibarang',
      sizeLabel: '1.8 GB',
      color: DashboardTheme.colors.primaryContainer,
      tag: 'Auto-Sync',
    },
    {
      id: 'voice_cache',
      label: 'Cache Suara & Darurat',
      sizeLabel: '620 MB',
      color: DashboardTheme.colors.semanticInfo,
    },
    {
      id: 'free_space',
      label: 'Ruang Memori Tersedia',
      sizeLabel: '5.58 GB',
      color: DashboardTheme.colors.textMuted,
    },
  ],
};

function FolderSpecialIcon({ size = 22, color = DashboardTheme.colors.semanticInfo }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6h-8l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11l1.2 2.5 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z"
        fill={color}
      />
    </Svg>
  );
}

function CloudSyncIcon({ size = 18, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 16.9A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M16 19l3 3 3-3M22 22l-3-3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function MopCleanIcon({ size = 18, color = DashboardTheme.colors.semanticWarning }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 4L15 8M12 11L4 19a2.12 2.12 0 0 0 3 3l8-8M9 8l7 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckCircleIcon({ size = 18, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const OfflineStorageSection: React.FC<OfflineStorageSectionProps> = ({
  data = DEFAULT_STORAGE_DATA,
  isDownloadingMap = false,
  downloadProgress = null,
  onManageMaps,
  onPurgeCache,
  onToggleDownload,
}) => {
  const [isPurging, setIsPurging] = useState(false);
  const [isPurged, setIsPurged] = useState(false);

  const handleCleanCache = async () => {
    if (isPurging) return;
    setIsPurging(true);

    try {
      if (onPurgeCache) {
        await onPurgeCache();
      }
    } finally {
      setIsPurging(false);
      setIsPurged(true);
      setTimeout(() => {
        setIsPurged(false);
      }, 2500);
    }
  };

  const handleManage = () => {
    if (onManageMaps) {
      onManageMaps();
      return;
    }

    Alert.alert(
      '🗺️ Kelola Peta Offline Pantura',
      'Paket peta luring jalur Pantura Losarang, Kandanghaur, Lohbener, hingga Stasiun Jatibarang & Alun-Alun Indramayu (1.8 GB). Siaga saat internet blank spot.',
      [
        {
          text: isDownloadingMap ? 'Sedang Mengunduh...' : 'Unduh & Simpan ke Cache',
          onPress: () => {
            if (onToggleDownload) onToggleDownload(true);
          },
        },
        {
          text: 'Hapus Cache Peta Offline',
          style: 'destructive',
          onPress: () => {
            if (onToggleDownload) onToggleDownload(false);
          },
        },
        { text: 'Tutup', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <FolderSpecialIcon size={22} />
          </View>
          <View style={styles.headerTextCol}>
            <Text style={styles.titleText}>Peta Luring & Cache</Text>
            <Text style={styles.subtitleText}>Tersedia tanpa internet di zona blank spot</Text>
          </View>
        </View>

        <View style={styles.usedBadge}>
          <Text style={styles.usedBadgeText}>{data.usedPercentage}% Terpakai</Text>
        </View>
      </View>

      {/* Numeric Metric */}
      <View style={styles.metricRow}>
        <Text style={styles.metricBig}>{data.usedGb.toFixed(1)}</Text>
        <Text style={styles.metricUnit}>GB</Text>
        <Text style={styles.metricDivider}>/</Text>
        <Text style={styles.metricTotal}>{data.totalGb.toFixed(1)}</Text>
        <Text style={styles.metricAllocated}>GB dialokasikan</Text>
      </View>

      {/* Bar Chart */}
      <View style={styles.barTrack}>
        <View style={[styles.barUsed, { width: `${data.usedPercentage}%` }]} />
        <View style={[styles.barFree, { width: `${100 - data.usedPercentage}%` }]} />
      </View>

      {/* Legend List */}
      <View style={styles.legendContainer}>
        {data.items.map((item) => (
          <View key={item.id} style={styles.legendRow}>
            <View style={styles.legendLeft}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel} numberOfLines={1}>
                {item.label}
              </Text>
              {item.tag && (
                <View style={styles.tagWrap}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                </View>
              )}
            </View>
            <Text style={styles.legendValue}>{item.sizeLabel}</Text>
          </View>
        ))}
      </View>

      {/* Active Download Progress Indicator */}
      {isDownloadingMap && (
        <View style={styles.downloadProgressBox}>
          <View style={styles.downloadProgressHeader}>
            <ActivityIndicator size="small" color={DashboardTheme.colors.primary} />
            <Text style={styles.downloadProgressText}>
              {downloadProgress?.statusText || 'Mengunduh ubin peta Pantura...'}
            </Text>
            <Text style={styles.downloadProgressPercent}>
              {downloadProgress ? `${downloadProgress.percentage}%` : '...'}
            </Text>
          </View>
          <View style={styles.downloadProgressBarTrack}>
            <View
              style={[
                styles.downloadProgressBarFill,
                { width: `${downloadProgress?.percentage || 15}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={handleManage}
          activeOpacity={0.82}
          accessibilityLabel="Kelola Peta Luring"
          accessibilityRole="button"
        >
          <CloudSyncIcon size={18} />
          <Text style={styles.manageBtnText}>Kelola Peta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.purgeButton}
          onPress={handleCleanCache}
          activeOpacity={0.82}
          accessibilityLabel="Bersihkan Cache Memori"
          accessibilityRole="button"
        >
          {isPurging ? (
            <>
              <ActivityIndicator size="small" color={DashboardTheme.colors.primary} />
              <Text style={styles.purgeBtnText}>Membersihkan...</Text>
            </>
          ) : isPurged ? (
            <>
              <CheckCircleIcon size={18} />
              <Text style={[styles.purgeBtnText, { color: DashboardTheme.colors.primary }]}>
                Cache Bersih
              </Text>
            </>
          ) : (
            <>
              <MopCleanIcon size={18} />
              <Text style={styles.purgeBtnText}>Bersihkan Cache</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 22,
    padding: 16,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: DashboardTheme.colors.semanticInfoBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
  usedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
  },
  usedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticInfo,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 10,
  },
  metricBig: {
    fontSize: 32,
    fontWeight: '900',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.8,
  },
  metricUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
  },
  metricDivider: {
    fontSize: 14,
    color: DashboardTheme.colors.textMuted,
    marginHorizontal: 2,
  },
  metricTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
  },
  metricAllocated: {
    fontSize: 12,
    color: DashboardTheme.colors.textMuted,
  },
  barTrack: {
    height: 14,
    width: '100%',
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 14,
    padding: 2,
  },
  barUsed: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  barFree: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.25)',
    marginLeft: 2,
  },
  legendContainer: {
    gap: 10,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendLabel: {
    fontSize: 12,
    color: DashboardTheme.colors.textPrimary,
    fontWeight: '500',
  },
  tagWrap: {
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '800',
    color: DashboardTheme.colors.primary,
    textTransform: 'uppercase',
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  manageButton: {
    flex: 1,
    height: 42,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  manageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  purgeButton: {
    flex: 1,
    height: 42,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  purgeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticWarning,
  },
  downloadProgressBox: {
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
  },
  downloadProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  downloadProgressText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
  },
  downloadProgressPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: DashboardTheme.colors.primary,
  },
  downloadProgressBarTrack: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(148, 163, 184, 0.25)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  downloadProgressBarFill: {
    height: '100%',
    backgroundColor: DashboardTheme.colors.primary,
    borderRadius: 999,
  },
});
