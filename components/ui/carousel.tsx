import * as React from "react";
import { View, ScrollView, Dimensions, ViewStyle } from 'react-native';
import { Button } from "./button";

type CarouselApi = {
  scrollToIndex: (index: number) => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
};

type CarouselProps = {
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
  style?: ViewStyle;
  onIndexChange?: (index: number) => void;
};

type CarouselContextProps = {
  orientation: "horizontal" | "vertical";
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  currentIndex: number;
  totalItems: number;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  children,
  style,
  onIndexChange,
}: CarouselProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [screenData, setScreenData] = React.useState(Dimensions.get('window'));
  
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;
  
  React.useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const scrollPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
      
      if (orientation === "horizontal") {
        scrollRef.current?.scrollTo({
          x: newIndex * screenData.width,
          animated: true,
        });
      } else {
        scrollRef.current?.scrollTo({
          y: newIndex * screenData.height,
          animated: true,
        });
      }
    }
  };

  const scrollNext = () => {
    if (currentIndex < totalItems - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
      
      if (orientation === "horizontal") {
        scrollRef.current?.scrollTo({
          x: newIndex * screenData.width,
          animated: true,
        });
      } else {
        scrollRef.current?.scrollTo({
          y: newIndex * screenData.height,
          animated: true,
        });
      }
    }
  };

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < totalItems - 1;

  return (
    <CarouselContext.Provider
      value={{
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        currentIndex,
        totalItems,
      }}
    >
      <View style={[{ position: 'relative' }, style]}>
        {children}
      </View>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { orientation } = useCarousel();
  const scrollRef = React.useRef<ScrollView>(null);
  
  return (
    <View style={[{ overflow: 'hidden' }, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal={orientation === "horizontal"}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          flexDirection: orientation === "horizontal" ? 'row' : 'column',
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

function CarouselItem({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { orientation } = useCarousel();
  const [screenData, setScreenData] = React.useState(Dimensions.get('window'));
  
  React.useEffect(() => {
    const onChange = (result: any) => {
      setScreenData(result.window);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  return (
    <View
      style={[
        {
          width: orientation === "horizontal" ? screenData.width : '100%',
          height: orientation === "vertical" ? screenData.height : 'auto',
          flexShrink: 0,
          flexGrow: 0,
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

function CarouselPrevious({
  variant = "outline",
  size = "icon",
  style,
}: {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  style?: ViewStyle;
}) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      variant={variant}
      size={size}
      onPress={scrollPrev}
      disabled={!canScrollPrev}
      style={{
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        ...(orientation === "horizontal"
          ? { top: '50%', left: -48, transform: [{ translateY: -16 }] }
          : { top: -48, left: '50%', transform: [{ translateX: -16 }] }),
        ...style,
      }}
    >
      ‹
    </Button>
  );
}

function CarouselNext({
  variant = "outline",
  size = "icon",
  style,
}: {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  style?: ViewStyle;
}) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      variant={variant}
      size={size}
      onPress={scrollNext}
      disabled={!canScrollNext}
      style={{
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: 16,
        ...(orientation === "horizontal"
          ? { top: '50%', right: -48, transform: [{ translateY: -16 }] }
          : { bottom: -48, left: '50%', transform: [{ translateX: -16 }] }),
        ...style,
      }}
    >
      ›
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
