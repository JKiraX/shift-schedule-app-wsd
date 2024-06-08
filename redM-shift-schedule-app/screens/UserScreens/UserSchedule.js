import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import ShiftCard from "../../components/Cards/ShiftCard";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import moment from "moment";

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
    if (Object.keys(selectedDates).length > 0 && selectedUser) {
      fetchShiftData();
    } else {
      setShiftData([]);
    }
  }, [selectedDates, selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://192.168.5.22:3001/api/users`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      const userData = data.map(user => ({ key: user.id, value: user.name }));
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };
  const fetchShiftData = async () => {
    try {
      const dates = Object.keys(selectedDates).join(",");
      const queryParams = `?dates=${dates}`;
      console.log(`Requesting data for dates: ${dates}`);
  
      const response = await fetch(`http://192.168.5.22:3001/api/schedules${queryParams}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();
      const filteredData = selectedUser
        ? data.filter((shift) => shift.user_id === selectedUser.key)
        : data;
      setShiftData(filteredData);
    } catch (error) {
      console.error("Error fetching shift data:", error.message);
    }
  };

  const handleSelect = (selected) => {
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
        dotColor: "#3D5A80",
      };
    }

    setSelectedDates(newSelectedDates);
    setMarkedDates(newSelectedDates);
  };

  const groupShiftsByDate = (shifts) => {
    return shifts.reduce((acc, shift) => {
      const date = shift.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(shift);
      return acc;
    }, {});
  };

  const groupedShiftData = groupShiftsByDate(shiftData);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
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
            backgroundColor: selectedTab === 0 ? "#98C1D9" : "white",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Shifts</Text>
        </TouchableOpacity>
        <View style={{ width: "10%" }} />
        <TouchableOpacity
          style={{
            width: "45%",
            height: 50,
            backgroundColor: selectedTab === 1 ? "#98C1D9" : "white",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Leave</Text>
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
    {Object.keys(selectedDates).length > 0 ? (
      selectedUser ? (
        Object.keys(groupedShiftData).map((date) => (
          <View key={date} style={{ width: "100%", padding: 20 }}>
            <Text style={styles.dateHeader}>{moment(date).format('LL')}:</Text>
            {groupedShiftData[date].map((shift, index) => (
              <ShiftCard
                key={index}
                shiftName={shift.shift_name}
                startTime={shift.start_time}
                endTime={shift.end_time}
                assignedUsers={shift.user_name}
              />
            ))}
          </View>
        ))
      ) : (
        Object.keys(selectedDates).map((date) => (
          <View key={date} style={{ width: "100%", padding: 20 }}>
            <Text style={styles.dateHeader}>{moment(date).format('LL')}:</Text>
            <Text style={styles.noShiftsText}>Select a user to view their shifts</Text>
          </View>
        ))
      )
    ) : (
      <Text style={styles.noShiftsText}>Select dates to view shifts</Text>
    )}
  </View>
</ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noShiftsText: {
    fontSize: 16,
    color: "gray",
  },
});

export default UserScheduleScreen;
