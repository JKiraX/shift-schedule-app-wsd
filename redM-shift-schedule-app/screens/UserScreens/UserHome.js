import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import ShiftCard from '../../components/Cards/ShiftCard';
import moment from "moment";

const UserHomeScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shiftData, setShiftData] = useState([]);

  useEffect(() => {
    // Fetch shift data from the database
    fetchShiftData();
  }, []);

  const onDateSelected = (date) => {
    setSelectedDate(date);
    // You can fetch shift data for the selected date here if needed
  };

  const fetchShiftData = async () => {
    try {
      // Replace this with your actual database query logic
      const data = [
        {
          shiftName: '6am Shift',
          startTime: '06:00',
          endTime: '14:00',
          assignedUsers: ['User 1', 'User 2'],
        },
        {
          shiftName: '8am Shift',
          startTime: '08:00',
          endTime: '16:00',
          assignedUsers: ['User 3', 'User 4'],
        },
        {
          shiftName: '2pm Shift',
          startTime: '14:00',
          endTime: '22:00',
          assignedUsers: ['User 1', 'User 2'],
        },
        {
          shiftName: '10pm Shift',
          startTime: '22:00',
          endTime: '06:00',
          assignedUsers: ['User 1', 'User 2'],
        },
        // Add more shift data objects as needed
      ];

      setShiftData(data);
    } catch (error) {
      console.error('Error fetching shift data:', error);
    }
  };

  const markedDatesFunc = (date) => {
    const currentDate = moment().startOf("day");
    const selectedMoment = moment(selectedDate).startOf("day");
    const dateMoment = moment(date).startOf("day");

    if (dateMoment.isSame(currentDate)) {
      return {
        dots: [
          {
            color:
              selectedMoment && dateMoment.isSame(selectedMoment)
                ? "#E6F2FF"
                : "red",
            selectedColor: "#E6F2FF",
          },
        ],
      };
    }

    if (selectedMoment && dateMoment.isSame(selectedMoment)) {
      return {
        style: {
          container: {
            backgroundColor: "#E6F2FF",
          },
          text: {
            color: "black",
            fontWeight: "bold",
          },
        },
      };
    }

    return {};
  };

  const canScrollToDate = (date) => {
    const currentDate = moment().startOf("day");
    const dateMoment = moment(date).startOf("day");
    return dateMoment.isSameOrAfter(currentDate);
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
      />
    </SafeAreaView>
  );
}

export default UserHomeScreen;
