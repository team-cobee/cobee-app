import * as React from "react";
import { Modal, View, Text, TouchableOpacity, ViewStyle, TextStyle, Animated } from 'react-native';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  setOpen: () => {},
});

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Dialog({ children, open, onOpenChange }: DialogProps) {
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
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function DialogTrigger({ children, asChild }: DialogTriggerProps) {
  const { setOpen } = React.useContext(DialogContext);

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
function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

interface DialogCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

function DialogClose({ children, asChild }: DialogCloseProps) {
  const { setOpen } = React.useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      onPress: () => setOpen(false),
    });
  }

  return (
    <TouchableOpacity onPress={() => setOpen(false)}>
      {children}
    </TouchableOpacity>
  );
}

interface DialogOverlayProps {
  style?: ViewStyle;
}

function DialogOverlay({ style }: DialogOverlayProps) {
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

interface DialogContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showCloseButton?: boolean;
}

function DialogContent({ children, style, showCloseButton = true }: DialogContentProps) {
  const { open, setOpen } = React.useContext(DialogContext);
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
    maxWidth: 500,
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
    position: 'relative',
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const closeButtonStyle: ViewStyle = {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
          {showCloseButton && (
            <TouchableOpacity
              style={closeButtonStyle}
              onPress={() => setOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: '#6b7280' }}>×</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

interface DialogHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function DialogHeader({ children, style }: DialogHeaderProps) {
  const headerStyle: ViewStyle = {
    marginBottom: 16,
  };

  return (
    <View style={[headerStyle, style]}>
      {children}
    </View>
  );
}

interface DialogFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function DialogFooter({ children, style }: DialogFooterProps) {
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

interface DialogTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function DialogTitle({ children, style }: DialogTitleProps) {
  const titleStyle: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  };

  return (
    <Text style={[titleStyle, style]}>
      {children}
    </Text>
  );
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function DialogDescription({ children, style }: DialogDescriptionProps) {
  const descriptionStyle: TextStyle = {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  };

  return (
    <Text style={[descriptionStyle, style]}>
      {children}
    </Text>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
