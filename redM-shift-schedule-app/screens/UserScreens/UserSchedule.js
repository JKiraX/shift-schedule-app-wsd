import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [allUsers, setAllUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://192.168.5.22:3001/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        // Log the raw data for debugging
        console.log("Raw users data:", data);

        const formattedUsers = data.map((user) => ({
          key: user.user_id?.toString() ?? `unknown-${Math.random()}`,
          value: user.user_name ?? "Unknown User",
        }));
        setAllUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  
  useEffect(() => {
    if (Object.keys(selectedDates).length > 0 && allUsers.length > 0) {
      fetchShiftData();
    } else {
      setShiftData([]);
    }
  }, [selectedDates, selectedUser, allUsers]);


  // const fetchUsers = async () => {
  //   try {
  //     const response = await fetch(`http://10.0.0.113:3001/api/users`);
  //     if (!response.ok) {
  //       throw new Error(`Network response was not ok: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     const userData = data.map((user) => ({ key: user.id, value: user.name }));
  //     setUsers(userData);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error.message);
  //   }
  // };


  const fetchShiftData = async () => {
    try {
      const dates = Object.keys(selectedDates).join(",");
      const userId = selectedUser ? selectedUser.key : null;
      const queryParams = `?dates=${dates}${userId ? `&userId=${userId}` : ""}`;
      console.log(`Requesting data for dates: ${dates} and user: ${userId}`);
  
      const response = await fetch(
        `http://192.168.5.61:3001/api/schedules${queryParams}`
      );
      if (!response.ok)
        throw new Error(`Network response was not ok: ${response.status}`);
      const data = await response.json();
      console.log("Received shift data:", JSON.stringify(data, null, 2));
      setShiftData(data);
    } catch (error) {
      console.error("Error fetching shift data:", error.message);
    }
  };

  const handleSelect = (selected) => {
    setSelectedUser(selected);
    setShiftData([]);
    console.log("Selected user:", selected);
    const selectedUser = allUsers.find((user) => user.value === selected);
    setSelectedSwitchUser(selectedUser);
  };

  const handleDayPress = useCallback((day) => {
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
        dotColor: "#c82f2f"
      };
    }
  
    setSelectedDates(newSelectedDates);
    setMarkedDates(newSelectedDates);
  }, [selectedDates]);
  
  const groupShiftsByDate = useCallback((shifts) => {
    return shifts.reduce((acc, shift) => {
      const date = shift.date ? moment(shift.date).format("YYYY-MM-DD") : null;
      if (date) {
        if (!acc[date]) {
          acc[date] = [];
        }
        const shiftId = `${date}-${shift.user_id}-${shift.start_time}`;
        acc[date].push({ ...shift, shiftId });
      }
      return acc;
    }, {});
  }, []);

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
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}
    >
         <DropdownComponent
        data={allUsers}
        onSelect={(selected) => {
          console.log("Dropdown selected:", selected);
          handleSelect(selected);
        }}
      />
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
            <View key={date} style={{ width: "100%", padding: 20 }}>
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
                    .map((shift) => (
                      <ShiftCard
                        key={shift.shiftId}
                        shiftId={shift.shiftId}
                        shiftName={shift.shift_name}
                        startTime={shift.start_time}
                        endTime={shift.end_time}
                        assignedUsers={shift.user_name}
                        allUsers={allUsers}
                        // onSwitchComplete={handleSwitchComplete}
                      />
                    ))
                ) : (
                  <Text style={styles.noShiftsText}>
                    No shifts available: On leave
                  </Text>
                )
              ) : groupedShiftData[date]?.length > 0 ? (
                groupedShiftData[date].map((shift) => (
                  <ShiftCard
                    key={shift.shiftId}
                    shiftId={shift.shiftId}
                    shiftName={shift.shift_name}
                    startTime={shift.start_time}
                    endTime={shift.end_time}
                    assignedUsers={shift.user_name}
                    allUsers={allUsers}
                    // onSwitchComplete={handleSwitchComplete}
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
    maxWidth: 350,
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
