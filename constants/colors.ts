// React Native용 색상 상수 정의
// globals.css에서 추출한 색상들을 React Native용으로 변환

export const Colors = {
  // Primary colors
  primary: '#F7B32B',
  primaryForeground: '#ffffff',
  
  // Background colors
  background: '#ffffff',
  foreground: '#1f2937',
  
  // Card colors
  card: '#ffffff',
  cardForeground: '#1f2937',
  
  // Secondary colors
  secondary: '#f3f4f6',
  secondaryForeground: '#1f2937',
  
  // Muted colors
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  
  // Accent colors
  accent: '#e5e7eb',
  accentForeground: '#1f2937',
  
  // Destructive colors
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  
  // Border and input colors
  border: 'rgba(0, 0, 0, 0.1)',
  input: '#f3f4f6',
  inputBackground: '#f3f4f6',
  
  // Text colors
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
    muted: '#9ca3af',
  },
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Gradient colors for special effects
  gradient: {
    primary: ['#F7B32B', '#fbbf24'],
    secondary: ['#f3f4f6', '#e5e7eb'],
  },
  
  // Dark mode colors (for future use)
  dark: {
    background: '#1f2937',
    foreground: '#f9fafb',
    card: '#374151',
    cardForeground: '#f9fafb',
    muted: '#4b5563',
    mutedForeground: '#d1d5db',
    border: '#374151',
  },
} as const;

// 자주 사용되는 색상 별칭
export const AppColors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  
  // Gray scale
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Yellow (Primary brand color)
  yellow400: '#fbbf24',
  yellow500: '#F7B32B',
  yellow600: '#d97706',
  
  // Status colors
  red500: '#ef4444',
  green500: '#10b981',
  blue500: '#3b82f6',
  orange500: '#f59e0b',
} as const;

export default Colors;