import React, { useState } from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet, Platform } from "react-native";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import PropTypes from "prop-types";

const SwitchButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>Switch</Text>
  </TouchableOpacity>
);

const ShiftCardChange = ({ shiftName, startTime, endTime, assignedUsers, allUsers }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSwitchPress = () => setModalVisible(true);
  const handleSwitch = () => {
    console.log("Switch");
    setModalVisible(false);
  };

  const handleCancel = () => setModalVisible(false);
  const handleSelect = (selected) => console.log(selected);

  return (
    <View style={styles.card}>
      <Text style={styles.shiftName}>{shiftName}</Text>
      {assignedUsers ? (
        typeof assignedUsers === "string" ? (
          <Text style={styles.userText}>{assignedUsers}</Text>
        ) : (
          assignedUsers.map((user, index) => (
            <Text key={index} style={styles.userText}>{user}</Text>
          ))
        )
      ) : (
        <Text style={styles.userText}>No assigned users</Text>
      )}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>Start: {startTime}</Text>
        <Text style={styles.time}>End: {endTime}</Text>
        <SwitchButton onPress={handleSwitchPress} />
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Please select employee to switch on the shift.
            </Text>
            <Text style={styles.modalSubtitle}>Switch User 1 with:</Text>
            <View style={styles.dropdownContainer}>
              <DropdownComponent data={allUsers} onSelect={handleSelect} />
            </View>
            <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleSwitch}>
                <Text style={styles.modalButtonText}>Switch</Text>
              </TouchableOpacity>
            </View>
            </View>
        </View>
      </Modal>
    </View>
  );
};
ShiftCardChange.propTypes = {
  shiftName: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  assignedUsers: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  allUsers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 15,
    marginVertical: 8,
    width: "112%",
    maxWidth: 350,
    alignSelf: "center",
  },
  shiftName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timeContainer: {
    marginTop: 8,
  },
  time: {
    fontSize: 16,
    marginBottom: 4,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: "#c82f2f",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxWidth: 365,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  dropdownContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    paddingHorizontal: 20,
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

export default ShiftCardChange;