import * as React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  ScrollView,
  ViewStyle, 
  TextStyle 
} from 'react-native';

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  sideOffset?: number;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  inset?: boolean;
  style?: ViewStyle;
}

interface DropdownMenuCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

interface DropdownMenuRadioItemProps {
  children: React.ReactNode;
  value: string;
  onSelect?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  inset?: boolean;
  style?: TextStyle;
}

interface DropdownMenuSeparatorProps {
  style?: ViewStyle;
}

interface DropdownMenuShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

type DropdownMenuContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextProps | null>(null);

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a <DropdownMenu />");
  }
  return context;
}

function DropdownMenu({
  children,
  open = false,
  onOpenChange,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <DropdownMenuContext.Provider
      value={{
        open: isOpen,
        setOpen: handleOpenChange,
      }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuTrigger({
  children,
  style,
}: DropdownMenuTriggerProps) {
  const { setOpen, open } = useDropdownMenu();

  return (
    <TouchableOpacity
      onPress={() => setOpen(!open)}
      style={style}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

function DropdownMenuContent({
  children,
  style,
  sideOffset = 4,
}: DropdownMenuContentProps) {
  const { open, setOpen } = useDropdownMenu();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [open, scaleAnim]);

  if (!open) return null;

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
            {
              position: 'absolute',
              top: 50 + sideOffset,
              right: 16,
              backgroundColor: '#ffffff',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              padding: 4,
              minWidth: 128,
              maxHeight: 300,
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

function DropdownMenuItem({
  children,
  onSelect,
  disabled = false,
  variant = "default",
  inset = false,
  style,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      setOpen(false);
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

function DropdownMenuCheckboxItem({
  children,
  checked = false,
  onCheckedChange,
  disabled = false,
  style,
}: DropdownMenuCheckboxItemProps) {
  const { setOpen } = useDropdownMenu();

  const handlePress = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
      setOpen(false);
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

function DropdownMenuRadioItem({
  children,
  value,
  onSelect,
  disabled = false,
  style,
}: DropdownMenuRadioItemProps) {
  const { setOpen } = useDropdownMenu();

  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
      setOpen(false);
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

function DropdownMenuLabel({
  children,
  inset = false,
  style,
}: DropdownMenuLabelProps) {
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

function DropdownMenuSeparator({
  style,
}: DropdownMenuSeparatorProps) {
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

function DropdownMenuShortcut({
  children,
  style,
}: DropdownMenuShortcutProps) {
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
function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuSubTrigger({ 
  children, 
  inset 
}: { 
  children: React.ReactNode; 
  inset?: boolean;
}) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: inset ? 32 : 8,
      paddingVertical: 6,
    }}>
      <Text style={{ fontSize: 14, color: '#374151' }}>{children}</Text>
      <Text style={{ marginLeft: 'auto', fontSize: 16, color: '#6b7280' }}>›</Text>
    </View>
  );
}

function DropdownMenuSubContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
