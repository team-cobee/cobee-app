import * as React from "react";
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ToggleVariant = "default" | "outline";
type ToggleSize = "default" | "sm" | "lg";

interface ToggleVariants {
  variant?: ToggleVariant;
  size?: ToggleSize;
}

const toggleVariants = {
  variant: {
    default: {
      backgroundColor: 'transparent',
    },
    outline: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      backgroundColor: 'transparent',
    },
  },
  size: {
    default: { height: 36, paddingHorizontal: 8, minWidth: 36 },
    sm: { height: 32, paddingHorizontal: 6, minWidth: 32 },
    lg: { height: 40, paddingHorizontal: 10, minWidth: 40 },
  },
};

interface ToggleProps {
  children: React.ReactNode;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  variant?: ToggleVariant;
  size?: ToggleSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function Toggle({
  children,
  pressed = false,
  onPressedChange,
  disabled = false,
  variant = "default",
  size = "default",
  style,
  textStyle,
}: ToggleProps) {
  const handlePress = () => {
    if (!disabled) {
      onPressedChange?.(!pressed);
    }
  };

  const getVariantStyle = (): ViewStyle => {
    const variantStyle = toggleVariants.variant[variant];
    const sizeStyle = toggleVariants.size[size];
    
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 6,
      ...variantStyle,
      ...sizeStyle,
    };

    if (pressed) {
      return {
        ...baseStyle,
        backgroundColor: '#F7B32B20',
      };
    }

    if (variant === 'outline' && !pressed) {
      return {
        ...baseStyle,
        borderColor: '#d1d5db',
      };
    }

    return baseStyle;
  };

  const getTextColor = (): string => {
    if (pressed) return '#F7B32B';
    return '#374151';
  };

  return (
    <TouchableOpacity
      style={[
        getVariantStyle(),
        {
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            {
              fontSize: 14,
              fontWeight: '500',
              color: getTextColor(),
            },
            textStyle
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

export { Toggle, toggleVariants, type ToggleVariants };