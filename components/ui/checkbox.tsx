import * as React from "react";
import { TouchableOpacity, Text, ViewStyle } from 'react-native';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

function Checkbox({
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
}: CheckboxProps) {
  const handlePress = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          width: 16,
          height: 16,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: checked ? '#F7B32B' : '#e5e7eb',
          backgroundColor: checked ? '#F7B32B' : '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      activeOpacity={0.7}
    >
      {checked && (
        <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>
          ✓
        </Text>
      )}
    </TouchableOpacity>
  );
}

export { Checkbox };
