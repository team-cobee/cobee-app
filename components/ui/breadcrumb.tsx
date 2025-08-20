import * as React from "react";
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface BreadcrumbProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface BreadcrumbListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: TextStyle;
}

interface BreadcrumbPageProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

interface BreadcrumbEllipsisProps {
  style?: ViewStyle;
}

function Breadcrumb({ children, style }: BreadcrumbProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

function BreadcrumbList({ children, style }: BreadcrumbListProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function BreadcrumbItem({ children, style }: BreadcrumbItemProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function BreadcrumbLink({ children, onPress, style }: BreadcrumbLinkProps) {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component onPress={onPress}>
      <Text
        style={[
          {
            fontSize: 14,
            color: '#6b7280',
          },
          style
        ]}
      >
        {children}
      </Text>
    </Component>
  );
}

function BreadcrumbPage({ children, style }: BreadcrumbPageProps) {
  return (
    <Text
      style={[
        {
          fontSize: 14,
          color: '#374151',
          fontWeight: 'normal',
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

function BreadcrumbSeparator({ children, style }: BreadcrumbSeparatorProps) {
  return (
    <View style={style}>
      {children ?? (
        <Text style={{ fontSize: 14, color: '#6b7280' }}>
          ›
        </Text>
      )}
    </View>
  );
}

function BreadcrumbEllipsis({ style }: BreadcrumbEllipsisProps) {
  return (
    <View
      style={[
        {
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style
      ]}
    >
      <Text style={{ fontSize: 16, color: '#6b7280' }}>
        …
      </Text>
    </View>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
