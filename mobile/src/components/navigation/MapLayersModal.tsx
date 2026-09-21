import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { DashboardTheme } from '@/constants/dashboardTheme';

export type MapTypeOption = 'satellite' | 'street_light' | 'street_dark';

export interface MapLayerConfig {
  mapType: MapTypeOption;
  showCrimeHeatmap: boolean;
  showPjuLighting: boolean;
  showCctvCameras: boolean;
  showSafeHavens: boolean;
}

interface MapLayersModalProps {
  visible: boolean;
  onDismiss: () => void;
  config: MapLayerConfig;
  onChangeConfig: (newConfig: MapLayerConfig) => void;
}

/* Vector Icons */
function SatelliteThumbIcon({ size = 28, active = false }: { size?: number; active?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="6" fill={active ? '#3B82F6' : '#475569'} />
      <Circle cx="12" cy="12" r="5" stroke="#FFFFFF" strokeWidth="1.8" strokeDasharray="3 3" />
      <Path d="M4 20l6-6M20 4l-6 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function VectorDayThumbIcon({ size = 28, active = false }: { size?: number; active?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="6" fill={active ? '#84CC16' : '#E2E8F0'} />
      <Path d="M4 12h16M12 4v16" stroke={active ? '#1E293B' : '#64748B'} strokeWidth="2" strokeLinecap="round" />
      <Path d="M6 6l12 12" stroke={active ? '#1E293B' : '#64748B'} strokeWidth="1.5" />
    </Svg>
  );
}

function VectorNightThumbIcon({ size = 28, active = false }: { size?: number; active?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="6" fill={active ? '#6366F1' : '#0F172A'} />
      <Path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="#F8FAFC" />
    </Svg>
  );
}

function CloseIcon({ size = 18, color = '#64748B' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export const MapLayersModal: React.FC<MapLayersModalProps> = ({
  visible,
  onDismiss,
  config,
  onChangeConfig,
}) => {
  const insets = useSafeAreaInsets();

  const handleSetMapType = (mapType: MapTypeOption) => {
    onChangeConfig({ ...config, mapType });
  };

  const handleToggle = (key: keyof Omit<MapLayerConfig, 'mapType'>) => {
    onChangeConfig({ ...config, [key]: !config[key] });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={[styles.sheetCard, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
              {/* Top Handle */}
              <View style={styles.dragHandle} />

              {/* Header */}
              <View style={styles.headerRow}>
                <View style={styles.titleCol}>
                  <Text style={styles.sheetTitle}>Lapisan & Filter Spasial</Text>
                  <Text style={styles.sheetSubtitle}>
                    Kustomisasi tampilan peta dan telemetri keamanan
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onDismiss}
                  activeOpacity={0.7}
                  accessibilityLabel="Tutup pengaturan lapisan"
                >
                  <CloseIcon size={18} />
                </TouchableOpacity>
              </View>

              {/* ================= 1. BASE MAP TYPE SELECTION ================= */}
              <View style={styles.sectionWrap}>
                <Text style={styles.sectionLabel}>TIPE PETA DASAR</Text>
                <View style={styles.mapTypeRow}>
                  {/* Satelit ESRI 3D */}
                  <TouchableOpacity
                    style={[
                      styles.mapTypeOption,
                      config.mapType === 'satellite' && styles.mapTypeOptionActive,
                    ]}
                    onPress={() => handleSetMapType('satellite')}
                    activeOpacity={0.8}
                  >
                    <SatelliteThumbIcon active={config.mapType === 'satellite'} />
                    <Text
                      style={[
                        styles.mapTypeTitle,
                        config.mapType === 'satellite' && styles.mapTypeTitleActive,
                      ]}
                    >
                      Satelit 3D
                    </Text>
                    <Text style={styles.mapTypeDesc}>ESRI High-Res</Text>
                  </TouchableOpacity>

                  {/* Vektor Terang (Day) */}
                  <TouchableOpacity
                    style={[
                      styles.mapTypeOption,
                      config.mapType === 'street_light' && styles.mapTypeOptionActive,
                    ]}
                    onPress={() => handleSetMapType('street_light')}
                    activeOpacity={0.8}
                  >
                    <VectorDayThumbIcon active={config.mapType === 'street_light'} />
                    <Text
                      style={[
                        styles.mapTypeTitle,
                        config.mapType === 'street_light' && styles.mapTypeTitleActive,
                      ]}
                    >
                      Jalan Terang
                    </Text>
                    <Text style={styles.mapTypeDesc}>Kontras Bersih</Text>
                  </TouchableOpacity>

                  {/* Vektor Malam (Dark) */}
                  <TouchableOpacity
                    style={[
                      styles.mapTypeOption,
                      config.mapType === 'street_dark' && styles.mapTypeOptionActive,
                    ]}
                    onPress={() => handleSetMapType('street_dark')}
                    activeOpacity={0.8}
                  >
                    <VectorNightThumbIcon active={config.mapType === 'street_dark'} />
                    <Text
                      style={[
                        styles.mapTypeTitle,
                        config.mapType === 'street_dark' && styles.mapTypeTitleActive,
                      ]}
                    >
                      Jalan Gelap
                    </Text>
                    <Text style={styles.mapTypeDesc}>Minim Silau</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ================= 2. SPATIAL SAFETY LAYERS ================= */}
              <View style={styles.sectionWrap}>
                <Text style={styles.sectionLabel}>LAPISAN KESELAMATAN AKTIF</Text>
                <View style={styles.switchList}>
                  {/* Crime Heatmap */}
                  <View style={styles.switchRow}>
                    <View style={styles.switchIconCol}>
                      <View style={[styles.miniIndicator, { backgroundColor: '#EF4444' }]} />
                    </View>
                    <View style={styles.switchTextCol}>
                      <Text style={styles.switchTitle}>Heatmap Kerawanan Spasial</Text>
                      <Text style={styles.switchDesc}>
                        Zona risiko tinggi berbasis laporan 30 hari
                      </Text>
                    </View>
                    <Switch
                      value={config.showCrimeHeatmap}
                      onValueChange={() => handleToggle('showCrimeHeatmap')}
                      trackColor={{ false: '#E2E8F0', true: '#84CC16' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {/* PJU Lighting */}
                  <View style={styles.switchRow}>
                    <View style={styles.switchIconCol}>
                      <View style={[styles.miniIndicator, { backgroundColor: '#EAB308' }]} />
                    </View>
                    <View style={styles.switchTextCol}>
                      <Text style={styles.switchTitle}>Jalur Penerangan Jalan (PJU)</Text>
                      <Text style={styles.switchDesc}>
                        Pewarnaan jalan dengan lampu aktif 94%+
                      </Text>
                    </View>
                    <Switch
                      value={config.showPjuLighting}
                      onValueChange={() => handleToggle('showPjuLighting')}
                      trackColor={{ false: '#E2E8F0', true: '#84CC16' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {/* CCTV Cameras */}
                  <View style={styles.switchRow}>
                    <View style={styles.switchIconCol}>
                      <View style={[styles.miniIndicator, { backgroundColor: '#0284C7' }]} />
                    </View>
                    <View style={styles.switchTextCol}>
                      <Text style={styles.switchTitle}>Kamera CCTV Aktif</Text>
                      <Text style={styles.switchDesc}>
                        Pin kamera Dishub DKI & pengawasan publik
                      </Text>
                    </View>
                    <Switch
                      value={config.showCctvCameras}
                      onValueChange={() => handleToggle('showCctvCameras')}
                      trackColor={{ false: '#E2E8F0', true: '#84CC16' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>

                  {/* Safe Haven */}
                  <View style={styles.switchRow}>
                    <View style={styles.switchIconCol}>
                      <View style={[styles.miniIndicator, { backgroundColor: '#10B981' }]} />
                    </View>
                    <View style={styles.switchTextCol}>
                      <Text style={styles.switchTitle}>Safe Haven & Pos Keamanan</Text>
                      <Text style={styles.switchDesc}>
                        Pos polisi, satpam komplek, & ritel 24 Jam
                      </Text>
                    </View>
                    <Switch
                      value={config.showSafeHavens}
                      onValueChange={() => handleToggle('showSafeHavens')}
                      trackColor={{ false: '#E2E8F0', true: '#84CC16' }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                </View>
              </View>

              {/* Dismiss Action Button */}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={onDismiss}
                activeOpacity={0.85}
              >
                <Text style={styles.applyButtonText}>Terapkan Preferensi Peta</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    gap: 3,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sectionWrap: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
  },

  /* Base Map Type Row */
  mapTypeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  mapTypeOption: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  mapTypeOptionActive: {
    borderColor: '#416900',
    backgroundColor: '#F7FEE7',
  },
  mapTypeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  mapTypeTitleActive: {
    color: '#315200',
    fontWeight: '800',
  },
  mapTypeDesc: {
    fontSize: 10,
    color: '#64748B',
  },

  /* Switch Rows */
  switchList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  switchIconCol: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  switchTextCol: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  switchDesc: {
    fontSize: 11,
    color: '#64748B',
  },

  /* Apply Action Button */
  applyButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#416900',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
});
