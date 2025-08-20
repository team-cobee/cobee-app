import * as React from "react";
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  style?: ViewStyle;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function Calendar({ selected, onSelect, style }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: Date[] = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  const isSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString();
  };
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };
  
  return (
    <View style={[{ padding: 12 }, style]}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <TouchableOpacity
          onPress={() => navigateMonth(-1)}
          style={{
            padding: 8,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}
        >
          <Text style={{ fontSize: 16, color: '#374151' }}>‹</Text>
        </TouchableOpacity>
        
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: '#374151',
        }}>
          {MONTHS[month]} {year}
        </Text>
        
        <TouchableOpacity
          onPress={() => navigateMonth(1)}
          style={{
            padding: 8,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#e5e7eb',
          }}
        >
          <Text style={{ fontSize: 16, color: '#374151' }}>›</Text>
        </TouchableOpacity>
      </View>
      
      {/* Day headers */}
      <View style={{
        flexDirection: 'row',
        marginBottom: 8,
      }}>
        {DAYS.map((day) => (
          <View key={day} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{
              fontSize: 12,
              fontWeight: 'normal',
              color: '#6b7280',
            }}>
              {day}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Calendar grid */}
      <View>
        {Array.from({ length: 6 }, (_, weekIndex) => (
          <View key={weekIndex} style={{
            flexDirection: 'row',
            marginBottom: 8,
          }}>
            {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => (
              <TouchableOpacity
                key={dayIndex}
                onPress={() => onSelect?.(date)}
                style={{
                  flex: 1,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  backgroundColor: isSelected(date) ? '#F7B32B' : 
                                  isToday(date) ? '#f3f4f6' : 'transparent',
                }}
                disabled={!isCurrentMonth(date)}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'normal',
                  color: isSelected(date) ? '#ffffff' :
                         isToday(date) ? '#374151' :
                         isCurrentMonth(date) ? '#374151' : '#9ca3af',
                }}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export { Calendar };
