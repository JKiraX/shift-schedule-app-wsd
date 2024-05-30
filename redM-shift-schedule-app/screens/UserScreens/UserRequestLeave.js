import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import SmallButton from "../../components/Buttons/smallButton";

export default function UserRequestLeaveScreen({ navigation }) {
  // Date range picker
  const DateRangePicker = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [markedDates, setMarkedDates] = useState({});
    const [justification, setJustification] = useState("");

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

    const handleTextChange = (input) => {
      setJustification(input);
      console.log(input);
    };

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}>
            <Text
              style={{
                color: "#3D5A80",
                fontWeight: "bold",
                fontSize: 22,
                paddingTop: 10,
                paddingBottom: 10,
                textAlign: "left",
              }}
            >
              Select Day(s) off:
            </Text>
            <Calendar
              style={{ width: 350, borderRadius: 15 }}
              enableSwipeMonths={true}
              hideExtraDays={true}
              markingType="period"
              markedDates={markedDates}
              onDayPress={handleDayPress}
            />
            <Text
              style={{
                color: "#3D5A80",
                fontWeight: "bold",
                fontSize: 22,
                paddingTop: 10,
                paddingBottom: 10,
                textAlign: "left",
              }}
            >
              Justification:
            </Text>
            <TextInput
              style={{
                height: 100,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                textAlignVertical: "top",
                minWidth: 350,
                borderRadius: 15,
                borderColor: "#3D5A80",
                backgroundColor: "white",
              }}
              multiline
              numberOfLines={5}
              maxLength={100}
              onChangeText={handleTextChange}
              value={justification}
              placeholder="Type here..."
            />
            <SmallButton text="Submit" onPress={() => console.log("Submit")} />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  };

  return <DateRangePicker />;
}
