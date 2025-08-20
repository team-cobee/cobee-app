import * as React from "react";
import { 
  View, 
  TouchableOpacity, 
  Modal, 
  Animated,
  ViewStyle 
} from 'react-native';

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface PopoverContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  align?: "center" | "start" | "end";
  sideOffset?: number;
}

interface PopoverAnchorProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

type PopoverContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerPosition: { x: number; y: number; width: number; height: number } | null;
  setTriggerPosition: (position: { x: number; y: number; width: number; height: number } | null) => void;
};

const PopoverContext = React.createContext<PopoverContextProps | null>(null);

function usePopover() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within a <Popover />");
  }
  return context;
}

function Popover({
  children,
  open = false,
  onOpenChange,
}: PopoverProps) {
  const [isOpen, setIsOpen] = React.useState(open);
  const [triggerPosition, setTriggerPosition] = React.useState<{ x: number; y: number; width: number; height: number } | null>(null);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <PopoverContext.Provider
      value={{
        open: isOpen,
        setOpen: handleOpenChange,
        triggerPosition,
        setTriggerPosition,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({
  children,
  style,
}: PopoverTriggerProps) {
  const { setOpen, open, setTriggerPosition } = usePopover();
  const triggerRef = React.useRef<View>(null);

  const handlePress = () => {
    if (!open && triggerRef.current) {
      triggerRef.current.measure((_, __, width, height, pageX, pageY) => {
        setTriggerPosition({ x: pageX, y: pageY, width, height });
      });
    }
    setOpen(!open);
  };

  return (
    <View ref={triggerRef} style={style}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
}

function PopoverContent({
  children,
  style,
  align = "center",
  sideOffset = 4,
}: PopoverContentProps) {
  const { open, setOpen, triggerPosition } = usePopover();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: open ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: open ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [open, scaleAnim, fadeAnim]);

  if (!open || !triggerPosition) return null;

  const getPositionStyle = (): ViewStyle => {
    const contentWidth = 288; // w-72 equivalent
    let left = triggerPosition.x;
    
    switch (align) {
      case "start":
        left = triggerPosition.x;
        break;
      case "end":
        left = triggerPosition.x + triggerPosition.width - contentWidth;
        break;
      default: // center
        left = triggerPosition.x + (triggerPosition.width / 2) - (contentWidth / 2);
        break;
    }

    return {
      position: 'absolute',
      top: triggerPosition.y + triggerPosition.height + sideOffset,
      left: Math.max(16, Math.min(left, 400 - contentWidth - 16)), // Keep within screen bounds
      width: contentWidth,
    };
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={() => setOpen(false)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
        activeOpacity={1}
        onPress={() => setOpen(false)}
      >
        <Animated.View
          style={[
            getPositionStyle(),
            {
              backgroundColor: '#ffffff',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
            style
          ]}
        >
          {children}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

function PopoverAnchor({
  children,
  style,
}: PopoverAnchorProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
