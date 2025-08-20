import React from 'react';
import { Switch as RNSwitch, SwitchProps as RNSwitchProps, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface SwitchProps extends Omit<RNSwitchProps, 'value'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({ checked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      trackColor={{
        false: Colors.mutedForeground,
        true: Colors.primary,
      }}
      thumbColor={checked ? Colors.primaryForeground : Colors.background}
      ios_backgroundColor={Colors.mutedForeground}
      {...props}
    />
  );
}