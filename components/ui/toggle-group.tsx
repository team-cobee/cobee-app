import * as React from "react";
import {
  View,
  ViewStyle,
} from 'react-native';

import { Toggle, ToggleVariants } from "./toggle";

type ToggleGroupType = "single" | "multiple";

const ToggleGroupContext = React.createContext<ToggleVariants>({
  size: "default",
  variant: "default",
});

interface ToggleGroupProps extends ToggleVariants {
  children: React.ReactNode;
  style?: ViewStyle;
  type?: ToggleGroupType;
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
}

function ToggleGroup({
  variant = "default",
  size = "default",
  children,
  style,
  type = "single",
  value,
  onValueChange,
  disabled = false,
}: ToggleGroupProps) {
  const contextValue = React.useMemo(() => ({
    variant,
    size,
  }), [variant, size]);

  const getGroupStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      width: 'auto',
      borderRadius: 6,
    };

    if (variant === 'outline') {
      return {
        ...baseStyle,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      };
    }

    return baseStyle;
  };

  return (
    <View style={[getGroupStyle(), style]}>
      <ToggleGroupContext.Provider value={contextValue}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            const childCount = React.Children.count(children);
            const isFirst = index === 0;
            const isLast = index === childCount - 1;
            
            const childProps = child.props as any;
            return React.cloneElement(child as any, {
              ...(childProps || {}),
              isFirst,
              isLast,
              variant: childProps?.variant || variant,
              size: childProps?.size || size,
              disabled: childProps?.disabled || disabled,
              type,
              groupValue: value,
              onGroupValueChange: onValueChange,
            });
          }
          return child;
        })}
      </ToggleGroupContext.Provider>
    </View>
  );
}

interface ToggleGroupItemProps extends ToggleVariants {
  children: React.ReactNode;
  value: string;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  type?: ToggleGroupType;
  groupValue?: string | string[];
  onGroupValueChange?: (value: string | string[]) => void;
}

function ToggleGroupItem({
  children,
  variant,
  size,
  value,
  style,
  onPress,
  disabled = false,
  isFirst = false,
  isLast = false,
  type = "single",
  groupValue,
  onGroupValueChange,
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  
  const finalVariant = variant || context.variant;
  const finalSize = size || context.size;

  const isPressed = React.useMemo(() => {
    if (type === "single") {
      return groupValue === value;
    } else {
      return Array.isArray(groupValue) && groupValue.includes(value);
    }
  }, [type, groupValue, value]);

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (!onGroupValueChange) return;

    if (type === "single") {
      onGroupValueChange(isPressed ? "" : value);
    } else {
      const currentValues = Array.isArray(groupValue) ? groupValue : [];
      if (isPressed) {
        onGroupValueChange(currentValues.filter(v => v !== value));
      } else {
        onGroupValueChange([...currentValues, value]);
      }
    }
  };

  const getItemStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      minWidth: 0,
      borderRadius: 0,
      shadowColor: 'transparent',
    };

    if (isFirst) {
      baseStyle.borderTopLeftRadius = 6;
      baseStyle.borderBottomLeftRadius = 6;
    }
    
    if (isLast) {
      baseStyle.borderTopRightRadius = 6;
      baseStyle.borderBottomRightRadius = 6;
    }

    if (finalVariant === 'outline') {
      baseStyle.borderLeftWidth = isFirst ? 1 : 0;
      baseStyle.borderRightWidth = 1;
      baseStyle.borderTopWidth = 1;
      baseStyle.borderBottomWidth = 1;
      baseStyle.borderColor = '#d1d5db';
    }

    return baseStyle;
  };

  return (
    <Toggle
      pressed={isPressed}
      onPressedChange={handlePress}
      variant={finalVariant}
      size={finalSize}
      disabled={disabled}
      style={{
        ...getItemStyle(),
        ...style,
      }}
    >
      {children}
    </Toggle>
  );
}

export { ToggleGroup, ToggleGroupItem };