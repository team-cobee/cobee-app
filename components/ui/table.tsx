import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  ViewStyle,
  TextStyle,
  TouchableOpacity
} from 'react-native';

interface TableProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function Table({ children, style }: TableProps) {
  return (
    <View
      style={[
        {
          position: 'relative',
          width: '100%',
        },
        style
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          width: '100%',
        }}
      >
        <View
          style={{
            width: '100%',
            minWidth: 600, // Ensure minimum width for table content
          }}
        >
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function TableHeader({ children, style }: TableHeaderProps) {
  return (
    <View
      style={[
        {
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function TableBody({ children, style }: TableBodyProps) {
  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isLast = index === React.Children.count(children) - 1;
          return React.cloneElement(child as any, {
            ...(child.props || {}),
            isLast,
          });
        }
        return child;
      })}
    </View>
  );
}

interface TableFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function TableFooter({ children, style }: TableFooterProps) {
  return (
    <View
      style={[
        {
          backgroundColor: 'rgba(243, 244, 246, 0.5)',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        },
        style
      ]}
    >
      {children}
    </View>
  );
}

interface TableRowProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  selected?: boolean;
  isLast?: boolean;
}

function TableRow({ 
  children, 
  style, 
  onPress, 
  selected = false,
  isLast = false 
}: TableRowProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  const rowContent = (
    <View
      style={[
        {
          flexDirection: 'row',
          borderBottomWidth: isLast ? 0 : 1,
          borderBottomColor: '#e5e7eb',
          backgroundColor: selected 
            ? 'rgba(243, 244, 246, 0.5)' 
            : isPressed 
              ? 'rgba(243, 244, 246, 0.5)' 
              : 'transparent',
        },
        style
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={1}
      >
        {rowContent}
      </TouchableOpacity>
    );
  }

  return rowContent;
}

interface TableHeadProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  flex?: number;
  width?: number;
}

function TableHead({ 
  children, 
  style, 
  textStyle, 
  flex = 1,
  width 
}: TableHeadProps) {
  return (
    <View
      style={[
        {
          height: 40,
          paddingHorizontal: 8,
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: width ? undefined : flex,
          width: width,
        },
        style
      ]}
    >
      <Text
        style={[
          {
            color: '#111827',
            fontWeight: '500',
            fontSize: 14,
            textAlign: 'left',
          },
          textStyle
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </View>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  flex?: number;
  width?: number;
}

function TableCell({ 
  children, 
  style, 
  textStyle,
  flex = 1,
  width 
}: TableCellProps) {
  return (
    <View
      style={[
        {
          padding: 8,
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: width ? undefined : flex,
          width: width,
        },
        style
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            {
              color: '#374151',
              fontSize: 14,
              textAlign: 'left',
            },
            textStyle
          ]}
          numberOfLines={1}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

interface TableCaptionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function TableCaption({ 
  children, 
  style, 
  textStyle 
}: TableCaptionProps) {
  return (
    <View
      style={[
        {
          marginTop: 16,
        },
        style
      ]}
    >
      <Text
        style={[
          {
            color: '#6b7280',
            fontSize: 14,
            textAlign: 'center',
          },
          textStyle
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};