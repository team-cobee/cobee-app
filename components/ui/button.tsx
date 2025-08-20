import * as React from "react";
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const getButtonStyles = (variant: ButtonVariant, size: ButtonSize, disabled?: boolean): { container: ViewStyle; text: TextStyle } => {
  const baseContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    opacity: disabled ? 0.5 : 1,
  };

  const baseText: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
  };

  let containerStyle: ViewStyle = { ...baseContainer };
  let textStyle: TextStyle = { ...baseText };

  // Variant styles
  switch (variant) {
    case 'default':
      containerStyle.backgroundColor = '#F7B32B';
      textStyle.color = '#ffffff';
      break;
    case 'destructive':
      containerStyle.backgroundColor = '#ef4444';
      textStyle.color = '#ffffff';
      break;
    case 'outline':
      containerStyle.backgroundColor = '#ffffff';
      containerStyle.borderWidth = 1;
      containerStyle.borderColor = '#e5e7eb';
      textStyle.color = '#374151';
      break;
    case 'secondary':
      containerStyle.backgroundColor = '#f3f4f6';
      textStyle.color = '#374151';
      break;
    case 'ghost':
      containerStyle.backgroundColor = 'transparent';
      textStyle.color = '#374151';
      break;
    case 'link':
      containerStyle.backgroundColor = 'transparent';
      textStyle.color = '#F7B32B';
      textStyle.textDecorationLine = 'underline';
      break;
  }

  // Size styles
  switch (size) {
    case 'sm':
      containerStyle.height = 32;
      containerStyle.paddingHorizontal = 12;
      textStyle.fontSize = 13;
      break;
    case 'lg':
      containerStyle.height = 40;
      containerStyle.paddingHorizontal = 24;
      textStyle.fontSize = 16;
      break;
    case 'icon':
      containerStyle.width = 36;
      containerStyle.height = 36;
      containerStyle.paddingHorizontal = 0;
      break;
    default: // 'default'
      containerStyle.height = 36;
      containerStyle.paddingHorizontal = 16;
      containerStyle.paddingVertical = 8;
      break;
  }

  return { container: containerStyle, text: textStyle };
};

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  onPress,
  disabled = false,
  style,
}) => {
  const styles = getButtonStyles(variant, size, disabled);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export { Button };
