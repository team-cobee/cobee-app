import * as React from "react";
import { Modal, View, Text, TouchableOpacity, ViewStyle, TextStyle, Animated } from 'react-native';
import { Button } from './button';

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue>({
  open: false,
  setOpen: () => {},
});

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function AlertDialog({ children, open, onOpenChange }: AlertDialogProps) {
  const [isOpen, setIsOpen] = React.useState(open || false);

  const setOpen = React.useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  return (
    <AlertDialogContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function AlertDialogTrigger({ children, asChild }: AlertDialogTriggerProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      onPress: () => setOpen(true),
    });
  }

  return (
    <TouchableOpacity onPress={() => setOpen(true)}>
      {children}
    </TouchableOpacity>
  );
}

// Portal component - not needed in React Native as Modal handles this
function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

interface AlertDialogOverlayProps {
  style?: ViewStyle;
}

function AlertDialogOverlay({ style }: AlertDialogOverlayProps) {
  const overlayStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  return <View style={[overlayStyle, style]} />;
}

interface AlertDialogContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function AlertDialogContent({ children, style }: AlertDialogContentProps) {
  const { open, setOpen } = React.useContext(AlertDialogContext);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (open) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [open, scaleAnim]);

  const contentStyle: ViewStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 24,
    marginHorizontal: 16,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <View style={containerStyle}>
        <Animated.View
          style={[
            contentStyle,
            style,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

interface AlertDialogHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function AlertDialogHeader({ children, style }: AlertDialogHeaderProps) {
  const headerStyle: ViewStyle = {
    marginBottom: 16,
    alignItems: 'center',
  };

  return (
    <View style={[headerStyle, style]}>
      {children}
    </View>
  );
}

interface AlertDialogFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function AlertDialogFooter({ children, style }: AlertDialogFooterProps) {
  const footerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
  };

  return (
    <View style={[footerStyle, style]}>
      {children}
    </View>
  );
}

interface AlertDialogTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function AlertDialogTitle({ children, style }: AlertDialogTitleProps) {
  const titleStyle: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  };

  return (
    <Text style={[titleStyle, style]}>
      {children}
    </Text>
  );
}

interface AlertDialogDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function AlertDialogDescription({ children, style }: AlertDialogDescriptionProps) {
  const descriptionStyle: TextStyle = {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  };

  return (
    <Text style={[descriptionStyle, style]}>
      {children}
    </Text>
  );
}

interface AlertDialogActionProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'destructive';
  style?: ViewStyle;
}

function AlertDialogAction({ children, onPress, variant = 'default', style }: AlertDialogActionProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

  const handlePress = () => {
    onPress?.();
    setOpen(false);
  };

  return (
    <Button
      variant={variant}
      onPress={handlePress}
      style={{ flex: 1, ...style }}
    >
      {children}
    </Button>
  );
}

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

function AlertDialogCancel({ children, onPress, style }: AlertDialogCancelProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

  const handlePress = () => {
    onPress?.();
    setOpen(false);
  };

  return (
    <Button
      variant="outline"
      onPress={handlePress}
      style={{ flex: 1, ...style }}
    >
      {children}
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
