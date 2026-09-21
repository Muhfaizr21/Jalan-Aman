import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { GuardianContactItem } from '@/types/profile';

interface GuardianContactActionModalProps {
  visible: boolean;
  contact: GuardianContactItem | null;
  isUserGuardian?: boolean;
  onDismiss: () => void;
  onEditPress?: () => void;
}

/* Vector Icons */
function PhoneIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
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

function WhatsAppIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
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

function EditIcon({ size = 18, color = DashboardTheme.colors.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const GuardianContactActionModal: React.FC<GuardianContactActionModalProps> = ({
  visible,
  contact,
  isUserGuardian = false,
  onDismiss,
  onEditPress,
}) => {
  if (!contact) return null;

  const handlePhoneCall = () => {
    if (!contact.phone || contact.phone === '-') {
      Alert.alert('Nomor Tidak Tersedia', 'Kontak ini belum memiliki nomor telepon yang valid.');
      return;
    }
    const cleanNumber = contact.phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert('Gagal Memanggil', `Tidak dapat membuka dialer untuk nomor: ${contact.phone}`);
    });
  };

  const handleWhatsAppChat = () => {
    if (!contact.phone || contact.phone === '-') {
      Alert.alert('Nomor Tidak Tersedia', 'Kontak ini belum memiliki nomor telepon yang valid.');
      return;
    }
    let cleanNumber = contact.phone.replace(/[^0-9]/g, '');
    if (cleanNumber.startsWith('0')) {
      cleanNumber = '62' + cleanNumber.slice(1);
    }

    const message = encodeURIComponent(
      `Halo ${contact.name}, saya mengonfirmasi bahwa Anda terhubung sebagai Pengawal Siaga saya di sistem keselamatan JalanAman Indramayu. Pantau rute perjalanan aman saya di: https://jalanaman.id`
    );

    const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${message}`;
    Linking.openURL(waUrl).catch(() => {
      Alert.alert('Gagal Membuka WhatsApp', 'Pastikan aplikasi WhatsApp sudah terpasang di perangkat Anda.');
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <View style={styles.sheetContainer} onStartShouldSetResponder={() => true}>
          {/* Top Handle */}
          <View style={styles.sheetHandle} />

          {/* Contact Header Info */}
          <View style={styles.contactHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {contact.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.contactHeaderMeta}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRelation}>{contact.relation}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
          </View>

          {/* Badge Info */}
          <View style={styles.badgeRow}>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{contact.statusText}</Text>
            </View>
            <View style={styles.permissionPill}>
              <Text style={styles.permissionText}>{contact.badgeLabel}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handlePhoneCall}
              activeOpacity={0.85}
              accessibilityLabel="Panggilan Telepon Darurat"
            >
              <PhoneIcon size={18} />
              <Text style={styles.callButtonText}>Telepon Langsung</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.waButton}
              onPress={handleWhatsAppChat}
              activeOpacity={0.85}
              accessibilityLabel="Kirim Pesan WhatsApp"
            >
              <WhatsAppIcon size={18} />
              <Text style={styles.waButtonText}>Kirim Sinyal WhatsApp</Text>
            </TouchableOpacity>

            {isUserGuardian && onEditPress && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  onDismiss();
                  onEditPress();
                }}
                activeOpacity={0.75}
              >
                <EditIcon size={16} />
                <Text style={styles.editButtonText}>Ubah / Hapus Pengawal Ini</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Cancel */}
          <TouchableOpacity style={styles.cancelButton} onPress={onDismiss} activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    gap: 16,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 4,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: DashboardTheme.colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: '800',
    color: DashboardTheme.colors.primary,
  },
  contactHeaderMeta: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  contactRelation: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  contactPhone: {
    fontSize: 12.5,
    color: DashboardTheme.colors.primary,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(132, 204, 22, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DashboardTheme.colors.primary,
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: DashboardTheme.colors.primary,
  },
  permissionPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  permissionText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#475569',
  },
  actionsGrid: {
    gap: 10,
    marginTop: 4,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 14,
  },
  callButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  waButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 14,
    borderRadius: 14,
  },
  waButtonText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
