import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { useAuth } from '@/hooks/useAuth';
import { GuardianContactItem } from '@/types/profile';

interface GuardiansCircleCardProps {
  contacts?: GuardianContactItem[];
  onAddGuardianPress?: () => void;
  onContactPress?: (contact: GuardianContactItem) => void;
  onToggleCorridorAlert?: (enabled: boolean) => void;
}

const OFFICIAL_EMERGENCY_CONTACTS: GuardianContactItem[] = [
  {
    id: 'em_112',
    name: 'Call Center 112 Indramayu',
    relation: 'Layanan Darurat Terpadu',
    phone: '112',
    badgeLabel: 'Siaga 24 Jam',
    badgeType: 'emergency_sos',
    statusText: 'Bebas Pulsa 24/7',
  },
  {
    id: 'em_polsek',
    name: 'Polsek Jatibarang (Siaga)',
    relation: 'Kepolisian Sektor',
    phone: '+62 234-351110',
    badgeLabel: 'Patroli Siaga',
    badgeType: 'patrol_cctv',
    statusText: 'Respons Cepat',
  },
];

/* Group Users Icon */
function GroupUsersIcon({ size = 22, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* User Add Icon */
function UserAddIcon({ size = 16, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Shield Icon */
function ShieldIcon({ size = 20, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        fill="rgba(132, 204, 22, 0.2)"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Bell Alert Icon */
function BellAlertIcon({ size = 20, color = DashboardTheme.colors.skyBlue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Security Radio Icon */
function SecurityRadioIcon({ size = 20, color = DashboardTheme.colors.semanticWarning }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const GuardiansCircleCard: React.FC<GuardiansCircleCardProps> = ({
  contacts = OFFICIAL_EMERGENCY_CONTACTS,
  onAddGuardianPress,
  onContactPress,
  onToggleCorridorAlert,
}) => {
  const { user } = useAuth();
  const [corridorAlert, setCorridorAlert] = useState(true);

  const activeContacts = React.useMemo(() => {
    const list = [...contacts];
    if (user?.guardian_name) {
      list.unshift({
        id: 'user_guardian_1',
        name: user.guardian_name,
        relation: 'Pengawal Utama Warga',
        phone: user.guardian_phone || '-',
        badgeLabel: 'Siaga Darurat',
        badgeType: 'emergency_sos',
        statusText: 'Terhubung Langsung',
      });
    }
    return list;
  }, [contacts, user]);

  const handleToggle = (val: boolean) => {
    setCorridorAlert(val);
    if (onToggleCorridorAlert) {
      onToggleCorridorAlert(val);
    }
  };

  const renderBadgeColors = (type: GuardianContactItem['badgeType']) => {
    switch (type) {
      case 'full_location':
        return {
          icon: <ShieldIcon size={20} />,
          iconBg: DashboardTheme.colors.semanticAccentBg,
          badgeBg: DashboardTheme.colors.semanticAccentBg,
          badgeText: DashboardTheme.colors.primary,
          statusColor: DashboardTheme.colors.primary,
        };
      case 'emergency_sos':
        return {
          icon: <BellAlertIcon size={20} />,
          iconBg: DashboardTheme.colors.semanticInfoBg,
          badgeBg: DashboardTheme.colors.semanticInfoBg,
          badgeText: DashboardTheme.colors.semanticInfo,
          statusColor: DashboardTheme.colors.textMuted,
        };
      case 'patrol_cctv':
        return {
          icon: <SecurityRadioIcon size={20} />,
          iconBg: DashboardTheme.colors.semanticWarningBg,
          badgeBg: DashboardTheme.colors.semanticWarningBg,
          badgeText: DashboardTheme.colors.semanticWarning,
          statusColor: DashboardTheme.colors.textMuted,
        };
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <View style={styles.titleRow}>
            <GroupUsersIcon size={22} />
            <Text style={styles.headerTitle}>Lingkaran Pengawal</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {activeContacts.length} Kontak Prioritas Terhubung
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddGuardianPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Tambah Kontak Pengawal Baru"
        >
          <UserAddIcon size={16} />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Contacts List */}
      <View style={styles.contactsList}>
        {activeContacts.map((contact) => {
          const colors = renderBadgeColors(contact.badgeType);

          return (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => onContactPress && onContactPress(contact)}
              activeOpacity={0.8}
            >
              <View style={styles.contactLeft}>
                <View style={[styles.contactIconWrap, { backgroundColor: colors.iconBg }]}>
                  {colors.icon}
                </View>
                <View style={styles.contactDetails}>
                  <View style={styles.nameRow}>
                    <Text style={styles.contactName} numberOfLines={1}>
                      {contact.name}
                    </Text>
                    <Text style={styles.relationText}>• {contact.relation}</Text>
                  </View>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
              </View>

              <View style={styles.contactRight}>
                <View style={[styles.statusBadge, { backgroundColor: colors.badgeBg }]}>
                  <Text style={[styles.statusBadgeText, { color: colors.badgeText }]}>
                    {contact.badgeLabel}
                  </Text>
                </View>
                <Text style={[styles.subStatusText, { color: colors.statusColor }]}>
                  {contact.statusText}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Safety Corridor Auto-alert Setting */}
      <View style={styles.corridorAlertRow}>
        <View style={styles.corridorTextWrapper}>
          <Text style={styles.corridorTitle}>Pemberitahuan Keluar Koridor Aman</Text>
          <Text style={styles.corridorSubtitle}>
            Kirim sinyal jika deviasi &gt;250m dari rute pulang
          </Text>
        </View>

        <Switch
          value={corridorAlert}
          onValueChange={handleToggle}
          trackColor={{
            false: DashboardTheme.colors.surfaceContainer,
            true: DashboardTheme.colors.primaryContainer,
          }}
          thumbColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xl,
    padding: 15,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  titleWrapper: {
    gap: 2,
    flex: 1,
    minWidth: 160,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: DashboardTheme.colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: DashboardTheme.radius.full,
    gap: 5,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
  },
  contactsList: {
    gap: 9,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    borderRadius: DashboardTheme.radius.lg,
    padding: 11,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  contactIconWrap: {
    width: 38,
    height: 38,
    borderRadius: DashboardTheme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDetails: {
    flex: 1,
    gap: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    flexShrink: 1,
  },
  relationText: {
    fontSize: 11,
    color: DashboardTheme.colors.textMuted,
  },
  contactPhone: {
    fontSize: 12,
    color: DashboardTheme.colors.textSecondary,
  },
  contactRight: {
    alignItems: 'flex-end',
    gap: 3,
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: DashboardTheme.radius.full,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subStatusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  corridorAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  corridorTextWrapper: {
    flex: 1,
    paddingRight: 10,
  },
  corridorTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
  },
  corridorSubtitle: {
    fontSize: 11,
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
});
