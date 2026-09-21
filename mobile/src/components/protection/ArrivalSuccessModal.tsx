import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface ArrivalSuccessModalProps {
  visible: boolean;
  onReturnHome: () => void;
}

function HomePinIcon({ size = 32, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 11l2-2 2 2M10 11v3h4v-3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const ArrivalSuccessModal: React.FC<ArrivalSuccessModalProps> = ({
  visible,
  onReturnHome,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onReturnHome}
    >
      <View style={styles.overlay}>
        <View style={styles.dialogCard}>
          {/* Green Glow Home Icon */}
          <View style={styles.iconCircle}>
            <HomePinIcon size={32} />
          </View>

          {/* Title & Body */}
          <Text style={styles.title}>Tiba dengan Selamat!</Text>
          <Text style={styles.description}>
            Proteksi perjalanan dimatikan. Pemberitahuan telah dikirimkan ke keluarga dan
            lingkaran pengawal Anda secara otomatis.
          </Text>

          {/* Return CTA */}
          <TouchableOpacity
            style={styles.returnButton}
            onPress={onReturnHome}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Kembali ke Beranda"
          >
            <Text style={styles.returnButtonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 28, 45, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xxl,
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 28,
      },
      android: {
        elevation: 8,
      },
    }),
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.primaryContainer,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: DashboardTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 8,
  },
  returnButton: {
    width: '100%',
    backgroundColor: DashboardTheme.colors.primaryContainer,
    borderRadius: DashboardTheme.radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.primaryContainer,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  returnButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
});
