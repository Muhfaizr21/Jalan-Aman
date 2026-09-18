import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

export interface EmergencySOSModalProps {
  visible?: boolean;
  onDismiss?: () => void;
  onEvacuationStart?: (shelterData: any) => void;
}

/* ================= VECTOR ICONS ================= */
function CloseDismissIcon({ color = '#64748B', size = 20 }: { color?: string; size?: number }) {
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

function AlarmLightOutlineIcon({ color = '#FFFFFF', size = 44 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9v6h14V9c0-3.87-3.13-7-7-7z"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 19h16M7 22h10M12 5v2M8.5 7.5l1.5 1.5M15.5 7.5L14 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PoliceShieldIcon({ color = '#0284C7', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        fill={color}
        fillOpacity="0.15"
      />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

function NavigationVariantIcon({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11l19-9-9 19-2-8-8-2z"
        stroke={color}
        strokeWidth="2.2"
        fill={color}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function RadioTowerIcon({ color = '#DC2626', size = 14 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="6" r="2" fill={color} />
      <Path
        d="M8.5 3a5 5 0 000 6M15.5 3a5 5 0 010 6M5.5 1a9 9 0 000 10M18.5 1a9 9 0 010 10M12 8v14M8 22l4-8 4 8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function UserHeartIcon({ color = '#0284C7', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
      <Path
        d="M5 21v-2a7 7 0 0114 0v2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function PhoneCallAlertIcon({ color = '#DC2626', size = 18 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function EmergencySOSModal({
  visible,
  onDismiss,
  onEvacuationStart,
}: EmergencySOSModalProps) {
  const insets = useSafeAreaInsets();
  const [holdingProgress, setHoldingProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Ripple Wave Animation
  const rippleAnim1 = useRef(new Animated.Value(1)).current;
  const rippleAnim2 = useRef(new Animated.Value(1)).current;
  const holdIntervalRef = useRef<any>(null);

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.timing(rippleAnim1, {
        toValue: 1.45,
        duration: 1600,
        useNativeDriver: true,
      })
    );
    const loop2 = Animated.loop(
      Animated.timing(rippleAnim2, {
        toValue: 1.8,
        duration: 2200,
        useNativeDriver: true,
      })
    );

    loop1.start();
    loop2.start();

    return () => {
      loop1.stop();
      loop2.stop();
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [rippleAnim1, rippleAnim2]);

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  // Hold 3 seconds logic
  const handlePressIn = () => {
    setIsHolding(true);
    setHoldingProgress(0);

    const startTime = Date.now();
    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 3000, 1);
      setHoldingProgress(progress);

      if (progress >= 1) {
        clearInterval(holdIntervalRef.current);
        triggerSOSAlert();
      }
    }, 60);
  };

  const handlePressOut = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    if (holdingProgress < 1) {
      setHoldingProgress(0);
    }
  };

  const triggerSOSAlert = () => {
    setBroadcastSent(true);
    Alert.alert(
      '🚨 SINYAL DARURAT DISIARKAN',
      'Koordinat satelit live Anda telah dipancarkan ke Ibu (+62 812-****-3321) dan Polsek Jatibarang. Rute evakuasi darurat siap dipandu.',
      [
        {
          text: 'PANDU EVAKUASI SEKARANG',
          onPress: handleStartEvacuation,
        },
        {
          text: 'Tutup Sinyal',
          style: 'cancel',
        },
      ]
    );
  };

  const handleStartEvacuation = () => {
    if (onEvacuationStart) {
      onEvacuationStart({
        shelter_name: 'Polsek Jatibarang',
        distance: '320 meter',
        eta: '1 menit',
      });
    } else {
      Alert.alert(
        '🛡️ Rute Evakuasi Aktif',
        'Navigasi darurat diarahkan ke Polsek Jatibarang (320m melalui Jl. Mayor Dasuki). Tetap di jalur berpenerangan terang.'
      );
      handleDismiss();
    }
  };

  const remainingSeconds = Math.max(0, 3 - holdingProgress * 3).toFixed(1);

  const content = (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']} testID="EmergencySOSModal">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ================= HEADER: critical_alert_banner ================= */}
      <View style={styles.headerBanner}>
        <View style={styles.headerLeftCol}>
          <View style={styles.badgeRow}>
            <View style={styles.statusBadge}>
              <View style={styles.badgePulsingDot} />
              <RadioTowerIcon color="#DC2626" size={13} />
              <Text style={styles.statusBadgeText}>Live Satellite Broadcast</Text>
            </View>
          </View>

          <Text style={styles.headerTitle} testID="sos-modal-title">Protokol Darurat Aktif</Text>
        </View>

        <TouchableOpacity
          style={styles.dismissButton}
          onPress={handleDismiss}
          activeOpacity={0.7}
          accessibilityLabel="Tutup Protokol Darurat"
        >
          <CloseDismissIcon color="#64748B" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= SECTION 1: sos_countdown_trigger ================= */}
        <View style={styles.sosTriggerSection}>
          <View style={styles.sosButtonContainer}>
            {/* Concentric Animated Pulse Wave Rings */}
            <Animated.View
              style={[
                styles.pulseWaveRing,
                {
                  transform: [{ scale: rippleAnim2 }],
                  opacity: rippleAnim2.interpolate({
                    inputRange: [1, 1.8],
                    outputRange: [0.7, 0],
                  }),
                },
              ]}
            />
            <Animated.View
              style={[
                styles.pulseWaveRing,
                {
                  transform: [{ scale: rippleAnim1 }],
                  opacity: rippleAnim1.interpolate({
                    inputRange: [1, 1.45],
                    outputRange: [0.9, 0],
                  }),
                },
              ]}
            />

            {/* Circular Hold Progress Border */}
            {isHolding && (
              <View style={styles.progressRingOverlay}>
                <View
                  style={[
                    styles.progressBorderFill,
                    {
                      opacity: holdingProgress > 0 ? 1 : 0,
                    },
                  ]}
                />
              </View>
            )}

            {/* Main Primary Action Circle Button (180px) */}
            <TouchableOpacity
              style={[
                styles.sosMainCircle,
                isHolding && styles.sosMainCirclePressed,
                broadcastSent && styles.sosMainCircleSent,
              ]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              testID="3-Second Hold Circle"
              accessibilityLabel="3-Second Hold Circle"
              accessibilityRole="button"
            >
              <AlarmLightOutlineIcon color="#FFFFFF" size={44} />

              <Text style={styles.sosActionLabel}>
                {broadcastSent
                  ? 'SINYAL AKTIF'
                  : isHolding
                  ? `${remainingSeconds}s`
                  : 'TAHAN 3 DETIK'}
              </Text>

              <Text style={styles.sosActionSublabel}>
                {broadcastSent
                  ? 'Siaran Terpancar'
                  : isHolding
                  ? 'Lepaskan untuk batal'
                  : 'Kirim Sinyal Bahaya'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Trigger Disclaimer */}
          <Text style={styles.triggerDisclaimerText}>
            Menyiarkan koordinat langsung ke kontak darurat dan pos siaga terdekat
          </Text>
        </View>

        {/* ================= SECTION 2: nearest_evacuation_target ================= */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Titik Evakuasi Terdekat</Text>
            <Text style={styles.etaHighlightBadge}>1 menit berkendara</Text>
          </View>

          <View
            style={styles.shelterQuickCard}
            testID="Nearest Police Shelter Card"
            accessibilityLabel="Nearest Police Shelter Card"
          >
            <View style={styles.shelterTopRow}>
              <View style={styles.shelterIconBox}>
                <PoliceShieldIcon color="#0284C7" size={22} />
              </View>

              <View style={styles.shelterTitleCol}>
                <View style={styles.shelterCategoryTag}>
                  <Text style={styles.shelterCategoryText}>Pos Polisi</Text>
                </View>

                <Text style={styles.shelterName}>Polsek Jatibarang</Text>
                <Text style={styles.shelterAddress}>Jl. Mayor Dasuki No. 12</Text>
              </View>

              <View style={styles.distanceBadgeCol}>
                <Text style={styles.distanceValue}>320 m</Text>
                <Text style={styles.distanceLabel}>Jarak</Text>
              </View>
            </View>

            {/* Action Button: Pandu Rute Evakuasi Sekarang */}
            <TouchableOpacity
              style={styles.evacuationActionButton}
              onPress={handleStartEvacuation}
              activeOpacity={0.88}
              accessibilityRole="button"
            >
              <NavigationVariantIcon color="#FFFFFF" size={17} />
              <Text style={styles.evacuationActionText}>
                Pandu Rute Evakuasi Sekarang
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= SECTION 3: emergency_contacts_ping ================= */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>Penerima Siaran Koordinat</Text>

          <View
            style={styles.contactsListContainer}
            testID="Family Emergency Contact Broadcast"
            accessibilityLabel="Family Emergency Contact Broadcast"
          >
            {/* Contact 1: Ibu */}
            <View style={styles.contactItemRow}>
              <View style={styles.contactIconCircle}>
                <UserHeartIcon color="#0284C7" size={18} />
              </View>

              <View style={styles.contactDetailsCol}>
                <View style={styles.contactRoleRow}>
                  <Text style={styles.contactRole}>Kontak Keluarga Utama</Text>
                  <View style={styles.onlineDot} />
                </View>

                <Text style={styles.contactName}>
                  Ibu{' '}
                  <Text style={styles.contactPhone}>(+62 812-****-3321)</Text>
                </Text>

                <Text style={styles.contactStatusText}>
                  Tersambung (SMS / WA Broadcast)
                </Text>
              </View>
            </View>

            <View style={styles.contactDivider} />

            {/* Contact 2: Call Center 110 */}
            <View style={styles.contactItemRow}>
              <View style={[styles.contactIconCircle, styles.contactIconDanger]}>
                <PhoneCallAlertIcon color="#DC2626" size={18} />
              </View>

              <View style={styles.contactDetailsCol}>
                <View style={styles.contactRoleRow}>
                  <Text style={styles.contactRole}>Layanan Tanggap Darurat</Text>
                  <View style={styles.onlineDot} />
                </View>

                <Text style={styles.contactName}>
                  Call Center 110{' '}
                  <Text style={styles.contactPhone}>(110)</Text>
                </Text>

                <Text style={styles.contactStatusText}>
                  Siaga Siap Panggil
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ================= FOOTER: single_action_row ================= */}
      <View
        style={[
          styles.footerContainer,
          { paddingBottom: Math.max(insets.bottom, 12) + 8 },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleDismiss}
          activeOpacity={0.8}
          testID="Cancel Button"
          accessibilityLabel="Cancel Button"
          accessibilityRole="button"
        >
          <Text style={styles.cancelButtonText}>Batal / Salah Tekan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (visible !== undefined) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleDismiss}
      >
        {content}
      </Modal>
    );
  }

  return content;
}

export default EmergencySOSModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* ================= HEADER ================= */
  headerBanner: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerLeftCol: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  badgePulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: -0.1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  dismissButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  /* Scrollable Content */
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },

  /* ================= SECTION 1: sos_countdown_trigger ================= */
  sosTriggerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 16,
  },
  sosButtonContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseWaveRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FEE2E2',
  },
  progressRingOverlay: {
    position: 'absolute',
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 4,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBorderFill: {
    width: '100%',
    height: '100%',
    borderRadius: 98,
  },
  sosMainCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      default: {
        boxShadow: '0 8px 24px rgba(220, 38, 38, 0.45)',
      },
    }),
  },
  sosMainCirclePressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: '#B91C1C',
  },
  sosMainCircleSent: {
    backgroundColor: '#059669',
  },
  sosActionLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
    letterSpacing: 0.4,
  },
  sosActionSublabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  triggerDisclaimerText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 290,
    marginTop: 8,
    lineHeight: 17,
  },

  /* ================= SECTION 2: nearest_evacuation_target ================= */
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  etaHighlightBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  shelterQuickCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    gap: 12,
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
  shelterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shelterIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterTitleCol: {
    flex: 1,
  },
  shelterCategoryTag: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginBottom: 2,
  },
  shelterCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
  },
  shelterName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  shelterAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  distanceBadgeCol: {
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  distanceValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  distanceLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '600',
  },
  evacuationActionButton: {
    backgroundColor: '#0284C7',
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#0284C7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
      },
    }),
  },
  evacuationActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.1,
  },

  /* ================= SECTION 3: emergency_contacts_ping ================= */
  contactsListContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
  },
  contactItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIconDanger: {
    backgroundColor: '#FEE2E2',
  },
  contactDetailsCol: {
    flex: 1,
  },
  contactRoleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactRole: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  contactPhone: {
    fontWeight: '500',
    color: '#64748B',
  },
  contactStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    marginTop: 2,
  },
  contactDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },

  /* ================= FOOTER: single_action_row ================= */
  footerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  cancelButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
});
