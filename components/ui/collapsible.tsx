import * as React from "react";
import { View, TouchableOpacity, Animated, ViewStyle } from 'react-native';

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

type CollapsibleContextProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animatedHeight: Animated.Value;
};

const CollapsibleContext = React.createContext<CollapsibleContextProps | null>(null);

function useCollapsible() {
  const context = React.useContext(CollapsibleContext);
  if (!context) {
    throw new Error("useCollapsible must be used within a <Collapsible />");
  }
  return context;
}

function Collapsible({
  open = false,
  onOpenChange,
  children,
  style,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(open);
  const animatedHeight = React.useRef(new Animated.Value(open ? 1 : 0)).current;

  React.useEffect(() => {
    setIsOpen(open);
    Animated.timing(animatedHeight, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [open, animatedHeight]);

  const handleToggle = React.useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    
    Animated.timing(animatedHeight, {
      toValue: newOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [onOpenChange, animatedHeight]);

  return (
    <CollapsibleContext.Provider
      value={{
        open: isOpen,
        onOpenChange: handleToggle,
        animatedHeight,
      }}
    >
      <View style={style}>
        {children}
      </View>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({
  children,
  onPress,
  style,
}: CollapsibleTriggerProps) {
  const { open, onOpenChange } = useCollapsible();

  const handlePress = () => {
    onOpenChange(!open);
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={style}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

function CollapsibleContent({
  children,
  style,
}: CollapsibleContentProps) {
  const { animatedHeight } = useCollapsible();
  const [contentHeight, setContentHeight] = React.useState(0);

  const animatedStyle = {
    height: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, contentHeight],
    }),
    opacity: animatedHeight,
  };

  return (
    <Animated.View style={[animatedStyle, { overflow: 'hidden' }]}>
      <View
        style={style}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0 && contentHeight === 0) {
            setContentHeight(height);
          }
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
