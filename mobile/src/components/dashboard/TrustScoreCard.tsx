import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

interface TrustScoreCardProps {
  userName?: string;
  locationLabel?: string;
  avatarUrl?: string;
  trustScore?: number;
  radiusKm?: number;
  isRealtime?: boolean;
  onPressScore?: () => void;
  onPressRadarPill?: () => void;
}

/* Verified User Shield Icon */
function VerifiedShieldIcon({ size = 15, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
        fill={color}
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({
  userName = 'Warga',
  locationLabel = 'Jatibarang, Indramayu • Pantauan Aman',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  trustScore = 98,
  radiusKm = 2.5,
  isRealtime = true,
  onPressScore,
  onPressRadarPill,
}) => {
  // Professional Radar Beacon Ping Animation
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 2.4,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 1600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [pulseScale, pulseOpacity]);

  return (
    <View style={styles.cardContainer}>
      {/* Top Greeting & Trust Score Row */}
      <View style={styles.topRow}>
        {/* User Info */}
        <View style={styles.userProfileWrapper}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.onlineBadge} />
          </View>
          <View style={styles.greetingTextWrapper}>
            <Text style={styles.greetingTitle}>Halo, {userName}</Text>
            <Text style={styles.locationSubtitle} numberOfLines={1}>
              {locationLabel}
            </Text>
          </View>
        </View>

        {/* Trust Score Gauge */}
        <TouchableOpacity
          style={styles.trustScoreWrapper}
          onPress={onPressScore}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Trust Score ${trustScore} dari 100`}
        >
          <View style={styles.scoreRow}>
            <Text style={styles.scoreNumber}>{trustScore}</Text>
            <Text style={styles.scoreDenominator}>/100</Text>
          </View>
          <View style={styles.verifiedRow}>
            <VerifiedShieldIcon size={14} />
            <Text style={styles.scoreLabel}>Trust Score</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Live Radar Status Pill with Professional Ping */}
      <TouchableOpacity
        style={styles.radarPill}
        onPress={onPressRadarPill}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Live radar aktif radius ${radiusKm} kilometer real-time`}
      >
        <View style={styles.radarInfoRow}>
          <View style={styles.pulseContainer}>
            <Animated.View
              style={[
                styles.pulseRing,
                {
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                },
              ]}
            />
            <View style={styles.pulseDot} />
          </View>
          <Text style={styles.radarText}>
            Live Radar Aktif • Radius {radiusKm} km
          </Text>
        </View>

        {isRealtime && <Text style={styles.realtimeBadge}>Real-time</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userProfileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DashboardTheme.colors.surfaceContainer,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: DashboardTheme.colors.primaryContainer,
    borderWidth: 2,
    borderColor: DashboardTheme.colors.surfaceCard,
  },
  greetingTextWrapper: {
    flexDirection: 'column',
    flex: 1,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  locationSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: DashboardTheme.colors.textSecondary,
    marginTop: 2,
  },
  trustScoreWrapper: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -1,
    lineHeight: 36,
  },
  scoreDenominator: {
    fontSize: 14,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
    marginLeft: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: DashboardTheme.colors.textSecondary,
    letterSpacing: 0.1,
  },
  radarPill: {
    backgroundColor: DashboardTheme.colors.semanticAccentBg,
    borderRadius: DashboardTheme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radarInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pulseContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: DashboardTheme.colors.primaryContainer,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: DashboardTheme.colors.primary,
  },
  radarText: {
    fontSize: 13,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
    letterSpacing: -0.1,
  },
  realtimeBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: DashboardTheme.colors.primary,
  },
});
