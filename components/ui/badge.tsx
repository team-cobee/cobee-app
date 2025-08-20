import * as React from "react";
import { View, Text, ViewStyle, TextStyle } from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const getBadgeStyles = (variant: BadgeVariant): { container: ViewStyle; text: TextStyle } => {
  const baseContainer: ViewStyle = {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
  };

  const baseText: TextStyle = {
    fontSize: 12,
    fontWeight: '500',
  };

  switch (variant) {
    case 'default':
      return {
        container: {
          ...baseContainer,
          backgroundColor: '#F7B32B',
          borderColor: 'transparent',
        },
        text: {
          ...baseText,
          color: '#ffffff',
        },
      };
    case 'secondary':
      return {
        container: {
          ...baseContainer,
          backgroundColor: '#f3f4f6',
          borderColor: 'transparent',
        },
        text: {
          ...baseText,
          color: '#374151',
        },
      };
    case 'destructive':
      return {
        container: {
          ...baseContainer,
          backgroundColor: '#ef4444',
          borderColor: 'transparent',
        },
        text: {
          ...baseText,
          color: '#ffffff',
        },
      };
    case 'outline':
      return {
        container: {
          ...baseContainer,
          backgroundColor: 'transparent',
          borderColor: '#e5e7eb',
        },
        text: {
          ...baseText,
          color: '#374151',
        },
      };
    default:
      return {
        container: {
          ...baseContainer,
          backgroundColor: '#F7B32B',
          borderColor: 'transparent',
        },
        text: {
          ...baseText,
          color: '#ffffff',
        },
      };
  }
};

function Badge({ children, variant = 'default', style }: BadgeProps) {
  const styles = getBadgeStyles(variant);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

export { Badge };