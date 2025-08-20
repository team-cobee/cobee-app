import * as React from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Animated,
  ViewStyle
} from 'react-native';

interface InputOTPProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  style?: ViewStyle;
  autoFocus?: boolean;
}

interface InputOTPGroupProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface InputOTPSlotProps {
  index: number;
  style?: ViewStyle;
}

interface InputOTPSeparatorProps {
  style?: ViewStyle;
}

type InputOTPContextProps = {
  value: string;
  onChange: (value: string) => void;
  length: number;
  disabled: boolean;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
};

const InputOTPContext = React.createContext<InputOTPContextProps | null>(null);

function useInputOTP() {
  const context = React.useContext(InputOTPContext);
  if (!context) {
    throw new Error("useInputOTP must be used within InputOTP");
  }
  return context;
}

function InputOTP({
  value,
  onChange,
  length = 6,
  disabled = false,
  style,
  autoFocus = false,
}: InputOTPProps) {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const inputRef = React.useRef<TextInput>(null);

  const handleChangeText = (text: string) => {
    // Only allow digits and limit to specified length
    const cleanedText = text.replace(/[^0-9]/g, '').slice(0, length);
    onChange(cleanedText);
  };

  const handleFocus = () => {
    setFocusedIndex(value.length < length ? value.length : length - 1);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  return (
    <InputOTPContext.Provider
      value={{
        value,
        onChange,
        length,
        disabled,
        focusedIndex,
        setFocusedIndex,
      }}
    >
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            opacity: disabled ? 0.5 : 1,
          },
          style
        ]}
      >
        {/* Hidden input for actual text input */}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="numeric"
          maxLength={length}
          editable={!disabled}
          autoFocus={autoFocus}
          style={{
            position: 'absolute',
            left: -9999,
            opacity: 0,
          }}
        />
      </View>
    </InputOTPContext.Provider>
  );
}

function InputOTPGroup({
  children,
  style,
}: InputOTPGroupProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function InputOTPSlot({
  index,
  style,
}: InputOTPSlotProps) {
  const { value, focusedIndex } = useInputOTP();
  const char = value[index] || '';
  const isActive = focusedIndex === index;
  const isEmpty = !char;
  
  const blinkAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isActive && isEmpty) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      blinkAnim.setValue(1);
    }
  }, [isActive, isEmpty, blinkAnim]);

  return (
    <View
      style={[
        {
          position: 'relative',
          width: 36,
          height: 36,
          borderWidth: 1,
          borderColor: isActive ? '#F7B32B' : '#e5e7eb',
          backgroundColor: '#ffffff',
          borderTopRightRadius: index === 0 ? 0 : 6,
          borderBottomRightRadius: index === 0 ? 0 : 6,
          borderTopLeftRadius: index === 0 ? 6 : 0,
          borderBottomLeftRadius: index === 0 ? 6 : 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
        isActive && {
          borderWidth: 2,
          shadowColor: '#F7B32B',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 3,
        },
        style
      ]}
    >
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
      }}>
        {char}
      </Text>
      
      {isActive && isEmpty && (
        <Animated.View
          style={{
            position: 'absolute',
            width: 1,
            height: 16,
            backgroundColor: '#374151',
            opacity: blinkAnim,
          }}
        />
      )}
    </View>
  );
}

function InputOTPSeparator({
  style,
}: InputOTPSeparatorProps) {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
        style
      ]}
    >
      <Text style={{
        fontSize: 16,
        color: '#9ca3af',
        fontWeight: 'bold',
      }}>
        -
      </Text>
    </View>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
