import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuth } from '@/hooks/useAuth';

interface EditProfileModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSaveSuccess?: (updatedData: any) => void;
}

/* Vector Icons */
function ArrowBackIcon({ size = 22, color = '#0F172A' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M19 12H5M12 19l-7-7 7-7" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CameraIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
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

function CheckShieldIcon({ size = 16, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onDismiss,
  onSaveSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [city, setCity] = useState(user?.domicile || 'Indramayu');

  // Medical ID States
  const [bloodType, setBloodType] = useState<'A' | 'B' | 'AB' | 'O'>('B');
  const [rhesus, setRhesus] = useState<'+' | '-'>('+');
  const [allergies, setAllergies] = useState(user?.allergies || '');
  const [conditions, setConditions] = useState(user?.medical_notes || '');
  const [hospital, setHospital] = useState(user?.emergency_hospital || 'RSUD Indramayu');

  // Primary Guardian
  const [guardianName, setGuardianName] = useState(user?.guardian_name || '');
  const [guardianPhone, setGuardianPhone] = useState(user?.guardian_phone || '');

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setCity(user.domicile || 'Indramayu');
      if (user.blood_type) {
        const cleanType = user.blood_type.replace('+', '').replace('-', '') as 'A' | 'B' | 'AB' | 'O';
        if (['A', 'B', 'AB', 'O'].includes(cleanType)) {
          setBloodType(cleanType);
        }
        setRhesus(user.blood_type.includes('-') ? '-' : '+');
      }
      setAllergies(user.allergies || '');
      setConditions(user.medical_notes || '');
      setHospital(user.emergency_hospital || 'RSUD Indramayu');
      setGuardianName(user.guardian_name || '');
      setGuardianPhone(user.guardian_phone || '');
    }
  }, [user, visible]);

  const initials = (fullName || 'WA')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const memberId = user
    ? (user.role === 'Superadmin' ? 'JA-SUPERADMIN' : `JA-${user.id.slice(0, 8).toUpperCase()}`)
    : 'JA-WARGA-INDRAMAYU';

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Data Belum Lengkap', 'Nama lengkap wajib diisi.');
      return;
    }

    setIsSaving(true);
    try {
      const combinedBloodType = `${bloodType}${rhesus}`;
      const updated = await updateProfile({
        name: fullName.trim(),
        phone: phone.trim(),
        domicile: city.trim(),
        blood_type: combinedBloodType,
        allergies: allergies.trim(),
        medical_notes: conditions.trim(),
        emergency_hospital: hospital.trim(),
        guardian_name: guardianName.trim(),
        guardian_phone: guardianPhone.trim(),
      });

      if (onSaveSuccess) {
        onSaveSuccess(updated);
      }
      onDismiss();
    } catch (err: unknown) {
      Alert.alert(
        'Gagal Menyimpan',
        err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan profil ke server.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleKycVerification = () => {
    Alert.alert(
      'Verifikasi Identitas Warga',
      'Fitur pemindaian e-KTP dengan enkripsi lokal SHA-256. Data tidak disebarluaskan ke pihak ketiga dan hanya digunakan untuk verifikasi status relawan warga.'
    );
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

        {/* Header Bar */}
        <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onDismiss}
            activeOpacity={0.7}
            accessibilityLabel="Batal dan kembali"
          >
            <ArrowBackIcon size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profil & Identitas Aman</Text>
          <TouchableOpacity
            style={[styles.saveHeaderBtn, isSaving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveHeaderBtnText}>Simpan</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Body Scroll */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Edit Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={() => Alert.alert('Ganti Foto', 'Buka kamera atau galeri untuk memperbarui foto profil.')}
                activeOpacity={0.8}
              >
                <CameraIcon size={14} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarLabel}>{fullName || 'Pengguna JalanAman'}</Text>
            <Text style={styles.avatarSublabel}>ID Warga Terenkripsi: {memberId}</Text>
          </View>

          {/* Trust Score KYC Verification Card */}
          <TouchableOpacity
            style={styles.kycCard}
            onPress={handleKycVerification}
            activeOpacity={0.8}
          >
            <View style={styles.kycLeft}>
              <View style={styles.kycIconWrap}>
                <CheckShieldIcon size={20} />
              </View>
              <View style={styles.kycTextCol}>
                <Text style={styles.kycTitle}>Tingkatkan Trust Score ke 100%</Text>
                <Text style={styles.kycDesc}>
                  Verifikasi identitas warga via e-KTP untuk membuka lencana Pengawal Terpercaya.
                </Text>
              </View>
            </View>
            <Text style={styles.kycActionText}>Verifikasi →</Text>
          </TouchableOpacity>

          {/* ================= SECTION 1: PERSONAL ACCOUNT INFO ================= */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeading}>DATA PRIBADI & KONTAK</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Nama Lengkap</Text>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nama sesuai KTP"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldBlock}>
              <View style={styles.labelWithBadgeRow}>
                <Text style={styles.fieldLabel}>Nomor WhatsApp</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>✓ Terverifikasi</Text>
                </View>
              </View>
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+62 812-xxxx-xxxx"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldBlock}>
              <View style={styles.labelWithBadgeRow}>
                <Text style={styles.fieldLabel}>Alamat Email Akun</Text>
                <View style={[styles.verifiedBadge, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                  <Text style={[styles.verifiedBadgeText, { color: '#2563EB' }]}>✓ Akun Terdaftar</Text>
                </View>
              </View>
              <TextInput
                style={[styles.textInput, { backgroundColor: '#F8FAFC', color: '#475569' }]}
                value={email}
                editable={false}
                placeholder="email@domain.com"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Area Domisili</Text>
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder="Kecamatan, Kota"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* ================= SECTION 2: MEDICAL ID & FIRST RESPONDER ================= */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>ID MEDIS DARURAT (P3K)</Text>
              <Text style={styles.sectionNotice}>Dapat diakses saat darurat</Text>
            </View>

            {/* Blood Type & Rhesus Selector */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Golongan Darah & Rhesus</Text>
              <View style={styles.bloodTypeRow}>
                {(['A', 'B', 'AB', 'O'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.bloodTypeBtn, bloodType === type && styles.bloodTypeBtnActive]}
                    onPress={() => setBloodType(type)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.bloodTypeText, bloodType === type && styles.bloodTypeTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}

                <View style={styles.rhesusWrap}>
                  <TouchableOpacity
                    style={[styles.rhesusBtn, rhesus === '+' && styles.rhesusBtnActive]}
                    onPress={() => setRhesus('+')}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.rhesusText, rhesus === '+' && styles.rhesusTextActive]}>+ (Pos)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rhesusBtn, rhesus === '-' && styles.rhesusBtnActive]}
                    onPress={() => setRhesus('-')}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.rhesusText, rhesus === '-' && styles.rhesusTextActive]}>- (Neg)</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Alergi Obat / Makanan</Text>
              <TextInput
                style={styles.textInput}
                value={allergies}
                onChangeText={setAllergies}
                placeholder="Contoh: Penisilin, Parasetamol"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Kondisi Medis / Catatan Reseptor</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={conditions}
                onChangeText={setConditions}
                multiline
                numberOfLines={2}
                placeholder="Catatan untuk paramedis / penolong"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Rumah Sakit Rujukan Utama</Text>
              <TextInput
                style={styles.textInput}
                value={hospital}
                onChangeText={setHospital}
                placeholder="Nama RS terdekat"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          {/* ================= SECTION 3: PRIMARY GUARDIAN ================= */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionHeading}>KONTAK PENGAWAL PRIORITAS (SOS)</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Nama Kontak Pengawal</Text>
              <TextInput
                style={styles.textInput}
                value={guardianName}
                onChangeText={setGuardianName}
                placeholder="Nama dan hubungan (misal: Ayah/Ibu)"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Nomor Telepon WhatsApp</Text>
              <TextInput
                style={styles.textInput}
                value={guardianPhone}
                onChangeText={setGuardianPhone}
                keyboardType="phone-pad"
                placeholder="+62 811-xxxx-xxxx"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  saveHeaderBtn: {
    backgroundColor: '#416900',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  saveHeaderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 18,
    paddingHorizontal: 16,
    gap: 24,
  },

  /* Avatar Section */
  avatarSection: {
    alignItems: 'center',
    gap: 6,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 4,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#D9F99D',
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: '900',
    color: '#A3E635',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#416900',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  avatarSublabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  /* KYC Banner */
  kycCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7FEE7',
    borderWidth: 1,
    borderColor: '#D9F99D',
    borderRadius: 16,
    padding: 14,
  },
  kycLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  kycIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9F99D',
  },
  kycTextCol: {
    flex: 1,
    gap: 2,
  },
  kycTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#315200',
  },
  kycDesc: {
    fontSize: 11,
    color: '#4D7C0F',
    lineHeight: 15,
  },
  kycActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#315200',
    marginLeft: 8,
  },

  /* Sections */
  sectionWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },
  sectionNotice: {
    fontSize: 10,
    fontWeight: '600',
    color: '#DC2626',
  },

  /* Fields */
  fieldBlock: {
    gap: 6,
  },
  labelWithBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },

  /* Blood Type Selector */
  bloodTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bloodTypeBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  bloodTypeBtnActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  bloodTypeTextActive: {
    color: '#FFFFFF',
  },
  rhesusWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  rhesusBtn: {
    paddingHorizontal: 10,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  rhesusBtnActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  rhesusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  rhesusTextActive: {
    color: '#FFFFFF',
  },
});
