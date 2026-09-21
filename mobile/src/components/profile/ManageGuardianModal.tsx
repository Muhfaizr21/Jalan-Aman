import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';

interface ManageGuardianModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSuccess?: () => void;
}

/* Vector Icons */
function ArrowBackIcon({ size = 22, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldUserIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

const RELATION_PRESETS = [
  'Keluarga Inti',
  'Pasangan',
  'Orang Tua',
  'Saudara',
  'Teman Dekat',
  'Ketua RT / RW',
];

export const ManageGuardianModal: React.FC<ManageGuardianModalProps> = ({
  visible,
  onDismiss,
  onSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();
  const { refetch: refetchNotifications } = useNotifications();

  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [relation, setRelation] = useState('Keluarga Inti');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible && user) {
      setGuardianName(user.guardian_name || '');
      setGuardianPhone(user.guardian_phone || '');
    }
  }, [visible, user]);

  const hasExistingGuardian = Boolean(user?.guardian_name && user.guardian_name.trim() !== '');

  const handleSave = async () => {
    if (!guardianName.trim()) {
      Alert.alert('Data Belum Lengkap', 'Mohon isi nama kontak pengawal.');
      return;
    }
    if (!guardianPhone.trim()) {
      Alert.alert('Data Belum Lengkap', 'Mohon isi nomor telepon atau WhatsApp pengawal.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: user?.name || 'Warga JalanAman',
        phone: user?.phone || '',
        domicile: user?.domicile || '',
        blood_type: user?.blood_type || '',
        allergies: user?.allergies || '',
        medical_notes: user?.medical_notes || '',
        emergency_hospital: user?.emergency_hospital || '',
        guardian_name: guardianName.trim(),
        guardian_phone: guardianPhone.trim(),
      });

      await refetchNotifications();

      Alert.alert(
        '✅ Pengawal Berhasil Disimpan',
        `Kontak ${guardianName.trim()} (${guardianPhone.trim()}) kini terhubung ke akun Anda di database PostgreSQL JalanAman sebagai Pengawal Utama Siaga 24 Jam.`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (onSuccess) onSuccess();
              onDismiss();
            },
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Gagal Menyimpan', err?.message || 'Terjadi gangguan jaringan saat menyimpan pengawal.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGuardian = () => {
    Alert.alert(
      'Hapus Pengawal',
      `Apakah Anda yakin ingin melepas ${user?.guardian_name} dari Lingkaran Pengawal Anda?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            setIsSaving(true);
            try {
              await updateProfile({
                name: user?.name || 'Warga JalanAman',
                phone: user?.phone || '',
                domicile: user?.domicile || '',
                blood_type: user?.blood_type || '',
                allergies: user?.allergies || '',
                medical_notes: user?.medical_notes || '',
                emergency_hospital: user?.emergency_hospital || '',
                guardian_name: '',
                guardian_phone: '',
              });
              await refetchNotifications();
              Alert.alert('Pengawal Dilepas', 'Kontak pengawal telah dihapus dari database PostgreSQL.');
              if (onSuccess) onSuccess();
              onDismiss();
            } catch (err: any) {
              Alert.alert('Gagal', err?.message || 'Gagal melepas pengawal.');
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onDismiss}
              activeOpacity={0.7}
              accessibilityLabel="Tutup Formulir"
            >
              <ArrowBackIcon size={20} />
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
              <Text style={styles.headerTitle}>
                {hasExistingGuardian ? 'Kelola Pengawal Utama' : 'Tambah Pengawal Siaga'}
              </Text>
              <Text style={styles.headerSubtitle}>Tersimpan di Database PostgreSQL</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Info Card */}
            <View style={styles.infoBanner}>
              <View style={styles.infoIconCircle}>
                <ShieldUserIcon size={20} />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={styles.infoTitle}>Hak Akses Pengawal Terverifikasi</Text>
                <Text style={styles.infoText}>
                  Pengawal yang Anda daftarkan akan menerima notifikasi otomatis ketika Deadman Switch atau tombol S.O.S Marabahaya terpicu di wilayah Indramayu.
                </Text>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>NAMA LENGKAP PENGAWAL</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Rina Pramudita / Bpk. H. Sukardi"
                placeholderTextColor={DashboardTheme.colors.textMuted}
                value={guardianName}
                onChangeText={setGuardianName}
                autoCapitalize="words"
              />

              <Text style={styles.inputLabel}>NOMOR TELEPON / WHATSAPP</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: 081234567890"
                placeholderTextColor={DashboardTheme.colors.textMuted}
                value={guardianPhone}
                onChangeText={setGuardianPhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>HUBUNGAN PENGAWAL</Text>
              <View style={styles.presetsGrid}>
                {RELATION_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[styles.presetChip, relation === preset && styles.presetChipActive]}
                    onPress={() => setRelation(preset)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        relation === preset && styles.presetChipTextActive,
                      ]}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsCol}>
              <TouchableOpacity
                style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={isSaving}
                activeOpacity={0.88}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {hasExistingGuardian ? 'Simpan Perubahan Pengawal' : 'Hubungkan ke Lingkaran Pengawal'}
                  </Text>
                )}
              </TouchableOpacity>

              {hasExistingGuardian && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeleteGuardian}
                  disabled={isSaving}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Hapus Kontak Pengawal dari Akun</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.25)',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#365314',
  },
  infoText: {
    fontSize: 12,
    color: '#4D7C0F',
    lineHeight: 18,
  },
  formSection: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  presetChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: DashboardTheme.colors.primary,
    borderColor: DashboardTheme.colors.primary,
  },
  presetChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  actionButtonsCol: {
    gap: 12,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: DashboardTheme.colors.primary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DashboardTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deleteButton: {
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
});
