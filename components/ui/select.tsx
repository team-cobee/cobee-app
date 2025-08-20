import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.inputBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerText: {
    fontSize: 16,
    color: Colors.foreground,
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.mutedForeground,
  },
  chevron: {
    fontSize: 16,
    color: Colors.mutedForeground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    width: '80%',
    maxHeight: '60%',
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: Colors.foreground,
  },
  selectedOption: {
    backgroundColor: Colors.accent,
  },
});

export function Select({ 
  options, 
  value, 
  onValueChange, 
  placeholder = '선택하세요', 
  style, 
  disabled = false 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  const renderOption = ({ item, index }: { item: SelectOption; index: number }) => (
    <TouchableOpacity
      style={[
        styles.optionItem,
        index === options.length - 1 && styles.optionItemLast,
        item.value === value && styles.selectedOption,
      ]}
      onPress={() => handleSelect(item.value)}
    >
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.triggerDisabled, style]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={selectedOption ? styles.triggerText : styles.placeholderText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#9ca3af" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// Legacy exports for compatibility
export const SelectTrigger = ({ children, ...props }: any) => children;
export const SelectContent = ({ children, ...props }: any) => children;
export const SelectItem = ({ children, value, ...props }: any) => children;
export const SelectValue = ({ placeholder, ...props }: any) => null;