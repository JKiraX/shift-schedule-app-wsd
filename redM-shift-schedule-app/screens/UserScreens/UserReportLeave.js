import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import SmallButton from "../../components/Buttons/smallButton";
import DropdownComponent2 from "../../components/Dropdown/dropdownComponent2";

export default function UserRequestLeaveScreen({ navigation }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [justification, setJustification] = useState("");
  const [leaveType, setLeaveType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const leaveTypes = [
    { key: "1", value: "Sick Leave" },
    { key: "2", value: "Annual Leave" },
    { key: "3", value: "Family Responsibility Leave" },
    { key: "4", value: "Study Leave" },
  ];

  const generateMarkedDates = (start, end) => {
    let dateRange = {};
    let currentDate = dayjs(start);
    const endDate = dayjs(end);
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      const dateString = currentDate.format("YYYY-MM-DD");
      if (dateString === start) {
        dateRange[dateString] = {
          startingDay: true,
          color: "#c82f2f",
          textColor: "white",
        };
      } else if (dateString === end) {
        dateRange[dateString] = {
          endingDay: true,
          color: "#c82f2f",
          textColor: "white",
        };
      } else {
        dateRange[dateString] = { color: "#c82f2f", textColor: "white" };
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
          color: "#c82f2f",
          textColor: "white",
        },
      });
    } else if (day.dateString < startDate) {
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: {
          startingDay: true,
          color: "#c82f2f",
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
  };

  const handleSelectLeaveType = (selected) => {
    setLeaveType(selected);
  };

  const handleModal = () => {
    setModalVisible(true);
  };

  const handleModalConfirm = async () => {
    if (!leaveType || !startDate || !endDate || !justification) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const userId = 1; // Assuming the user ID is known and set. Replace with actual user ID.
      const response = await fetch(`http://192.168.5.22:3001/api/report-leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          type_of_leave: leaveType.value,
          justification,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      Alert.alert("Success", "Leave reported successfully.");
      setModalVisible(false);
      // Reset the form
      setStartDate(null);
      setEndDate(null);
      setMarkedDates({});
      setJustification("");
      setLeaveType(null);
    } catch (error) {
      console.error("Error reporting leave:", error.message);
      Alert.alert("Error", "Failed to report leave.");
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <SafeAreaView style={{ flex: 1,backgroundColor:"white" }}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
        >
          <Text
            style={{
              color: "#c82f2f",
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
              color: "#c82f2f",
              fontWeight: "bold",
              fontSize: 22,
              paddingTop: 10,
              paddingBottom: 10,
              textAlign: "left",
            }}
          >
            Type of Leave:
          </Text>
          <DropdownComponent2
            data={leaveTypes}
            onSelect={handleSelectLeaveType}
          />
          <Text
            style={{
              color: "#c82f2f",
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
              borderColor: "#c82f2f",
              backgroundColor: "white",
            }}
            multiline
            numberOfLines={5}
            maxLength={100}
            onChangeText={handleTextChange}
            value={justification}
            placeholder="Type here..."
          />
          <SmallButton text="Submit" onPress={handleModal} />
        </ScrollView>
      </SafeAreaView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#f2f2f2",
              padding: 20,
              borderRadius: 15,
              width: 365,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              You are confirming that you were unavailable for the selected
              dates.
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                borderRadius: 15,
                paddingTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  paddingHorizontal: 50,
                  paddingVertical: 15,
                  backgroundColor: "#c82f2f",
                  borderRadius: 15,
                  marginHorizontal: 10,
                }}
                onPress={handleModalCancel}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 50,
                  paddingVertical: 15,
                  backgroundColor: "#c82f2f",
                  borderRadius: 15,
                  marginHorizontal: 10,
                }}
                onPress={handleModalConfirm}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
