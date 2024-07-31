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
      console.error("Error fetching current user:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/api/authentication");
      const sortedUsers = response.data.sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Error",
        `Failed to fetch users: ${
          error.response ? error.response.data : error.message
        }`
      );
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = users.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      Alert.alert("Error", "Invalid user ID");
      return;
    }

    try {
      const response = await apiClient.delete(`/api/authentication/${id}`);
      if (response.status === 200) {
        fetchUsers(); // Refresh the list after deletion
      } else if (response.status === 404) {
        Alert.alert("Error", "User not found");
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Error",
        `Failed to delete user: ${
          error.response ? error.response.data : error.message
        }`
      );
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
          onPress={() => handleDelete(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
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
});

export default AdminEmployee;
