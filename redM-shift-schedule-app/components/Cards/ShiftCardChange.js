import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";

// Reusable Switch Button component
const SwitchButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Switch</Text>
      </View>
    </TouchableOpacity>
  );
};

// ShiftCardChange component
const ShiftCardChange = ({ shiftName, startTime, endTime, assignedUsers }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle switch button press
  const handleSwitchPress = () => {
    setModalVisible(true);
  };

  // Function to handle switch confirmation
  const handleSwitch = () => {
    console.log("Switch");
    setModalVisible(false);
  };

  // Function to handle modal cancellation
  const handleCancel = () => {
    setModalVisible(false);
  };

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

  return (
    <View style={styles.card}>
      <Text style={styles.shiftName}>{shiftName}</Text>
      {assignedUsers.map((user, index) => (
        <Text key={index}>{user}</Text>
      ))}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>Start: {startTime}</Text>
        <Text style={styles.time}>End: {endTime}</Text>
        <SwitchButton onPress={handleSwitchPress} />
      </View>
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
              backgroundColor: "#d3d3d3",
              padding: 20,
              borderRadius: 15,
              width: 365,
            }}
          >
            <Text
              style={{ fontSize: 18, marginBottom: 10, fontWeight: "bold" }}
            >
              Please select employee to switch on the shift.
            </Text>
            {/* Uername needs to come from backend */}
            <Text style={{ fontSize: 16 }}>User 1</Text>
            <View style={{ alignItems: "center" }}>
              <DropdownComponent data={data} onSelect={handleSelect} />
            </View>
            <Text style={{ fontSize: 16 }}>User 2</Text>
            <View style={{ alignItems: "center" }}>
              <DropdownComponent data={data} onSelect={handleSelect} />
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSwitch}
              >
                <Text style={styles.modalButtonText}>Switch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#d3d3d3",
    padding: 16,
    borderRadius: 15,
    marginVertical: 8,
    width: 350,
    alignItems: "stretch",
  },
  shiftName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  time: {
    fontSize: 16,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: "#3D5A80",
  },
  buttonText: {
    color: "white",
    fontWeight: "semi-bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
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
    backgroundColor: "#3D5A80",
    borderRadius: 15,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ShiftCardChange;
