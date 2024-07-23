import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import ShiftCard from "../../components/Cards/ShiftCard";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import moment from "moment";

const { width } = Dimensions.get("window");

const UserScheduleScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [shiftData, setShiftData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedDates).length > 0 && users.length > 0) {
      fetchShiftData();
    } else {
      setShiftData([]);
    }
  }, [selectedDates, selectedUser, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://192.168.5.61:3001/api/users`);
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);
      const data = await response.json();
      setUsers(data.map((user) => ({ key: user.id, value: user.name })));
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const fetchShiftData = async () => {
    try {
      const dates = Object.keys(selectedDates).join(",");
      const userId = selectedUser ? selectedUser.key : null;
      const queryParams = `?dates=${dates}${userId ? `&userId=${userId}` : ""}`;
      const response = await fetch(
        `http://192.168.5.61:3001/api/schedules${queryParams}`
      );
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);
      const data = await response.json();
      setShiftData(data);
    } catch (error) {
      console.error("Error fetching shift data:", error.message);
    }
  };

  const handleSelect = (selected) => {
    setSelectedUser(selected);
  };

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    const newSelectedDates = { ...selectedDates };
    const newMarkedDates = { ...markedDates };

    if (newSelectedDates[dateString]) {
      delete newSelectedDates[dateString];
      delete newMarkedDates[dateString];
    } else {
      newSelectedDates[dateString] = { selected: true };
      newMarkedDates[dateString] = {
        selected: true,
        selectedColor: "#c82f2f",
        marked: true,
        dotColor: "#c82f2f",
      };
    }
      
    setSelectedDates(newSelectedDates);
    setMarkedDates(newMarkedDates);
  };

  const groupShiftsByDate = (shifts) => {
    return shifts.reduce((acc, shift) => {
      const date = shift.date ? moment(shift.date).format("YYYY-MM-DD") : null;
      if (date) {
        if (!acc[date]) acc[date] = [];
        acc[date].push(shift);
      }
      return acc;
    }, {});
  };

  const groupedShiftData = groupShiftsByDate(shiftData);

  const renderShifts = (date) => {
    if (selectedUser) {
      const userShifts = groupedShiftData[date]?.filter(
        (shift) => shift.user_id === selectedUser.key
      );
      if (userShifts && userShifts.length > 0) {
        return userShifts.map((shift, index) => (
          <ShiftCard
            key={index}
            shiftName={shift.shift_name}
            startTime={shift.start_time}
            endTime={shift.end_time}
            assignedUsers={shift.user_name}
          />
        ));
      }
      return (
        <Text style={styles.noShiftsText}>No shifts available: On leave</Text>
      );
    }
    if (groupedShiftData[date]?.length > 0) {
      return groupedShiftData[date].map((shift, index) => (
        <ShiftCard
          key={index}
          shiftName={shift.shift_name}
          startTime={shift.start_time}
          endTime={shift.end_time}
          assignedUsers={shift.user_name}
        />
      ));
    }
    return <Text style={styles.noShiftsText}>No shifts available</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropdownComponent data={users} onSelect={handleSelect} />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 0 && styles.selectedTab]}
          onPress={() => setSelectedTab(0)}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 0 && styles.selectedTabText,
            ]}
          >
            Shifts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 1 && styles.selectedTab]}
          onPress={() => setSelectedTab(1)}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 1 && styles.selectedTabText,
            ]}
          >
            Leave
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Calendar
          style={styles.calendar}
          enableSwipeMonths={true}
          hideExtraDays={true}
          markingType="dot"
          markedDates={markedDates}
          onDayPress={handleDayPress}
          theme={{
            selectedDayBackgroundColor: '#c82f2f',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#c82f2f',
            dotColor: '#c82f2f',
            arrowColor: "#c82f2f",
            monthTextColor: "#c82f2f",
            textMonthFontWeight: "bold",
            // Add these lines to make the arrows red
            arrowColor: '#c82f2f',
            'stylesheet.calendar.header': {
              arrow: {
                padding: 10,
              },
            },
          }}
        />
        {Object.keys(selectedDates).map((date) => (
          <View key={date} style={styles.dateContainer}>
            <Text style={styles.dateHeader}>{moment(date).format("LL")}:</Text>
            {renderShifts(date)}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingTop: 10,
  },
  tabContainer: {
    width: width * 0.9,
    height: 60,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedTab: {
    backgroundColor: "rgba(200, 47, 47, 0.8)",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  selectedTabText: {
    color: "white",
  },
  calendar: {
    width: width * 0.9,
    maxWidth: 350,
    borderRadius: 15,
  },
  dateContainer: {
    width: "100%",
    padding: 20,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noShiftsText: {
    fontSize: 16,
    color: "gray",
  },
});

export default UserScheduleScreen;