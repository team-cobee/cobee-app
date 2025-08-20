import * as React from "react";
import { View, ViewStyle } from 'react-native';

interface AspectRatioProps {
  ratio?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}

function AspectRatio({ ratio = 1, children, style }: AspectRatioProps) {
  return (
    <View
      style={[
        {
          width: '100%',
          aspectRatio: ratio,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

export { AspectRatio };
