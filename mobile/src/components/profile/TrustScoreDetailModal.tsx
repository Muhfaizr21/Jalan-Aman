/**
 * TrustScoreDetailModal.tsx
 * Modal bottom sheet presenting in-depth breakdown of user's Tingkat Kepercayaan (Trust Score).
 * Adheres to Clean Architecture and Senior UI/UX guidelines.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { useTrustScore } from '@/hooks/useTrustScore';

interface TrustScoreDetailModalProps {
  visible: boolean;
  onDismiss: () => void;
  onNavigateToEditProfile?: () => void;
}

function CloseIcon({ size = 20, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldCheckIcon({ size = 22, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
        fill={color}
      />
      <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckCircleIcon({ size = 16, color = '#416900' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={2} />
      <Path d="M8 12l2.5 2.5L16 9" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const TrustScoreDetailModal: React.FC<TrustScoreDetailModalProps> = ({
  visible,
  onDismiss,
  onNavigateToEditProfile,
}) => {
  const insets = useSafeAreaInsets();
  const { score, tierLabel, tierStatus, tierColor, description, benefits, factors, history } = useTrustScore();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Top Header */}
        <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) + 6 }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIconWrap, { backgroundColor: '#F7FEE7' }]}>
              <ShieldCheckIcon size={22} color={tierColor} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Tingkat Kepercayaan</Text>
              <Text style={styles.headerSubtitle}>Sistem Reputasi Komunitas JalanAman</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onDismiss}
            activeOpacity={0.7}
            accessibilityLabel="Tutup rincian"
          >
            <CloseIcon size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) + 24 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Hero Score Card */}
          <View style={styles.scoreHeroCard}>
            <View style={[styles.tierPill, { backgroundColor: '#F7FEE7', borderColor: '#D9F99D' }]}>
              <Text style={[styles.tierPillText, { color: tierColor }]}>{tierLabel}</Text>
            </View>

            <View style={styles.scoreRow}>
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.maxScoreNumber}>/100</Text>
            </View>

            <Text style={[styles.statusText, { color: tierColor }]}>{tierStatus}</Text>
            <Text style={styles.descText}>{description}</Text>
          </View>

          {/* Breakdown of Trust Factors */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Faktor Penentu Kepercayaan</Text>
            <View style={styles.factorsList}>
              {factors.map((factor, index) => (
                <View key={index} style={styles.factorCard}>
                  <View style={styles.factorHeaderRow}>
                    <View style={styles.factorTitleRow}>
                      <CheckCircleIcon size={16} color={factor.isComplete ? '#416900' : '#94A3B8'} />
                      <Text style={styles.factorLabel}>{factor.label}</Text>
                    </View>
                    <Text
                      style={[
                        styles.factorStatus,
                        { color: factor.isComplete ? '#416900' : '#D97706' },
                      ]}
                    >
                      {factor.status}
                    </Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${(factor.score / factor.maxScore) * 100}%`,
                          backgroundColor: factor.isComplete ? '#416900' : '#F59E0B',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Tier Benefits */}
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionTitle}>Hak Istimewa Tier Anda</Text>
            <View style={styles.benefitsCard}>
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <View style={styles.benefitBullet} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Real PostgreSQL Reputation History Audit Trail */}
          <View style={styles.sectionWrap}>
            <View style={styles.historyHeaderRow}>
              <Text style={styles.sectionTitle}>Log Audit Reputasi (PostgreSQL)</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>Terkoneksi Realtime</Text>
              </View>
            </View>
            <View style={styles.historyCard}>
              {history && history.length > 0 ? (
                history.map((item, idx) => (
                  <View key={item.id || idx} style={[styles.historyRow, idx > 0 && styles.historyRowBorder]}>
                    <View style={styles.historyLeft}>
                      <View style={[styles.deltaPill, { backgroundColor: item.change_amount >= 0 ? '#ECFDF5' : '#FEF2F2' }]}>
                        <Text style={[styles.deltaText, { color: item.change_amount >= 0 ? '#059669' : '#DC2626' }]}>
                          {item.change_amount >= 0 ? `+${item.change_amount}` : item.change_amount}
                        </Text>
                      </View>
                      <View style={styles.historyTextWrap}>
                        <Text style={styles.historyReason}>{item.reason}</Text>
                        <Text style={styles.historyTime}>
                          {new Date(item.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.historyScoreSnap}>{item.current_score} Poin</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyHistoryWrap}>
                  <Text style={styles.emptyHistoryText}>Belum ada riwayat aktivitas reputasi tercatat.</Text>
                </View>
              )}
            </View>
          </View>

          {/* Action CTA */}
          <View style={styles.ctaRow}>
            {onNavigateToEditProfile && (
              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={() => {
                  onDismiss();
                  onNavigateToEditProfile();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.editProfileBtnText}>Lengkapi Profil & Kontak</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={onDismiss}
              activeOpacity={0.8}
            >
              <Text style={styles.dismissBtnText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
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
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9F99D',
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 18,
    gap: 18,
  },
  scoreHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  tierPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  tierPillText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1.5,
  },
  maxScoreNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 2,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '800',
  },
  descText: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  sectionWrap: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  factorsList: {
    gap: 8,
  },
  factorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  factorHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  factorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  factorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  factorStatus: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  benefitBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#416900',
    marginTop: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  ctaRow: {
    gap: 10,
    marginTop: 6,
  },
  editProfileBtn: {
    backgroundColor: '#416900',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dismissBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  historyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 10,
  },
  historyRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  deltaPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deltaText: {
    fontSize: 12,
    fontWeight: '800',
  },
  historyTextWrap: {
    flex: 1,
  },
  historyReason: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  historyTime: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  historyScoreSnap: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  emptyHistoryWrap: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
