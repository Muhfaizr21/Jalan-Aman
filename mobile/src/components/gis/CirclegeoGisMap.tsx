import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

export interface GisMarkerItem {
  id: string;
  name: string;
  detail: string;
  lng: number;
  lat: number;
  type: 'haven' | 'hazard' | 'cctv' | 'user';
}

interface CirclegeoGisMapProps {
  interactive?: boolean;
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
  showSafeRoute?: boolean;
  routeCoordinates?: [number, number][];
  markers?: GisMarkerItem[];
  showCctvLayer?: boolean;
  autoRotate?: boolean;
  onPinPress?: (name: string, detail: string) => void;
  children?: React.ReactNode;
}

export const CirclegeoGisMap: React.FC<CirclegeoGisMapProps> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/images/login-bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B0F19',
    overflow: 'hidden',
  },
});
