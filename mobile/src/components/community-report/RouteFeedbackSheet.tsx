import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { RouteFeedbackExperienceChip } from '@/types/communityReport';

interface RouteFeedbackSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmitFeedback?: (rating: number, selectedChips: string[]) => void;
}

const FEEDBACK_CHIPS: RouteFeedbackExperienceChip[] = [
  { id: 'c1', label: 'Penerangan Baik', icon: 'light', isPositive: true },
  { id: 'c2', label: 'Jalanan Ramai', icon: 'crowd', isPositive: true },
  { id: 'c3', label: 'Merasa Nyaman & Aman', icon: 'shield', isPositive: true },
  { id: 'c4', label: 'Minim Lampu Jalan', icon: 'dark', isPositive: false },
  { id: 'c5', label: 'Ada Titik Sepi / Rawan', icon: 'quiet', isPositive: false },
  { id: 'c6', label: 'Patroli Terlihat', icon: 'patrol', isPositive: true },
];

function StarIcon({ size = 32, isFilled = true }: { size?: number; isFilled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={isFilled ? '#84CC16' : '#E2E8F0'}
        stroke={isFilled ? '#65A30D' : '#CBD5E1'}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CloseIcon({ size = 18, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" stroke={color} strokeWidth={2} />
      <Path d="M8 12l2.5 2.5L16 9" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export const RouteFeedbackSheet: React.FC<RouteFeedbackSheetProps> = ({
  visible,
  onClose,
  onSubmitFeedback,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [selectedChips, setSelectedChips] = useState<string[]>(['c1', 'c2', 'c3']);

  const toggleChip = (id: string) => {
    setSelectedChips((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (onSubmitFeedback) {
      onSubmitFeedback(rating, selectedChips);
    }
    Alert.alert(
      '🌟 Terima Kasih atas Ulasannya!',
      'Ulasan rute Anda membantu algoritma spasial JalanAman menjaga kenyamanan seluruh warga.',
      [{ text: 'Tutup', onPress: onClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheetContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle}>Bagaimana Perjalanan Terakhirmu?</Text>
              <Text style={styles.headerSubtitle}>Rute: Stasiun Jatibarang → Rumah (2.1 km)</Text>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Tutup"
            >
              <CloseIcon size={18} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* 5-Star Rating Component */}
            <View style={styles.ratingBox}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                  style={styles.starBtn}
                >
                  <StarIcon size={32} isFilled={star <= rating} />
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Feedback Experience Chips */}
            <View style={styles.chipsSection}>
              <Text style={styles.chipsTitle}>Pilih Pengalaman Anda</Text>
              <View style={styles.chipsWrapper}>
                {FEEDBACK_CHIPS.map((chip) => {
                  const isSelected = selectedChips.includes(chip.id);
                  return (
                    <TouchableOpacity
                      key={chip.id}
                      style={[
                        styles.chipPill,
                        isSelected ? styles.chipPillSelected : styles.chipPillDefault,
                      ]}
                      onPress={() => toggleChip(chip.id)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {chip.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Simpan Ulasan Rute"
            >
              <Text style={styles.saveBtnText}>Simpan Ulasan Rute</Text>
              <CheckCircleIcon size={18} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 38 : 24,
    maxHeight: '85%',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTextCol: {
    flex: 1,
    gap: 3,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    borderRadius: DashboardTheme.radius.xl,
    paddingVertical: 14,
    gap: 8,
  },
  starBtn: {
    padding: 4,
  },
  chipsSection: {
    gap: 8,
  },
  chipsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
  },
  chipsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: DashboardTheme.radius.full,
    borderWidth: 1,
  },
  chipPillDefault: {
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    borderColor: DashboardTheme.colors.borderCard,
  },
  chipPillSelected: {
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    borderColor: DashboardTheme.colors.primaryContainer,
  },
  chipText: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: DashboardTheme.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: DashboardTheme.colors.textPrimary,
    borderRadius: DashboardTheme.radius.xl,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.textPrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  saveBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
