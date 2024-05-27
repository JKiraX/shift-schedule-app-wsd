// UserScheduleScreen.js

import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import ShiftCard from "../../components/Cards/ShiftCard";

const ShiftCardsContainer = () => {
  const [shiftData, setShiftData] = useState([]);

  useEffect(() => {
    fetchShiftData();
  }, []);

  const fetchShiftData = async () => {
    try {
      // Replace this with your actual database query logic
      const data = [
        {
          shiftName: '6am Shift',
          startTime: '06:00',
          endTime: '14:00',
          assignedUsers: ['User 1', 'User 2'],
        },
        {
          shiftName: '8am Shift',
          startTime: '08:00',
          endTime: '16:00',
          assignedUsers: ['User 3', 'User 4'],
        },
        {
          shiftName: '2pm Shift',
          startTime: '14:00',
          endTime: '22:00',
          assignedUsers: ['User 1', 'User 2'],
        },
        {
          shiftName: '10pm Shift',
          startTime: '22:00',
          endTime: '06:00',
          assignedUsers: ['User 1', 'User 2'],
        },
        // Add more shift data objects as needed
      ];

      setShiftData(data);
    } catch (error) {
      console.error('Error fetching shift data:', error);
    }
  };

  return (
    <ScrollView>
      <View style={{padding:20, minWidth:350}}>
        {shiftData.map((shift, index) => (
          <ShiftCard
            key={index}
            shiftName={shift.shiftName}
            startTime={shift.startTime}
            endTime={shift.endTime}
            assignedUsers={shift.assignedUsers}
          />
        ))}
      </View>
    </ScrollView>
  );
};
export default function UserScheduleScreen({ navigation }) {
  // Data for the DropdownComponent
  const data = [
    { key: "1", value: "Yusheen" },
    { key: "2", value: "Roxanne" },
    { key: "3", value: "Hope" },
    { key: "4", value: "Mpho" },
    { key: "5", value: "Charlotte" },
  ];

  const handleSelect = (selected) => {
    console.log(selected);
  };

  // Switch Button
  const [selectedTab, setSelectedTab] = useState(0);

  // Date range picker
  const DateRangePicker = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [markedDates, setMarkedDates] = useState({});

    const generateMarkedDates = (start, end) => {
      let dateRange = {};
      let currentDate = dayjs(start);
      const endDate = dayjs(end);

      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
        const dateString = currentDate.format("YYYY-MM-DD");
        if (dateString === start) {
          dateRange[dateString] = {
            startingDay: true,
            color: "#3D5A80",
            textColor: "white",
          };
        } else if (dateString === end) {
          dateRange[dateString] = {
            endingDay: true,
            color: "#3D5A80",
            textColor: "white",
          };
        } else {
          dateRange[dateString] = { color: "#3D5A80", textColor: "white" };
        }
        currentDate = currentDate.add(1, "day");
      }

      return dateRange;
    };

    const handleDayPress = (day) => {
      if (!startDate) {
        setStartDate(day.dateString);
        setEndDate(null);
        setMarkedDates({
          [day.dateString]: {
            startingDay: true,
            color: "#3D5A80",
            textColor: "white",
          },
        });
      } else if (day.dateString < startDate) {
        setStartDate(day.dateString);
        setEndDate(null);
        setMarkedDates({
          [day.dateString]: {
            startingDay: true,
            color: "#3D5A80",
            textColor: "white",
          },
        });
      } else {
        setEndDate(day.dateString);
        setMarkedDates(generateMarkedDates(startDate, day.dateString));
      }
    };

    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        {/* Dropdown */}
        <DropdownComponent data={data} onSelect={handleSelect} />
        {/* Switch and shift buttons */}
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
        {/* Switch between shift and leave calendar "pages" */}
        {selectedTab === 0 ? (
          // Shifts Page
          <ScrollView>
            <View style={{ flex: 1, alignItems: "center", paddingTop: 10 }}>
              <Calendar
                style={{ width: 350, borderRadius: 15 }}
                enableSwipeMonths={true}
                hideExtraDays={true}
                markingType="period"
                markedDates={markedDates}
                onDayPress={handleDayPress}
              />
              <ShiftCardsContainer/>
            </View>
          </ScrollView>
        ) : (
          // Leave Page
          <ScrollView>
            <View style={{ flex: 1, alignItems: "center", paddingTop: 10 }}>
              <Calendar
                style={{ width: 350, borderRadius: 15 }}
                enableSwipeMonths={true}
                hideExtraDays={true}
                markingType="period"
                markedDates={markedDates}
                onDayPress={handleDayPress}
              />
              <ShiftCardsContainer/>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  };

  return <DateRangePicker />;
}
