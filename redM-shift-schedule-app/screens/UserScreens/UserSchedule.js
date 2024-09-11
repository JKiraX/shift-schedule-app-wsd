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
import ShiftCard from "../../components/Cards/ShiftCard";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import moment from "moment";

const { width } = Dimensions.get("window");

const UserScheduleScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [shiftData, setShiftData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedDates).length > 0) {
      fetchShiftDataForMultipleDates(Object.keys(selectedDates));
    }
  }, [selectedDates, selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://192.168.5.22:3001/users`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status}, ${errorText}`);
      }
      const responseData = await response.json();

      if (responseData.success && Array.isArray(responseData.data)) {
        setUsers(responseData.data.map((user) => ({
          key: user.user_id.toString(),
          value: `${user.first_name} ${user.last_name}`
        })));
      } else {
        console.error("Received data is not in the expected format:", responseData);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const groupShiftsByShiftName = (shifts) => {
    if (!Array.isArray(shifts)) {
      console.error("Shifts is not an array:", shifts);
      return {};
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

  const fetchShiftDataForMultipleDates = async (dates) => {
    setIsLoading(true);
    const newShiftData = {};

    for (const date of dates) {
      try {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        let url = `http://192.168.5.22:3001/schedules?date=${formattedDate}`;
        
        if (selectedUser) {
          const selectedUserObject = users.find(user => user.value === selectedUser);
          if (selectedUserObject) {
            url += `&userId=${selectedUserObject.key}`;
          }
        }

        console.log("Fetching data from URL:", url);

        const response = await fetch(url);

        if (response.ok) {
          const responseData = await response.json();

          if (responseData.success && Array.isArray(responseData.data)) {
            const groupedShifts = groupShiftsByShiftName(responseData.data);
            newShiftData[formattedDate] = Object.values(groupedShifts);
          } else {
            console.error(
              "Unexpected data format for date",
              formattedDate,
              ":",
              responseData
            );
            newShiftData[formattedDate] = [];
          }
        } else {
          const errorText = await response.text();
          console.error(
            "Error fetching shift data for date",
            formattedDate,
            ":",
            response.status,
            errorText
          );
          newShiftData[formattedDate] = [];
        }
      } catch (error) {
        console.error("Error fetching shift data for date", date, ":", error);
        newShiftData[date] = [];
      }
    }

    setShiftData(newShiftData);
    setIsLoading(false);
  };

  const handleSelect = (selected) => {
    console.log("Selected user:", selected);
    setSelectedUser(selected);
    if (Object.keys(selectedDates).length > 0) {
      fetchShiftDataForMultipleDates(Object.keys(selectedDates));
    }
  };

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    const newSelectedDates = { ...selectedDates };
    const newMarkedDates = { ...markedDates };

    if (newSelectedDates[dateString]) {
      delete newSelectedDates[dateString];
      delete newMarkedDates[dateString];
    } else {
      newSelectedDates[dateString] = true;
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

  const renderShifts = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#c82f2f" />;
    }

    const formatTime = (time) => {
      return moment(time, "HH:mm:ss").format("HH:mm");
    };

    return Object.entries(selectedDates).map(([date, _]) => (
      <View key={date} style={styles.dateContainer}>
        <Text style={styles.dateHeader}>{moment(date).format("LL")}:</Text>
        {shiftData[date] && shiftData[date].length > 0 ? (
          shiftData[date].map((shift, index) => (
            <ShiftCard
              key={`${date}-${index}`}
              shiftName={shift.shift_name}
              startTime={formatTime(shift.start_time)} 
                endTime={formatTime(shift.end_time)} 
              assignedUsers={
                Array.isArray(shift.assigned_users)
                  ? shift.assigned_users.flat()
                  : []
              }
            />
          ))
        ) : (
          <Text style={styles.noShiftsText}>
            No shifts available for this date.
          </Text>
        )}
      </View>
    ));
  };


  return (
    <SafeAreaView style={styles.container}>
      <DropdownComponent data={users} onSelect={handleSelect} />
      
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
            "stylesheet.calendar.header": {
              arrow: {
                padding: 10,
              },
            },
          }}
        />
        {renderShifts()}
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