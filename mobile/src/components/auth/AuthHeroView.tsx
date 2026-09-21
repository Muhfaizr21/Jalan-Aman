import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { AuthSheetModal } from './AuthSheetModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/* Pure White Shield Brand Icon */
function BrandShieldIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255, 255, 255, 0.15)"
      />
      <Path
        d="M12 8.5c-.6-1-2-1-2.5 0-.5 1 0 2 2.5 3.5 2.5-1.5 3-2.5 2.5-3.5-.5-1-1.9-1-2.5 0z"
        fill="#A3E635"
      />
    </Svg>
  );
}

export const AuthHeroView: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { continueAsGuest } = useAuth();
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const statusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const safeTop = Math.max(insets.top, statusBarHeight);

  const handleOpenSignUp = () => {
    setAuthModalMode('signup');
    setIsAuthModalVisible(true);
  };

  const handleOpenSignIn = () => {
    setAuthModalMode('signin');
    setIsAuthModalVisible(true);
  };

  const handleGuestExplore = () => {
    continueAsGuest();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Cinematic Fullscreen Photography Background */}
      <ImageBackground
        source={require('../../../assets/images/login-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Top Dark Scrim for Brand Logo Visibility */}
        <Svg width="100%" height={160} style={styles.topScrim} pointerEvents="none">
          <Defs>
            <LinearGradient id="topFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#0B0F19" stopOpacity={0.85} />
              <Stop offset="50%" stopColor="#0B0F19" stopOpacity={0.4} />
              <Stop offset="100%" stopColor="#0B0F19" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#topFade)" />
        </Svg>

        {/* Top Left Brand Logo (Nike-style positioning) */}
        <View style={[styles.brandHeader, { paddingTop: safeTop + 14 }]}>
          <View style={styles.brandRow}>
            <BrandShieldIcon size={30} />
            <View>
              <Text style={styles.brandWordmark}>JalanAman</Text>
              <Text style={styles.brandTagline}>PERSONAL SAFETY NETWORK</Text>
            </View>
          </View>
        </View>

        {/* Bottom Dark Vignette Gradient Scrim */}
        <Svg width="100%" height={SCREEN_HEIGHT * 0.65} style={styles.bottomScrim} pointerEvents="none">
          <Defs>
            <LinearGradient id="bottomFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#0B0F19" stopOpacity={0} />
              <Stop offset="25%" stopColor="#0B0F19" stopOpacity={0.45} />
              <Stop offset="60%" stopColor="#0B0F19" stopOpacity={0.85} />
              <Stop offset="100%" stopColor="#0B0F19" stopOpacity={0.98} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#bottomFade)" />
        </Svg>

        {/* Bottom Hero Callout (Typography & Dual Action Buttons) */}
        <View style={[styles.bottomContent, { paddingBottom: Math.max(insets.bottom, 24) + 14 }]}>
          {/* Main Headline */}
          <Text style={styles.heroTitle}>JalanAman</Text>

          {/* Subtitle Message */}
          <Text style={styles.heroSubtitle}>
            Jalan tenang, pulang aman. Navigasi cerdas yang mendampingi setiap jengkal rute perjalananmu.
          </Text>

          {/* Nike-Style Dual Action Buttons */}
          <View style={styles.actionButtonsRow}>
            {/* Left Button: Join Us / Daftar Akun (Solid White Pill) */}
            <TouchableOpacity
              style={styles.joinUsButton}
              onPress={handleOpenSignUp}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Daftar Akun Baru"
            >
              <Text style={styles.joinUsButtonText}>Daftar Akun</Text>
            </TouchableOpacity>

            {/* Right Button: Sign In / Masuk (White Outlined Pill) */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleOpenSignIn}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Masuk ke Akun Anda"
            >
              <Text style={styles.signInButtonText}>Masuk</Text>
            </TouchableOpacity>
          </View>

          {/* Guest Mode Direct Access */}
          <TouchableOpacity
            style={styles.guestLinkButton}
            onPress={handleGuestExplore}
            activeOpacity={0.7}
          >
            <Text style={styles.guestLinkText}>
              Jelajahi Dulu Tanpa Akun (Mode Tamu) ›
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Interactive Bottom Sheet Form */}
      <AuthSheetModal
        visible={isAuthModalVisible}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalVisible(false)}
        onSuccess={() => {
          setIsAuthModalVisible(false);
          router.replace('/');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  brandHeader: {
    paddingHorizontal: 24,
    zIndex: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandWordmark: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  brandTagline: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#A3E635',
    letterSpacing: 1.2,
    marginTop: 1,
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomContent: {
    paddingHorizontal: 24,
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
    marginBottom: 8,
    lineHeight: 38,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.78)',
    lineHeight: 22,
    marginBottom: 26,
    maxWidth: '92%',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  joinUsButton: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  joinUsButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B0F19',
    letterSpacing: -0.2,
  },
  signInButton: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  guestLinkButton: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  guestLinkText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
  },
});
