import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import ShiftCard from "../../components/Cards/ShiftCard";
import moment from "moment";

const UserHomeScreen = ({ navigation }) => {
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
    // Fetch shift data from the database
    fetchShiftData();
  }, []);

  const onDateSelected = (date) => {
    setSelectedDate(date);
    // You can fetch shift data for the selected date here if needed
  };

  const generateSchedule = async () => {
    try {
      // Call your server API endpoint to generate the schedule for the current month
      const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
      const currentYear = new Date().getFullYear(); // Get the current year
      const response = await fetch(`/api/generate-schedule?month=${currentMonth}&year=${currentYear}`, {
        method: 'POST',
        // Add any additional headers or body if required
      });
  
      if (response.ok) {
        const data = await response.json();
        // Update the shiftData state with the generated schedule data
        setShiftData(data);
      } else {
        console.error('Error generating schedule:', response.status);
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
    }
  };

  const fetchShiftData = async () => {
    try {
      // Replace this with your actual database query logic
      const data = [
        {
          shiftName: "6am Shift",
          startTime: "06:00",
          endTime: "14:00",
          assignedUsers: ["User 1", "User 2"],
        },
        {
          shiftName: "8am Shift",
          startTime: "08:00",
          endTime: "16:00",
          assignedUsers: ["User 3", "User 4"],
        },
        {
          shiftName: "2pm Shift",
          startTime: "14:00",
          endTime: "22:00",
          assignedUsers: ["User 1", "User 2"],
        },
        {
          shiftName: "10pm Shift",
          startTime: "22:00",
          endTime: "06:00",
          assignedUsers: ["User 1", "User 2"],
        },
        // Add more shift data objects as needed
      ];

      setShiftData(data);
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarStrip
        scrollable
        style={{ height: 120, paddingTop: 20, paddingBottom: 10 }}
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
          {shiftData.map((shift, index) => (
            <ShiftCard
              key={index}
              shiftName={shift.shiftName}
              startTime={shift.startTime}
              endTime={shift.endTime}
              assignedUsers={shift.assignedUsers}
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

export default UserHomeScreen;
