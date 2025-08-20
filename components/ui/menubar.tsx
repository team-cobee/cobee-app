import * as React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal,
  Animated,
  ViewStyle,
  TextStyle
} from 'react-native';

interface MenubarProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function Menubar({
  children,
  style,
}: MenubarProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#ffffff',
          flexDirection: 'row',
          height: 36,
          alignItems: 'center',
          gap: 4,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          padding: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface MenubarMenuProps {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

type MenubarContextProps = {
  openMenu: string | null;
  setOpenMenu: (menu: string | null) => void;
};

const MenubarContext = React.createContext<MenubarContextProps | null>(null);

function useMenubar() {
  const context = React.useContext(MenubarContext);
  if (!context) {
    throw new Error("useMenubar must be used within Menubar");
  }
  return context;
}

function MenubarMenu({
  children,
  onOpenChange,
}: MenubarMenuProps) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);

  const handleOpenChange = (menu: string | null) => {
    setOpenMenu(menu);
    onOpenChange?.(menu !== null);
  };

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu: handleOpenChange }}>
      {children}
    </MenubarContext.Provider>
  );
}

interface MenubarGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function MenubarGroup({
  children,
  style,
}: MenubarGroupProps) {
  return (
    <View style={[{ flexDirection: 'column' }, style]}>
      {children}
    </View>
  );
}

interface MenubarPortalProps {
  children: React.ReactNode;
}

function MenubarPortal({
  children,
}: MenubarPortalProps) {
  return <>{children}</>;
}

interface MenubarRadioGroupProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  style?: ViewStyle;
}

function MenubarRadioGroup({
  children,
  value,
  onValueChange,
  style,
}: MenubarRadioGroupProps) {
  return (
    <View style={[{ flexDirection: 'column' }, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selectedValue: value,
            onSelect: onValueChange,
          } as any);
        }
        return child;
      })}
    </View>
  );
}

interface MenubarTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  menuId: string;
}

function MenubarTrigger({
  children,
  style,
  menuId,
}: MenubarTriggerProps) {
  const { openMenu, setOpenMenu } = useMenubar();
  const isOpen = openMenu === menuId;

  const handlePress = () => {
    setOpenMenu(isOpen ? null : menuId);
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          backgroundColor: isOpen ? '#F7B32B20' : 'transparent',
        },
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: isOpen ? '#F7B32B' : '#374151',
      }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface MenubarContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  menuId: string;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

function MenubarContent({
  children,
  style,
  menuId,
  align = 'start',
  sideOffset = 8,
}: MenubarContentProps) {
  const { openMenu, setOpenMenu } = useMenubar();
  const isOpen = openMenu === menuId;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: isOpen ? 1 : 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, fadeAnim, scaleAnim]);

  if (!isOpen) return null;

  return (
    <MenubarPortal>
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setOpenMenu(null)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          }}
          activeOpacity={1}
          onPress={() => setOpenMenu(null)}
        >
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 60 + sideOffset,
                left: align === 'start' ? 16 : align === 'end' ? 'auto' : '50%',
                right: align === 'end' ? 16 : undefined,
                minWidth: 192,
                backgroundColor: '#ffffff',
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                padding: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
                zIndex: 50,
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
    </MenubarPortal>
  );
}

interface MenubarItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
  inset?: boolean;
  variant?: 'default' | 'destructive';
}

function MenubarItem({
  children,
  style,
  textStyle,
  onPress,
  disabled = false,
  inset = false,
  variant = 'default',
}: MenubarItemProps) {
  return (
    <TouchableOpacity
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
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          {
            fontSize: 14,
            color: variant === 'destructive' ? '#ef4444' : '#374151',
          },
          textStyle
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface MenubarCheckboxItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

function MenubarCheckboxItem({
  children,
  style,
  textStyle,
  checked = false,
  onCheckedChange,
  disabled = false,
}: MenubarCheckboxItemProps) {
  const handlePress = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
    }
  };

  return (
    <TouchableOpacity
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
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={{
          position: 'absolute',
          left: 8,
          width: 14,
          height: 14,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked && (
          <Text style={{
            fontSize: 12,
            color: '#F7B32B',
          }}>
            ✓
          </Text>
        )}
      </View>
      <Text
        style={[
          {
            fontSize: 14,
            color: '#374151',
          },
          textStyle
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface MenubarRadioItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  value: string;
  selectedValue?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

function MenubarRadioItem({
  children,
  style,
  textStyle,
  value,
  selectedValue,
  onSelect,
  disabled = false,
}: MenubarRadioItemProps) {
  const isSelected = selectedValue === value;

  const handlePress = () => {
    if (!disabled) {
      onSelect?.(value);
    }
  };

  return (
    <TouchableOpacity
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
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={{
          position: 'absolute',
          left: 8,
          width: 14,
          height: 14,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isSelected && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#F7B32B',
            }}
          />
        )}
      </View>
      <Text
        style={[
          {
            fontSize: 14,
            color: '#374151',
          },
          textStyle
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface MenubarLabelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  inset?: boolean;
}

function MenubarLabel({
  children,
  style,
  textStyle,
  inset = false,
}: MenubarLabelProps) {
  return (
    <View
      style={[
        {
          paddingHorizontal: inset ? 32 : 8,
          paddingVertical: 6,
        },
        style
      ]}
    >
      <Text
        style={[
          {
            fontSize: 14,
            fontWeight: '500',
            color: '#6b7280',
          },
          textStyle
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

interface MenubarSeparatorProps {
  style?: ViewStyle;
}

function MenubarSeparator({
  style,
}: MenubarSeparatorProps) {
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

interface MenubarShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

function MenubarShortcut({
  children,
  style,
}: MenubarShortcutProps) {
  return (
    <Text
      style={[
        {
          color: '#9ca3af',
          marginLeft: 'auto',
          fontSize: 12,
          letterSpacing: 1.5,
        },
        style
      ]}
    >
      {children}
    </Text>
  );
}

interface MenubarSubProps {
  children: React.ReactNode;
}

function MenubarSub({
  children,
}: MenubarSubProps) {
  return <>{children}</>;
}

interface MenubarSubTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  inset?: boolean;
  onPress?: () => void;
}

function MenubarSubTrigger({
  children,
  style,
  textStyle,
  inset = false,
  onPress,
}: MenubarSubTriggerProps) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 4,
          paddingHorizontal: inset ? 32 : 8,
          paddingVertical: 6,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          {
            fontSize: 14,
            color: '#374151',
            flex: 1,
          },
          textStyle
        ]}
      >
        {children}
      </Text>
      <Text style={{
        fontSize: 12,
        color: '#6b7280',
        marginLeft: 8,
      }}>
        ▶
      </Text>
    </TouchableOpacity>
  );
}

interface MenubarSubContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  isOpen?: boolean;
}

function MenubarSubContent({
  children,
  style,
  isOpen = false,
}: MenubarSubContentProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: isOpen ? 1 : 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, fadeAnim, scaleAnim]);

  if (!isOpen) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: '100%',
          top: 0,
          minWidth: 128,
          backgroundColor: '#ffffff',
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          padding: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          zIndex: 50,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        style
      ]}
    >
      {children}
    </Animated.View>
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
