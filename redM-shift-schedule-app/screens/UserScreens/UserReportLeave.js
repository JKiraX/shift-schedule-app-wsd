import React, { useState } from "react";
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
  Pressable,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DropdownComponent2 from "../../components/Dropdown/dropdownComponent2";
import DropdownComponent3 from "../../components/Dropdown/dropdownComponent3";
import SmallButton from "../../components/Buttons/smallButton";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width } = Dimensions.get("window");
const UserRequestLeaveScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Overtime page functionality
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [overtime, setOvertime] = useState("");

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if (Platform.OS === "android") {
        toggleDatepicker();
        setOvertime(currentDate.toDateString());
      }
    } else {
      toggleDatepicker();
    }
  };

  const confirmIOSDate = () => {
    setOvertime(date.toDateString());
    toggleDatepicker();
  };
  const overtimeShifts = [
    { key: "1", value: "Shift 1" },
    { key: "2", value: "Shift 2" },
    { key: "3", value: "Shift 3" },
    { key: "4", value: "Shift 4" },
  ];
  const handleOvertimeShifts = (selected) => {
    // Handle overtime shifts selection
  };
  const overtimeHours = [
    { key: "1", value: "1 Hour" },
    { key: "2", value: "2 Hours" },
    { key: "3", value: "3 Hours" },
    { key: "4", value: "4 Hours" },
  ];
  const handleOvertimeHours = (selected) => {
    // Handle overtime hours selection
  };
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
    if (selectedTab === 1) {
      if (!leaveType || !startDate || !endDate || !justification) {
        Alert.alert("Error", "All fields are required.");
        return;
      }
      try {
        const userId = 1; // Assuming the user ID is known and set. Replace with actual user ID.
        const response = await fetch(
          `http://192.168.5.61:3001/api/report-leave`,
          {
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
          }
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
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
    } else {
      // Handle overtime submission (without API call)
      Alert.alert("Success", "Overtime request submitted.");
      setModalVisible(false);
    }
  };
  const handleModalCancel = () => {
    setModalVisible(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 0 && styles.activeTab]}
          onPress={() => setSelectedTab(0)}
        >
          <Text
            style={[styles.tabText, selectedTab === 0 && styles.activeTabText]}
          >
            Overtime
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 1 && styles.activeTab]}
          onPress={() => setSelectedTab(1)}
        >
          <Text
            style={[styles.tabText, selectedTab === 1 && styles.activeTabText]}
          >
            Leave
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          {selectedTab === 0 && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Overtime Form:</Text>
              <Text style={styles.label}>Which day did you work overtime?</Text>
              {showPicker && (
                <View>
                  {Platform.OS === "ios" ? (
                    <View>
                      <DateTimePicker
                        mode="date"
                        display="spinner"
                        value={date}
                        onChange={onChange}
                        style={styles.datePicker}
                        
                      />
                      <View style={styles.iosPickerButtonContainer}>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            styles.pickerButton,
                            { backgroundColor: "#11182711" },
                          ]}
                          onPress={confirmIOSDate}
                        >
                          <Text>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            styles.pickerButton,
                            { backgroundColor: "#11182711" },
                          ]}
                          onPress={toggleDatepicker}
                        >
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <DateTimePicker
                      mode="date"
                      display="spinner"
                      value={date}
                      onChange={onChange}
                      style={styles.datePicker}
                    />
                  )}
                </View>
              )}

              {!showPicker && (
                <Pressable onPress={toggleDatepicker}>
                  <TextInput
                    placeholder="Select date"
                    style={styles.textInput2}
                    value={overtime}
                    editable={false}
                    onPressIn={toggleDatepicker}
                  />
                </Pressable>
              )}
              <Text style={styles.label}>Which shift did you work?</Text>
              <DropdownComponent3
                data={overtimeShifts}
                onSelect={handleOvertimeShifts}
              />
              <Text style={styles.label}>
                How many hours did you work overtime?
              </Text>
              <DropdownComponent3
                data={overtimeHours}
                onSelect={handleOvertimeHours}
              />
              <View style={styles.submitButtonContainer}>
                <SmallButton text="Submit" onPress={handleModal} />
              </View>
            </View>
          )}
          {selectedTab === 1 && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Select Day(s) off:</Text>
              <Calendar
                style={styles.calendar}
                enableSwipeMonths={true}
                hideExtraDays={true}
                markingType="period"
                markedDates={markedDates}
                onDayPress={handleDayPress}
                theme={{
                  selectedDayBackgroundColor: '#c82f2f',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#c82f2f',
                  dotColor: '#c82f2f',
                  arrowColor: "#c82f2f",
                  monthTextColor: "#c82f2f",
                  textMonthFontWeight: "bold",
                  arrowColor: '#c82f2f',
                  'stylesheet.calendar.header': {
                    arrow: {
                      padding: 10,
              },
            },
          }}
              />
              <Text style={styles.sectionTitle}>Type of Leave:</Text>
              <DropdownComponent2
                data={leaveTypes}
                onSelect={handleSelectLeaveType}
              />
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
              <View style={styles.submitButtonContainer}>
                <SmallButton text="Submit" onPress={handleModal} />
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              All leave and overtime needs to be approved by a manager before
              reporting it on the app.
            </Text>
            <Text style={styles.modalText2}>
              Please confirm only if it has been approved.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalConfirm}
              >
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
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    width: width * 0.9,
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    flex:1,
    width: width * 0.9,
    alignItems: "center",

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
    width: width * 0.9,
    borderRadius: 15,
  },
  textInput: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
    width: width * 0.9,
    borderRadius: 10,
    borderColor: "#c82f2f",
    backgroundColor: "white",
  },
  textInput2: {
    height: 55,
    borderWidth: 1,
    padding: 10,
    width: width * 0.9,
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
    width: width * 0.9,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  modalText2: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
    paddingTop: 20,
  },
  modalButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "#c82f2f",
    borderRadius: 15,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    alignSelf: "flex-start",
    padding: 10,
  },
  input: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#e9ecef",
    width: "100%",
    fontSize: 17,
  },
  datePicker: {
    height: 120,
    marginTop: -10,
  },
  iosPickerButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
  },
  submitButtonContainer: {
    marginTop: 20, // Adjust this value to increase or decrease the space
  },
});
export default UserRequestLeaveScreen;
