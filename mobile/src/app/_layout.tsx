import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { router, useSegments, useRootNavigationState } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SettingsProvider } from '@/context/SettingsContext';

SplashScreen.preventAutoHideAsync();

/**
 * Route Guard Component (AuthGate)
 * Enforces dual-track security: unauthenticated visitors MUST see the Login screen first
 * unless they have a verified active JWT session or explicitly enter Guest Mode.
 */
function AuthGate({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const rootNavState = useRootNavigationState();
  const { isAuthenticated, isGuest, isLoading } = useAuth();

  useEffect(() => {
    // Wait until root navigation is mounted and initial auth verification completes
    if (!rootNavState?.key || isLoading) return;

    const inAuthScreen = segments[0] === 'login';

    if (!isAuthenticated && !isGuest && !inAuthScreen) {
      // User is not logged in and not in guest mode -> redirect to login
      router.replace('/login');
    } else if (isAuthenticated && inAuthScreen) {
      // User is already logged in -> redirect away from login to main dashboard
      router.replace('/');
    }
  }, [isAuthenticated, isGuest, isLoading, segments, rootNavState?.key]);

  return <>{children}</>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <NotificationProvider>
        <SettingsProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <AuthGate>
              <AppTabs />
            </AuthGate>
          </ThemeProvider>
        </SettingsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
