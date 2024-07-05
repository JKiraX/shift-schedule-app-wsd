import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView, Dimensions } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import ShiftCard from "../../components/Cards/ShiftCard";
import moment from "moment";

const { width, height } = Dimensions.get('window');

const AdminHomeScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shiftData, setShiftData] = useState([]);

  useEffect(() => {
    fetchShiftData(selectedDate);
  }, [selectedDate]);

  const canScrollToDate = (date) => {
    const currentDate = moment().startOf("day");
    const dateMoment = moment(date).startOf("day");
    return dateMoment.isSameOrAfter(currentDate);
  };

  const markedDates = [
    {
      date: new Date(),
      dots: [{ color: "#EE6C4D", selectedDotColor: "#EE6C4D" }],
    },
  ];

  const onDateSelected = (date) => {
    setSelectedDate(date);
  };

  const fetchShiftData = async (date) => {
    try {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const response = await fetch(`http://192.168.5.61:3001/schedules?date=${formattedDate}`);
      
      if (response.ok) {
        const data = await response.json();
        setShiftData(data);
      } else {
        console.error('Error fetching shift data:', response.status);
      }
    } catch (error) {
      console.error("Error fetching shift data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        datesBlacklist={(date) => !canScrollToDate(date)}
        markedDates={markedDates}
      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.shiftCardsContainer}>
          {shiftData.map((shift, index) => (
            <ShiftCard
              key={index}
              shiftName={shift.shift_name}
              startTime={shift.start_time}
              endTime={shift.end_time}
              assignedUsers={shift.user_name}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  calendarStrip: {
    height: height * 0.15,
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
    fontSize: 12,
    marginTop: 5,
  },
  iconContainer: {
    flex: 0.1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  shiftCardsContainer: {
    padding: width * 0.05,
  },
});

export default AdminHomeScreen;