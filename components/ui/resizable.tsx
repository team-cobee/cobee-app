import * as React from "react";
import {
  View,
  PanResponder,
  ViewStyle
} from 'react-native';

interface ResizablePanelGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

type ResizableContextProps = {
  direction: 'horizontal' | 'vertical';
  panelSizes: number[];
  setPanelSizes: (sizes: number[]) => void;
};

const ResizableContext = React.createContext<ResizableContextProps | null>(null);

function useResizable() {
  const context = React.useContext(ResizableContext);
  if (!context) {
    throw new Error("useResizable must be used within ResizablePanelGroup");
  }
  return context;
}

function ResizablePanelGroup({
  children,
  direction = 'horizontal',
  style,
}: ResizablePanelGroupProps) {
  const [panelSizes, setPanelSizes] = React.useState<number[]>([]);

  return (
    <ResizableContext.Provider value={{ direction, panelSizes, setPanelSizes }}>
      <View
        style={[
          {
            flex: 1,
            height: '100%',
            width: '100%',
            flexDirection: direction === 'vertical' ? 'column' : 'row',
          },
          style
        ]}
      >
        {children}
      </View>
    </ResizableContext.Provider>
  );
}

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  style?: ViewStyle;
}

function ResizablePanel({
  children,
  defaultSize = 50,
  style,
}: ResizablePanelProps) {
  return (
    <View
      style={[
        {
          flex: defaultSize / 100,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface ResizableHandleProps {
  withHandle?: boolean;
  style?: ViewStyle;
  onResize?: (delta: number) => void;
}

function ResizableHandle({
  withHandle = false,
  style,
  onResize,
}: ResizableHandleProps) {
  const { direction } = useResizable();
  const [isDragging, setIsDragging] = React.useState(false);
  
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gestureState) => {
        const delta = direction === 'horizontal' ? gestureState.dx : gestureState.dy;
        onResize?.(delta);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        {
          backgroundColor: '#e5e7eb',
          position: 'relative',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: direction === 'horizontal' ? 1 : '100%',
          height: direction === 'vertical' ? 1 : '100%',
          zIndex: 10,
        },
        isDragging && {
          backgroundColor: '#F7B32B',
        },
        style
      ]}
    >
      {withHandle && (
        <View
          style={{
            backgroundColor: '#e5e7eb',
            zIndex: 10,
            width: direction === 'horizontal' ? 12 : 16,
            height: direction === 'horizontal' ? 16 : 12,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#d1d5db',
            transform: direction === 'vertical' ? [{ rotate: '90deg' }] : undefined,
          }}
        >
          <View style={{
            width: 2,
            height: 10,
            backgroundColor: '#9ca3af',
            marginHorizontal: 1,
          }} />
          <View style={{
            width: 2,
            height: 10,
            backgroundColor: '#9ca3af',
            marginHorizontal: 1,
          }} />
        </View>
      )}
    </View>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle, useResizable };
