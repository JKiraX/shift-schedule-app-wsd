import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DropdownComponent2 from "../../components/Dropdown/dropdownComponent2";
import SmallButton from "../../components/Buttons/smallButton";
import dayjs from "dayjs";

const UserRequestLeaveScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Leave functionality state variables
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [justification, setJustification] = useState("");
  const [leaveType, setLeaveType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const leaveTypes = [
    { key: "1", value: "Sick Leave" },
    { key: "2", value: "Annual Leave" },
    { key: "3", value: "Family Responsibility Leave" },
    { key: "4", value: "Study Leave" },
  ];

  const handleDayPress = (day) => {
    if (selectedTab === 1) {
      // Leave view
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
    }
  };

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
      const response = await fetch(`http://192.168.5.61:3001/api/report-leave`, {
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
    <SafeAreaView style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 0 && styles.activeTab]}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}>Overtime</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 1 && styles.activeTab]}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}>Leave</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {selectedTab === 1 && (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={styles.sectionTitle}>Select Day(s) off:</Text>
              <Calendar
                style={styles.calendar}
                enableSwipeMonths={true}
                hideExtraDays={true}
                markingType="period"
                markedDates={markedDates}
                onDayPress={handleDayPress}
              />
              <Text style={styles.sectionTitle}>Type of Leave:</Text>
              <DropdownComponent2 data={leaveTypes} onSelect={handleSelectLeaveType} />
              <Text style={styles.sectionTitle}>Justification:</Text>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={5}
                maxLength={100}
                onChangeText={handleTextChange}
                value={justification}
                placeholder="Type here..."
              />
              <SmallButton text="Submit" onPress={handleModal} />
            </View>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              You are confirming that you were unavailable for the selected dates.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleModalCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleModalConfirm}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: "grey",
  },
  tabContainer: {
    width: 350,
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
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  activeTab: {
    backgroundColor: "rgba(200, 47, 47, 0.8)",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  activeTabText: {
    color: "white",
  },
  sectionTitle: {
    color: "#c82f2f",
    fontWeight: "bold",
    fontSize: 22,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "left",
  },
  calendar: {
    width: 350,
    borderRadius: 15,
  },
  textInput: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
    minWidth: 350,
    borderRadius: 15,
    borderColor: "#c82f2f",
    backgroundColor: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 15,
    width: 365,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
    paddingTop: 20,
  },
  modalButton: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    backgroundColor: "#c82f2f",
    borderRadius: 15,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserRequestLeaveScreen;