import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { IncidentCategoryId, IncidentCategoryData } from '@/types/communityReport';

interface IncidentCategoryFormProps {
  onSubmitReport: (data: {
    category: IncidentCategoryId;
    location: string;
    description: string;
    hasPhoto: boolean;
  }) => void;
}

const CATEGORIES: IncidentCategoryData[] = [
  {
    id: 'lampu_mati',
    title: 'Lampu Mati',
    subtitle: 'Titik gelap & minim cahaya',
    iconName: 'light_off',
    accentColor: DashboardTheme.colors.primary,
  },
  {
    id: 'kriminalitas',
    title: 'Kriminalitas',
    subtitle: 'Begal / ancaman aktif',
    iconName: 'crisis_alert',
    accentColor: DashboardTheme.colors.semanticAlert,
  },
  {
    id: 'kerusakan_jalan',
    title: 'Kerusakan Jalan',
    subtitle: 'Lubang, genangan air',
    iconName: 'warning',
    accentColor: '#F59E0B',
  },
  {
    id: 'bahaya_spasial',
    title: 'Bahaya Spasial',
    subtitle: 'Gang sempit & sepi',
    iconName: 'near_me_disabled',
    accentColor: DashboardTheme.colors.skyBlue,
  },
];

/* Category Icons */
function LightOffIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18h6M10 22h4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 2a6 6 0 0 0-6 6c0 2 1 3.5 2 4.5V15h8v-2.5c1-1 2-2.5 2-4.5a6 6 0 0 0-6-6z" stroke={color} strokeWidth={2} />
      <Path d="M3 3l18 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CrimeAlertIcon({ size = 20, color = DashboardTheme.colors.semanticAlert }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M12 8v5M12 16h.01" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function RoadDamageIcon({ size = 20, color = '#F59E0B' }: { size?: number; color?: string }) {
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

function SpatialHazardIcon({ size = 20, color = DashboardTheme.colors.skyBlue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke={color}
        strokeWidth={2}
      />
      <Path d="M8 8l8 8M16 8l-8 8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function CheckSmallIcon({ size = 14, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MyLocationIcon({ size = 18, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="7" stroke={color} strokeWidth={2} />
      <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="12" r="2.5" fill={color} />
    </Svg>
  );
}

function EditLocationIcon({ size = 14, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function AddPhotoIcon({ size = 22, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function SendIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const IncidentCategoryForm: React.FC<IncidentCategoryFormProps> = ({
  onSubmitReport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<IncidentCategoryId>('lampu_mati');
  const [locationText, setLocationText] = useState('Jl. Johar No. 14, Gondangdia');
  const [description, setDescription] = useState('');
  const [hasPhoto, setHasPhoto] = useState(true);

  const handleEditLocation = () => {
    Alert.prompt
      ? Alert.prompt(
          'Ubah Lokasi Laporan',
          'Masukkan alamat atau nama jalan lokasi kejadian:',
          (text) => {
            if (text && text.trim()) setLocationText(text.trim());
          },
          'plain-text',
          locationText
        )
      : Alert.alert('Lokasi GPS Terkalibrasi', `Koordinat saat ini disesuaikan ke: ${locationText}`);
  };

  const handleTogglePhoto = () => {
    setHasPhoto((prev) => !prev);
    if (!hasPhoto) {
      Alert.alert('Foto Terlampir', 'Foto bukti lokasi berhasil dipilih.');
    }
  };

  const handleSubmit = () => {
    onSubmitReport({
      category: selectedCategory,
      location: locationText,
      description,
      hasPhoto,
    });
  };

  const renderIcon = (id: IncidentCategoryId) => {
    switch (id) {
      case 'lampu_mati':
        return <LightOffIcon size={20} color={DashboardTheme.colors.primary} />;
      case 'kriminalitas':
        return <CrimeAlertIcon size={20} color={DashboardTheme.colors.semanticAlert} />;
      case 'kerusakan_jalan':
        return <RoadDamageIcon size={20} color="#F59E0B" />;
      case 'bahaya_spasial':
        return <SpatialHazardIcon size={20} color={DashboardTheme.colors.skyBlue} />;
    }
  };

  return (
    <View style={styles.card}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={styles.accentBar} />
          <Text style={styles.headerTitle}>Pilih Kategori Insiden</Text>
        </View>
        <Text style={styles.requiredTag}>Wajib diisi</Text>
      </View>

      {/* 2x2 Categories Grid */}
      <View style={styles.categoriesGrid}>
        {CATEGORIES.map((item) => {
          const isSelected = selectedCategory === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryCard,
                isSelected ? styles.categoryCardSelected : styles.categoryCardDefault,
              ]}
              onPress={() => setSelectedCategory(item.id)}
              activeOpacity={0.8}
            >
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <CheckSmallIcon size={12} />
                </View>
              )}

              <View style={styles.categoryIconWrap}>
                {renderIcon(item.id)}
              </View>

              <View style={styles.categoryTextCol}>
                <Text
                  style={[
                    styles.categoryTitle,
                    isSelected && { fontWeight: '800' },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={styles.categorySubtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Auto-Detected Location Box */}
      <View style={styles.locationSection}>
        <Text style={styles.fieldLabel}>Lokasi Terdeteksi Otomatis</Text>
        <View style={styles.locationBox}>
          <View style={styles.locationLeft}>
            <MyLocationIcon size={18} />
            <View style={styles.locationTextCol}>
              <Text style={styles.locationAddress} numberOfLines={1}>
                {locationText}
              </Text>
              <Text style={styles.locationAccuracy}>Radius akurasi GPS: 120m</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editLocationBtn}
            onPress={handleEditLocation}
            activeOpacity={0.75}
          >
            <EditLocationIcon size={13} />
            <Text style={styles.editLocationText}>Ubah</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description and Photo Evidence */}
      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>Keterangan Tambahan (Opsional)</Text>
        <View style={styles.textInputWrapper}>
          <TextInput
            style={styles.textArea}
            placeholder="Jelaskan situasi singkat, misal: 3 tiang lampu padam berturut-turut..."
            placeholderTextColor={DashboardTheme.colors.textMuted}
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Photo Attachment Section */}
      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>Bukti Foto Lokasi</Text>
        <View style={styles.photosRow}>
          {hasPhoto && (
            <View style={styles.photoThumbWrapper}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
                }}
                style={styles.photoThumbImage}
              />
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={handleTogglePhoto}
                activeOpacity={0.7}
              >
                <Text style={styles.removePhotoText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.addPhotoCard}
            onPress={handleTogglePhoto}
            activeOpacity={0.75}
          >
            <AddPhotoIcon size={22} />
            <Text style={styles.addPhotoLabel}>Foto Bukti</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Report CTA */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Kirim Laporan Komunitas"
      >
        <SendIcon size={18} />
        <Text style={styles.submitButtonText}>Kirim Laporan Komunitas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xxl,
    padding: 16,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accentBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  requiredTag: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '48%',
    borderRadius: DashboardTheme.radius.lg,
    padding: 12,
    minHeight: 110,
    justifyContent: 'space-between',
    borderWidth: 1,
    position: 'relative',
  },
  categoryCardDefault: {
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderColor: DashboardTheme.colors.borderCard,
  },
  categoryCardSelected: {
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    borderColor: DashboardTheme.colors.primaryContainer,
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.primaryContainer,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    ...DashboardTheme.shadows.card,
  },
  categoryTextCol: {
    gap: 2,
    marginTop: 8,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  categorySubtitle: {
    fontSize: 10.5,
    color: DashboardTheme.colors.textSecondary,
  },
  locationSection: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    padding: 11,
    borderRadius: DashboardTheme.radius.lg,
    gap: 8,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  locationTextCol: {
    flex: 1,
    minWidth: 0,
    gap: 1,
  },
  locationAddress: {
    fontSize: 12.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  locationAccuracy: {
    fontSize: 10.5,
    color: DashboardTheme.colors.textSecondary,
  },
  editLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: DashboardTheme.radius.md,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
  },
  editLocationText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  formGroup: {
    gap: 6,
  },
  textInputWrapper: {
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: DashboardTheme.radius.lg,
    padding: 10,
  },
  textArea: {
    fontSize: 13,
    color: DashboardTheme.colors.textPrimary,
    minHeight: 56,
    padding: 0,
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 2,
  },
  photoThumbWrapper: {
    width: 72,
    height: 72,
    borderRadius: DashboardTheme.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  photoThumbImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  addPhotoCard: {
    width: 72,
    height: 72,
    borderRadius: DashboardTheme.radius.lg,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  addPhotoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
  },
  submitButton: {
    backgroundColor: DashboardTheme.colors.primaryContainer,
    borderRadius: DashboardTheme.radius.full,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.primaryContainer,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 14,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
});
