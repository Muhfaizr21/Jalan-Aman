import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';
import { QuickDestinationChip } from '@/types/dashboard';

interface QuickCommuteSearchProps {
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  onSubmitSearch?: () => void;
  onFilterPress?: () => void;
  onPressSearchInput?: () => void;
  onChipPress?: (chip: QuickDestinationChip) => void;
  chips?: QuickDestinationChip[];
  onNotificationPress?: () => void;
  hasUnreadNotifications?: boolean;
}

const DEFAULT_CHIPS: QuickDestinationChip[] = [
  { id: '1', label: 'Stasiun Jatibarang', type: 'transit', query: 'Stasiun Jatibarang' },
  { id: '2', label: 'Alun-Alun Indramayu', type: 'office', query: 'Alun-Alun Indramayu' },
  { id: '3', label: 'Simpang Lima', type: 'transit', query: 'Simpang Lima Indramayu' },
  { id: '4', label: 'Rumah', type: 'home', query: 'Perum Griya Jatibarang' },
];

/* Search Lens Icon */
function SearchIcon({ size = 20, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Bell Notification Icon */
function BellIcon({ size = 18, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
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

/* Tune Filters Icon */
function TuneIcon({ size = 18, color = DashboardTheme.colors.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* Building Office Icon */
function OfficeIcon({ size = 16, color = DashboardTheme.colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 21h18M6 21V7l8-4v18M14 11h4v10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 9h2M9 13h2M9 17h2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/* Train Transit Icon */
function TrainIcon({ size = 16, color = DashboardTheme.colors.skyBlue }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM4 11h16M8 15h.01M16 15h.01M7 21l2-3M17 21l-2-3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* House Icon */
function HomeIcon({ size = 16, color = DashboardTheme.colors.semanticWarning }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM9 22V12h6v10"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const QuickCommuteSearch: React.FC<QuickCommuteSearchProps> = ({
  searchQuery = '',
  onSearchChange,
  onSubmitSearch,
  onFilterPress,
  onPressSearchInput,
  onChipPress,
  chips = DEFAULT_CHIPS,
  onNotificationPress,
  hasUnreadNotifications,
}) => {
  const renderChipIcon = (type: QuickDestinationChip['type']) => {
    switch (type) {
      case 'office':
        return <OfficeIcon size={16} />;
      case 'transit':
        return <TrainIcon size={16} />;
      case 'home':
        return <HomeIcon size={16} />;
      default:
        return <OfficeIcon size={16} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <SearchIcon size={21} />
        {onPressSearchInput ? (
          <TouchableOpacity
            style={styles.inputClickArea}
            onPress={onPressSearchInput}
            activeOpacity={0.8}
            accessibilityRole="search"
            accessibilityLabel="Buka pencarian tempat aman"
          >
            <Text style={[styles.inputPlaceholderText, searchQuery ? styles.inputFilledText : null]}>
              {searchQuery || 'Mau ke mana dengan rute aman?'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Mau ke mana dengan rute aman?"
            placeholderTextColor={DashboardTheme.colors.textMuted}
            value={searchQuery}
            onChangeText={onSearchChange}
            onSubmitEditing={onSubmitSearch}
            returnKeyType="search"
          />
        )}
        {onNotificationPress && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Pusat Peringatan & Info"
          >
            <BellIcon size={17} />
            {hasUnreadNotifications && <View style={styles.unreadBadge} />}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Pengaturan Filter Rute"
        >
          <TuneIcon size={17} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Quick Commute Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScrollContainer}
      >
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={styles.chipButton}
            onPress={() => onChipPress && onChipPress(chip)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`Pilih tujuan ${chip.label}`}
          >
            {renderChipIcon(chip.type)}
            <Text style={styles.chipText}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.surfaceCard,
    borderRadius: DashboardTheme.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.card,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: DashboardTheme.colors.textPrimary,
    padding: 0,
  },
  inputClickArea: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 2,
  },
  inputPlaceholderText: {
    fontSize: 14,
    color: DashboardTheme.colors.textMuted,
  },
  inputFilledText: {
    color: DashboardTheme.colors.textPrimary,
    fontWeight: '600',
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DashboardTheme.colors.surfaceCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  chipsScrollContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DashboardTheme.colors.surfaceCard,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: DashboardTheme.radius.md,
    gap: 7,
    borderWidth: 1,
    borderColor: DashboardTheme.colors.borderCard,
    ...DashboardTheme.shadows.chip,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: DashboardTheme.colors.textPrimary,
  },
});
