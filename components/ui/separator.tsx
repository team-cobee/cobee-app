import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  const separatorStyle: ViewStyle = {
    backgroundColor: Colors.border,
    ...(orientation === 'horizontal' 
      ? { height: 1, width: '100%' }
      : { width: 1, height: '100%' }
    ),
  };

  return <View style={[separatorStyle, style]} />;
}