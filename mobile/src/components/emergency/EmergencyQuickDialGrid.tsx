import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { EmergencyCallService } from '@/types/emergencyCenter';

interface EmergencyQuickDialGridProps {
  services?: EmergencyCallService[];
  onCallPress?: (service: EmergencyCallService) => void;
}

const DEFAULT_EMERGENCY_SERVICES: EmergencyCallService[] = [
  {
    id: 'police',
    number: '110',
    name: 'Polisi Patroli',
    unit: 'Polsek Jatibarang (320m)',
    badge: 'Bebas Pulsa',
    category: 'police',
  },
  {
    id: 'ambulance',
    number: '119',
    name: 'Ambulans & Medis',
    unit: 'RSUD Indramayu (Siaga)',
    badge: 'SPGDT',
    category: 'medical',
  },
  {
    id: 'fire',
    number: '113',
    name: 'Pemadam & SAR',
    unit: 'Pos Damkar Jatibarang (850m)',
    badge: 'Damkar',
    category: 'fire',
  },
  {
    id: 'hotline',
    number: '129',
    name: 'Hotline Perempuan',
    unit: 'Unit PPA Indramayu',
    badge: 'SAPDA',
    category: 'hotline',
  },
];

function PhoneCallIcon({ size = 16, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PoliceIcon({ size = 20, color = DashboardTheme.colors.semanticInfo }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MedicalIcon({ size = 20, color = DashboardTheme.colors.semanticAlert }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FireIcon({ size = 20, color = DashboardTheme.colors.semanticWarning }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ShieldHeartIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8c-.6-1-2-1-2.5 0-.5 1 0 2 2.5 3.5 2.5-1.5 3-2.5 2.5-3.5-.5-1-1.9-1-2.5 0z"
        fill={color}
      />
    </Svg>
  );
}

export const EmergencyQuickDialGrid: React.FC<EmergencyQuickDialGridProps> = ({
  services = DEFAULT_EMERGENCY_SERVICES,
  onCallPress,
}) => {
  const handleDial = (service: EmergencyCallService) => {
    if (onCallPress) {
      onCallPress(service);
      return;
    }

    Alert.alert(
      `Panggil ${service.name} (${service.number})?`,
      `Panggilan akan dialihkan langsung ke saluran darurat ${service.unit}.`,
      [
        {
          text: 'Hubungi Sekarang',
          onPress: () => {
            Linking.openURL(`tel:${service.number}`);
          },
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };

  const renderServiceIcon = (category: EmergencyCallService['category']) => {
    switch (category) {
      case 'police':
        return <PoliceIcon size={20} />;
      case 'medical':
        return <MedicalIcon size={20} />;
      case 'fire':
        return <FireIcon size={20} />;
      case 'hotline':
        return <ShieldHeartIcon size={20} />;
    }
  };

  const getIconBgStyle = (category: EmergencyCallService['category']) => {
    switch (category) {
      case 'police':
        return { backgroundColor: DashboardTheme.colors.semanticInfoBg };
      case 'medical':
        return { backgroundColor: DashboardTheme.colors.semanticAlertBg };
      case 'fire':
        return { backgroundColor: DashboardTheme.colors.semanticWarningBg };
      case 'hotline':
        return { backgroundColor: DashboardTheme.colors.semanticAccentBg };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionTitle}>Panggilan Cepat Darurat</Text>
          <Text style={styles.sectionSub}>Langsung terhubung dengan operator siaga</Text>
        </View>
        <View style={styles.readyBadge}>
          <Text style={styles.readyBadgeText}>24/7 Siaga</Text>
        </View>
      </View>

      {/* 2x2 Grid */}
      <View style={styles.gridContainer}>
        {services.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleDial(item)}
            activeOpacity={0.82}
            accessibilityLabel={`Panggil darurat ${item.name} nomor ${item.number}`}
            accessibilityRole="button"
          >
            {/* Card Top Row: Service Icon & Call Icon */}
            <View style={styles.cardTopRow}>
              <View style={[styles.serviceIconWrap, getIconBgStyle(item.category)]}>
                {renderServiceIcon(item.category)}
              </View>
              <View style={styles.callCircle}>
                <PhoneCallIcon size={14} />
              </View>
            </View>

            {/* Card Bottom: Number, Badge, Title, Subtitle */}
            <View style={styles.cardBottom}>
              <View style={styles.numberRow}>
                <Text style={styles.metricNumber}>{item.number}</Text>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
              <Text style={styles.serviceName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.serviceUnit} numberOfLines={1}>
                {item.unit}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  headerLeft: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
  readyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: DashboardTheme.colors.semanticInfoBg,
  },
  readyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.semanticInfo,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  card: {
    width: '48.2%', // Responsive on 360dp devices like Galaxy J7 Prime
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: 22,
    padding: 14,
    shadowColor: DashboardTheme.colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 18,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  serviceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottom: {
    marginTop: 4,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: DashboardTheme.colors.textMuted,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    marginTop: 2,
  },
  serviceUnit: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 1,
  },
});
