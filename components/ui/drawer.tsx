import * as React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Dimensions,
  ViewStyle, 
  TextStyle 
} from 'react-native';

type DrawerDirection = "top" | "bottom" | "left" | "right";

interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  direction?: DrawerDirection;
}

interface DrawerTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface DrawerContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  direction?: DrawerDirection;
}

interface DrawerHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface DrawerFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface DrawerTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface DrawerDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

type DrawerContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  direction: DrawerDirection;
};

const DrawerContext = React.createContext<DrawerContextProps | null>(null);

function useDrawer() {
  const context = React.useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a <Drawer />");
  }
  return context;
}

function Drawer({
  children,
  open = false,
  onOpenChange,
  direction = "bottom",
}: DrawerProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <DrawerContext.Provider
      value={{
        open: isOpen,
        setOpen: handleOpenChange,
        direction,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({
  children,
  style,
}: DrawerTriggerProps) {
  const { setOpen } = useDrawer();

  return (
    <TouchableOpacity
      onPress={() => setOpen(true)}
      style={style}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

function DrawerOverlay() {
  const { setOpen } = useDrawer();

  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      activeOpacity={1}
      onPress={() => setOpen(false)}
    />
  );
}

function DrawerContent({
  children,
  style,
  direction,
}: DrawerContentProps) {
  const { open, setOpen, direction: contextDirection } = useDrawer();
  const finalDirection = direction || contextDirection;
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [open, slideAnim]);

  const getTransform = () => {
    switch (finalDirection) {
      case "top":
        return [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-height * 0.8, 0],
          })
        }];
      case "bottom":
        return [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [height * 0.8, 0],
          })
        }];
      case "left":
        return [{
          translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width * 0.75, 0],
          })
        }];
      case "right":
        return [{
          translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [width * 0.75, 0],
          })
        }];
      default:
        return [];
    }
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      backgroundColor: '#ffffff',
      flex: 1,
    };

    switch (finalDirection) {
      case "top":
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          right: 0,
          maxHeight: '80%',
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        };
      case "bottom":
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '80%',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        };
      case "left":
        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          left: 0,
          width: '75%',
          maxWidth: 320,
          borderRightWidth: 1,
          borderRightColor: '#e5e7eb',
        };
      case "right":
        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          right: 0,
          width: '75%',
          maxWidth: 320,
          borderLeftWidth: 1,
          borderLeftColor: '#e5e7eb',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="none"
      onRequestClose={() => setOpen(false)}
    >
      <DrawerOverlay />
      <Animated.View
        style={[
          getContainerStyle(),
          {
            transform: getTransform(),
          },
          style
        ]}
      >
        {finalDirection === "bottom" && (
          <View style={{
            backgroundColor: '#f3f4f6',
            marginHorizontal: 'auto',
            marginTop: 16,
            height: 8,
            width: 100,
            borderRadius: 4,
            alignSelf: 'center',
          }} />
        )}
        {children}
      </Animated.View>
    </Modal>
  );
}

function DrawerHeader({
  children,
  style,
}: DrawerHeaderProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          gap: 6,
          padding: 16,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function DrawerFooter({
  children,
  style,
}: DrawerFooterProps) {
  return (
    <View
      style={[
        {
          marginTop: 'auto',
          flexDirection: 'column',
          gap: 8,
          padding: 16,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function DrawerTitle({
  children,
  style,
}: DrawerTitleProps) {
  return (
    <Text
      style={[
        {
          fontSize: 18,
          fontWeight: '600',
          color: '#374151',
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

function DrawerDescription({
  children,
  style,
}: DrawerDescriptionProps) {
  return (
    <Text
      style={[
        {
          fontSize: 14,
          color: '#6b7280',
          lineHeight: 20,
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

function DrawerClose({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { setOpen } = useDrawer();

  return (
    <TouchableOpacity
      onPress={() => setOpen(false)}
      style={style}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

// Simplified components for compatibility
function DrawerPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
