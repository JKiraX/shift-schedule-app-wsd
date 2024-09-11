import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import DropdownComponent3 from "../../components/Dropdown/dropdownComponent3";

const ShiftCardChange = ({
  shiftName,
  startTime,
  endTime,
  assignedUsers = [],
  shiftId,
  onSwitchSuccess,
  workDate,
  allUsers,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [assignedUsersList, setAssignedUsersList] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState(null);

  useEffect(() => {
    if (assignedUsers.length > 0 && allUsers.length > 0) {
      const firstAssignedUser = allUsers.find(
        (user) => user.value === assignedUsers[0]
      );
      if (firstAssignedUser) {
        setCurrentUser(firstAssignedUser);
      } else {
        console.warn(assignedUsers[0]);
      }
    } else {
      console.warn("No assigned users or allUsers is empty");
    }

    fetchUsers();
  }, [assignedUsers, allUsers]);

  const handleCurrentUserSelect = (selected) => {
    setCurrentUser(selected);
  };

  const handleNewUserSelect = (selected) => {
    setNewUser(selected);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://192.168.5.22:3001/users`);
      const responseData = await response.json();

      if (responseData.success && Array.isArray(responseData.data)) {
        const allUsers = responseData.data.map((user) => ({
          key: user.user_id,
          value: `${user.first_name} ${user.last_name}`,
        }));

        setAllUsersList(allUsers);

        const filteredAssignedUsers = assignedUsers
          .map((userName) => allUsers.find((user) => user.value === userName))
          .filter(Boolean);

        setAssignedUsersList(filteredAssignedUsers);

        // Set the first assigned user as the current user
        if (filteredAssignedUsers.length > 0) {
          setCurrentUser(filteredAssignedUsers[0]);
        } else {
          console.warn("No filtered assigned users found");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      Alert.alert("Error", "Failed to fetch user data. Please try again.");
    }
  };

  const handleSwitchPress = () => setModalVisible(true);

  const handleSwitch = async () => {
    console.log(
      "Attempting switch with currentUser:",
      currentUser,
      "and newUser:",
      newUser
    );
    if (!currentUser || !newUser || !shiftId || !workDate) {
      console.error("Missing required fields:", {
        currentUser,
        newUser,
        shiftId,
        workDate,
      });
      Alert.alert(
        "Error",
        "Please ensure all required fields are selected and valid."
      );
      return;
    }

    const payload = {
      work_date: workDate,
      shift_id: shiftId,
      current_user_id: currentUser.key,
      new_user_id: newUser.key,
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch(
        `http://192.168.5.22:3001/api/schedules/switch`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.success) {
        console.log("Switch successful:", result.data);
        Alert.alert("Success", "Shift switched successfully");
        setModalVisible(false);
        if (onSwitchSuccess) onSwitchSuccess();
      } else {
        console.error("Error switching shift:", result.error);
        Alert.alert(
          "Error",
          result.error || "Failed to switch shift. Please try again."
        );
      }
    } catch (error) {
      console.error("Error making switch request:", error.message);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setCurrentUser(null);
    setNewUser(null);
  };

  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <Text style={styles.shiftName}>{shiftName}</Text>
        <View style={styles.usersContainer}>
          {assignedUsers.map((user, index) => (
            <Text key={index} style={styles.assignedUser}>
              {user}
            </Text>
          ))}
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
            <Text style={styles.modalSubtitle}>Select the current user:</Text>
            <DropdownComponent
              data={assignedUsersList}
              onSelect={handleCurrentUserSelect}
              defaultValue={currentUser?.value}
            />
            <Text style={styles.modalSubtitle2}>
              Select the user to switch with:
            </Text>
            <DropdownComponent3
              data={allUsersList}
              onSelect={handleNewUserSelect}
              defaultValue={newUser ? newUser.key : null}
            />
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
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    minWidth: 350,
  },
  shiftName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    // paddingBottom: 2,
  },
  contentContainer: {
    flex: 1,
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

  modalSubtitle2: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  dropdownContainer: {
    alignItems: "center",
    margin: 20,
  },

  dropdownContainerLarge: {
    margin: 20,
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
