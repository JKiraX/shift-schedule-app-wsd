import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import ShiftCard from "../../components/Cards/ShiftCard";
import moment from "moment";

const UserHomeScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shiftData, setShiftData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    fetchShiftData(date);
  };

  const fetchShiftData = async (date) => {
    setIsLoading(true);
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await fetch(
        `http://192.168.5.22:3001/schedules?date=${formattedDate}`
      );

      if (response.ok) {
        const data = await response.json();
        setShiftData(data.data || []);  // Ensure you are using data from the API response
      } else {
        console.error("Error fetching shift data:", response.status);
        setShiftData([]);
      }
    } catch (error) {
      console.error("Error fetching shift data:", error);
      setShiftData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarStrip
        scrollable={true}
        style={styles.calendarStrip}
        calendarHeaderStyle={styles.calendarHeader}
        calendarColor={styles.calendarColor.backgroundColor}
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
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : shiftData.length > 0 ? (
            shiftData.map((shift, index) => (
              <ShiftCard
                key={index}
                shiftName={shift.shift_name}
                startTime={shift.start_time}
                endTime={shift.end_time}
                assignedUsers={shift.assigned_users}  // Handle multiple users correctly
              />
            ))
          ) : (
            <Text style={styles.noShiftsText}>
              No shifts available for this date.
            </Text>
          )}
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
    height: 120,
    paddingTop: 20,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  calendarColor: {
    backgroundColor: "white",
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
    padding: 20,
  },
  noShiftsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default UserHomeScreen;
