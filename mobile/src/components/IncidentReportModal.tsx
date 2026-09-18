import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export interface IncidentReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSuccess?: (data: any) => void;
}

export type CategoryId = 'begal' | 'pju_padam' | 'jalan_rusak' | 'sepi_rawan';

interface CategoryOption {
  id: CategoryId;
  label: string;
  badge_color: string;
  iconType: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'begal',
    label: 'Titik Begal / Curas',
    badge_color: '#DC2626',
    iconType: 'shield-alert',
  },
  {
    id: 'pju_padam',
    label: 'Lampu PJU Padam',
    badge_color: '#F59E0B',
    iconType: 'flashlight-off',
  },
  {
    id: 'jalan_rusak',
    label: 'Jalan Rusak Parah',
    badge_color: '#64748B',
    iconType: 'alert-octagon',
  },
  {
    id: 'sepi_rawan',
    label: 'Jalan Sepi & Gelap',
    badge_color: '#0284C7',
    iconType: 'weather-night',
  },
];

/* ================= VECTOR ICONS ================= */
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

function ShieldAlertIcon({ color = '#DC2626', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.12"
      />
      <Path d="M12 8v4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="12" cy="15.5" r="1.2" fill={color} />
    </Svg>
  );
}

function FlashlightOffIcon({ color = '#F59E0B', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 10l-4-4V2H10v4l-4 4v11a1 1 0 001 1h10a1 1 0 001-1V10z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M4 4l16 16" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function AlertOctagonIcon({ color = '#64748B', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.12"
      />
      <Path d="M12 8v4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1.2" fill={color} />
    </Svg>
  );
}

function WeatherNightIcon({ color = '#0284C7', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CameraIcon({ color = '#64748B', size = 24 }: { color?: string; size?: number }) {
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

function InfoShieldIcon({ color = '#64748B', size = 16 }: { color?: string; size?: number }) {
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

export function IncidentReportModal({
  visible,
  onClose,
  onSubmitSuccess,
}: IncidentReportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('begal');
  const [chronologyText, setChronologyText] = useState('');
  const [hasPhotoProof, setHasPhotoProof] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTogglePhoto = () => {
    setHasPhotoProof(!hasPhotoProof);
    if (!hasPhotoProof) {
      Alert.alert(
        'Foto Lampiran Terpasang',
        'Foto bukti insiden / penerangan berhasil disematkan dari kamera perangkat.'
      );
    }
  };

  const handleUbahPeta = () => {
    Alert.alert(
      'Ubah Titik Lokasi Peta',
      'Geser pin peta untuk menyesuaikan koordinat akurat insiden yang ingin dilaporkan.'
    );
  };

  const handleSubmitReport = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '✅ Laporan Berhasil Dikirim',
        'Laporan kondisi jalan Anda telah masuk ke sistem moderasi crowdsourcing dan diteruskan ke pemetaan spasial rute.',
        [
          {
            text: 'Selesai',
            onPress: () => {
              if (onSubmitSuccess) {
                onSubmitSuccess({
                  category: selectedCategory,
                  notes: chronologyText,
                  hasPhoto: hasPhotoProof,
                  location: 'Dekat Klaster Jl. Pantura - Jatibarang',
                  timestamp: new Date().toISOString(),
                });
              }
              // Reset form
              setChronologyText('');
              setHasPhotoProof(false);
              onClose();
            },
          },
        ]
      );
    }, 800);
  };

  const renderCategoryIcon = (iconType: string, badgeColor: string) => {
    switch (iconType) {
      case 'shield-alert':
        return <ShieldAlertIcon color={badgeColor} size={22} />;
      case 'flashlight-off':
        return <FlashlightOffIcon color={badgeColor} size={22} />;
      case 'alert-octagon':
        return <AlertOctagonIcon color={badgeColor} size={22} />;
      case 'weather-night':
        return <WeatherNightIcon color={badgeColor} size={22} />;
      default:
        return <ShieldAlertIcon color={badgeColor} size={22} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalBackdrop}
      >
        <TouchableOpacity
          style={styles.backdropDismissArea}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheetContainer} testID="IncidentReportModal">
          {/* ================= 1. HEADER SECTION ================= */}
          <View style={styles.headerSection}>
            <View style={styles.dragHandle} />

            <View style={styles.titleRow}>
              <View style={styles.titleTextColumn}>
                <Text style={styles.sheetTitle} testID="report-modal-title">Laporkan Kondisi Jalan</Text>
                <Text style={styles.sheetSubtitle}>
                  Bantu warga lain melintasi rute yang aman
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                activeOpacity={0.7}
                accessibilityLabel="Tutup Laporan"
              >
                <CloseIcon color="#64748B" size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ================= 2. LOCATION PICKER PREVIEW ================= */}
            <View
              style={styles.locationPickerPreview}
              testID="Auto GPS Tag"
              accessibilityLabel="Auto GPS Tag"
            >
              <View style={styles.locationIconWrapper}>
                <PinDropIcon color="#0284C7" size={22} />
              </View>

              <View style={styles.locationTextColumn}>
                <Text style={styles.locationLabel}>
                  Titik Terdeteksi Otomatis (GPS)
                </Text>
                <Text style={styles.locationDetail}>
                  Dekat Klaster Jl. Pantura - Jatibarang
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleUbahPeta}
                activeOpacity={0.7}
                style={styles.ubahPetaButton}
              >
                <Text style={styles.ubahPetaText}>Ubah Peta</Text>
              </TouchableOpacity>
            </View>

            {/* ================= 3. CATEGORY SELECTOR GRID ================= */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionHeaderTitle}>
                Pilih Jenis Insiden / Kerawanan
              </Text>

              <View
                style={styles.categoryGrid}
                testID="Category Grid"
                accessibilityLabel="Category Grid"
              >
                {CATEGORY_OPTIONS.map((opt) => {
                  const isSelected = selectedCategory === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.categoryTile,
                        isSelected && styles.categoryTileSelected,
                        isSelected && { borderColor: opt.badge_color },
                      ]}
                      onPress={() => setSelectedCategory(opt.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.categoryIconRow}>
                        <View
                          style={[
                            styles.categoryBadgeWrapper,
                            { backgroundColor: `${opt.badge_color}18` },
                          ]}
                        >
                          {renderCategoryIcon(opt.iconType, opt.badge_color)}
                        </View>

                        {isSelected && (
                          <View
                            style={[
                              styles.checkIndicator,
                              { backgroundColor: opt.badge_color },
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
                      </View>

                      <Text
                        style={[
                          styles.categoryTileLabel,
                          isSelected && styles.categoryTileLabelSelected,
                        ]}
                        numberOfLines={2}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ================= 4. FORM INPUTS ================= */}
            <View style={styles.formInputsSection}>
              {/* Field 1: Catatan / Kronologi Singkat */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelRow}>
                  <Text style={styles.fieldLabel}>
                    Catatan / Kronologi Singkat
                  </Text>
                  <Text style={styles.charCounter}>
                    {chronologyText.length}/200
                  </Text>
                </View>

                <TextInput
                  style={styles.multilineInput}
                  placeholder="Contoh: Ada sekelompok motor mencurigakan dan minim penerangan..."
                  placeholderTextColor="#94A3B8"
                  multiline={true}
                  numberOfLines={4}
                  maxLength={200}
                  value={chronologyText}
                  onChangeText={setChronologyText}
                  textAlignVertical="top"
                  testID="Textarea Notes"
                  accessibilityLabel="Textarea Notes"
                />
              </View>

              {/* Field 2: Foto Bukti Kejadian / Kondisi */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>
                  Foto Bukti Kejadian / Kondisi (Opsional)
                </Text>

                <TouchableOpacity
                  style={[
                    styles.photoUploadTile,
                    hasPhotoProof && styles.photoUploadTileAttached,
                  ]}
                  onPress={handleTogglePhoto}
                  activeOpacity={0.8}
                  testID="Photo Upload"
                  accessibilityLabel="Photo Upload"
                  accessibilityRole="button"
                >
                  <CameraIcon
                    color={hasPhotoProof ? '#0284C7' : '#64748B'}
                    size={26}
                  />
                  <Text
                    style={[
                      styles.photoUploadText,
                      hasPhotoProof && styles.photoUploadTextAttached,
                    ]}
                  >
                    {hasPhotoProof
                      ? '✓ 1 Foto Bukti Terlampir (Klik untuk ubah)'
                      : 'Ambil Foto atau Unggah Bukti'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ================= 5. SUBMIT SECTION ================= */}
            <View style={styles.submitSection}>
              <View style={styles.disclaimerRow}>
                <InfoShieldIcon color="#64748B" size={15} />
                <Text style={styles.disclaimerText}>
                  Laporan akan diverifikasi otomatis oleh modul moderasi dan
                  memengaruhi Trust Score akun Anda.
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryActionButton,
                  isSubmitting && styles.primaryActionButtonDisabled,
                ]}
                onPress={handleSubmitReport}
                disabled={isSubmitting}
                activeOpacity={0.88}
                testID="Submit Button"
                accessibilityLabel="Submit Button"
                accessibilityRole="button"
              >
                <Text style={styles.primaryActionButtonText}>
                  {isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan Valid'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default IncidentReportModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  backdropDismissArea: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    maxHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
      default: {
        boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },

  /* ================= 1. HEADER SECTION ================= */
  headerSection: {
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleTextColumn: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  /* ================= 2. LOCATION PICKER PREVIEW ================= */
  locationPickerPreview: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  locationIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationTextColumn: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  locationDetail: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  ubahPetaButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
  },
  ubahPetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
  },

  /* ================= 3. CATEGORY SELECTOR GRID ================= */
  categorySection: {
    marginTop: 20,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.1,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryTile: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 88,
  },
  categoryTileSelected: {
    backgroundColor: '#F0F9FF',
  },
  categoryIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadgeWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTileLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 16,
  },
  categoryTileLabelSelected: {
    fontWeight: '700',
  },

  /* ================= 4. FORM INPUTS ================= */
  formInputsSection: {
    marginTop: 20,
    gap: 16,
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  charCounter: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  multilineInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 82,
    lineHeight: 18,
  },
  photoUploadTile: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoUploadTileAttached: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
    borderStyle: 'solid',
  },
  photoUploadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  photoUploadTextAttached: {
    color: '#0284C7',
    fontWeight: '700',
  },

  /* ================= 5. SUBMIT SECTION ================= */
  submitSection: {
    marginTop: 22,
    gap: 14,
  },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  primaryActionButton: {
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
  primaryActionButtonDisabled: {
    opacity: 0.65,
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
