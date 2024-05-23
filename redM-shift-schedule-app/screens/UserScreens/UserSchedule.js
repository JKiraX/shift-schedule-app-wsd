import React, { useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";

export default function UserScheduleScreen({ navigation }) {
  //data for the DropdownComponent
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

  //Date range picker
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
        {/* dropdown */}
        <DropdownComponent data={data} onSelect={handleSelect} />
        {/* switch and shift buttons */}
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
            </View>
          </ScrollView>
        ) : (
          // Leave Page
          <ScrollView>
            <View
              style={{ flex: 1, alignItems: "center", paddingTop: 10 }}
            ></View>
            <Calendar
              style={{ width: 350, borderRadius: 15 }}
              enableSwipeMonths={true}
              hideExtraDays={true}
              markingType="period"
              markedDates={markedDates}
              onDayPress={handleDayPress}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    );
  };

  return <DateRangePicker />;
}
