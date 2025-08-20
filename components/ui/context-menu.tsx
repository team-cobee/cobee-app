import * as React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  PanResponder, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

interface ContextMenuProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface ContextMenuTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface ContextMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface ContextMenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  inset?: boolean;
  style?: ViewStyle;
}

interface ContextMenuCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

interface ContextMenuRadioItemProps {
  children: React.ReactNode;
  value: string;
  onSelect?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

interface ContextMenuLabelProps {
  children: React.ReactNode;
  inset?: boolean;
  style?: TextStyle;
}

interface ContextMenuSeparatorProps {
  style?: ViewStyle;
}

interface ContextMenuShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

type ContextMenuContextProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
};

const ContextMenuContext = React.createContext<ContextMenuContextProps | null>(null);

function useContextMenu() {
  const context = React.useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within a <ContextMenu />");
  }
  return context;
}

function ContextMenu({
  children,
  style,
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isOpen, scaleAnim]);

  return (
    <ContextMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        position,
        setPosition,
      }}
    >
      <View style={style}>
        {children}
      </View>
    </ContextMenuContext.Provider>
  );
}

function ContextMenuTrigger({
  children,
  style,
}: ContextMenuTriggerProps) {
  const { setIsOpen, setPosition } = useContextMenu();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setPosition({ x: locationX, y: locationY });
      setIsOpen(true);
    },
  });

  return (
    <TouchableOpacity
      style={style}
      onLongPress={(evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        setPosition({ x: pageX, y: pageY });
        setIsOpen(true);
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </TouchableOpacity>
  );
}

function ContextMenuContent({
  children,
  style,
}: ContextMenuContentProps) {
  const { isOpen, setIsOpen, position } = useContextMenu();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [isOpen, scaleAnim]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
        activeOpacity={1}
        onPress={() => setIsOpen(false)}
      >
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: position.x,
              top: position.y,
              backgroundColor: '#ffffff',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              padding: 4,
              minWidth: 128,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 5,
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

function ContextMenuItem({
  children,
  onSelect,
  disabled = false,
  variant = "default",
  inset = false,
  style,
}: ContextMenuItemProps) {
  const { setIsOpen } = useContextMenu();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      setIsOpen(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderRadius: 4,
          paddingHorizontal: inset ? 32 : 8,
          paddingVertical: 6,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      activeOpacity={0.7}
    >
      <Text style={{
        fontSize: 14,
        color: variant === "destructive" ? '#dc2626' : '#374151',
      }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function ContextMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
}: ContextMenuCheckboxItemProps) {
  const { setIsOpen } = useContextMenu();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
      setIsOpen(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderRadius: 4,
          paddingVertical: 6,
          paddingRight: 8,
          paddingLeft: 32,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      activeOpacity={0.7}
    >
      <View style={{
        position: 'absolute',
        left: 8,
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {checked && (
          <Text style={{ fontSize: 12, color: '#374151' }}>✓</Text>
        )}
      </View>
      <Text style={{
        fontSize: 14,
        color: '#374151',
      }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function ContextMenuRadioItem({
  children,
  value,
  onSelect,
  disabled = false,
  style,
}: ContextMenuRadioItemProps) {
  const { setIsOpen } = useContextMenu();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      setIsOpen(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderRadius: 4,
          paddingVertical: 6,
          paddingRight: 8,
          paddingLeft: 32,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      activeOpacity={0.7}
    >
      <View style={{
        position: 'absolute',
        left: 8,
        width: 14,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <View style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#374151',
        }} />
      </View>
      <Text style={{
        fontSize: 14,
        color: '#374151',
      }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

function ContextMenuLabel({
  children,
  inset = false,
  style,
}: ContextMenuLabelProps) {
  return (
    <Text
      style={[
        {
          paddingHorizontal: inset ? 32 : 8,
          paddingVertical: 6,
          fontSize: 14,
          fontWeight: '500',
          color: '#374151',
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

function ContextMenuSeparator({
  style,
}: ContextMenuSeparatorProps) {
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: '#e5e7eb',
          marginHorizontal: -4,
          marginVertical: 4,
        },
        style
      ]}
    />
  );
}

function ContextMenuShortcut({
  children,
  style,
}: ContextMenuShortcutProps) {
  return (
    <Text
      style={[
        {
          marginLeft: 'auto',
          fontSize: 12,
          color: '#6b7280',
          letterSpacing: 1,
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

// Simplified versions for compatibility
function ContextMenuGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuSubContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuSubTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function ContextMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
