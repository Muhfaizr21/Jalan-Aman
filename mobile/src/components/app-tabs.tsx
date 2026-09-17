import React, { useState } from 'react';
import { Tabs, router } from 'expo-router';
import { BottomNavigationBar } from './BottomNavigationBar';

export default function AppTabs() {
  return (
    <Tabs
      tabBar={(props) => {
        const currentRouteName = props.state.routes[props.state.index]?.name;
        let activeTab: 'navigasi' | 'lapor' | 'info' = 'navigasi';
        if (currentRouteName === 'explore') {
          activeTab = 'info';
        } else if (currentRouteName === 'report') {
          activeTab = 'lapor';
        }

        return (
          <BottomNavigationBar
            activeTab={activeTab}
            onTabPress={(tabId) => {
              if (tabId === 'lapor') {
                router.push('/report');
              } else if (tabId === 'info') {
                router.push('/explore');
              } else {
                router.push('/');
              }
            }}
            onLaporPress={() => router.push('/report')}
          />
        );
      }}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Navigasi' }} />
      <Tabs.Screen name="explore" options={{ title: 'Info Aman' }} />
      <Tabs.Screen name="report" options={{ title: 'Laporkan Insiden', href: null }} />
      <Tabs.Screen name="sos" options={{ title: 'Protokol Darurat SOS', href: null }} />
      <Tabs.Screen name="shelters" options={{ title: 'Titik Perlindungan', href: null }} />
      <Tabs.Screen name="navigation" options={{ title: 'Navigasi Aktif', href: null }} />
    </Tabs>
  );
}
