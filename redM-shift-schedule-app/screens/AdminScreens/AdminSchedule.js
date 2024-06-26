import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import ShiftCardChange from "../../components/Cards/ShiftCardChange";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import moment from "moment";

const AdminScheduleScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [shiftData, setShiftData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const calendarRef = useRef(null);

  const handleCalendarRef = (calendar) => {
    calendarRef.current = calendar;
  };

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
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      const userData = data.map((user) => ({
        key: Number(user.id),
        value: user.name,
      }));
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const fetchShiftData = async () => {
    try {
      const dates = Object.keys(selectedDates).join(",");
      const userId = selectedUser ? selectedUser.key : null;
      const queryParams = `?dates=${dates}${userId ? `&userId=${userId}` : ""}`;
      console.log(`Requesting data for dates: ${dates} and user: ${userId}`);

      const response = await fetch(
        `http://192.168.5.61:3001/api/schedules${queryParams}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      setShiftData(data);
    } catch (error) {
      console.error("Error fetching shift data:", error.message);
    }
  };

  const handleSelect = (selected) => {
    console.log("User selected:", selected); // Debugging statement
    setSelectedUser(selected);
    setShiftData([]); // Clear shift data when a new user is selected
  };

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    const newSelectedDates = { ...selectedDates };

    if (newSelectedDates[dateString]) {
      delete newSelectedDates[dateString];
    } else {
      newSelectedDates[dateString] = {
        selected: true,
        marked: true,
        dotColor: "#c82f2f",
      };
    }

    setSelectedDates(newSelectedDates);
    setMarkedDates(newSelectedDates);
  };

  const groupShiftsByDate = (shifts) => {
    return shifts.reduce((acc, shift) => {
      const date = shift.date ? moment(shift.date).format("YYYY-MM-DD") : null;
      if (date) {
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(shift);
      }
      return acc;
    }, {});
  };

  const groupedShiftData = groupShiftsByDate(shiftData);

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}
    >
      <DropdownComponent data={users} onSelect={handleSelect} />
      <View
        style={{
          width: 350,
          height: 60,
          backgroundColor: "white",
          borderWidth: 0.5,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 5,
          paddingRight: 5,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            width: "45%",
            height: 50,
            backgroundColor:
              selectedTab === 0 ? "rgba(200, 47, 47,0.8)" : "white",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setSelectedTab(0)}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: selectedTab === 0 ? "white" : "black",
            }}
          >
            Shifts
          </Text>
        </TouchableOpacity>
        <View style={{ width: "10%" }} />
        <TouchableOpacity
          style={{
            width: "45%",
            height: 50,
            backgroundColor:
              selectedTab === 1 ? "rgba(200, 47, 47,0.8)" : "white",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setSelectedTab(1)}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: selectedTab === 0 ? "black" : "white",
            }}
          >
            Leave
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={{ flex: 1, alignItems: "center", paddingTop: 10 }}>
          <Calendar
            style={{ width: 350, borderRadius: 15 }}
            enableSwipeMonths={true}
            hideExtraDays={true}
            markingType="multi-dot"
            markedDates={markedDates}
            onDayPress={handleDayPress}
          />
          {Object.keys(selectedDates).map((date) => (
            <View key={date} style={{ width: "100%", padding: 20, }}>
              <Text style={styles.dateHeader}>
                {moment(date).format("LL")}:
              </Text>
              {selectedUser ? (
                groupedShiftData[date] &&
                groupedShiftData[date].some(
                  (shift) => shift.user_id === selectedUser.key
                ) ? (
                  groupedShiftData[date]
                    .filter((shift) => shift.user_id === selectedUser.key)
                    .map((shift, index) => (
                      <ShiftCardChange
                        key={index}
                        shiftName={shift.shift_name}
                        startTime={shift.start_time}
                        endTime={shift.end_time}
                        assignedUsers={shift.user_name}
                        allUsers={users}
                      />
                    ))
                ) : (
                  <Text style={styles.noShiftsText}>
                    No shifts available: On leave
                  </Text>
                )
              ) : groupedShiftData[date]?.length > 0 ? (
                groupedShiftData[date].map((shift, index) => (
                  <ShiftCardChange
                    key={index}
                    shiftName={shift.shift_name}
                    startTime={shift.start_time}
                    endTime={shift.end_time}
                    assignedUsers={shift.user_name}
                    allUsers={users}
                  />
                ))
              ) : (
                <Text style={styles.noShiftsText}>No shifts available</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default AdminScheduleScreen;
