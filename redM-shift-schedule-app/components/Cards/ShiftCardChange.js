import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
// import PropTypes from "prop-types";

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
  console.log('ShiftCardChange rendered with:', { shiftId, currentAssignedUser });
  const handleSwitchPress = () => {
    setModalVisible(true);
  };

  const handleSwitch = async () => {
    if (selectedSwitchUser && shiftId) {
      try {
        console.log('Sending switch request for shiftId:', shiftId);
        const [date, oldUserId, ...startTimeParts] = shiftId.split('-');
        const startTime = startTimeParts.join('-');
        
        const response = await fetch(
          `http://10.0.0.113:3001/api/schedules/${date}/${oldUserId}/${startTime}/switch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: selectedSwitchUser.key,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
  
        const updatedSchedule = await response.json();
        console.log('Received updated schedule:', updatedSchedule);
  
        setCurrentAssignedUser(updatedSchedule.user_name);
        console.log('Updated currentAssignedUser to:', updatedSchedule.user_name);
  
        if (onSwitchComplete) {
          onSwitchComplete(shiftId, updatedSchedule.user_name);
        }
  
        setSelectedSwitchUser(null);
        setModalVisible(false);
      } catch (error) {
        console.error("Error updating shift data:", error.message);
      }
    } else {
      setModalVisible(false);
    }
  };


  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSelect = (selected) => {
    setSelectedSwitchUser(selected);
  };

  const getUserName = (userId) => {
    const user = allUsers.find((user) => user.key === userId);
    return user ? user.value : `User ID: ${userId}`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.shiftName}>{shiftName}</Text>
      <Text style={styles.assignedUsers}>{currentAssignedUser}</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>Start: {startTime}</Text>
        <Text style={styles.time}>End: {endTime}</Text>
        <SwitchButton onPress={handleSwitchPress} />
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Please select employee to switch on the shift.
            </Text>
            <Text style={styles.modalSubtitle}>Switch User with:</Text>
            <View style={{ alignItems: "center" }}>
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

// ShiftCardChange.propTypes = {
//   shiftId: PropTypes.number.isRequired,
//   shiftName: PropTypes.string.isRequired,
//   startTime: PropTypes.string.isRequired,
//   endTime: PropTypes.string.isRequired,
//   assignedUsers: PropTypes.oneOfType([
//     PropTypes.string,
//     PropTypes.arrayOf(PropTypes.string),
//   ]),
//   allUsers: PropTypes.arrayOf(
//     PropTypes.shape({
//       key: PropTypes.number.isRequired,
//       value: PropTypes.string.isRequired,
//     })
//   ).isRequired,
//   onSwitchComplete: PropTypes.func,
// };

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
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
    marginTop: 8,
  },
  time: {
    fontSize: 14,
    marginBottom: 4,
  },
  assignedUsers: {
    fontSize: 16,
    fontWeight: "500",
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
    fontWeight: "semi-bold",
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
    backgroundColor: "#d3d3d3",
    padding: 20,
    borderRadius: 15,
    width: 365,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  modalSubtitle: {
    fontSize: 16,
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

export default ShiftCardChange;
