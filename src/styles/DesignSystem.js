import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== ELEGANT COLOR PALETTE =====
export const Colors = {
  // Primary Brand Colors
  primary: '#1E3A8A', // Deep Blue
  primaryLight: '#3B82F6', // Bright Blue
  primaryDark: '#1E40AF', // Darker Blue
  
  // Secondary Colors
  secondary: '#10B981', // Emerald Green
  secondaryLight: '#34D399', // Light Green
  secondaryDark: '#059669', // Dark Green
  
  // Accent Colors
  accent: '#F59E0B', // Amber
  accentLight: '#FBBF24', // Light Amber
  accentDark: '#D97706', // Dark Amber
  
  // Success/Error Colors
  success: '#10B981', // Green
  error: '#EF4444', // Red
  warning: '#F59E0B', // Amber
  info: '#3B82F6', // Blue
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background Colors
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  
  // Text Colors
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Gradient Colors
  gradients: {
    primary: ['#1E3A8A', '#3B82F6', '#60A5FA'],
    secondary: ['#10B981', '#34D399', '#6EE7B7'],
    accent: ['#F59E0B', '#FBBF24', '#FCD34D'],
    sunset: ['#F59E0B', '#EF4444', '#EC4899'],
    ocean: ['#1E3A8A', '#0EA5E9', '#06B6D4'],
    forest: ['#059669', '#10B981', '#34D399'],
  }
};


// ===== TYPOGRAPHY (FIXED SIZES) =====
export const Typography = {
  // Fixed Font Sizes (no scaling)
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  
  // Font Weights
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  
  // Fixed Line Heights (absolute values)
  lineHeight: {
    tight: 20,
    normal: 24,
    relaxed: 28,
  }
};

// ===== SPACING (FIXED SIZES) =====
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
};

// ===== BORDER RADIUS =====
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// ===== SHADOWS =====
export const Shadows = {
  none: {},
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
};

// ===== COMPONENT STYLES =====
export const ComponentStyles = StyleSheet.create({
  // Card Styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  cardElevated: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  cardGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Shadows.md,
  },
  
  // Button Styles
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  buttonText: {
    color: Colors.textInverse,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  buttonTextOutline: {
    color: Colors.primary,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
  },
  
  // Input Styles
  input: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  inputFocused: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  
  // Text Styles
  heading1: {
    fontSize: Typography['4xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.tight,
  },
  heading2: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.tight,
  },
  heading3: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.tight,
  },
  body: {
    fontSize: Typography.base,
    fontWeight: Typography.normal,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeight.normal,
  },
  caption: {
    fontSize: Typography.sm,
    fontWeight: Typography.normal,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal,
  },
  
  // Badge Styles
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePrimary: {
    backgroundColor: Colors.primary,
  },
  badgeSecondary: {
    backgroundColor: Colors.secondary,
  },
  badgeAccent: {
    backgroundColor: Colors.accent,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerCentered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Row/Column Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  columnCentered: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

// ===== ANIMATION VALUES =====
export const Animation = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// ===== LAYOUT CONSTANTS =====
export const Layout = {
  screenPadding: Spacing.lg,
  cardSpacing: Spacing.md,
  sectionSpacing: Spacing.xl,
  headerHeight: 60,
  tabBarHeight: 80,
};


// Default export
export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  ComponentStyles,
  Animation,
  Layout,
}; 