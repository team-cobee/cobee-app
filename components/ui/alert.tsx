import * as React from "react";
import { View, Text, ViewStyle, TextStyle } from 'react-native';

type AlertVariant = 'default' | 'destructive';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface AlertTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const getAlertStyles = (variant: AlertVariant): { container: ViewStyle; title: TextStyle; description: TextStyle } => {
  const baseContainer: ViewStyle = {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
  };

  const baseTitle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
  };

  const baseDescription: TextStyle = {
    fontSize: 13,
    lineHeight: 18,
  };

  switch (variant) {
    case 'destructive':
      return {
        container: {
          ...baseContainer,
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
        },
        title: {
          ...baseTitle,
          color: '#dc2626',
        },
        description: {
          ...baseDescription,
          color: '#dc2626',
          opacity: 0.9,
        },
      };
    default:
      return {
        container: {
          ...baseContainer,
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
        },
        title: {
          ...baseTitle,
          color: '#374151',
        },
        description: {
          ...baseDescription,
          color: '#6b7280',
        },
      };
  }
};

function Alert({ variant = 'default', children, style }: AlertProps) {
  const styles = getAlertStyles(variant);

  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

function AlertTitle({ children, style }: AlertTitleProps) {
  return (
    <Text style={style}>
      {children}
    </Text>
  );
}

function AlertDescription({ children, style }: AlertDescriptionProps) {
  return (
    <Text style={style}>
      {children}
    </Text>
  );
}

export { Alert, AlertTitle, AlertDescription };
