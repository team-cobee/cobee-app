import * as React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated,
  ViewStyle 
} from 'react-native';

interface NavigationMenuProps {
  children: React.ReactNode;
  style?: ViewStyle;
  viewport?: boolean;
}

function NavigationMenu({
  children,
  style,
  viewport = true,
}: NavigationMenuProps) {
  return (
    <View
      style={[
        {
          position: 'relative',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '100%',
        },
        style
      ]}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </View>
  );
}

interface NavigationMenuListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function NavigationMenuList({
  children,
  style,
}: NavigationMenuListProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          flex: 1,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface NavigationMenuItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function NavigationMenuItem({
  children,
  style,
}: NavigationMenuItemProps) {
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

const navigationMenuTriggerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: 36,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 6,
  backgroundColor: '#ffffff',
};

interface NavigationMenuTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  isOpen?: boolean;
}

function NavigationMenuTrigger({
  children,
  style,
  onPress,
  isOpen = false,
}: NavigationMenuTriggerProps) {
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      style={[
        navigationMenuTriggerStyle,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginRight: 4,
      }}>
        {children}
      </Text>
      <Animated.View
        style={{
          transform: [{ rotate }],
        }}
      >
        <Text style={{
          fontSize: 12,
          color: '#6b7280',
        }}>
          ▼
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

interface NavigationMenuContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  isOpen?: boolean;
}

function NavigationMenuContent({
  children,
  style,
  isOpen = false,
}: NavigationMenuContentProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: isOpen ? 1 : 0.95,
        duration: 200,
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
          top: '100%',
          left: 0,
          width: '100%',
          padding: 8,
          backgroundColor: '#ffffff',
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
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

interface NavigationMenuViewportProps {
  style?: ViewStyle;
}

function NavigationMenuViewport({
  style,
}: NavigationMenuViewportProps) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          top: '100%',
          left: 0,
          zIndex: 50,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style
      ]}
    >
      <View
        style={{
          marginTop: 6,
          width: '100%',
          overflow: 'hidden',
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          backgroundColor: '#ffffff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      />
    </View>
  );
}

interface NavigationMenuLinkProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  isActive?: boolean;
}

function NavigationMenuLink({
  children,
  style,
  onPress,
  isActive = false,
}: NavigationMenuLinkProps) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'column',
          gap: 4,
          borderRadius: 4,
          padding: 8,
          backgroundColor: isActive ? '#F7B32B20' : 'transparent',
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={{
        fontSize: 14,
        color: isActive ? '#F7B32B' : '#374151',
        fontWeight: isActive ? '600' : '400',
      }}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface NavigationMenuIndicatorProps {
  style?: ViewStyle;
  isVisible?: boolean;
}

function NavigationMenuIndicator({
  style,
  isVisible = false,
}: NavigationMenuIndicatorProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isVisible, fadeAnim]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: '100%',
          zIndex: 1,
          height: 6,
          alignItems: 'center',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          opacity: fadeAnim,
        },
        style
      ]}
    >
      <View
        style={{
          width: 8,
          height: 8,
          backgroundColor: '#e5e7eb',
          transform: [{ rotate: '45deg' }],
          borderTopLeftRadius: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      />
    </Animated.View>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
