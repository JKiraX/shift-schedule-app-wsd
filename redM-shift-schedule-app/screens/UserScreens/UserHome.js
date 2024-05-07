import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

export default function UserHomeScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onDateSelected = (date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarStrip
        scrollable
        style={{ height: 120, paddingTop: 20, paddingBottom: 10 }}
        calendarHeaderStyle={{ color: '#9098B1', fontSize: 18, fontWeight: "bold" }}
        calendarColor={'white'}
        dateNumberStyle={{ color: '#98C1D9', fontSize:20, fontWeight:"normal" }}
        dateNameStyle={{ color: '#98C1D9', fontSize: 12, marginTop:5}}
        iconContainer={{ flex: 0.1 }}
        selectedDate={selectedDate}
        onDateSelected={onDateSelected}
        
        
      />
    </SafeAreaView>
  );
}