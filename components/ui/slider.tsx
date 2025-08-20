import * as React from "react";
import {
  View,
  PanResponder,
  Animated,
  ViewStyle
} from 'react-native';

interface SliderProps {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  onValueChange?: (value: number[]) => void;
  style?: ViewStyle;
}

function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  disabled = false,
  onValueChange,
  style,
}: SliderProps) {
  const [internalValue, setInternalValue] = React.useState<number[]>(
    value || defaultValue || [min]
  );
  const [trackLayout, setTrackLayout] = React.useState({ width: 0, height: 0 });
  const animatedValues = React.useRef(
    internalValue.map(val => new Animated.Value(val))
  ).current;

  const currentValues = value || internalValue;

  React.useEffect(() => {
    if (value) {
      setInternalValue(value);
      value.forEach((val, index) => {
        if (animatedValues[index]) {
          animatedValues[index].setValue(val);
        }
      });
    }
  }, [value, animatedValues]);

  const createPanResponder = (thumbIndex: number) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        const isHorizontal = orientation === 'horizontal';
        const trackSize = isHorizontal ? trackLayout.width : trackLayout.height;
        const delta = isHorizontal ? gestureState.dx : -gestureState.dy;
        
        const valueRange = max - min;
        const deltaValue = (delta / trackSize) * valueRange;
        const currentValue = currentValues[thumbIndex];
        let newValue = currentValue + deltaValue;
        
        // Constrain to min/max
        newValue = Math.max(min, Math.min(max, newValue));
        
        // Apply step
        newValue = Math.round(newValue / step) * step;
        
        const newValues = [...currentValues];
        newValues[thumbIndex] = newValue;
        
        // Ensure thumbs don't cross
        if (thumbIndex > 0 && newValue < newValues[thumbIndex - 1]) {
          newValues[thumbIndex] = newValues[thumbIndex - 1];
        }
        if (thumbIndex < newValues.length - 1 && newValue > newValues[thumbIndex + 1]) {
          newValues[thumbIndex] = newValues[thumbIndex + 1];
        }
        
        setInternalValue(newValues);
        onValueChange?.(newValues);
        
        animatedValues[thumbIndex].setValue(newValues[thumbIndex]);
      },
      onPanResponderRelease: () => {},
    });
  };

  const getThumbPosition = (value: number) => {
    const percentage = (value - min) / (max - min);
    return percentage;
  };

  const getRangeWidth = () => {
    if (currentValues.length === 1) {
      return getThumbPosition(currentValues[0]);
    }
    const startPos = getThumbPosition(Math.min(...currentValues));
    const endPos = getThumbPosition(Math.max(...currentValues));
    return endPos - startPos;
  };

  const getRangeStart = () => {
    if (currentValues.length === 1) {
      return 0;
    }
    return getThumbPosition(Math.min(...currentValues));
  };

  return (
    <View
      style={[
        {
          position: 'relative',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          alignItems: 'center',
          width: orientation === 'horizontal' ? '100%' : 6,
          height: orientation === 'horizontal' ? 16 : 176,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
    >
      {/* Track */}
      <View
        style={{
          position: 'relative',
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          overflow: 'hidden',
          width: orientation === 'horizontal' ? '100%' : 6,
          height: orientation === 'horizontal' ? 16 : '100%',
        }}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setTrackLayout({ width, height });
        }}
      >
        {/* Range */}
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#F7B32B',
            ...(orientation === 'horizontal' 
              ? {
                  left: `${getRangeStart() * 100}%`,
                  width: `${getRangeWidth() * 100}%`,
                  height: '100%',
                }
              : {
                  bottom: `${getRangeStart() * 100}%`,
                  height: `${getRangeWidth() * 100}%`,
                  width: '100%',
                }
            ),
          }}
        />
      </View>
      
      {/* Thumbs */}
      {currentValues.map((thumbValue, index) => {
        const position = getThumbPosition(thumbValue);
        const panResponder = createPanResponder(index);
        
        return (
          <Animated.View
            key={index}
            {...panResponder.panHandlers}
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: '#ffffff',
              borderWidth: 2,
              borderColor: '#F7B32B',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              ...(orientation === 'horizontal'
                ? {
                    left: `${position * 100}%`,
                    marginLeft: -8,
                  }
                : {
                    bottom: `${position * 100}%`,
                    marginBottom: -8,
                  }
              ),
            }}
          />
        );
      })}
    </View>
  );
}

export { Slider };