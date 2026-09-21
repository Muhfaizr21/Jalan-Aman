import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useShelters } from '@/hooks/useShelters';

export interface ShelterCardData {
  id: string;
  name: string;
  category: 'police' | 'store24' | 'pos_satpam' | 'hospital';
  category_badge: {
    label: string;
    bg_color: string;
    text_color: string;
  };
  status_badge: {
    label: string;
    bg_color: string;
    text_color: string;
  };
  distance: string;
  eta: string;
  address: string;
  action: {
    label: string;
    type: string;
  };
}

/* ================= VECTOR ICONS ================= */
function ArrowBackIcon({ color = '#0F172A', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShieldCheckIcon({ color = '#0284C7', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StoreIcon({ color = '#D97706', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9l1-6h16l1 6M21 9v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9M9 22V12h6v10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M3 9h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function AccountGroupIcon({ color = '#475569', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="9" cy="7" r="4" stroke={color} strokeWidth="2" />
      <Path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function NavigationRerouteIcon({ color = '#FFFFFF', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 12h12"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PinSmallIcon({ color = '#0284C7', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill={color}
      />
      <Circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
    </Svg>
  );
}

function ClockSmallIcon({ color = '#059669', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function SafeHavenDirectoryScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { rawShelters, isLoading, error, refetch } = useShelters();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filterChips = [
    { id: 'all', label: 'Semua Titik', icon: null },
    { id: 'police', label: 'Pos Polisi', icon: 'shield-check' },
    { id: 'store24', label: 'Retail 24 Jam', icon: 'store' },
    { id: 'pos_satpam', label: 'Pos Satpam', icon: 'account-group' },
    { id: 'hospital', label: 'Rumah Sakit', icon: 'shield-check' },
  ];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleReroute = (shelter: ShelterCardData) => {
    Alert.alert(
      '🛡️ Pengalihan Rute Aman',
      `Rute perjalanan Anda akan diarahkan menuju titik evakuasi terdekat: ${shelter.name} (${shelter.distance}, estimasi ${shelter.eta}). Koridor lampu aktif diprioritaskan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Mulai Pengalihan Rute',
          onPress: () => {
            Alert.alert(
              'Rute Dialihkan',
              `Navigasi berbelok ke ${shelter.name}. Terus ikuti arahan benderang hingga tiba di lokasi perlindungan.`,
              [
                {
                  text: 'Buka Navigasi',
                  onPress: () => router.replace('/'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const allShelters: ShelterCardData[] = rawShelters.map((s) => {
    let categoryBadge = { label: 'Safe Haven', bg_color: '#F1F5F9', text_color: '#475569' };
    if (s.category === 'police') {
      categoryBadge = { label: 'Pos Polisi', bg_color: '#E0F2FE', text_color: '#0284C7' };
    } else if (s.category === 'store24') {
      categoryBadge = { label: 'Retail 24 Jam', bg_color: '#FEF3C7', text_color: '#D97706' };
    } else if (s.category === 'pos_satpam') {
      categoryBadge = { label: 'Pos Satpam', bg_color: '#F1F5F9', text_color: '#475569' };
    } else if (s.category === 'hospital') {
      categoryBadge = { label: 'Rumah Sakit', bg_color: '#FEE2E2', text_color: '#DC2626' };
    }

    return {
      id: s.id,
      name: s.name,
      category: s.category,
      category_badge: categoryBadge,
      status_badge: {
        label: s.is_24h ? 'Siaga 24 Jam' : 'Operasional Aktif',
        bg_color: '#D1FAE5',
        text_color: '#059669',
      },
      distance: s.distance,
      eta: s.eta,
      address: s.address,
      action: {
        label: 'Arahkan Rute',
        type: 'route_reroute',
      },
    };
  });

  const filteredShelters =
    activeFilter === 'all'
      ? allShelters
      : allShelters.filter((s) => s.category === activeFilter);

  const renderFilterIcon = (iconName: string | null, isActive: boolean) => {
    if (!iconName) return null;
    const color = isActive ? '#FFFFFF' : '#64748B';
    switch (iconName) {
      case 'shield-check':
        return <ShieldCheckIcon color={color} size={15} />;
      case 'store':
        return <StoreIcon color={color} size={15} />;
      case 'account-group':
        return <AccountGroupIcon color={color} size={15} />;
      default:
        return null;
    }
  };

  const renderShelterList = () => {
    if (isLoading && allShelters.length === 0) {
      return <ActivityIndicator size="large" color="#0284C7" style={{ marginTop: 32 }} />;
    }
    if (filteredShelters.length === 0) {
      return (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600' }}>
            Tidak ada titik safe haven untuk kategori ini.
          </Text>
        </View>
      );
    }
    return filteredShelters.map((shelter) => (
      <View key={shelter.id} style={styles.shelterCard}>
        {/* Top Badges Row */}
        <View style={styles.cardBadgesRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: shelter.category_badge.bg_color },
            ]}
          >
            <Text
              style={[
                styles.categoryBadgeText,
                { color: shelter.category_badge.text_color },
              ]}
            >
              {shelter.category_badge.label}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: shelter.status_badge.bg_color },
            ]}
          >
            <View style={styles.statusDotGreen} />
            <Text
              style={[
                styles.statusBadgeText,
                { color: shelter.status_badge.text_color },
              ]}
            >
              {shelter.status_badge.label}
            </Text>
          </View>
        </View>

        {/* Name & Address */}
        <Text style={styles.shelterTitle}>{shelter.name}</Text>
        <Text style={styles.shelterAddress}>{shelter.address}</Text>

        {/* Distance, ETA & Divider */}
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <PinSmallIcon color="#0284C7" size={13} />
            <Text style={styles.metaChipText}>{shelter.distance}</Text>
          </View>

          <View style={styles.metaChip}>
            <ClockSmallIcon color="#059669" size={13} />
            <Text style={[styles.metaChipText, { color: '#059669' }]}>
              {shelter.eta} berkendara
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.rerouteActionButton}
          onPress={() => handleReroute(shelter)}
          activeOpacity={0.88}
        >
          <NavigationRerouteIcon color="#FFFFFF" size={16} />
          <Text style={styles.rerouteActionText}>
            {shelter.action.label}
          </Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: safeTop }]} edges={['left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ================= HEADER: standard_top_bar ================= */}
      <View style={styles.topBarHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityLabel="Kembali"
        >
          <ArrowBackIcon color="#0F172A" size={22} />
        </TouchableOpacity>

        <View style={styles.topBarTitleCol}>
          <Text style={styles.topBarTitle}>Titik Perlindungan (Safe Haven)</Text>
          <Text style={styles.topBarSubtitle}>Radius aman &lt;350m dari rute aktif</Text>
        </View>

        <View style={styles.topBarRightSpacer} />
      </View>

      {/* ================= FILTER BAR: horizontal_scroll_chips ================= */}
      <View style={styles.filterBarContainer}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filterChips.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : styles.filterChipInactive,
                ]}
                onPress={() => setActiveFilter(item.id)}
                activeOpacity={0.8}
              >
                {renderFilterIcon(item.icon, isActive)}
                <Text
                  style={[
                    styles.filterChipText,
                    isActive ? styles.filterChipTextActive : styles.filterChipTextInactive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ================= BODY SECTIONS: shelter_list (vertical_card_list) ================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0284C7']}
            tintColor="#0284C7"
          />
        }
        contentContainerStyle={[
          styles.scrollListContent,
          { paddingBottom: Math.max(insets.bottom, 16) + 24 },
        ]}
      >
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderCount}>
            Menampilkan {filteredShelters.length} Shelter Terdekat (Indramayu)
          </Text>
          <View style={styles.activePillBadge}>
            <View style={styles.liveGreenDot} />
            <Text style={styles.activePillText}>Safe Haven Terverifikasi</Text>
          </View>
        </View>

        {renderShelterList()}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SafeHavenDirectoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* ================= HEADER: standard_top_bar ================= */
  topBarHeader: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleCol: {
    flex: 1,
    marginLeft: 12,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  topBarSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  topBarRightSpacer: {
    width: 24,
  },

  /* ================= FILTER BAR: horizontal_scroll_chips ================= */
  filterBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  filterChipInactive: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  filterChipTextInactive: {
    color: '#64748B',
  },

  /* ================= BODY SECTIONS: shelter_list ================= */
  scrollListContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  listHeaderCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activePillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },

  /* Shelter Card */
  shelterCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
      default: {
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  cardBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusDotGreen: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#059669',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  shelterTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  shelterAddress: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  rerouteActionButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#0284C7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
      },
    }),
  },
  rerouteActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
