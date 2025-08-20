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
import { Ionicons } from '@expo/vector-icons';

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type SheetContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextProps | null>(null);

function useSheet() {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within Sheet");
  }
  return context;
}

function Sheet({ children, open = false, onOpenChange }: SheetProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <SheetContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

interface SheetTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SheetTrigger({ children, style }: SheetTriggerProps) {
  const { setOpen } = useSheet();

  return (
    <TouchableOpacity
      style={style}
      onPress={() => setOpen(true)}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

interface SheetCloseProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SheetClose({ children, style }: SheetCloseProps) {
  const { setOpen } = useSheet();

  return (
    <TouchableOpacity
      style={style}
      onPress={() => setOpen(false)}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

interface SheetPortalProps {
  children: React.ReactNode;
}

function SheetPortal({ children }: SheetPortalProps) {
  return <>{children}</>;
}

interface SheetOverlayProps {
  style?: ViewStyle;
  onPress?: () => void;
}

function SheetOverlay({ style, onPress }: SheetOverlayProps) {
  const { open } = useSheet();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: open ? 1 : 0,
      duration: open ? 500 : 300,
      useNativeDriver: true,
    }).start();
  }, [open, fadeAnim]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 50,
          opacity: fadeAnim,
        },
        style
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onPress}
        activeOpacity={1}
      />
    </Animated.View>
  );
}

interface SheetContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

function SheetContent({
  children,
  style,
  side = 'right',
}: SheetContentProps) {
  const { open, setOpen } = useSheet();
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: open ? 1 : 0,
      duration: open ? 500 : 300,
      useNativeDriver: true,
    }).start();
  }, [open, slideAnim]);

  const getTransform = () => {
    switch (side) {
      case 'right':
        return [{
          translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [screenWidth, 0],
          }),
        }];
      case 'left':
        return [{
          translateX: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-screenWidth, 0],
          }),
        }];
      case 'top':
        return [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-screenHeight, 0],
          }),
        }];
      case 'bottom':
        return [{
          translateY: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [screenHeight, 0],
          }),
        }];
      default:
        return [];
    }
  };

  const getPosition = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      backgroundColor: '#ffffff',
      zIndex: 50,
      flexDirection: 'column',
      gap: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    };

    switch (side) {
      case 'right':
        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          right: 0,
          width: screenWidth * 0.75,
          maxWidth: 384, // sm:max-w-sm
          borderLeftWidth: 1,
          borderLeftColor: '#e5e7eb',
        };
      case 'left':
        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          left: 0,
          width: screenWidth * 0.75,
          maxWidth: 384,
          borderRightWidth: 1,
          borderRightColor: '#e5e7eb',
        };
      case 'top':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          right: 0,
          height: 'auto',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          height: 'auto',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        };
      default:
        return baseStyle;
    }
  };

  if (!open) return null;

  return (
    <SheetPortal>
      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <SheetOverlay onPress={() => setOpen(false)} />
        <Animated.View
          style={[
            getPosition(),
            {
              transform: getTransform(),
            },
            style
          ]}
        >
          {children}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              borderRadius: 4,
              opacity: 0.7,
              padding: 4,
            }}
            onPress={() => setOpen(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </SheetPortal>
  );
}

interface SheetHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SheetHeader({ children, style }: SheetHeaderProps) {
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

interface SheetFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SheetFooter({ children, style }: SheetFooterProps) {
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

interface SheetTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function SheetTitle({ children, style }: SheetTitleProps) {
  return (
    <Text
      style={[
        {
          color: '#111827',
          fontWeight: '600',
          fontSize: 18,
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

interface SheetDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function SheetDescription({ children, style }: SheetDescriptionProps) {
  return (
    <Text
      style={[
        {
          color: '#6b7280',
          fontSize: 14,
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  useSheet,
};
