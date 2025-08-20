import * as React from "react";
import { Text, TextStyle } from 'react-native';

interface LabelProps {
  children: React.ReactNode;
  disabled?: boolean;
  style?: TextStyle;
}

function Label({ children, disabled = false, style }: LabelProps) {
  const labelStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    color: '#374151',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Text style={[labelStyle, style]}>
      {children}
    </Text>
  );
}

export { Label };
