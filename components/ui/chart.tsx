import * as React from "react";
import { View, Text, ViewStyle } from 'react-native';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

interface ChartContainerProps {
  children: React.ReactNode;
  config: ChartConfig;
  style?: ViewStyle;
}

function ChartContainer({
  children,
  config,
  style,
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <View
        style={[
          {
            flex: 1,
            aspectRatio: 16/9,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style
        ]}
      >
        {children}
      </View>
    </ChartContext.Provider>
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  style?: ViewStyle;
}

function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  style,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <View
      style={[
        {
          backgroundColor: '#ffffff',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          paddingHorizontal: 10,
          paddingVertical: 6,
          gap: 6,
          minWidth: 128,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        },
        style
      ]}
    >
      {!hideLabel && label && (
        <Text style={{
          fontSize: 12,
          fontWeight: '500',
          color: '#374151',
        }}>
          {label}
        </Text>
      )}
      
      <View style={{ gap: 6 }}>
        {payload.map((item, index) => {
          const itemConfig = config[item.dataKey] || config[item.name];
          const indicatorColor = item.color || '#F7B32B';

          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {!hideIndicator && (
                <View
                  style={{
                    width: indicator === "dot" ? 10 : indicator === "line" ? 4 : 0,
                    height: 10,
                    borderRadius: indicator === "dot" ? 5 : 1,
                    backgroundColor: indicatorColor,
                    borderWidth: indicator === "dashed" ? 1.5 : 0,
                    borderStyle: indicator === "dashed" ? 'dashed' : 'solid',
                    borderColor: indicatorColor,
                  }}
                />
              )}
              
              <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 12,
                  color: '#6b7280',
                }}>
                  {itemConfig?.label || item.name}
                </Text>
                
                {item.value && (
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: '#374151',
                    fontFamily: 'monospace',
                  }}>
                    {item.value.toLocaleString()}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

interface ChartLegendContentProps {
  payload?: any[];
  hideIcon?: boolean;
  verticalAlign?: "top" | "bottom";
  style?: ViewStyle;
}

function ChartLegendContent({
  payload,
  hideIcon = false,
  verticalAlign = "bottom",
  style,
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          paddingVertical: verticalAlign === "top" ? 0 : 12,
          paddingBottom: verticalAlign === "top" ? 12 : 0,
        },
        style
      ]}
    >
      {payload.map((item) => {
        const itemConfig = config[item.dataKey] || config[item.value];
        const IconComponent = itemConfig?.icon;

        return (
          <View
            key={item.value}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {IconComponent && !hideIcon ? (
              <IconComponent />
            ) : (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: item.color || '#F7B32B',
                }}
              />
            )}
            
            <Text style={{
              fontSize: 12,
              color: '#374151',
            }}>
              {itemConfig?.label || item.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
};
