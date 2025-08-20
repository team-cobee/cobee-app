import * as React from "react";
import { View, ViewStyle, Animated } from 'react-native';

interface ProgressProps {
  value?: number;
  max?: number;
  style?: ViewStyle;
  indicatorStyle?: ViewStyle;
  animated?: boolean;
}

function Progress({ 
  value = 0, 
  max = 100, 
  style, 
  indicatorStyle, 
  animated = true 
}: ProgressProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(percentage);
    }
  }, [percentage, animated, animatedValue]);

  const containerStyle: ViewStyle = {
    height: 8,
    width: '100%',
    backgroundColor: 'rgba(247, 179, 43, 0.2)', // #F7B32B with 20% opacity
    borderRadius: 4,
    overflow: 'hidden',
  };

  const indicatorBaseStyle: ViewStyle = {
    height: '100%',
    backgroundColor: '#F7B32B',
    borderRadius: 4,
  };

  const animatedIndicatorStyle = {
    width: animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      <Animated.View 
        style={[
          indicatorBaseStyle, 
          animatedIndicatorStyle, 
          indicatorStyle
        ]} 
      />
    </View>
  );
}

export { Progress };
