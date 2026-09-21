/**
 * apiConfig.ts
 * Single source of truth for JalanAman Backend API configuration.
 * Automatically resolves localhost according to the platform:
 * - Web Browser: http://localhost:8080/api/v1
 * - Android Emulator: http://10.0.2.2:8080/api/v1
 * - iOS Simulator / Real Device: Uses EXPO_PUBLIC_API_URL or local IP
 */

import { Platform } from 'react-native';

const getLocalhostIp = (): string => {
  if (Platform.OS === 'android') {
    // Android emulator loops back to host machine via 10.0.2.2
    return '10.0.2.2';
  }
  return 'localhost';
};

const DEFAULT_PORT = '8080';
const DEFAULT_BASE_URL = `http://${getLocalhostIp()}:${DEFAULT_PORT}/api/v1`;

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL,
  timeoutMs: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  endpoints: {
    health: '/health',
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      me: '/auth/me',
    },
    incidents: {
      list: '/incidents',
      create: '/incidents',
      detail: (id: string) => `/incidents/${id}`,
    },
    shelters: {
      list: '/shelters',
      create: '/shelters',
      detail: (id: string) => `/shelters/${id}`,
    },
    users: {
      profile: '/users/profile',
      account: '/users/account',
      reputation: '/users/reputation',
      settings: '/users/settings',
      settingsReset: '/users/settings/reset',
    },
    notifications: {
      list: '/notifications',
      markRead: (id: string) => `/notifications/${id}/read`,
      markAllRead: '/notifications/read-all',
    },
    maps: {
      offlinePack: '/maps/offline-pack/indramayu',
    },
    trips: {
      start: '/trips/start',
      telemetry: '/trips/telemetry',
      complete: '/trips/complete',
      active: '/trips/active',
      history: '/trips/history',
    },
  },
} as const;

export type ApiEndpoints = typeof API_CONFIG.endpoints;
