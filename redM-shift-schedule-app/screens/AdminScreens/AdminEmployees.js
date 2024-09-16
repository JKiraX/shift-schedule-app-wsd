import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddEmployeePage from "./AddEmployees";
import EditEmployeeScreen from "./EditEmployees";
import apiClient from "../../../server/aspApiRoutes";
import * as SecureStore from "expo-secure-store";

const Stack = createNativeStackNavigator();

const AdminEmployeeScreen = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchUsers();
      getCurrentUser();
    }
  }, [isFocused]);

  const getCurrentUser = async () => {
    try {
      const email = await SecureStore.getItemAsync("email");
      const role = await SecureStore.getItemAsync("role");
      const id = await SecureStore.getItemAsync("userId");
      setCurrentUser({ email, role, id });
    } catch (error) {
      Alert.alert("Error", "Error fetching current user");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/api/authentication");
      const sortedUsers = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      Alert.alert("Error", `Failed to fetch users: ${error.response ? error.response.data : error.message}`);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setModalVisible(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete || !userToDelete.id) {
      Alert.alert("Error", "Invalid user ID");
      return;
    }

    try {
      const response = await apiClient.delete(`/api/authentication/${userToDelete.id}`);
      if (response.status === 200) {
        fetchUsers();
        setModalVisible(false);
        setUserToDelete(null);
      } else if (response.status === 404) {
        Alert.alert("Error", "User not found");
      } else {
        Alert.alert("Error", "Failed to delete user");
      }
    } catch (error) {
      Alert.alert("Error", `Failed to delete user: ${error.response ? error.response.data : error.message}`);
    }
  };
  
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text
        style={styles.userName}
      >{`${item.firstName} ${item.lastName}`}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("EditEmployee", {
              employee: item,
              currentUser: currentUser,
            })
          }
        >
          <MaterialCommunityIcons name="pencil" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteConfirmation(item)}
        >
          <MaterialCommunityIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const DeleteConfirmationModal = ({ visible, onConfirm, onCancel, userName }) => (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            Are you sure you want to permanently delete the user {userName}?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={onCancel}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={onConfirm}>
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.push("AddEmployees")}
        >
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        renderItem={renderUserItem}
        contentContainerStyle={styles.userList}
      />
      <DeleteConfirmationModal
        visible={modalVisible}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        userName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''}
      />
    </SafeAreaView>
  );
};

const AdminEmployee = () => (
  <Stack.Navigator initialRouteName="AdminEmployeeScreen">
    <Stack.Screen
      name="AdminEmployeeScreen"
      component={AdminEmployeeScreen}
      options={{
        title: "Employees",
        headerTintColor: "#c82f2f",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="AddEmployees"
      component={AddEmployeePage}
      options={{
        title: "Add Employee",
        headerTintColor: "#c82f2f",
        headerTitleAlign: "center",
      }}
    />
    <Stack.Screen
      name="EditEmployee"
      component={EditEmployeeScreen}
      options={{
        title: "Edit Employee",
        headerTintColor: "#c82f2f",
        headerTitleAlign: "center",
      }}
    />
  </Stack.Navigator>
);

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#c82f2f",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  userList: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
    borderRadius: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
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
    width: Math.min(365, width * 0.9),
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 15,
    paddingTop: 20,
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

export default AdminEmployee;