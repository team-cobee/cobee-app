import * as React from "react";
import {
  View,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

interface RadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

type RadioGroupContextProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupContextProps | null>(null);

function useRadioGroup() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error("useRadioGroup must be used within RadioGroup");
  }
  return context;
}

function RadioGroup({
  children,
  value,
  onValueChange,
  disabled = false,
  style,
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View
        style={[
          {
            gap: 12,
          },
          style
        ]}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  disabled?: boolean;
  style?: ViewStyle;
}

function RadioGroupItem({
  value,
  disabled,
  style,
}: RadioGroupItemProps) {
  const { value: groupValue, onValueChange, disabled: groupDisabled } = useRadioGroup();
  const isSelected = groupValue === value;
  const isDisabled = disabled || groupDisabled;

  const handlePress = () => {
    if (!isDisabled && onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <TouchableOpacity
      style={[
        {
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: isSelected ? '#F7B32B' : '#d1d5db',
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
          opacity: isDisabled ? 0.5 : 1,
        },
        isSelected && {
          borderWidth: 2,
          shadowColor: '#F7B32B',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 3,
        },
        style
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {isSelected && (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#F7B32B',
          }}
        />
      )}
    </TouchableOpacity>
  );
}

export { RadioGroup, RadioGroupItem, useRadioGroup };
