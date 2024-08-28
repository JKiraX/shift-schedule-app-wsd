import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import ShiftCard from "../../components/Cards/ShiftCardChange";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import moment from "moment";

const { width } = Dimensions.get("window");

const UserScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState({});
  const [shiftData, setShiftData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchShiftData(selectedDate);
    }
  }, [selectedDate, selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://192.168.5.22:3001/api/users`);
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);
      const data = await response.json();
      setUsers(data.map((user) => ({ key: user.id, value: user.name })));
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const groupShiftsByShiftName = (shifts) => {
    if (!Array.isArray(shifts)) {
      console.error("Shifts is not an array:", shifts);
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
      const userIdParam = selectedUser ? `&userId=${selectedUser.key}` : "";
      const url = `http://192.168.5.22:3001/schedules?date=${formattedDate}${userIdParam}`;

      console.log("Fetching data from:", url);

      const response = await fetch(url);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Raw data from API:", responseData);

        if (responseData.success && Array.isArray(responseData.data)) {
          const groupedShifts = groupShiftsByShiftName(responseData.data);
          console.log("Grouped shifts:", groupedShifts);
          setShiftData(Object.values(groupedShifts));
        } else {
          console.error("Unexpected data format:", responseData);
          setShiftData([]);
        }
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
  const handleSelect = (selected) => {
    setSelectedUser(selected);
  };

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);

    setMarkedDates({
      [dateString]: {
        selected: true,
        selectedColor: "#c82f2f",
        marked: true,
        dotColor: "#c82f2f",
      },
    });
  };

  const renderShifts = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    if (shiftData.length === 0) {
      return (
        <Text style={styles.noShiftsText}>
          No shifts available for this date.
        </Text>
      );
    }
    return shiftData.map((shift, index) => (
      <ShiftCard
        key={index}
        shiftName={shift.shift_name}
        startTime={shift.start_time}
        endTime={shift.end_time}
        assignedUsers={shift.assigned_users}
      />
    ));
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
            selectedDayBackgroundColor: "#c82f2f",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#c82f2f",
            dotColor: "#c82f2f",
            arrowColor: "#c82f2f",
            monthTextColor: "#c82f2f",
            textMonthFontWeight: "bold",
            arrowColor: "#c82f2f",
            "stylesheet.calendar.header": {
              arrow: {
                padding: 10,
              },
            },
          }}
        />
        <View style={styles.dateContainer}>
          {selectedDate && (
            <Text style={styles.dateHeader}>
              {moment(selectedDate).format("LL")}:
            </Text>
          )}
          {renderShifts()}
        </View>
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
