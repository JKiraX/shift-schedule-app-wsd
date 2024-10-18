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
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DropdownComponent2 from "../../components/Dropdown/dropdownComponent2";
import DropdownComponent3 from "../../components/Dropdown/dropdownComponent3";
import SmallButton from "../../components/Buttons/smallButton";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import { format, addMinutes } from "date-fns";

const { width } = Dimensions.get("window");

const UserRequestLeaveScreen = () => {
  const [userId, setUserId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [overtimeHours, setOvertimeHours] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [shift, setShifts] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [overtime, setOvertime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getUserId();
    fetchShifts();
  }, []);

  const getUserId = async () => {
    try {
      const storedUserId = await SecureStore.getItemAsync("userId");
      if (storedUserId) {
        setUserId(parseInt(storedUserId, 10));
      } else {
        Alert.alert("Error", "User not logged in. Please log in and try again.");
      }
    } catch {
      Alert.alert("Error", "Failed to retrieve user ID. Please try again.");
    }
  };

  const fetchShifts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://192.168.5.22:3001/api/shifts");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        const formattedShifts = data.data.map((shift) => ({
          key: shift.shift_id.toString(),
          value: shift.shift_name,
        }));
        setShifts(formattedShifts);
      } else {
        throw new Error(data.error || "Failed to fetch shifts");
      }
    } catch {
      Alert.alert("Error", "Failed to fetch shifts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShiftSelect = (selected) => {
    setSelectedShift(selected);
  };

  const handleOvertimeHours = (selected) => {
    setOvertimeHours(parseInt(selected.value, 10));
  };

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

  const handleSubmit = async () => {
    if (!userId || !selectedShift || overtimeHours === null) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const formattedDate = format(date, "yyyy-MM-dd");

      const requestBody = {
        userId: userId,
        shiftId: parseInt(selectedShift.key, 10),
        workDate: formattedDate,
        overtimeHours: overtimeHours,
      };

      const response = await fetch(
        "http://192.168.5.22:3001/api/update-overtime",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", "Overtime hours logged successfully.");
        setDate(new Date());
        setSelectedShift(null);
        setOvertimeHours(null);
      } else {
        setErrorMessage(result.error || "Failed to update overtime");
      }
    } catch {
      setErrorMessage("Failed to log overtime. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const overtimeOptions = [
    { key: "1", value: 1 },
    { key: "2", value: 2 },
    { key: "3", value: 3 },
    { key: "4", value: 4 },
  ];

  
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
      const selectedDate = day.dateString;

      if (!startDate || (startDate && endDate)) {
      
        setStartDate(selectedDate);
        setEndDate(null);
        setMarkedDates({
          [selectedDate]: {
            startingDay: true,
            endingDay: true,
            color: "#c82f2f",
            textColor: "white",
          },
        });
      } else if (startDate && !endDate) {
  
        if (selectedDate < startDate) {
    
          setStartDate(selectedDate);
          setEndDate(null);
          setMarkedDates({
            [selectedDate]: {
              startingDay: true,
              endingDay: true,
              color: "#c82f2f",
              textColor: "white",
            },
          });
        } else {
       
          setEndDate(selectedDate);
          setMarkedDates(generateMarkedDates(startDate, selectedDate));
        }
      }
    }
  };

  const generateMarkedDates = (start, end) => {
    let dateRange = {};
    let currentDate = dayjs(start);
    const endDate = dayjs(end);

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
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

    if (start === end) {
      dateRange[start] = {
        startingDay: true,
        endingDay: true,
        color: "#c82f2f",
        textColor: "white",
      };
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
    if (selectedTab === 0) {

      await handleSubmit();
    } else if (selectedTab === 1) {

      if (!leaveType || !startDate || !justification) {
        Alert.alert(
          "Error",
          "Please fill in all required fields: Leave Type, Date, and Justification."
        );
        return;
      }
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in and try again.");
        return;
      }
      setIsLoading(true);
      try {
        
        const now = new Date();
        const saTime = addMinutes(now, now.getTimezoneOffset() + 120);
        const formattedReportedAt = format(saTime, "yyyy-MM-dd'T'HH:mm:ss");

        const response = await fetch(
          `http://192.168.5.22:3001/api/report-leave`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              type_of_leave: leaveType.value,
              justification,
              start_date: startDate,
              end_date: endDate || startDate,
              reported_at: formattedReportedAt,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const result = await response.json();
        Alert.alert("Success", "Leave reported successfully.");
        resetForm();
      } catch (error) {
     
        Alert.alert("Error", "Failed to report leave. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const resetForm = () => {
    setStartDate(null);
    setEndDate(null);
    setMarkedDates({});
    setJustification("");
    setLeaveType(null);
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

              <DropdownComponent3 data={shift} onSelect={handleShiftSelect} />

              <Text style={styles.label}>
                How many hours did you work overtime?
              </Text>
              <DropdownComponent3
                data={overtimeOptions}
                onSelect={handleOvertimeHours}
              />

              {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              ) : null}

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
                  selectedDayBackgroundColor: "#c82f2f",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#c82f2f",
                  dotColor: "#c82f2f",
                  arrowColor: "#c82f2f",
                  monthTextColor: "#c82f2f",
                  textMonthFontWeight: "bold",
                  arrowColor: "#c82f2f",
                  "stylesheet.calendar.header": {
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
              {isLoading && <ActivityIndicator size="large" color="#c82f2f" />}
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

  errorMessage: {
    color: "red",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
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
    flex: 1,
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
    marginTop: 20,
  },
});
export default UserRequestLeaveScreen;
