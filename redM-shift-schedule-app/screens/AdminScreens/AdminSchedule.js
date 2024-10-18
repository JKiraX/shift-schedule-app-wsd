import React, { useState, useEffect } from "react";
import { SERVER_URL_APP } from '@env';

import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import ShiftCardChange from "../../components/Cards/ShiftCardChange";
import DropdownComponent4 from "../../components/Dropdown/dropdownComponent4";
import moment from "moment";

const { width, height } = Dimensions.get("window");
const AdminScheduleScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [shiftData, setShiftData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState([]);
 

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedDates).length > 0) {
      fetchShiftDataForMultipleDates(Object.keys(selectedDates));
    } else {
      setShiftData({});
    }
  }, [selectedDates, selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${SERVER_URL_APP}/users`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${response.status}, ${errorText}`);
      }
      const responseData = await response.json();

      if (responseData.success && Array.isArray(responseData.data)) {
        setUsers(responseData.data.map((user) => ({
          key: user.user_id,
          value: `${user.first_name} ${user.last_name}`,
        })));
      } else {
        setUsers([]);
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching user data");
    }
  };

  const fetchShiftDataForMultipleDates = async (dates) => {
    setIsLoading(true);
    const newShiftData = {};

    for (const date of dates) {
      try {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        let url = `${SERVER_URL_APP}/schedules?date=${formattedDate}`;
        
        if (selectedUser) {
          const selectedUserObject = users.find((user) => user.value === selectedUser);
          if (selectedUserObject) {
            url += `&userId=${selectedUserObject.key}`;
          }
        }

        const response = await fetch(url);

        if (response.ok) {
          const responseData = await response.json();

          if (responseData.success && Array.isArray(responseData.data)) {
            const groupedShifts = groupShiftsByShiftName(responseData.data);
            newShiftData[formattedDate] = Object.values(groupedShifts);
          } else {
            newShiftData[formattedDate] = [];
          }
        } else {
          newShiftData[formattedDate] = [];
        }
      } catch (error) {
        newShiftData[date] = [];
      }
    }

    setShiftData(newShiftData);
    setIsLoading(false);
  };

  const groupShiftsByShiftName = (shifts) => {
    if (!Array.isArray(shifts)) {
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

  const handleSelect = (selected) => {
    setSelectedUser(selected);
    if (Object.keys(selectedDates).length > 0) {
      fetchShiftDataForMultipleDates(Object.keys(selectedDates));
    }
  };

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    const newSelectedDates = { ...selectedDates };
    const newMarkedDates = { ...markedDates };
    const newShiftData = { ...shiftData };

    if (newSelectedDates[dateString]) {
      delete newSelectedDates[dateString];
      delete newMarkedDates[dateString];
      delete newShiftData[dateString];  
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
    setShiftData(newShiftData);
  };

  const renderShifts = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#c82f2f" />;
    } 
    
    if (Object.keys(selectedDates).length === 0){
      return <Text style={styles.noShiftsText}>No dates selected. Please select a date to view shifts.</Text>;
    }

    const handleSwitchSuccess = (date) => {
      fetchShiftDataForMultipleDates([date]);
    };

    const formatTime = (time) => {
      return moment(time, "HH:mm:ss").format("HH:mm");
    };
  
    return Object.entries(selectedDates).map(([date, _]) => (
      <View key={date} style={styles.dateContainer}>
        <Text style={styles.dateHeader}>{moment(date).format("LL")}:</Text>
        {shiftData[date] && shiftData[date].length > 0 ? (
          shiftData[date].map((shift, index) => {
          
            return (
              <ShiftCardChange
                key={`${date}-${index}`}
                shiftName={shift.shift_name}
                startTime={formatTime(shift.start_time)} 
                endTime={formatTime(shift.end_time)} 
                assignedUsers={
                  Array.isArray(shift.assigned_users)
                    ? shift.assigned_users.flat()
                    : []
                }
                workDate={date}
                shiftId={shift.shift_id} 
                onSwitchSuccess={() => handleSwitchSuccess(date)}
                allUsers={users}
              />
            );
          })
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
      <DropdownComponent4 data={users} onSelect={handleSelect} value={selectedUser}/>
      
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

export default AdminScheduleScreen;