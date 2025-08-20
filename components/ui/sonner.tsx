import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ViewStyle,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: ViewStyle;
  maxToasts?: number;
}

type ToasterContextProps = {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
};

const ToasterContext = React.createContext<ToasterContextProps | null>(null);

export function useToast() {
  const context = React.useContext(ToasterContext);
  if (!context) {
    throw new Error('useToast must be used within ToasterProvider');
  }
  return context;
}

function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after duration
    const duration = toast.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast, removeAllToasts }}>
      {children}
    </ToasterContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove();
    });
  };

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { bg: '#10b981', text: '#ffffff' };
      case 'error':
        return { bg: '#ef4444', text: '#ffffff' };
      case 'warning':
        return { bg: '#F7B32B', text: '#ffffff' };
      case 'info':
        return { bg: '#3b82f6', text: '#ffffff' };
      default:
        return { bg: '#374151', text: '#ffffff' };
    }
  };

  const colors = getToastColors(toast.type);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        backgroundColor: colors.bg,
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        maxWidth: 350,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{
          color: colors.text,
          fontSize: 14,
          fontWeight: '500',
        }}>
          {toast.message}
        </Text>
        
        {toast.action && (
          <TouchableOpacity
            style={{
              marginTop: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              alignSelf: 'flex-start',
            }}
            onPress={toast.action.onClick}
            activeOpacity={0.7}
          >
            <Text style={{
              color: colors.text,
              fontSize: 12,
              fontWeight: '600',
            }}>
              {toast.action.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity
        onPress={handleRemove}
        style={{
          marginLeft: 12,
          padding: 4,
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="close" size={16} color={colors.text} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const Toaster = ({
  position = 'top-center',
  style,
  maxToasts = 5,
}: ToasterProps) => {
  const { toasts, removeToast } = useToast();
  const { width } = Dimensions.get('window');

  const getPosition = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      position: 'absolute',
      zIndex: 1000,
      pointerEvents: 'box-none',
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyle, top: 50, left: 16 };
      case 'top-center':
        return { ...baseStyle, top: 50, left: width / 2, transform: [{ translateX: -175 }] };
      case 'top-right':
        return { ...baseStyle, top: 50, right: 16 };
      case 'bottom-left':
        return { ...baseStyle, bottom: 50, left: 16 };
      case 'bottom-center':
        return { ...baseStyle, bottom: 50, left: width / 2, transform: [{ translateX: -175 }] };
      case 'bottom-right':
        return { ...baseStyle, bottom: 50, right: 16 };
      default:
        return { ...baseStyle, top: 50, left: width / 2, transform: [{ translateX: -175 }] };
    }
  };

  const visibleToasts = toasts.slice(-maxToasts);

  return (
    <View
      style={[
        getPosition(),
        style
      ]}
      pointerEvents="box-none"
    >
      {visibleToasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </View>
  );
};

// Helper functions for easy toast usage
export const toast = {
  success: (_message: string, _options?: { duration?: number; action?: Toast['action'] }) => {
    // This will be used with the context
  },
  error: (_message: string, _options?: { duration?: number; action?: Toast['action'] }) => {
    // This will be used with the context
  },
  warning: (_message: string, _options?: { duration?: number; action?: Toast['action'] }) => {
    // This will be used with the context
  },
  info: (_message: string, _options?: { duration?: number; action?: Toast['action'] }) => {
    // This will be used with the context
  },
  default: (_message: string, _options?: { duration?: number; action?: Toast['action'] }) => {
    // This will be used with the context
  },
};

export { Toaster, ToasterProvider };
