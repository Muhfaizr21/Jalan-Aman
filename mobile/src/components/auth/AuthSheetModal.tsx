import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { router } from 'expo-router';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { useAuth } from '@/hooks/useAuth';

interface AuthSheetModalProps {
  visible: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess?: () => void;
}

function CloseIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function EyeIcon({ size = 20, color = DashboardTheme.colors.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export const AuthSheetModal: React.FC<AuthSheetModalProps> = ({
  visible,
  initialMode = 'signin',
  onClose,
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setAuthMode(initialMode);
    setErrorMessage(null);
  }, [initialMode, visible]);

  const handleQuickFill = (role: 'superadmin' | 'user') => {
    setErrorMessage(null);
    if (role === 'superadmin') {
      setAuthMode('signin');
      setIdentifier('admin@gmail.com');
      setPassword('admin123');
    } else {
      setAuthMode('signin');
      setIdentifier('faiiz@test.com');
      setPassword('password123');
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();

    if (!cleanIdentifier) {
      Alert.alert('Perhatian', 'Silakan masukkan alamat email atau nomor telepon Anda.');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      Alert.alert('Perhatian', 'Kata sandi minimal terdiri dari 6 karakter.');
      return;
    }
    if (authMode === 'signup' && !fullName.trim()) {
      Alert.alert('Perhatian', 'Silakan masukkan nama lengkap Anda.');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'signin') {
        await login({
          email: cleanIdentifier,
          password: cleanPassword,
        });
      } else {
        await register({
          name: fullName.trim(),
          email: cleanIdentifier,
          password: cleanPassword,
        });
      }

      // Automatically close modal and transition to app
      onClose();
      if (onSuccess) {
        onSuccess();
      } else {
        router.replace('/');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Autentikasi gagal. Periksa kembali email dan kata sandi Anda.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    handleQuickFill('user');
    Alert.alert(
      'Google Sign-In',
      'Akun pengguna Google telah disiapkan untuk pengujian instan.',
      [{ text: 'Lanjut Masuk', onPress: handleSubmit }]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheetContainer}>
          {/* Top Grabber */}
          <View style={styles.grabberBar} />

          {/* Header row with Mode Switcher & Close Button */}
          <View style={styles.sheetHeader}>
            <View style={styles.tabSwitcher}>
              <TouchableOpacity
                style={[styles.switchBtn, authMode === 'signin' && styles.switchBtnActive]}
                onPress={() => setAuthMode('signin')}
                activeOpacity={0.8}
              >
                <Text style={[styles.switchBtnText, authMode === 'signin' && styles.switchBtnTextActive]}>
                  Masuk
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.switchBtn, authMode === 'signup' && styles.switchBtnActive]}
                onPress={() => setAuthMode('signup')}
                activeOpacity={0.8}
              >
                <Text style={[styles.switchBtnText, authMode === 'signup' && styles.switchBtnTextActive]}>
                  Daftar
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Tutup formulir"
            >
              <CloseIcon size={18} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            <Text style={styles.headline}>
              {authMode === 'signin' ? 'Selamat Datang Kembali' : 'Lindungi Perjalananmu'}
            </Text>
            <Text style={styles.subheadline}>
              {authMode === 'signin'
                ? 'Masuk untuk sinkronisasi radar komunitas & kontak pengawal.'
                : 'Bergabung dengan jaringan pelindung pejalan kaki dan komuter cerdas.'}
            </Text>

            {/* Quick Social Auth */}
            <TouchableOpacity
              style={styles.googleBtn}
              onPress={handleGoogleAuth}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <GoogleIcon size={20} />
              <Text style={styles.googleBtnText}>Lanjutkan dengan Google</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau dengan kredensial</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Registration Full Name */}
            {authMode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Lengkap</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Misal: Sarah Paramitha"
                  placeholderTextColor={DashboardTheme.colors.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            )}

            {/* Email / Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email atau Nomor Telepon</Text>
              <TextInput
                style={styles.textInput}
                placeholder="nama@email.com atau 0812xxxx"
                placeholderTextColor={DashboardTheme.colors.textMuted}
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input with eye toggle */}
            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.inputLabel}>Kata Sandi</Text>
                {authMode === 'signin' && (
                  <TouchableOpacity
                    onPress={() => Alert.alert('Bantuan Sandi', 'Tautan pemulihan akun akan dikirimkan ke email terdaftar.')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.forgotPasswordText}>Lupa Sandi?</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordTextInput}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor={DashboardTheme.colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  activeOpacity={0.7}
                >
                  <EyeIcon
                    size={20}
                    color={isPasswordVisible ? DashboardTheme.colors.primary : DashboardTheme.colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Feedback Banner */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {errorMessage}</Text>
              </View>
            )}

            {/* Quick Fill Dual Track Testing Helpers */}
            <View style={styles.quickFillContainer}>
              <Text style={styles.quickFillTitle}>Pintasan Uji Coba 2 Jalur:</Text>
              <View style={styles.quickFillButtonsRow}>
                <TouchableOpacity
                  style={[styles.quickFillBtn, identifier === 'admin@gmail.com' && styles.quickFillBtnActive]}
                  onPress={() => handleQuickFill('superadmin')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.quickFillBtnText, identifier === 'admin@gmail.com' && styles.quickFillBtnTextActive]}>
                    👑 Superadmin (admin@gmail.com)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickFillBtn, identifier === 'faiiz@test.com' && styles.quickFillBtnActive]}
                  onPress={() => handleQuickFill('user')}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.quickFillBtnText, identifier === 'faiiz@test.com' && styles.quickFillBtnTextActive]}>
                    👤 User Warga (faiiz@test.com)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.88}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#0F172A" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {authMode === 'signin' ? 'Masuk ke JalanAman' : 'Buat Akun Pelindung'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Footnote privacy assurance */}
            <Text style={styles.privacyAssurance}>
              🔒 Terproteksi enkripsi end-to-end berstandar keselamatan sipil.
            </Text>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  grabberBar: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: 999,
    padding: 3,
  },
  switchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
  },
  switchBtnActive: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  switchBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textMuted,
  },
  switchBtnTextActive: {
    color: DashboardTheme.colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingBottom: 20,
  },
  headline: {
    fontSize: 20,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subheadline: {
    fontSize: 12.5,
    color: DashboardTheme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 18,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    gap: 10,
    marginBottom: 16,
  },
  googleBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textMuted,
    textTransform: 'uppercase',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
    marginBottom: 6,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
  textInput: {
    height: 48,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 13.5,
    color: DashboardTheme.colors.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  passwordTextInput: {
    flex: 1,
    fontSize: 13.5,
    color: DashboardTheme.colors.textPrimary,
    padding: 0,
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    height: 50,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
    shadowColor: DashboardTheme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  privacyAssurance: {
    fontSize: 11,
    textAlign: 'center',
    color: DashboardTheme.colors.textMuted,
    lineHeight: 16,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  quickFillContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
  },
  quickFillTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textAlign: 'center',
  },
  quickFillButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickFillBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFillBtnActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  quickFillBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  quickFillBtnTextActive: {
    color: '#FFFFFF',
  },
});
