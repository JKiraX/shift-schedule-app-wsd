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
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <CalendarStrip
          scrollable
          style={styles.calendarStrip}
          calendarHeaderStyle={styles.calendarHeader}
          calendarColor={"white"}
          dateNumberStyle={styles.dateNumber}
          dateNameStyle={styles.dateName}
          iconContainer={styles.iconContainer}
          selectedDate={selectedDate}
          onDateSelected={onDateSelected}
          markedDatesFunc={markedDatesFunc}
          datesBlacklist={(date) => !canScrollToDate(date)}
          dayContainerStyle={styles.dayContainer}
        />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarStrip: {
    height: 150,
    paddingTop: 20,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  dateNumber: {
    color: "black",
    fontSize: 20,
    fontWeight: "normal",
  },
  dateName: {
    color: "black",
    fontSize: 14,
    marginTop: 5,
  },
  iconContainer: {
    flex: 0.1,
  },
  dayContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});

export default UserHomeScreen;
