import React, { useState } from "react";
import { Text, View, TouchableOpacity, Modal, StyleSheet } from "react-native";

const ShiftCardChange = ({ shiftName, startTime, endTime, assignedUsers = [] }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSwitchPress = () => setModalVisible(true);
  const handleSwitch = () => {
    console.log("Switch action triggered");
    setModalVisible(false);
  };

  const handleCancel = () => setModalVisible(false);

  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <Text style={styles.shiftName}>{shiftName}</Text>
        <View style={styles.usersContainer}>
          {Array.isArray(assignedUsers) ? (
            assignedUsers.map((user, index) => (
              <Text key={index} style={styles.assignedUser}>
                {user}
              </Text>
            ))
          ) : (
            <Text style={styles.assignedUser}>No users assigned</Text>
          )}
        </View>
      </View>
      <Text style={styles.time}>
        {startTime} - {endTime}
      </Text>
      <SwitchButton onPress={handleSwitchPress} />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Switch Shift</Text>
            <Text style={styles.modalSubtitle}>
              Select a user to switch shifts:
            </Text>

            {/* Placeholder for dropdown component, replace with actual component */}
            <View style={styles.dropdownContainer}>
              <Text>Dropdown Component Placeholder</Text>
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSwitch}
              >
                <Text style={styles.modalButtonText}>Switch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const SwitchButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>Switch</Text>
  </TouchableOpacity>
);

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
    marginBottom: 6,
    // paddingBottom: 2,
  },
  assignedUser: {
    fontSize: 16,
    marginBottom: 4,
  },
  timeContainer: {
    marginTop: 8,
  },
  time: {
    fontSize: 16,
    color: "#666",
    alignSelf: "flex-end",
    marginTop: 5,

    fontWeight: "500",
  },
  button: {
    borderRadius: 15,
    paddingVertical: 10,
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
