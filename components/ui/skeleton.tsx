import * as React from "react";
import { View, ViewStyle, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  style?: ViewStyle;
  animated?: boolean;
}

function Skeleton({ 
  width = '100%', 
  height = 20, 
  style, 
  animated = true 
}: SkeletonProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [animated, animatedValue]);

  const skeletonStyle: ViewStyle = {
    width,
    height,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  };

  const animatedStyle = animated ? {
    backgroundColor: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#e5e7eb', '#f3f4f6'],
    }),
  } : {};

  if (animated) {
    return (
      <Animated.View 
        style={[skeletonStyle, animatedStyle, style]} 
      />
    );
  }

  return (
    <View style={[skeletonStyle, style]} />
  );
}

export { Skeleton };
