import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaginationProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function Pagination({ children, style }: PaginationProps) {
  return (
    <View
      style={[
        {
          marginHorizontal: 'auto',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface PaginationContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function PaginationContent({
  children,
  style,
}: PaginationContentProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface PaginationItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function PaginationItem({ children, style }: PaginationItemProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

interface PaginationLinkProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isActive?: boolean;
  onPress?: () => void;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

function PaginationLink({
  children,
  style,
  textStyle,
  isActive = false,
  onPress,
  size = 'icon',
}: PaginationLinkProps) {
  const getSize = () => {
    switch (size) {
      case 'sm': return { width: 32, height: 32, padding: 6 };
      case 'lg': return { width: 44, height: 44, padding: 12 };
      case 'icon': return { width: 36, height: 36, padding: 8 };
      default: return { width: 40, height: 40, padding: 10 };
    }
  };

  return (
    <TouchableOpacity
      style={[
        {
          ...getSize(),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          backgroundColor: isActive ? '#F7B32B' : 'transparent',
          borderWidth: isActive ? 1 : 0,
          borderColor: isActive ? '#F7B32B' : 'transparent',
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          {
            fontSize: 14,
            fontWeight: isActive ? '600' : '400',
            color: isActive ? '#ffffff' : '#374151',
          },
          textStyle
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface PaginationPreviousProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  showText?: boolean;
}

function PaginationPrevious({
  style,
  textStyle,
  onPress,
  showText = true,
}: PaginationPreviousProps) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 6,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-back" size={16} color="#6b7280" />
      {showText && (
        <Text
          style={[
            {
              fontSize: 14,
              color: '#374151',
            },
            textStyle
          ]}
        >
          Previous
        </Text>
      )}
    </TouchableOpacity>
  );
}

interface PaginationNextProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  showText?: boolean;
}

function PaginationNext({
  style,
  textStyle,
  onPress,
  showText = true,
}: PaginationNextProps) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 6,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {showText && (
        <Text
          style={[
            {
              fontSize: 14,
              color: '#374151',
            },
            textStyle
          ]}
        >
          Next
        </Text>
      )}
      <Ionicons name="chevron-forward" size={16} color="#6b7280" />
    </TouchableOpacity>
  );
}

interface PaginationEllipsisProps {
  style?: ViewStyle;
}

function PaginationEllipsis({
  style,
}: PaginationEllipsisProps) {
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
      <Ionicons name="ellipsis-horizontal" size={16} color="#6b7280" />
    </View>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
