import * as React from "react";
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  type?: string; // For web compatibility, but ignored in React Native
}

const styles = StyleSheet.create({
  input: {
    height: 36,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#374151',
  },
  focused: {
    borderColor: '#F7B32B',
    borderWidth: 2,
  },
});

function Input({ style, ...props }: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <TextInput
      style={[
        styles.input,
        isFocused && styles.focused,
        style
      ]}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}

export { Input };