import * as React from "react";
import { View, TouchableOpacity, Text, ViewStyle, TextStyle, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  type?: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue>({
  openItems: new Set(),
  toggleItem: () => {},
  type: 'single',
});

interface AccordionProps {
  type?: 'single' | 'multiple';
  children: React.ReactNode;
  style?: ViewStyle;
  defaultValue?: string | string[];
}

function Accordion({ type = 'single', children, style, defaultValue }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() => {
    if (defaultValue) {
      return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    }
    return new Set();
  });

  const toggleItem = React.useCallback((value: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        if (type === 'single') {
          newSet.clear();
        }
        newSet.add(value);
      }
      return newSet;
    });
  }, [type]);

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <View style={style}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

function AccordionItem({ value, children, style }: AccordionItemProps) {
  const itemStyle: ViewStyle = {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  };

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <View style={[itemStyle, style]}>
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
}

interface AccordionItemContextValue {
  value: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue>({
  value: '',
});

interface AccordionTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function AccordionTrigger({ children, style, textStyle }: AccordionTriggerProps) {
  const { openItems, toggleItem } = React.useContext(AccordionContext);
  const { value } = React.useContext(AccordionItemContext);
  const isOpen = openItems.has(value);
  
  const rotateAnim = React.useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotateAnim]);

  const triggerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    gap: 16,
  };

  const triggerTextStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    textAlign: 'left',
  };

  const chevronStyle = {
    transform: [{
      rotate: rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      }),
    }],
  };

  return (
    <TouchableOpacity
      style={[triggerStyle, style]}
      onPress={() => toggleItem(value)}
      activeOpacity={0.7}
    >
      <Text style={[triggerTextStyle, textStyle]}>
        {children}
      </Text>
      <Animated.View style={chevronStyle}>
        <Ionicons name="chevron-down" size={16} color="#6b7280" />
      </Animated.View>
    </TouchableOpacity>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function AccordionContent({ children, style }: AccordionContentProps) {
  const { openItems } = React.useContext(AccordionContext);
  const { value } = React.useContext(AccordionItemContext);
  const isOpen = openItems.has(value);
  
  const heightAnim = React.useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOpen, heightAnim]);

  const contentStyle: ViewStyle = {
    overflow: 'hidden',
    paddingBottom: 16,
  };

  const animatedStyle = {
    maxHeight: heightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1000], // Adjust max height as needed
    }),
    opacity: heightAnim,
  };

  return (
    <Animated.View style={[contentStyle, animatedStyle, style]}>
      <View>
        {children}
      </View>
    </Animated.View>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
