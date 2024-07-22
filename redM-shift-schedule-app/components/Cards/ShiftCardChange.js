import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Text, View, StyleSheet, TouchableOpacity, Modal, Dimensions } from "react-native";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";

const SwitchButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>Switch</Text>
  </TouchableOpacity>
);

SwitchButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const ShiftCardChange = ({
  shiftId,
  shiftName,
  startTime,
  endTime,
  assignedUsers,
  allUsers,
  onSwitchComplete,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSwitchUser, setSelectedSwitchUser] = useState(null);
  const [currentAssignedUser, setCurrentAssignedUser] = useState(
    typeof assignedUsers === "string" ? assignedUsers : getUserName(assignedUsers)
  );

  const handleSwitchPress = () => setModalVisible(true);

  const handleSwitch = async () => {
    if (!selectedSwitchUser?.key) {
      alert('Please select a user to switch with.');
      return;
    }

    try {
      const [year, month, day, shift_id] = shiftId.split("-");
      const date = `${year}-${month}-${day}`;
  
      const response = await fetch('http://10.2.44.68/api/schedules/switch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          shift_id,
          user_id: selectedSwitchUser.key
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to switch shift');
      }

      const result = await response.json();
      setCurrentAssignedUser(result.user_name);
      onSwitchComplete(shiftId, result.user_name);

      setSelectedSwitchUser(null);
      setModalVisible(false);
    } catch (error) {
      console.error('Error switching shift:', error);
      alert(error.message);
    }
  };

  const handleCancel = () => setModalVisible(false);

  const handleSelect = (selected) => {
    const selectedUser = allUsers.find(user => user.value === selected);
    setSelectedSwitchUser(selectedUser);
  };

  const getUserName = (userId) => {
    const user = allUsers.find(user => user.key === userId);
    return user ? user.value : `User ID: ${userId}`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.shiftName}>{shiftName}</Text>
      <Text style={styles.assignedUsers}>{currentAssignedUser}</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>Start: {startTime}</Text>
        <Text style={styles.time}>End: {endTime}</Text>
      </View>
      <SwitchButton onPress={handleSwitchPress} />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Please select employee to switch on the shift.
            </Text>
            <Text style={styles.modalSubtitle}>Switch User with:</Text>
            <View style={styles.dropdownContainer}>
              <DropdownComponent
                data={allUsers}
                onSelect={handleSelect}
              />
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
  shiftId: PropTypes.string.isRequired,
  shiftName: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  assignedUsers: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  allUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSwitchComplete: PropTypes.func.isRequired,
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 15,
    marginVertical: 8,
    width: width * 0.9,
    maxWidth: 350,
    alignSelf: 'center',
  },
  shiftName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    fontSize: 14,
    marginBottom: 4,
  },
  assignedUsers: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#c82f2f",
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#d3d3d3",
    padding: 20,
    borderRadius: 15,
    width: width * 0.9,
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
    paddingHorizontal: 30,
    paddingVertical: 12,
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