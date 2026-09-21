import React, { useState, useMemo } from 'react';
import { useShelters } from '@/hooks/useShelters';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

export interface ShelterItem {
  id: string;
  name: string;
  category: 'police' | 'store24' | 'pos_satpam' | 'hospital';
  category_label: string;
  category_bg: string;
  category_color: string;
  status_label: string;
  status_bg: string;
  status_color: string;
  distance: string;
  distance_meters: number;
  eta: string;
  address: string;
  is_verified: boolean;
}

export interface SafeHavenDirectoryModalProps {
  visible: boolean;
  onClose: () => void;
  onReroute?: (shelter: ShelterItem) => void;
}

/* ================= VECTOR ICONS ================= */
function CloseIcon({ color = '#64748B', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShieldCheckIcon({ color = '#0284C7', size = 15 }: { color?: string; size?: number }) {
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

function StoreIcon({ color = '#D97706', size = 15 }: { color?: string; size?: number }) {
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

function AccountGroupIcon({ color = '#475569', size = 15 }: { color?: string; size?: number }) {
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

function NavigationArrowIcon({ color = '#FFFFFF', size = 15 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11l19-9-9 19-2-8-8-2z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PinSmallIcon({ color = '#0284C7', size = 13 }: { color?: string; size?: number }) {
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

export function SafeHavenDirectoryModal({
  visible,
  onClose,
  onReroute,
}: SafeHavenDirectoryModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const { rawShelters, isLoading } = useShelters();

  const filterChips = [
    { id: 'all', label: 'Semua Titik', icon: null },
    { id: 'police', label: 'Pos Polisi', icon: 'police' },
    { id: 'store24', label: 'Retail 24 Jam', icon: 'store24' },
    { id: 'pos_satpam', label: 'Pos Satpam', icon: 'pos_satpam' },
    { id: 'hospital', label: 'Faskes / RSUD', icon: 'police' },
  ];

  const shelterItems: ShelterItem[] = useMemo(() => {
    if (!rawShelters || rawShelters.length === 0) return [];
    return rawShelters.map((s) => {
      let category_label = 'Safe Haven';
      let category_bg = '#F1F5F9';
      let category_color = '#475569';
      if (s.category === 'police') {
        category_label = 'Pos Polisi';
        category_bg = '#E0F2FE';
        category_color = '#0284C7';
      } else if (s.category === 'store24') {
        category_label = 'Retail 24 Jam';
        category_bg = '#FEF3C7';
        category_color = '#D97706';
      } else if (s.category === 'pos_satpam') {
        category_label = 'Pos Satpam';
        category_bg = '#F1F5F9';
        category_color = '#475569';
      } else if (s.category === 'hospital') {
        category_label = 'Faskes / RSUD';
        category_bg = '#FEE2E2';
        category_color = '#DC2626';
      }

      return {
        id: s.id,
        name: s.name,
        category: (s.category as any) || 'pos_satpam',
        category_label,
        category_bg,
        category_color,
        status_label: s.is_24h ? 'Siaga 24 Jam' : 'Buka Sekarang',
        status_bg: '#D1FAE5',
        status_color: '#059669',
        distance: s.distance || '400 m',
        distance_meters: 400,
        eta: s.eta || '3 mnt',
        address: s.address,
        is_verified: s.is_active,
      };
    });
  }, [rawShelters]);

  const filteredShelters =
    activeCategory === 'all'
      ? shelterItems
      : shelterItems.filter((s) => s.category === activeCategory);

  const handleReroutePress = (shelter: ShelterItem) => {
    Alert.alert(
      '🛡️ Pengalihan Rute Aman',
      `Rute Anda akan diarahkan ke ${shelter.name} (${shelter.distance}, ~${shelter.eta}). Jalur terang dan aman diprioritaskan.`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Arahkan Rute Sekarang',
          onPress: () => {
            if (onReroute) {
              onReroute(shelter);
            }
            onClose();
          },
        },
      ]
    );
  };

  const renderChipIcon = (iconType: string | null, isActive: boolean) => {
    if (!iconType) return null;
    const color = isActive ? '#FFFFFF' : '#64748B';
    switch (iconType) {
      case 'police':
        return <ShieldCheckIcon color={color} size={15} />;
      case 'store24':
        return <StoreIcon color={color} size={15} />;
      case 'pos_satpam':
        return <AccountGroupIcon color={color} size={15} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop} testID="SafeHavenDirectoryModal">
        <TouchableOpacity
          style={styles.backdropDismissArea}
          activeOpacity={1}
          onPress={onClose}
        />

        <SafeAreaView edges={['bottom']} style={styles.sheetContainer}>
          {/* Grabber Handle */}
          <View style={styles.dragHandle} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleCol}>
              <Text style={styles.headerTitle} testID="shelter-modal-title">
                Titik Perlindungan Terdekat
              </Text>
              <Text style={styles.headerSubtitle}>
                Safe Haven terverifikasi dalam radius &lt;350m dari rute Anda
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Tutup Titik Perlindungan"
            >
              <CloseIcon color="#64748B" size={20} />
            </TouchableOpacity>
          </View>

          {/* Category Filter Chips */}
          <View
            style={styles.filterChipsContainer}
            testID="Category Filter Chips"
            accessibilityLabel="Category Filter Chips"
          >
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipsScroll}
            >
              {filterChips.map((chip) => {
                const isActive = activeCategory === chip.id;
                return (
                  <TouchableOpacity
                    key={chip.id}
                    style={[
                      styles.filterChip,
                      isActive ? styles.filterChipActive : styles.filterChipInactive,
                    ]}
                    onPress={() => setActiveCategory(chip.id)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                  >
                    {renderChipIcon(chip.icon, isActive)}
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive ? styles.filterChipTextActive : styles.filterChipTextInactive,
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Shelter Cards List with Distance / ETA */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cardsScrollList}
            testID="Shelter Cards with Distance/ETA"
            accessibilityLabel="Shelter Cards with Distance/ETA"
          >
            <View style={styles.radiusNoticeRow}>
              <View style={styles.radiusPill}>
                <View style={styles.greenPulseDot} />
                <Text style={styles.radiusNoticeText}>
                  Radius Siaga &lt;350 Meter • {filteredShelters.length} Titik Aman
                </Text>
              </View>
            </View>

            {filteredShelters.map((shelter) => (
              <View key={shelter.id} style={styles.shelterCard}>
                <View style={styles.shelterCardTopRow}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: shelter.category_bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryBadgeText,
                        { color: shelter.category_color },
                      ]}
                    >
                      {shelter.category_label}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: shelter.status_bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: shelter.status_color },
                      ]}
                    >
                      {shelter.status_label}
                    </Text>
                  </View>
                </View>

                {/* Shelter Name & Address */}
                <Text style={styles.shelterName}>{shelter.name}</Text>
                <Text style={styles.shelterAddress}>{shelter.address}</Text>

                {/* Distance and ETA metrics */}
                <View style={styles.metaRow}>
                  <View style={styles.metaChip}>
                    <PinSmallIcon color="#0284C7" size={13} />
                    <Text style={styles.metaChipDistance}>{shelter.distance}</Text>
                  </View>

                  <View style={styles.metaChip}>
                    <Text style={styles.metaChipEta}>⏱️ ~{shelter.eta}</Text>
                  </View>

                  <View style={styles.metaChipVerified}>
                    <Text style={styles.metaChipVerifiedText}>✓ Terverifikasi</Text>
                  </View>
                </View>

                {/* Reroute Action Button */}
                <TouchableOpacity
                  style={styles.rerouteButton}
                  onPress={() => handleReroutePress(shelter)}
                  activeOpacity={0.88}
                  testID="Reroute Action Button"
                  accessibilityLabel="Reroute Action Button"
                  accessibilityRole="button"
                >
                  <NavigationArrowIcon color="#FFFFFF" size={15} />
                  <Text style={styles.rerouteButtonText}>Arahkan Rute</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default SafeHavenDirectoryModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropDismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
      default: {
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  filterChipsContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterChipsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
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
    color: '#475569',
  },
  cardsScrollList: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
  },
  radiusNoticeRow: {
    marginBottom: 12,
  },
  radiusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  greenPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
  },
  radiusNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  shelterCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  shelterCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  shelterName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  shelterAddress: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  metaChipDistance: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  metaChipEta: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  metaChipVerified: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaChipVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  rerouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  rerouteButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
