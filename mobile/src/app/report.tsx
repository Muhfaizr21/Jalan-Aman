import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export type CategorySeverity = 'high' | 'medium' | 'low';

export interface CategoryItem {
  id: string;
  label: string;
  icon: string;
  severity: CategorySeverity;
  active_color: string;
}

const INCIDENT_CATEGORIES: CategoryItem[] = [
  {
    id: 'begal',
    label: 'Begal / Tindak Kekerasan',
    icon: 'shield-alert-outline',
    severity: 'high',
    active_color: '#DC2626',
  },
  {
    id: 'pju_padam',
    label: 'Lampu PJU Padam',
    icon: 'lightbulb-off-outline',
    severity: 'medium',
    active_color: '#F59E0B',
  },
  {
    id: 'jalan_rusak',
    label: 'Jalan Rusak / Berlubang',
    icon: 'alert-octagon-outline',
    severity: 'low',
    active_color: '#64748B',
  },
  {
    id: 'sepi_rawan',
    label: 'Area Sepi & Gelap Gulita',
    icon: 'moon-waning-crescent',
    severity: 'medium',
    active_color: '#0284C7',
  },
];

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

function PinDropIcon({ color = '#0284C7', size = 20 }: { color?: string; size?: number }) {
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

function MapEditIcon({ color = '#0284C7', size = 15 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShieldAlertOutlineIcon({ color = '#DC2626', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 8v5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="12" cy="16.5" r="1.2" fill={color} />
    </Svg>
  );
}

function LightbulbOffOutlineIcon({ color = '#F59E0B', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18h6M10 22h4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 0012 2a5.96 5.96 0 00-4.24 1.76M6.3 6.3A6 6 0 006 8c0 2.22 1.21 4.16 3 5.2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M3 3l18 18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function AlertOctagonOutlineIcon({ color = '#64748B', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 8v4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1.2" fill={color} />
    </Svg>
  );
}

function MoonWaningCrescentIcon({ color = '#0284C7', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CameraMediaIcon({ color = '#64748B', size = 26 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" />
    </Svg>
  );
}

function WarningShieldIcon({ color = '#64748B', size = 15 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
      />
      <Path d="M12 8v4M12 16h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function IncidentReportScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('begal');
  const [chronologyText, setChronologyText] = useState<string>('');
  const [hasMediaAttached, setHasMediaAttached] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleAdjustMap = () => {
    Alert.alert(
      'Sesuaikan Titik Peta',
      'Geser pin peta untuk menyempurnakan koordinat lokasi kejadian (-6.3264, 108.3242).'
    );
  };

  const handlePickMedia = () => {
    setHasMediaAttached(!hasMediaAttached);
    if (!hasMediaAttached) {
      Alert.alert(
        'Foto Berhasil Dipilih',
        'Foto bukti insiden (JPEG/PNG, 2.4 MB) berhasil diunggah ke formulir.'
      );
    }
  };

  const handleSubmit = () => {
    if (!chronologyText.trim()) {
      Alert.alert(
        'Kronologi Wajib Diisi',
        'Mohon isi keterangan situasi singkat sebelum mengirimkan laporan.'
      );
      return;
    }

    setIsSubmitting(true);
    // Simulating POST /api/v1/reports
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '✅ Laporan Valid Diterima',
        'Laporan insiden Anda berhasil dikirim ke endpoint POST /api/v1/reports dan diteruskan ke pipeline klasterisasi spasial DBSCAN.',
        [
          {
            text: 'Kembali ke Navigasi',
            onPress: handleBack,
          },
        ]
      );
    }, 900);
  };

  const renderIcon = (id: string, color: string) => {
    switch (id) {
      case 'begal':
        return <ShieldAlertOutlineIcon color={color} size={24} />;
      case 'pju_padam':
        return <LightbulbOffOutlineIcon color={color} size={24} />;
      case 'jalan_rusak':
        return <AlertOctagonOutlineIcon color={color} size={24} />;
      case 'sepi_rawan':
        return <MoonWaningCrescentIcon color={color} size={24} />;
      default:
        return <ShieldAlertOutlineIcon color={color} size={24} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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

        <Text style={styles.topBarTitle}>Laporkan Insiden</Text>

        <View style={styles.topBarRightSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.contentContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ================= SECTION 1: location_picker (geo_selector_card) ================= */}
          <View style={styles.geoSelectorCard}>
            <View style={styles.geoHeaderRow}>
              <View style={styles.gpsBadge}>
                <View style={styles.gpsDot} />
                <Text style={styles.gpsBadgeText}>Terdeteksi via GPS</Text>
              </View>

              <Text style={styles.coordPreview}>-6.3264, 108.3242</Text>
            </View>

            <View style={styles.geoMainRow}>
              <View style={styles.pinCircle}>
                <PinDropIcon color="#0284C7" size={20} />
              </View>

              <View style={styles.streetColumn}>
                <Text style={styles.streetName}>Jl. Raya Pantura, Jatibarang</Text>
                <Text style={styles.streetSubtext}>Kec. Jatibarang, Kab. Indramayu</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.adjustMapButton}
              onPress={handleAdjustMap}
              activeOpacity={0.75}
            >
              <MapEditIcon color="#0284C7" size={14} />
              <Text style={styles.adjustMapText}>Sesuaikan Titik Peta</Text>
            </TouchableOpacity>
          </View>

          {/* ================= SECTION 2: incident_category (selectable_chips_grid) ================= */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Kategori Kejadian</Text>

            <View style={styles.chipsGrid}>
              {INCIDENT_CATEGORIES.map((item) => {
                const isSelected = selectedCategory === item.id;
                const severityLabel =
                  item.severity === 'high'
                    ? 'Tinggi'
                    : item.severity === 'medium'
                    ? 'Sedang'
                    : 'Rendah';

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.chipCard,
                      isSelected && {
                        borderColor: item.active_color,
                        backgroundColor: `${item.active_color}0C`,
                      },
                    ]}
                    onPress={() => setSelectedCategory(item.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.chipTopRow}>
                      <View
                        style={[
                          styles.chipIconBox,
                          {
                            backgroundColor: isSelected
                              ? `${item.active_color}18`
                              : '#F1F5F9',
                          },
                        ]}
                      >
                        {renderIcon(
                          item.id,
                          isSelected ? item.active_color : '#64748B'
                        )}
                      </View>

                      <View
                        style={[
                          styles.severityTag,
                          {
                            backgroundColor: isSelected
                              ? `${item.active_color}1F`
                              : '#F1F5F9',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.severityText,
                            {
                              color: isSelected
                                ? item.active_color
                                : '#64748B',
                            },
                          ]}
                        >
                          {severityLabel}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.chipLabel,
                        isSelected && {
                          color: '#0F172A',
                          fontWeight: '800',
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {item.label}
                    </Text>

                    {isSelected && (
                      <View
                        style={[
                          styles.selectedCheckPill,
                          { backgroundColor: item.active_color },
                        ]}
                      >
                        <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M20 6L9 17l-5-5"
                            stroke="#FFFFFF"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ================= SECTION 3: report_details ================= */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Keterangan Tambahan</Text>

            {/* Field: chronology_input (textarea) */}
            <View style={styles.fieldBlock}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>
                  Kronologi Singkat <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <Text style={styles.charCountText}>
                  {chronologyText.length}/250
                </Text>
              </View>

              <TextInput
                style={styles.textAreaInput}
                placeholder="Jelaskan situasi atau kondisi visual di lokasi kejadian..."
                placeholderTextColor="#94A3B8"
                multiline={true}
                numberOfLines={4}
                maxLength={250}
                value={chronologyText}
                onChangeText={setChronologyText}
                textAlignVertical="top"
              />
            </View>

            {/* Field: proof_uploader (media_picker) */}
            <View style={styles.fieldBlock}>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Foto Bukti Kejadian (Opsional)</Text>
                <Text style={styles.formatBadge}>Maks 5 MB</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.mediaUploaderBox,
                  hasMediaAttached && styles.mediaUploaderBoxActive,
                ]}
                onPress={handlePickMedia}
                activeOpacity={0.8}
              >
                <CameraMediaIcon
                  color={hasMediaAttached ? '#0284C7' : '#64748B'}
                  size={26}
                />
                <Text
                  style={[
                    styles.uploaderText,
                    hasMediaAttached && styles.uploaderTextActive,
                  ]}
                >
                  {hasMediaAttached
                    ? '✓ 1 Foto Bukti Terlampir (Ketuk untuk ganti)'
                    : 'Pilih File (image/jpeg, image/png)'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* ================= FOOTER: sticky_bottom_bar ================= */}
        <View
          style={[
            styles.stickyBottomBar,
            { paddingBottom: Math.max(insets.bottom, 12) + 8 },
          ]}
        >
          {/* legal_disclaimer */}
          <View style={styles.legalDisclaimerRow}>
            <WarningShieldIcon color="#64748B" size={15} />
            <Text style={styles.legalDisclaimerText}>
              Laporan palsu akan menurunkan Trust Score akun Anda secara otomatis.
            </Text>
          </View>

          {/* submit_button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.88}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Mengirimkan Laporan...' : 'Kirim Laporan Valid'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default IncidentReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* ================= HEADER ================= */
  topBarHeader: {
    height: 56,
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
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  topBarRightSpacer: {
    width: 38,
  },

  /* Content & Scroll */
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 28,
  },

  /* ================= SECTION 1: geo_selector_card ================= */
  geoSelectorCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
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
    }),
  },
  geoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  gpsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
  },
  gpsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: -0.1,
  },
  coordPreview: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#64748B',
  },
  geoMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  pinCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streetColumn: {
    flex: 1,
  },
  streetName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  streetSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  adjustMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adjustMapText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },

  /* ================= SECTION 2: selectable_chips_grid ================= */
  sectionContainer: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipCard: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    minHeight: 104,
    justifyContent: 'space-between',
    position: 'relative',
  },
  chipTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chipIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 16,
  },
  selectedCheckPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ================= SECTION 3: report_details ================= */
  fieldBlock: {
    marginBottom: 16,
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  requiredAsterisk: {
    color: '#DC2626',
    fontWeight: '700',
  },
  charCountText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  formatBadge: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  textAreaInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 90,
    lineHeight: 19,
  },
  mediaUploaderBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mediaUploaderBoxActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
    borderStyle: 'solid',
  },
  uploaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  uploaderTextActive: {
    color: '#0284C7',
    fontWeight: '700',
  },

  /* ================= FOOTER: sticky_bottom_bar ================= */
  stickyBottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      default: {
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  legalDisclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legalDisclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0284C7',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
      },
    }),
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
