import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
  ScrollView
} from 'react-native';

import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";

const SIDEBAR_WIDTH = 256; // 16rem in pixels
const SIDEBAR_WIDTH_MOBILE = 288; // 18rem in pixels
const SIDEBAR_WIDTH_ICON = 48; // 3rem in pixels

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

// Custom hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const { width } = Dimensions.get('window');
    setIsMobile(width < 768); // md breakpoint

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width < 768);
    });

    return () => subscription?.remove?.();
  }, []);

  return isMobile;
}

interface SidebarProviderProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
  style,
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <View
        style={[
          {
            flexDirection: 'row',
            minHeight: '100%',
            width: '100%',
          },
          style
        ]}
      >
        {children}
      </View>
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  children: React.ReactNode;
  style?: ViewStyle;
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  children,
  style,
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!isMobile) {
      Animated.timing(slideAnim, {
        toValue: state === "expanded" ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [state, isMobile, slideAnim]);

  if (collapsible === "none") {
    return (
      <View
        style={[
          {
            backgroundColor: '#f8f9fa',
            borderRightWidth: side === 'left' ? 1 : 0,
            borderLeftWidth: side === 'right' ? 1 : 0,
            borderColor: '#e5e7eb',
            flexDirection: 'column',
            height: '100%',
            width: SIDEBAR_WIDTH,
          },
          style
        ]}
      >
        {children}
      </View>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side={side}
          style={{
            backgroundColor: '#f8f9fa',
            width: SIDEBAR_WIDTH_MOBILE,
            padding: 0,
          }}
        >
          <SheetHeader style={{ position: 'absolute', left: -9999, opacity: 0 }}>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {children}
          </View>
        </SheetContent>
      </Sheet>
    );
  }

  const sidebarWidth = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      collapsible === "icon" ? SIDEBAR_WIDTH_ICON : 0,
      SIDEBAR_WIDTH
    ],
  });

  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row',
      }}
    >
      {/* Sidebar Gap */}
      <Animated.View
        style={{
          width: sidebarWidth,
          backgroundColor: 'transparent',
        }}
      />
      
      {/* Sidebar Container */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            zIndex: 10,
            height: '100%',
            width: sidebarWidth,
            flexDirection: 'column',
            ...(side === 'left' ? { left: 0 } : { right: 0 }),
            ...(variant === 'floating' || variant === 'inset' ? { padding: 8 } : {}),
          },
          style
        ]}
      >
        <View
          style={{
            backgroundColor: '#f8f9fa',
            flex: 1,
            flexDirection: 'column',
            borderRightWidth: side === 'left' && variant !== 'floating' ? 1 : 0,
            borderLeftWidth: side === 'right' && variant !== 'floating' ? 1 : 0,
            borderColor: '#e5e7eb',
            ...(variant === 'floating' ? {
              borderRadius: 8,
              borderWidth: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            } : {}),
          }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

interface SidebarTriggerProps {
  style?: ViewStyle;
  onPress?: () => void;
}

function SidebarTrigger({
  style,
  onPress,
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  const handlePress = () => {
    onPress?.();
    toggleSidebar();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      style={{
        width: 28,
        height: 28,
        ...style,
      }}
      onPress={handlePress}
    >
      <Text style={{
        fontSize: 16,
        color: '#374151',
      }}>
        ☰
      </Text>
    </Button>
  );
}

interface SidebarRailProps {
  style?: ViewStyle;
}

function SidebarRail({
  style,
}: SidebarRailProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <TouchableOpacity
      onPress={toggleSidebar}
      style={[
        {
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 16,
          zIndex: 20,
          right: -16,
          backgroundColor: 'transparent',
        },
        style
      ]}
      activeOpacity={0.7}
    />
  );
}

interface SidebarInsetProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarInset({ 
  children, 
  style 
}: SidebarInsetProps) {
  return (
    <View
      style={[
        {
          backgroundColor: '#ffffff',
          position: 'relative',
          flex: 1,
          flexDirection: 'column',
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarInputProps {
  style?: ViewStyle;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

function SidebarInput({
  style,
  placeholder,
  value,
  onChangeText,
}: SidebarInputProps) {
  return (
    <Input
      style={[
        {
          backgroundColor: '#ffffff',
          height: 32,
          width: '100%',
          shadowColor: 'transparent',
        },
        style
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
}

interface SidebarHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarHeader({ 
  children, 
  style 
}: SidebarHeaderProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          gap: 8,
          padding: 8,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarFooter({ 
  children, 
  style 
}: SidebarFooterProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          gap: 8,
          padding: 8,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarSeparatorProps {
  style?: ViewStyle;
}

function SidebarSeparator({
  style,
}: SidebarSeparatorProps) {
  return (
    <Separator
      style={{
        backgroundColor: '#e5e7eb',
        marginHorizontal: 8,
        width: 'auto',
        ...style,
      }}
    />
  );
}

interface SidebarContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarContent({ 
  children, 
  style 
}: SidebarContentProps) {
  const { state } = useSidebar();
  
  return (
    <ScrollView
      style={[
        {
          flex: 1,
          minHeight: 0,
        },
        style
      ]}
      contentContainerStyle={{
        flexDirection: 'column',
        gap: 8,
        overflow: state === 'collapsed' ? 'hidden' : 'visible',
      }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

interface SidebarGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarGroup({ 
  children, 
  style 
}: SidebarGroupProps) {
  return (
    <View
      style={[
        {
          position: 'relative',
          flexDirection: 'column',
          width: '100%',
          minWidth: 0,
          padding: 8,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarGroupLabelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function SidebarGroupLabel({
  children,
  style,
  textStyle,
}: SidebarGroupLabelProps) {
  const { state } = useSidebar();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          height: 32,
          alignItems: 'center',
          borderRadius: 6,
          paddingHorizontal: 8,
          opacity: state === 'collapsed' ? 0 : 1,
          marginTop: state === 'collapsed' ? -32 : 0,
        },
        style
      ]}
    >
      <Text
        style={[
          {
            fontSize: 12,
            fontWeight: '500',
            color: 'rgba(55, 65, 81, 0.7)',
          },
          textStyle
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

interface SidebarGroupActionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

function SidebarGroupAction({
  children,
  style,
  onPress,
}: SidebarGroupActionProps) {
  const { state } = useSidebar();

  if (state === 'collapsed') return null;

  return (
    <TouchableOpacity
      style={[
        {
          position: 'absolute',
          top: 14,
          right: 12,
          width: 20,
          height: 20,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          padding: 0,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

interface SidebarGroupContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarGroupContent({
  children,
  style,
}: SidebarGroupContentProps) {
  return (
    <View
      style={[
        {
          width: '100%',
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarMenuProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarMenu({ 
  children, 
  style 
}: SidebarMenuProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          width: '100%',
          minWidth: 0,
          gap: 4,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarMenuItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarMenuItem({ 
  children, 
  style 
}: SidebarMenuItemProps) {
  return (
    <View
      style={[
        {
          position: 'relative',
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

function SidebarMenuButton({
  children,
  isActive = false,
  variant = "default",
  size = "default",
  style,
  textStyle,
  onPress,
}: SidebarMenuButtonProps) {
  const { state } = useSidebar();

  const getSize = () => {
    switch (size) {
      case 'sm': return { height: 28, fontSize: 12 };
      case 'lg': return { height: 48, fontSize: 14 };
      default: return { height: 32, fontSize: 14 };
    }
  };

  const sizeConfig = getSize();

  const getBackgroundColor = () => {
    if (isActive) return '#F7B32B20';
    if (variant === 'outline') return '#ffffff';
    return 'transparent';
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          gap: 8,
          overflow: 'hidden',
          borderRadius: 6,
          padding: 8,
          backgroundColor: getBackgroundColor(),
          height: state === 'collapsed' ? 32 : sizeConfig.height,
          paddingHorizontal: state === 'collapsed' ? 8 : 8,
        },
        getBorderStyle(),
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          {
            fontSize: sizeConfig.fontSize,
            fontWeight: isActive ? '500' : '400',
            color: isActive ? '#F7B32B' : '#374151',
            flex: 1,
            textAlign: 'left',
          },
          textStyle
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface SidebarMenuActionProps {
  children: React.ReactNode;
  showOnHover?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}

function SidebarMenuAction({
  children,
  showOnHover = false,
  style,
  onPress,
}: SidebarMenuActionProps) {
  const { state } = useSidebar();

  if (state === 'collapsed') return null;

  return (
    <TouchableOpacity
      style={[
        {
          position: 'absolute',
          top: 6,
          right: 4,
          width: 20,
          height: 20,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          padding: 0,
          opacity: showOnHover ? 0.7 : 1,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

interface SidebarMenuBadgeProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function SidebarMenuBadge({
  children,
  style,
  textStyle,
}: SidebarMenuBadgeProps) {
  const { state } = useSidebar();

  if (state === 'collapsed') return null;

  return (
    <View
      style={[
        {
          position: 'absolute',
          right: 4,
          top: 6,
          height: 20,
          minWidth: 20,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          paddingHorizontal: 4,
        },
        style
      ]}
    >
      <Text
        style={[
          {
            fontSize: 12,
            fontWeight: '500',
            color: '#374151',
          },
          textStyle
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

interface SidebarMenuSkeletonProps {
  showIcon?: boolean;
  style?: ViewStyle;
}

function SidebarMenuSkeleton({
  showIcon = false,
  style,
}: SidebarMenuSkeletonProps) {
  const widthPercentage = React.useMemo(() => {
    return Math.floor(Math.random() * 40) + 50;
  }, []);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          height: 32,
          alignItems: 'center',
          gap: 8,
          borderRadius: 6,
          paddingHorizontal: 8,
        },
        style
      ]}
    >
      {showIcon && (
        <Skeleton
          style={{
            width: 16,
            height: 16,
            borderRadius: 6,
          }}
        />
      )}
      <Skeleton
        style={{
          height: 16,
          flex: 1,
          width: `${widthPercentage}%`,
        }}
      />
    </View>
  );
}

interface SidebarMenuSubProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarMenuSub({ 
  children, 
  style 
}: SidebarMenuSubProps) {
  const { state } = useSidebar();

  if (state === 'collapsed') return null;

  return (
    <View
      style={[
        {
          borderLeftWidth: 1,
          borderLeftColor: '#e5e7eb',
          marginLeft: 14,
          flexDirection: 'column',
          minWidth: 0,
          gap: 4,
          paddingLeft: 10,
          paddingVertical: 2,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarMenuSubItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function SidebarMenuSubItem({
  children,
  style,
}: SidebarMenuSubItemProps) {
  return (
    <View
      style={[
        {
          position: 'relative',
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface SidebarMenuSubButtonProps {
  children: React.ReactNode;
  size?: "sm" | "md";
  isActive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

function SidebarMenuSubButton({
  children,
  size = "md",
  isActive = false,
  style,
  textStyle,
  onPress,
}: SidebarMenuSubButtonProps) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          height: 28,
          minWidth: 0,
          alignItems: 'center',
          gap: 8,
          overflow: 'hidden',
          borderRadius: 6,
          paddingHorizontal: 8,
          backgroundColor: isActive ? '#F7B32B20' : 'transparent',
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          {
            fontSize: size === 'sm' ? 12 : 14,
            color: isActive ? '#F7B32B' : '#374151',
            fontWeight: isActive ? '500' : '400',
            flex: 1,
          },
          textStyle
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};