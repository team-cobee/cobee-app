import React from 'react';
import { TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

interface TextareaProps extends Omit<TextInputProps, 'multiline'> {
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  textarea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: Colors.inputBackground,
    color: Colors.foreground,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  focused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
});

export function Textarea({ style, ...props }: TextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <TextInput
      style={[
        styles.textarea,
        isFocused && styles.focused,
        style
      ]}
      multiline
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      placeholderTextColor={Colors.mutedForeground}
      {...props}
    />
  );
}