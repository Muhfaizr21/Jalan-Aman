import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

export interface TabItem {
  id: 'navigasi' | 'lapor' | 'info';
  label: string;
  icon: string;
  active_color?: string;
  inactive_color?: string;
  is_active?: boolean;
  is_action_highlight?: boolean;
  action_circle_bg?: string;
  action_icon_color?: string;
}

interface BottomNavigationBarProps {
  activeTab?: 'navigasi' | 'lapor' | 'info';
  onTabPress?: (tabId: 'navigasi' | 'lapor' | 'info') => void;
  onLaporPress?: () => void;
}

/* ================= VECTOR ICONS ================= */
function MapOutlineIcon({ color = '#64748B', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 3v15M15 6v15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function AlertCircleOutlineIcon({ color = '#FFFFFF', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.2" />
      <Path d="M12 8v4" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <Circle cx="12" cy="16" r="1.2" fill={color} />
    </Svg>
  );
}

function ShieldCheckmarkOutlineIcon({ color = '#64748B', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BottomNavigationBar({
  activeTab = 'navigasi',
  onTabPress,
  onLaporPress,
}: BottomNavigationBarProps) {
  const handlePress = (id: 'navigasi' | 'lapor' | 'info') => {
    if (id === 'lapor') {
      if (onLaporPress) {
        onLaporPress();
      } else if (onTabPress) {
        onTabPress('lapor');
      }
    } else {
      if (onTabPress) {
        onTabPress(id);
      }
    }
  };

  return (
    <View style={styles.bottomBarContainer}>
      {/* Tab 1: Navigasi */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handlePress('navigasi')}
        activeOpacity={0.75}
      >
        <MapOutlineIcon
          color={activeTab === 'navigasi' ? '#0284C7' : '#64748B'}
          size={22}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: activeTab === 'navigasi' ? '#0284C7' : '#64748B' },
            activeTab === 'navigasi' && styles.tabLabelActive,
          ]}
        >
          Navigasi
        </Text>
      </TouchableOpacity>

      {/* Tab 2: Lapor (Action Highlight Circle) */}
      <TouchableOpacity
        style={styles.actionHighlightContainer}
        onPress={() => handlePress('lapor')}
        activeOpacity={0.85}
      >
        <View style={styles.actionCircleButton}>
          <AlertCircleOutlineIcon color="#FFFFFF" size={24} />
        </View>
        <Text style={styles.actionLabel}>Lapor</Text>
      </TouchableOpacity>

      {/* Tab 3: Info Aman */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => handlePress('info')}
        activeOpacity={0.75}
      >
        <ShieldCheckmarkOutlineIcon
          color={activeTab === 'info' ? '#0284C7' : '#64748B'}
          size={22}
        />
        <Text
          style={[
            styles.tabLabel,
            { color: activeTab === 'info' ? '#0284C7' : '#64748B' },
            activeTab === 'info' && styles.tabLabelActive,
          ]}
        >
          Info Aman
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default BottomNavigationBar;

const styles = StyleSheet.create({
  bottomBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: 64,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      default: {
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: -0.1,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  actionHighlightContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  actionCircleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0284C7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      default: {
        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)',
      },
    }),
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 4,
    letterSpacing: -0.1,
  },
});
