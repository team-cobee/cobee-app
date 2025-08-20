import * as React from "react";
import { View, Text, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface AvatarProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface AvatarImageProps {
  src: string;
  alt?: string;
  style?: ImageStyle;
}

interface AvatarFallbackProps {
  children: React.ReactNode;
  style?: ViewStyle & { fontSize?: number; };
}

const defaultAvatarStyle: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#f3f4f6',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

const fallbackTextStyle: TextStyle = {
  fontSize: 14,
  fontWeight: '600',
  color: '#6b7280',
};

function Avatar({ children, style }: AvatarProps) {
  return (
    <View style={[defaultAvatarStyle, style]}>
      {children}
    </View>
  );
}

function AvatarImage({ src, alt, style }: AvatarImageProps) {
  return (
    <Image
      source={{ uri: src }}
      style={[{ width: '100%', height: '100%' }, style]}
      resizeMode="cover"
    />
  );
}

function AvatarFallback({ children, style }: AvatarFallbackProps) {
  const { fontSize, ...viewStyle } = style || {};
  const textStyle = fontSize ? { ...fallbackTextStyle, fontSize } : fallbackTextStyle;
  
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, viewStyle]}>
      <Text style={textStyle}>{children}</Text>
    </View>
  );
}

export { Avatar, AvatarImage, AvatarFallback };