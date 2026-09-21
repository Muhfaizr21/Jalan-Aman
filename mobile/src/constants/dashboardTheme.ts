/**
 * JalanAman Mobile - Modul 1 Design Tokens & Colors
 * Extracted directly from modul1.html Tailwind theme specifications.
 */

export const DashboardTheme = {
  colors: {
    // Surfaces
    surfaceCanvas: '#F7F8FA',
    surfaceCard: '#FFFFFF',
    surfaceCardTranslucent: 'rgba(255, 255, 255, 0.90)',
    surfaceContainer: '#E7EEFF',
    surfaceContainerLow: '#F0F3FF',
    surfaceVariant: '#D8E3FB',
    
    // Typography
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    
    // Primary Brand (Lime Safety)
    primary: '#416900',
    primaryContainer: '#84CC16',
    onPrimaryContainer: '#315200',
    primaryFixed: '#ACF847',
    accentNeon: '#C6FF00',
    semanticAccentBg: 'rgba(132, 204, 22, 0.15)',
    
    // Semantic States
    semanticAlert: '#EF4444',
    semanticAlertBg: 'rgba(239, 68, 68, 0.12)',
    semanticWarning: '#9D4300',
    semanticWarningBg: 'rgba(249, 115, 22, 0.12)',
    semanticInfo: '#00668A',
    semanticInfoBg: 'rgba(56, 189, 248, 0.12)',
    skyBlue: '#38BDF8',
    
    // Grid & Borders
    gridLine: '#D8E3FB',
    roadSecondary: '#E2E8F0',
    borderCard: 'rgba(15, 23, 42, 0.05)',
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
    xxl: 24,
    full: 9999,
  },
  shadows: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 16,
      elevation: 2,
    },
    floating: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 6,
    },
    sosGlow: {
      shadowColor: '#84CC16',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.55,
      shadowRadius: 20,
      elevation: 10,
    },
    chip: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 1,
    },
  },
} as const;
