// React Native utility functions
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

type Style = ViewStyle | TextStyle | ImageStyle;

// Simple style merger for React Native
export function cn(...styles: (Style | undefined | null | false)[]): Style {
  const result: Style = {};
  
  styles.forEach(style => {
    if (style && typeof style === 'object') {
      Object.assign(result, style);
    }
  });
  
  return result;
}

// Utility function to merge multiple style objects
export function mergeStyles(...styles: Style[]): Style {
  return Object.assign({}, ...styles);
}

// Convert hex color to rgba
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Get contrasting text color
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
