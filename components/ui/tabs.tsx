import * as React from "react";
import { View, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({});

interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

function Tabs({ value, onValueChange, children, style }: TabsProps) {
  const tabsStyle: ViewStyle = {
    flexDirection: 'column',
    gap: 8,
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View style={[tabsStyle, style]}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function TabsList({ children, style }: TabsListProps) {
  const listStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 3,
    alignSelf: 'flex-start',
  };

  return (
    <View style={[listStyle, style]}>
      {children}
    </View>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

function TabsTrigger({ value, children, style, textStyle, disabled = false }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
  const isActive = selectedValue === value;

  const triggerStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    backgroundColor: isActive ? '#ffffff' : 'transparent',
    opacity: disabled ? 0.5 : 1,
  };

  const triggerTextStyle: TextStyle = {
    fontSize: 14,
    fontWeight: '500',
    color: isActive ? '#374151' : '#6b7280',
  };

  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <TouchableOpacity
      style={[triggerStyle, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[triggerTextStyle, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

function TabsContent({ value, children, style }: TabsContentProps) {
  const { value: selectedValue } = React.useContext(TabsContext);

  if (selectedValue !== value) {
    return null;
  }

  const contentStyle: ViewStyle = {
    flex: 1,
  };

  return (
    <View style={[contentStyle, style]}>
      {children}
    </View>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
