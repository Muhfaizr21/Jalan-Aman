import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
  Linking,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { useAuth } from '@/hooks/useAuth';
import { GuardianQuickContact } from '@/types/protection';

interface LiveTripSharingCardProps {
  shareUrl?: string;
  guardians?: GuardianQuickContact[];
}

const OFFICIAL_SHARED_GUARDIANS: GuardianQuickContact[] = [
  {
    id: 'em_112',
    name: 'Call Center 112 Indramayu',
    relation: 'Layanan Darurat Terpadu',
    statusText: 'Siaga 24 Jam',
    isOnline: true,
    iconName: 'police',
  },
  {
    id: 'em_polsek',
    name: 'Polsek Jatibarang',
    relation: 'Kepolisian Sektor',
    statusText: 'Siaga Patroli',
    isOnline: true,
    iconName: 'police',
  },
];

function ShareLocationIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

function LinkIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CopyIcon({ size = 14, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 16h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckSmallIcon({ size = 14, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6L9 17l-5-5"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WhatsAppIcon({ size = 20, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FamilyGroupIcon({ size = 18, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PoliceBadgeIcon({ size = 18, color = DashboardTheme.colors.onPrimaryContainer }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5l-8-3z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const LiveTripSharingCard: React.FC<LiveTripSharingCardProps> = ({
  shareUrl = 'jalanaman.id/track/x98f-live',
  guardians = OFFICIAL_SHARED_GUARDIANS,
}) => {
  const { user } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  const activeGuardians = React.useMemo(() => {
    const list = [...guardians];
    if (user?.guardian_name) {
      list.unshift({
        id: 'usr_guardian',
        name: user.guardian_name,
        relation: 'Pengawal Utama Warga',
        statusText: 'Terhubung Langsung',
        isOnline: true,
        iconName: 'user',
      });
    }
    return list;
  }, [guardians, user]);

  const handleCopyLink = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleWhatsAppShare = () => {
    const fullUrl = `https://${shareUrl}`;
    const text = encodeURIComponent(
      `Pantau perjalanan aman saya secara realtime melalui JalanAman: ${fullUrl}`
    );
    const waUrl = `https://api.whatsapp.com/send?text=${text}`;

    Linking.canOpenURL(waUrl).then((supported) => {
      if (supported) {
        Linking.openURL(waUrl);
      } else {
        Share.share({
          message: `[JalanAman Proteksi Perjalanan]: Pantau rute saya di ${fullUrl}`,
        });
      }
    });
  };

  const renderGuardianIcon = (item: GuardianQuickContact) => {
    switch (item.iconName) {
      case 'family':
        return <FamilyGroupIcon size={16} />;
      case 'police':
        return <PoliceBadgeIcon size={16} />;
      default:
        return <FamilyGroupIcon size={16} />;
    }
  };

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <ShareLocationIcon size={20} />
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Live Trip Sharing</Text>
            <Text style={styles.headerSubtitle}>Enkripsi End-to-End</Text>
          </View>
        </View>

        <View style={styles.encryptionBadge}>
          <Text style={styles.encryptionText}>SSL 256-Bit</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Tautan terenkripsi aman berlaku selama perjalanan berlangsung. Status baterai &amp; rute live
        dibagikan secara berkala.
      </Text>

      {/* URL Copy Container Box */}
      <View style={styles.urlCopyBox}>
        <View style={styles.urlLeft}>
          <LinkIcon size={16} />
          <Text style={styles.urlText} numberOfLines={1}>
            {shareUrl}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopyLink}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Salin Tautan Pelacakan"
        >
          {isCopied ? <CheckSmallIcon size={14} /> : <CopyIcon size={14} />}
          <Text style={[styles.copyButtonText, isCopied && styles.copyButtonTextActive]}>
            {isCopied ? 'Tersalin!' : 'Salin'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Prominent WhatsApp Share Button */}
      <TouchableOpacity
        style={styles.whatsappButton}
        onPress={handleWhatsAppShare}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Bagikan ke WhatsApp"
      >
        <WhatsAppIcon size={20} />
        <Text style={styles.whatsappButtonText}>Bagikan ke WhatsApp</Text>
      </TouchableOpacity>

      {/* Pengawal Siaga Cepat */}
      <View style={styles.guardiansSection}>
        <Text style={styles.guardiansSectionTitle}>PENGAWAL SIAGA CEPAT</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.guardiansScroll}
        >
          {activeGuardians.map((g) => (
            <View key={g.id} style={styles.guardianPill}>
              <View style={styles.guardianIconCircle}>
                {renderGuardianIcon(g)}
              </View>
              <View style={styles.guardianDetails}>
                <Text style={styles.guardianName}>{g.name}</Text>
                <View style={styles.guardianStatusRow}>
                  {g.isOnline && <View style={styles.onlineDot} />}
                  <Text
                    style={[
                      styles.guardianStatusText,
                      g.isOnline && { color: DashboardTheme.colors.primary },
                    ]}
                  >
                    {g.statusText}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
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
    gap: 13,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 170,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: DashboardTheme.radius.md,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    gap: 1,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textMuted,
  },
  encryptionBadge: {
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DashboardTheme.radius.full,
  },
  encryptionText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
  },
  description: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
    lineHeight: 17,
  },
  urlCopyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    borderRadius: DashboardTheme.radius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  urlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  urlText: {
    fontSize: 12.5,
    color: DashboardTheme.colors.textPrimary,
    fontWeight: '600',
    flexShrink: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DashboardTheme.colors.surfaceCard,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: DashboardTheme.radius.full,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
  },
  copyButtonText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  copyButtonTextActive: {
    color: DashboardTheme.colors.primary,
  },
  whatsappButton: {
    backgroundColor: DashboardTheme.colors.primaryContainer,
    borderRadius: DashboardTheme.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: DashboardTheme.colors.primaryContainer,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  whatsappButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  guardiansSection: {
    gap: 8,
    marginTop: 2,
  },
  guardiansSectionTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  guardiansScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  guardianPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.surfaceContainerLow,
    paddingLeft: 6,
    paddingRight: 12,
    paddingVertical: 6,
    borderRadius: DashboardTheme.radius.full,
    gap: 8,
  },
  guardianIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guardianDetails: {
    gap: 1,
  },
  guardianName: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  guardianStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: DashboardTheme.colors.primary,
  },
  guardianStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: DashboardTheme.colors.textMuted,
  },
});
