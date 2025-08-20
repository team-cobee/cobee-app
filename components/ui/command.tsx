import * as React from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dialog, DialogContent } from "./dialog";

interface CommandProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onValueChange?: (search: string) => void;
}

interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

interface CommandInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
}

interface CommandListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CommandEmptyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CommandGroupProps {
  heading?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CommandItemProps {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

interface CommandShortcutProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface CommandSeparatorProps {
  style?: ViewStyle;
}

type CommandContextProps = {
  search: string;
  setSearch: (search: string) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};

const CommandContext = React.createContext<CommandContextProps | null>(null);

function useCommand() {
  const context = React.useContext(CommandContext);
  if (!context) {
    throw new Error("useCommand must be used within a <Command />");
  }
  return context;
}

function Command({
  children,
  style,
  onValueChange,
}: CommandProps) {
  const [search, setSearch] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const handleSearchChange = (text: string) => {
    setSearch(text);
    onValueChange?.(text);
    setSelectedIndex(-1);
  };

  return (
    <CommandContext.Provider
      value={{
        search,
        setSearch: handleSearchChange,
        selectedIndex,
        setSelectedIndex,
      }}
    >
      <View
        style={[
          {
            backgroundColor: '#ffffff',
            borderRadius: 6,
            flex: 1,
            width: '100%',
            overflow: 'hidden',
          },
          style
        ]}
      >
        {children}
      </View>
    </CommandContext.Provider>
  );
}

function CommandDialog({
  open = false,
  onOpenChange,
  children,
  title = "Command Palette",
  description = "Search for a command to run...",
}: CommandDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ padding: 0, overflow: 'hidden' }}>
        <Command>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  placeholder = "Type a command or search...",
  value,
  onChangeText,
  style,
}: CommandInputProps) {
  const { search, setSearch } = useCommand();
  
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          paddingHorizontal: 12,
          height: 36,
        },
        style
      ]}
    >
      <Ionicons name="search" size={16} color="#9ca3af" />
      <TextInput
        value={value ?? search}
        onChangeText={onChangeText ?? setSearch}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={{
          flex: 1,
          height: 40,
          paddingVertical: 12,
          fontSize: 14,
          color: '#374151',
          backgroundColor: 'transparent',
        }}
      />
    </View>
  );
}

function CommandList({
  children,
  style,
}: CommandListProps) {
  return (
    <ScrollView
      style={[
        {
          maxHeight: 300,
          paddingVertical: 4,
        },
        style
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

function CommandEmpty({
  children,
  style,
}: CommandEmptyProps) {
  return (
    <View
      style={[
        {
          paddingVertical: 24,
          alignItems: 'center',
        },
        style
      ]}
    >
      <Text style={{
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
      }}>
        {children}
      </Text>
    </View>
  );
}

function CommandGroup({
  heading,
  children,
  style,
}: CommandGroupProps) {
  return (
    <View
      style={[
        {
          overflow: 'hidden',
          padding: 4,
        },
        style
      ]}
    >
      {heading && (
        <Text style={{
          paddingHorizontal: 8,
          paddingVertical: 6,
          fontSize: 12,
          fontWeight: '500',
          color: '#6b7280',
        }}>
          {heading}
        </Text>
      )}
      {children}
    </View>
  );
}

function CommandItem({
  children,
  onSelect,
  disabled = false,
  style,
}: CommandItemProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderRadius: 4,
          paddingHorizontal: 8,
          paddingVertical: 6,
          opacity: disabled ? 0.5 : 1,
        },
        style
      ]}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

function CommandSeparator({
  style,
}: CommandSeparatorProps) {
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

function CommandShortcut({
  children,
  style,
}: CommandShortcutProps) {
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

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
