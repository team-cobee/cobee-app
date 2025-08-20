import * as React from "react";
import { View, ViewStyle, Text, TextStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          padding: 16,
          gap: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function CardHeader({ children, style }: CardHeaderProps) {
  return (
    <View
      style={[
        {
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#f3f4f6',
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function CardContent({ children, style }: CardContentProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

function CardTitle({ children, style }: CardTitleProps) {
  return (
    <Text
      style={[
        {
          fontSize: 18,
          fontWeight: '600',
          color: '#111827',
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

export { Card, CardHeader, CardContent, CardTitle };