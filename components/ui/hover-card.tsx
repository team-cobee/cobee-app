import * as React from "react";
import { 
  View, 
  TouchableOpacity, 
  Animated, 
  ViewStyle 
} from 'react-native';

interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

interface HoverCardTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface HoverCardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  align?: "center" | "start" | "end";
  sideOffset?: number;
}

type HoverCardContextProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openDelay: number;
  closeDelay: number;
};

const HoverCardContext = React.createContext<HoverCardContextProps | null>(null);

function useHoverCard() {
  const context = React.useContext(HoverCardContext);
  if (!context) {
    throw new Error("useHoverCard must be used within a <HoverCard />");
  }
  return context;
}

function HoverCard({
  children,
  openDelay = 700,
  closeDelay = 300,
}: HoverCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <HoverCardContext.Provider
      value={{
        isOpen,
        setIsOpen,
        openDelay,
        closeDelay,
      }}
    >
      {children}
    </HoverCardContext.Provider>
  );
}

function HoverCardTrigger({
  children,
  style,
}: HoverCardTriggerProps) {
  const { setIsOpen, openDelay, closeDelay } = useHoverCard();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handlePressIn = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, openDelay);
  };

  const handlePressOut = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, closeDelay);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={style}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => {}} // Required for touch events
        activeOpacity={1}
        style={{ position: 'relative' }}
      >
        {children}
      </TouchableOpacity>
    </View>
  );
}

function HoverCardContent({
  children,
  style,
  align = "center",
  sideOffset = 4,
}: HoverCardContentProps) {
  const { isOpen } = useHoverCard();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isOpen ? 1 : 0.95,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, fadeAnim, scaleAnim]);

  if (!isOpen) return null;

  const getAlignStyle = (): ViewStyle => {
    switch (align) {
      case "start":
        return { alignSelf: 'flex-start' };
      case "end":
        return { alignSelf: 'flex-end' };
      default:
        return { alignSelf: 'center' };
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: sideOffset,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#e5e7eb',
            padding: 16,
            width: 256,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 5,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
          getAlignStyle(),
          style
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        {children}
      </Animated.View>
    </View>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
