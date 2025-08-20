import { StyleSheet } from 'react-native';
import { Colors } from './colors';

// 공통으로 사용되는 스타일 정의
export const CommonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Flex layouts
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Text styles
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.foreground,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.foreground,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.foreground,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.mutedForeground,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.mutedForeground,
  },
  
  // Card styles
  card: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  // Button styles
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: Colors.inputBackground,
    color: Colors.foreground,
  },
  
  // Spacing
  margin: {
    marginVertical: 8,
  },
  marginTop: {
    marginTop: 8,
  },
  marginBottom: {
    marginBottom: 8,
  },
  marginHorizontal: {
    marginHorizontal: 16,
  },
  padding: {
    padding: 16,
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  paddingVertical: {
    paddingVertical: 8,
  },
  
  // Borders
  border: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  // Shadows
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  shadowLarge: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});

// 자주 사용되는 수치 상수
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  xxl: 16,
  full: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;