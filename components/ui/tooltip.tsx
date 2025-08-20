import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
}

function TooltipProvider({
  children,
  delayDuration: _delayDuration = 0,
}: TooltipProviderProps) {
  return <View style={{ flex: 1 }}>{children}</View>;
}

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}

type TooltipContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerPosition: { x: number; y: number; width: number; height: number } | null;
  setTriggerPosition: (position: { x: number; y: number; width: number; height: number } | null) => void;
};

const TooltipContext = React.createContext<TooltipContextProps | null>(null);

function useTooltip() {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within Tooltip");
  }
  return context;
}

function Tooltip({
  children,
  open = false,
  onOpenChange,
  delayDuration = 0,
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(open);
  const [triggerPosition, setTriggerPosition] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (newOpen && delayDuration > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(newOpen);
        onOpenChange?.(newOpen);
      }, delayDuration);
    } else {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
    }
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <TooltipContext.Provider
        value={{
          open: isOpen,
          setOpen: handleOpenChange,
          triggerPosition,
          setTriggerPosition,
        }}
      >
        {children}
      </TooltipContext.Provider>
    </TooltipProvider>
  );
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function TooltipTrigger({ children, style }: TooltipTriggerProps) {
  const { setOpen, setTriggerPosition } = useTooltip();
  const triggerRef = React.useRef<View>(null);

  const handlePressIn = () => {
    if (triggerRef.current) {
      triggerRef.current.measure((_, __, width, height, pageX, pageY) => {
        setTriggerPosition({ x: pageX, y: pageY, width, height });
      });
    }
    setOpen(true);
  };

  const handlePressOut = () => {
    setOpen(false);
  };

  return (
    <View ref={triggerRef} style={style}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
}

interface TooltipContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  side?: TooltipSide;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
}

function TooltipContent({
  children,
  style,
  textStyle,
  side = 'top',
  sideOffset = 0,
  align = 'center',
}: TooltipContentProps) {
  const { open, triggerPosition } = useTooltip();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: open ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: open ? 1 : 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, fadeAnim, scaleAnim]);

  if (!open || !triggerPosition) return null;

  const getPosition = (): ViewStyle => {
    const contentWidth = 200; // Estimated content width
    const contentHeight = 40; // Estimated content height
    let left = triggerPosition.x;
    let top = triggerPosition.y;

    switch (side) {
      case 'top':
        top = triggerPosition.y - contentHeight - sideOffset;
        switch (align) {
          case 'start':
            left = triggerPosition.x;
            break;
          case 'end':
            left = triggerPosition.x + triggerPosition.width - contentWidth;
            break;
          default: // center
            left = triggerPosition.x + (triggerPosition.width / 2) - (contentWidth / 2);
            break;
        }
        break;
      case 'bottom':
        top = triggerPosition.y + triggerPosition.height + sideOffset;
        switch (align) {
          case 'start':
            left = triggerPosition.x;
            break;
          case 'end':
            left = triggerPosition.x + triggerPosition.width - contentWidth;
            break;
          default: // center
            left = triggerPosition.x + (triggerPosition.width / 2) - (contentWidth / 2);
            break;
        }
        break;
      case 'left':
        left = triggerPosition.x - contentWidth - sideOffset;
        top = triggerPosition.y + (triggerPosition.height / 2) - (contentHeight / 2);
        break;
      case 'right':
        left = triggerPosition.x + triggerPosition.width + sideOffset;
        top = triggerPosition.y + (triggerPosition.height / 2) - (contentHeight / 2);
        break;
    }

    return {
      position: 'absolute',
      top: Math.max(10, top),
      left: Math.max(10, Math.min(left, 400 - contentWidth - 10)), // Keep within screen bounds
      zIndex: 50,
    };
  };

  const getArrowPosition = (): ViewStyle => {
    const arrowSize = 10;
    const baseStyle: ViewStyle = {
      position: 'absolute',
      width: arrowSize,
      height: arrowSize,
      backgroundColor: '#374151',
      transform: [{ rotate: '45deg' }],
    };

    switch (side) {
      case 'top':
        return {
          ...baseStyle,
          bottom: -arrowSize / 2,
          left: '50%',
          marginLeft: -arrowSize / 2,
        };
      case 'bottom':
        return {
          ...baseStyle,
          top: -arrowSize / 2,
          left: '50%',
          marginLeft: -arrowSize / 2,
        };
      case 'left':
        return {
          ...baseStyle,
          right: -arrowSize / 2,
          top: '50%',
          marginTop: -arrowSize / 2,
        };
      case 'right':
        return {
          ...baseStyle,
          left: -arrowSize / 2,
          top: '50%',
          marginTop: -arrowSize / 2,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Modal visible={open} transparent animationType="none">
      <View style={{ flex: 1 }} pointerEvents="box-none">
        <Animated.View
          style={[
            getPosition(),
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
          pointerEvents="none"
        >
          <View
            style={[
              {
                backgroundColor: '#374151',
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 6,
                maxWidth: 200,
              },
              style
            ]}
          >
            <Text
              style={[
                {
                  color: '#ffffff',
                  fontSize: 12,
                  textAlign: 'center',
                },
                textStyle
              ]}
            >
              {children}
            </Text>
            <View style={getArrowPosition()} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };