import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

export interface SearchPlaceItem {
  id: string;
  name: string;
  address: string;
  category?: string;
  safetyBadge?: string;
  safetyType?: 'pju' | 'cctv' | 'haven';
  distance?: string;
  coordinates?: [number, number];
}

interface SearchSuggestionModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSelectPlace: (placeName: string, coords?: [number, number]) => void;
  initialQuery?: string;
}

/* Vector Icons */
function ArrowBackIcon({ size = 22, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ClearCloseIcon({ size = 18, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HistoryClockIcon({ size = 18, color = '#94A3B8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="M12 7v5l3 3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PinLocationIcon({ size = 18, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        stroke={color}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.15}
      />
      <Circle cx="12" cy="10" r="3" fill={color} />
    </Svg>
  );
}

function HomeIcon({ size = 18, color = '#0284C7' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM9 22V12h6v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function OfficeBuildingIcon({ size = 18, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 21h18M6 21V7l8-4v18M14 11h4v10" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 9h2M9 13h2M9 17h2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function TransitTrainIcon({ size = 18, color = '#38BDF8' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM4 11h16M8 15h.01M16 15h.01M7 21l2-3M17 21l-2-3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PoliceShieldIcon({ size = 18, color = '#0284C7' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HospitalCrossIcon({ size = 18, color = '#EF4444' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={2} />
      <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

const SAVED_PLACES: SearchPlaceItem[] = [
  { id: 'save-home', name: 'Rumah (Griya Jatibarang)', address: 'Perum Griya Asri Blok B No. 14, Jatibarang', category: 'home', coordinates: [108.3015, -6.4690] },
  { id: 'save-work', name: 'Stasiun KAI Jatibarang', address: 'Jl. Mayor Dasuki, Jatibarang • KAI Commuter Hub', category: 'transit', coordinates: [108.3073, -6.4745] },
  { id: 'save-campus', name: 'Polindra (Politeknik Negeri Indramayu)', address: 'Jl. Lohbener Lama No. 8, Indramayu', category: 'campus', coordinates: [108.2830, -6.4150] },
  { id: 'save-kos', name: 'Kos Mahasiswi Indramayu', address: 'Jl. Kembar No. 12, Lemahabang, Indramayu', category: 'kos', coordinates: [108.3180, -6.3320] },
];

const INITIAL_RECENT_SEARCHES: SearchPlaceItem[] = [
  { id: 'rec-1', name: 'Stasiun KAI Jatibarang', address: 'Jl. Mayor Dasuki • Transit Aman Terpantau', distance: '450 m', coordinates: [108.3073, -6.4745] },
  { id: 'rec-2', name: 'Simpang Lima Indramayu', address: 'Bundaran Mangga • Jalur Terang PJU', distance: '14.2 km', coordinates: [108.3280, -6.3350] },
  { id: 'rec-3', name: 'Alun-Alun Indramayu', address: 'Pusat Kota • Ramai & Pos Satpol PP', distance: '15.8 km', coordinates: [108.3220, -6.3260] },
];

const ALL_SEARCH_DATABASE: SearchPlaceItem[] = [
  { id: 'db-1', name: 'Stasiun KAI Jatibarang', address: 'Jl. Mayor Dasuki No. 1, Jatibarang, Indramayu', safetyBadge: 'PJU 100% & 6 CCTV', safetyType: 'cctv', distance: '450 m', coordinates: [108.3073, -6.4745] },
  { id: 'db-2', name: 'Polsek Jatibarang', address: 'Jl. Mayor Dasuki No. 12, Jatibarang', safetyBadge: 'Safe Haven Utama 24 Jam', safetyType: 'haven', distance: '650 m', coordinates: [108.3120, -6.4712] },
  { id: 'db-3', name: 'Alun-Alun Indramayu', address: 'Jl. Mayjen Sutoyo, Margadadi, Indramayu', safetyBadge: 'Penerangan Tinggi & Ramai', safetyType: 'pju', distance: '15.8 km', coordinates: [108.3220, -6.3260] },
  { id: 'db-4', name: 'RSUD Indramayu', address: 'Jl. Murah Nara No. 7, Sindang, Indramayu', safetyBadge: 'Siaga Darurat 24 Jam', safetyType: 'haven', distance: '16.5 km', coordinates: [108.3225, -6.3315] },
  { id: 'db-5', name: 'Simpang Lima Indramayu', address: 'Bundaran Kijang / Mangga, Terusan', safetyBadge: 'Koridor Utama PJU 98%', safetyType: 'pju', distance: '14.2 km', coordinates: [108.3280, -6.3350] },
  { id: 'db-6', name: 'Indomaret 24 Jam Bulak', address: 'Jl. Raya Bulak No. 45, Jatibarang', safetyBadge: 'Shelter Komunitas 24 Jam', safetyType: 'haven', distance: '1.1 km', coordinates: [108.3148, -6.4688] },
  { id: 'db-7', name: 'Polres Indramayu', address: 'Jl. Gatot Subroto No. 45, Indramayu', safetyBadge: 'Pusat Komando Siaga 24 Jam', safetyType: 'haven', distance: '16.0 km', coordinates: [108.3200, -6.3290] },
  { id: 'db-8', name: 'Pasar Daerah Jatibarang', address: 'Jl. Siliwangi, Jatibarang', safetyBadge: 'Koridor Patroli Aktif', safetyType: 'pju', distance: '800 m', coordinates: [108.3060, -6.4720] },
];

export const SearchSuggestionModal: React.FC<SearchSuggestionModalProps> = ({
  visible,
  onDismiss,
  onSelectPlace,
  initialQuery = '',
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState(initialQuery);
  const [recentList, setRecentList] = useState<SearchPlaceItem[]>(INITIAL_RECENT_SEARCHES);

  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return ALL_SEARCH_DATABASE.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmed) ||
        item.address.toLowerCase().includes(trimmed)
    );
  }, [query]);

  const handleSelect = (placeName: string, coords?: [number, number]) => {
    // Add to recent if not present
    if (!recentList.some((r) => r.name === placeName)) {
      setRecentList((prev) => [
        { id: `rec-${Date.now()}`, name: placeName, address: 'Lokasi Terpilih', distance: 'Rute Langsung', coordinates: coords },
        ...prev.slice(0, 4),
      ]);
    }
    onSelectPlace(placeName, coords);
    onDismiss();
  };

  const handleRemoveRecent = (id: string) => {
    setRecentList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllRecent = () => {
    setRecentList([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Search Input Bar (Sticky Header) */}
        <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onDismiss}
            activeOpacity={0.7}
            accessibilityLabel="Kembali ke peta"
          >
            <ArrowBackIcon size={22} />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Cari jalan, halte, atau gedung aman..."
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => {
                if (query.trim()) handleSelect(query.trim());
              }}
            />
            {query.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setQuery('')}
                activeOpacity={0.7}
              >
                <ClearCloseIcon size={16} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Modal Scroll Content */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 20 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ================= 1. LIVE AUTO-SUGGESTION RESULTS (WHEN TYPING) ================= */}
          {query.trim().length > 0 ? (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>HASIL REKOMENDASI AMAN</Text>
              {filteredResults.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyTitle}>Gunakan Nama Lokasi Spesifik</Text>
                  <Text style={styles.emptySubtitle}>
                    Tidak ada nama jalan persis. Tekan cari untuk rute langsung ke "{query}".
                  </Text>
                  <TouchableOpacity
                    style={styles.customSearchBtn}
                    onPress={() => handleSelect(query.trim())}
                    activeOpacity={0.8}
                  >
                    <PinLocationIcon size={16} color="#FFFFFF" />
                    <Text style={styles.customSearchBtnText}>Arahkan Rute ke "{query}"</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                filteredResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.searchResultRow}
                    onPress={() => handleSelect(item.name, item.coordinates)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.resultIconCircle}>
                      <PinLocationIcon size={18} />
                    </View>
                    <View style={styles.resultDetailsCol}>
                      <View style={styles.resultHeaderLine}>
                        <Text style={styles.resultPlaceName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {item.distance && (
                          <Text style={styles.resultDistanceBadge}>{item.distance}</Text>
                        )}
                      </View>
                      <Text style={styles.resultAddressText} numberOfLines={1}>
                        {item.address}
                      </Text>
                      {item.safetyBadge && (
                        <View style={styles.safetyPill}>
                          <Text style={styles.safetyPillText}>🛡️ {item.safetyBadge}</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          ) : (
            /* ================= 2. DEFAULT STATE: SAVED + RECENT + QUICK CATEGORIES ================= */
            <>
              {/* Quick Saved Pinned Places (2x2 Grid) */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>TEMPAT TERSIMPAN</Text>
                <View style={styles.savedGrid}>
                  {SAVED_PLACES.map((place) => (
                    <TouchableOpacity
                      key={place.id}
                      style={styles.savedCard}
                      onPress={() => handleSelect(place.name, place.coordinates)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.savedIconCircle}>
                        {place.category === 'home' && <HomeIcon size={18} />}
                        {place.category === 'office' && <OfficeBuildingIcon size={18} />}
                        {place.category === 'campus' && <PoliceShieldIcon size={18} />}
                        {place.category === 'kos' && <HomeIcon size={18} color="#D97706" />}
                      </View>
                      <View style={styles.savedCardTextWrap}>
                        <Text style={styles.savedCardTitle}>{place.name}</Text>
                        <Text style={styles.savedCardSubtext} numberOfLines={1}>
                          {place.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Quick Transit & Safety POI Categories */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>PILIHAN CEPAT RADIUS SEKITAR</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.poiCategoryRow}>
                  <TouchableOpacity
                    style={styles.poiCategoryChip}
                    onPress={() => handleSelect('Stasiun KAI Jatibarang', [108.3073, -6.4745])}
                    activeOpacity={0.75}
                  >
                    <TransitTrainIcon size={16} />
                    <Text style={styles.poiCategoryLabel}>Stasiun KAI</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.poiCategoryChip}
                    onPress={() => handleSelect('Polsek Jatibarang', [108.3120, -6.4712])}
                    activeOpacity={0.75}
                  >
                    <PoliceShieldIcon size={16} />
                    <Text style={styles.poiCategoryLabel}>Pos Pantau 24J</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.poiCategoryChip}
                    onPress={() => handleSelect('RSUD Indramayu', [108.3225, -6.3315])}
                    activeOpacity={0.75}
                  >
                    <HospitalCrossIcon size={16} />
                    <Text style={styles.poiCategoryLabel}>RSUD / Klinik 24J</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              {/* Recent Searches */}
              {recentList.length > 0 && (
                <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>PENCARIAN TERAKHIR</Text>
                    <TouchableOpacity onPress={handleClearAllRecent} activeOpacity={0.6}>
                      <Text style={styles.clearAllText}>Hapus Semua</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.recentListWrap}>
                    {recentList.map((item) => (
                      <View key={item.id} style={styles.recentItemRow}>
                        <TouchableOpacity
                          style={styles.recentClickArea}
                          onPress={() => handleSelect(item.name, item.coordinates)}
                          activeOpacity={0.7}
                        >
                          <HistoryClockIcon size={18} />
                          <View style={styles.recentDetails}>
                            <Text style={styles.recentPlaceName}>{item.name}</Text>
                            <Text style={styles.recentAddress} numberOfLines={1}>
                              {item.address}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.removeRecentBtn}
                          onPress={() => handleRemoveRecent(item.id)}
                          activeOpacity={0.6}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <ClearCloseIcon size={14} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 6,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 24,
  },
  sectionContainer: {
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },

  /* Saved Places Grid */
  savedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  savedCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  savedIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  savedCardTextWrap: {
    flex: 1,
  },
  savedCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  savedCardSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* Quick POI Chips */
  poiCategoryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  poiCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  poiCategoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },

  /* Recent Searches List */
  recentListWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  recentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  recentClickArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentDetails: {
    flex: 1,
  },
  recentPlaceName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  recentAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  removeRecentBtn: {
    padding: 6,
  },

  /* Live Suggestion Results */
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  resultIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7FEE7',
    borderWidth: 1,
    borderColor: '#D9F99D',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  resultDetailsCol: {
    flex: 1,
    gap: 3,
  },
  resultHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultPlaceName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  resultDistanceBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  resultAddressText: {
    fontSize: 12,
    color: '#64748B',
  },
  safetyPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 3,
  },
  safetyPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },

  /* Empty State */
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  customSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#416900',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  customSearchBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
