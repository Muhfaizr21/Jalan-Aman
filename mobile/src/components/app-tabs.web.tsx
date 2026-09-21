import React, { useState } from 'react';
import { Tabs, router } from 'expo-router';
import { BottomNavigationBar } from './BottomNavigationBar';

export default function AppTabs() {
  return (
    <Tabs
      tabBar={() => null}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Rute Aman & Navigasi' }} />
      <Tabs.Screen name="radar" options={{ title: 'Radar JalanAman' }} />
      <Tabs.Screen name="explore" options={{ title: 'Feed & Wawasan' }} />
      <Tabs.Screen name="report" options={{ title: 'Laporkan Insiden' }} />
      <Tabs.Screen name="sos" options={{ title: 'Protokol Darurat SOS' }} />
      <Tabs.Screen name="shelters" options={{ title: 'Titik Perlindungan' }} />
      <Tabs.Screen name="navigation" options={{ title: 'Rute Aman' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil Saya' }} />
      <Tabs.Screen name="trip-protection" options={{ title: 'Proteksi Perjalanan' }} />
      <Tabs.Screen name="community-report" options={{ title: 'Pelaporan Komunitas' }} />
      <Tabs.Screen name="settings" options={{ title: 'Pengaturan Sistem' }} />
      <Tabs.Screen name="login" options={{ title: 'Masuk / Daftar' }} />
    </Tabs>
  );
}
