import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import ShiftCard from "../../components/Cards/ShiftCard";
import moment from "moment";

const AdminHomeScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shiftData, setShiftData] = useState([]);

  const canScrollToDate = (date) => {
    const currentDate = moment().startOf("day");
    const dateMoment = moment(date).startOf("day");
    return dateMoment.isSameOrAfter(currentDate);
  };

  const markedDates = [
    {
      date: new Date(),
      dots: [
        {
          color: "#EE6C4D",
          selectedDotColor: "#EE6C4D",
        },
      ],
    },
  ];

  useEffect(() => {
    fetchShiftData(selectedDate);
  }, [selectedDate]);

  const onDateSelected = (date) => {
    setSelectedDate(date);
  };

  const fetchShiftData = async (date) => {
    try {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const response = await fetch(`http://192.168.5.22:3001/schedules?date=${formattedDate}`); // Ensure the correct backend URL
      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        setShiftData(data);
      } else {
        console.error('Error fetching shift data:', response.status);
      }
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarStrip
        scrollable
        style={{ height: 120, paddingTop: 20, paddingBottom: 10}}
        calendarHeaderStyle={{
          color: "#9098B1",
          fontSize: 18,
          fontWeight: "bold",
        }}
        calendarColor={"white"}
        dateNumberStyle={{
          color: "#98C1D9",
          fontSize: 20,
          fontWeight: "normal",
        }}
        dateNameStyle={{ color: "#98C1D9", fontSize: 12, marginTop: 5 }}
        iconContainer={{ flex: 0.1 }}
        selectedDate={selectedDate}
        onDateSelected={onDateSelected}
        datesBlacklist={(date) => !canScrollToDate(date)}
        markedDates={markedDates}
      />

      {/* Render Shift Cards */}
      <ScrollView>
        <View style={styles.shiftCardsContainer}>
        {shiftData.map((shifts, index) => (
  <ShiftCard
    key={index}
    shiftName={shifts.shift_name}
    startTime={shifts.start_time}
    endTime={shifts.end_time}
    assignedUsers={shifts.user_name} // Pass the user_name directly
  />
))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shiftCardsContainer: {
    padding: 20,
  },
});

export default AdminHomeScreen;
