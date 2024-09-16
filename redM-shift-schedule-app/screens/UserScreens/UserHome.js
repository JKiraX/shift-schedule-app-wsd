import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Text,
  Dimensions,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import ShiftCard from "../../components/Cards/ShiftCard";
import moment from "moment";

const { width, height } = Dimensions.get("window");

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

  const groupShiftsByShiftName = (shifts) => {
    if (!Array.isArray(shifts)) {
      return [];
    }

    return shifts.reduce((acc, shift) => {
      if (!acc[shift.shift_name]) {
        acc[shift.shift_name] = {
          ...shift,
          assigned_users: [],
        };
      }
      acc[shift.shift_name].assigned_users.push(shift.assigned_users);
      return acc;
    }, {});
  };

  const fetchShiftData = async (date) => {
    setIsLoading(true);
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await fetch(
        `http://192.168.5.22:3001/schedules?date=${formattedDate}`
      );

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.success && Array.isArray(responseData.data)) {
          const groupedShifts = groupShiftsByShiftName(responseData.data);
          setShiftData(Object.values(groupedShifts));
        } else {
          setShiftData([]);
        }
      } else {
        setShiftData([]);
      }
    } catch {
      setShiftData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time) => moment(time, "HH:mm:ss").format("HH:mm")

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
                startTime={formatTime(shift.start_time)} 
                endTime={formatTime(shift.end_time)}
                assignedUsers={shift.assigned_users} 
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