import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNotifications } from '@/hooks/useNotifications';

export type NotificationCategory = 'all' | 'spatial' | 'guardian' | 'report';

export interface NotificationItem {
  id: string;
  category: 'spatial' | 'guardian' | 'report';
  severity: 'urgent' | 'warning' | 'safe' | 'info';
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  actionLabel?: string;
  actionType?: 'map' | 'track' | 'report';
}

interface NotificationCenterModalProps {
  visible: boolean;
  onDismiss: () => void;
  onNavigateToMap?: () => void;
  onNavigateToReport?: () => void;
  onNavigateToGuardian?: () => void;
}

/* Vector Icons */
function CloseIcon({ size = 20, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BellIcon({ size = 20, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function HazardIcon({ size = 18, color = '#DC2626' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M12 9v4M12 17h.01" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

function ShieldCheckIcon({ size = 18, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function DocumentCheckIcon({ size = 18, color = '#0284C7' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M14 2v6h6M9 15l2 2 4-4" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  visible,
  onDismiss,
  onNavigateToMap,
  onNavigateToReport,
  onNavigateToGuardian,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<NotificationCategory>('all');
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotifications();

  useEffect(() => {
    if (visible) {
      refetch();
    }
  }, [visible, refetch]);

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleNotificationAction = async (item: NotificationItem) => {
    await markAsRead(item.id);
    onDismiss();
    if (item.actionType === 'map') {
      if (onNavigateToMap) onNavigateToMap();
      else router.push('/');
    } else if (item.actionType === 'report') {
      if (onNavigateToReport) onNavigateToReport();
      else router.push('/report');
    } else if (item.actionType === 'track') {
      if (onNavigateToGuardian) onNavigateToGuardian();
      else router.push('/profile');
    }
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

        {/* Top Header */}
        <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.bellIconCircle}>
              <BellIcon size={20} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Pusat Peringatan & Info</Text>
              <Text style={styles.headerSubtitle}>
                {unreadCount > 0 ? `${unreadCount} peringatan baru belum dibaca` : 'Semua peringatan telah dibaca'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onDismiss}
            activeOpacity={0.7}
            accessibilityLabel="Tutup notifikasi"
          >
            <CloseIcon size={20} />
          </TouchableOpacity>
        </View>

        {/* Category Segmented Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
              Semua
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'spatial' && styles.tabBtnActive]}
            onPress={() => setActiveTab('spatial')}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabBtnText, activeTab === 'spatial' && styles.tabBtnTextActive]}>
              Bahaya Spasial
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'guardian' && styles.tabBtnActive]}
            onPress={() => setActiveTab('guardian')}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabBtnText, activeTab === 'guardian' && styles.tabBtnTextActive]}>
              Pengawal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'report' && styles.tabBtnActive]}
            onPress={() => setActiveTab('report')}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabBtnText, activeTab === 'report' && styles.tabBtnTextActive]}>
              Laporanku
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Header Row: Mark All Read */}
        {unreadCount > 0 && (
          <View style={styles.subActionBar}>
            <TouchableOpacity onPress={handleMarkAllAsRead} activeOpacity={0.7}>
              <Text style={styles.markAllReadText}>✓ Tandai Semua Dibaca</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notification Scroll List */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) + 16 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor="#416900"
              colors={['#416900']}
            />
          }
        >
          {isLoading && notifications.length === 0 ? (
            <View style={styles.emptyWrap}>
              <ActivityIndicator size="large" color="#416900" />
              <Text style={[styles.emptyDesc, { marginTop: 12 }]}>
                Memuat peringatan terkini dari server...
              </Text>
            </View>
          ) : filteredNotifications.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>Tidak Ada Peringatan</Text>
              <Text style={styles.emptyDesc}>
                Area sekitar Anda saat ini kondusif dan tidak ada pembaruan pada kategori ini.
              </Text>
            </View>
          ) : (
            filteredNotifications.map((item) => {
              const isUrgent = item.severity === 'urgent';
              const isWarning = item.severity === 'warning';

              return (
                <View
                  key={item.id}
                  style={[
                    styles.notifCard,
                    !item.isRead && styles.notifCardUnread,
                    isUrgent && styles.notifCardUrgentBorder,
                  ]}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.cardHeaderLeft}>
                      <View
                        style={[
                          styles.categoryIconWrap,
                          isUrgent && { backgroundColor: '#FEE2E2' },
                          isWarning && { backgroundColor: '#FEF3C7' },
                          item.severity === 'safe' && { backgroundColor: '#F7FEE7' },
                          item.severity === 'info' && { backgroundColor: '#E0F2FE' },
                        ]}
                      >
                        {item.category === 'spatial' && <HazardIcon size={16} color={isUrgent ? '#DC2626' : '#D97706'} />}
                        {item.category === 'guardian' && <ShieldCheckIcon size={16} color="#416900" />}
                        {item.category === 'report' && <DocumentCheckIcon size={16} color="#0284C7" />}
                      </View>
                      <View style={styles.cardTitleCol}>
                        <Text style={styles.cardTitleText}>{item.title}</Text>
                        <Text style={styles.cardTimeAgo}>{item.timeAgo}</Text>
                      </View>
                    </View>

                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.cardMessageText}>{item.message}</Text>

                  {item.actionLabel && (
                    <TouchableOpacity
                      style={[
                        styles.cardActionBtn,
                        isUrgent && { backgroundColor: '#DC2626' },
                      ]}
                      onPress={() => handleNotificationAction(item)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.cardActionBtnText}>{item.actionLabel} →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
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
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FEE7',
    borderWidth: 1,
    borderColor: '#D9F99D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Segmented Filter Tabs */
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: {
    backgroundColor: '#416900',
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },

  subActionBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
  },
  markAllReadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#416900',
  },

  /* Scroll Content */
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },

  /* Notification Cards */
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  notifCardUnread: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BAE6FD',
  },
  notifCardUrgentBorder: {
    borderColor: '#FECACA',
    backgroundColor: '#FFFBFB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  categoryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleCol: {
    flex: 1,
  },
  cardTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardTimeAgo: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0284C7',
    marginTop: 4,
  },
  cardMessageText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  cardActionBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 2,
  },
  cardActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Empty State */
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
